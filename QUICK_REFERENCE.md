# Quick Reference Guide - Core Features

## 🎯 Feature Implementation Map

### 1. Role-Based Access Control (RBAC)

**Backend:**
- Role Enum: `backend/src/main/java/com/skillevaluator/model/Role.java`
- Security Config: `backend/src/main/java/com/skillevaluator/security/SecurityConfig.java` (lines 65-81)
- User Entity: `backend/src/main/java/com/skillevaluator/model/User.java` (implements UserDetails)

**Frontend:**
- Protected Routes: `frontend/src/components/ProtectedRoute.jsx`
- Role Redirect: `frontend/src/pages/Login.jsx` (lines 30-35)

**Key Methods:**
```java
// SecurityConfig.java
.requestMatchers("/api/admin/**").hasRole("ADMIN")
.requestMatchers("/api/recruiter/**").hasAnyRole("RECRUITER", "ADMIN")
.requestMatchers("/api/candidate/**").hasAnyRole("CANDIDATE", "RECRUITER", "ADMIN")
```

---

### 2. JWT Authentication

**Backend:**
- Token Provider: `backend/src/main/java/com/skillevaluator/security/JwtTokenProvider.java`
- Auth Filter: `backend/src/main/java/com/skillevaluator/security/JwtAuthenticationFilter.java`
- Auth Controller: `backend/src/main/java/com/skillevaluator/controller/AuthController.java`

**Frontend:**
- API Service: `frontend/src/services/api.js` (interceptors for token injection)

**Key Endpoints:**
- `POST /api/auth/login` - Returns JWT token
- `POST /api/auth/register` - Creates user

**Token Flow:**
1. User logs in → Backend generates JWT with username + roles
2. Frontend stores token in localStorage
3. All API requests include: `Authorization: Bearer <token>`
4. Filter validates token → Sets authentication in SecurityContext

---

### 3. Test Engine (MCQ, True/False, Short Answer)

**Backend:**
- Question Type: `backend/src/main/java/com/skillevaluator/model/QuestionType.java`
- Question Entity: `backend/src/main/java/com/skillevaluator/model/Question.java`
- Answer Validation: `backend/src/main/java/com/skillevaluator/service/TestService.java` (isAnswerCorrect method)

**Frontend:**
- Test Session: `frontend/src/pages/TestSession.jsx` (lines 150-200)

**Question Type Handling:**
```java
// TestService.java - isAnswerCorrect()
switch (question.getType()) {
    case MCQ:
    case TRUE_FALSE:
        return correctAnswer.equalsIgnoreCase(userAnswerTrimmed);
    case SHORT_ANSWER:
        return correctAnswer.equalsIgnoreCase(userAnswerTrimmed);
}
```

---

### 4. Time-Limited Tests with Auto-Submission

**Backend:**
- TestSession Entity: `backend/src/main/java/com/skillevaluator/model/TestSession.java`
  - `expiresAt` field (calculated: startedAt + durationMinutes)
  - `status` field ("AUTO_SUBMITTED" when auto-submitted)
- TestService: `backend/src/main/java/com/skillevaluator/service/TestService.java`
  - `startTestSession()` - Sets expiration time
  - `submitTest()` - Checks expiration, handles autoSubmit flag

**Frontend:**
- Timer: `frontend/src/pages/TestSession.jsx` (lines 38-52)
- Auto-submit: `frontend/src/pages/TestSession.jsx` (handleAutoSubmit method)

**Key Code:**
```javascript
// Frontend - Auto-submission on timer expiration
useEffect(() => {
  if (timeRemaining > 0) {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit()  // Auto-submit
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }
}, [timeRemaining])
```

```java
// Backend - Expiration check
if (session.getExpiresAt().isBefore(LocalDateTime.now()) && !autoSubmit) {
    throw new RuntimeException("Test session has expired");
}
session.setStatus(autoSubmit ? "AUTO_SUBMITTED" : "SUBMITTED");
```

---

### 5. Question Randomization

**Backend:**
- Method: `backend/src/main/java/com/skillevaluator/service/TestService.java`
  - `getRandomizedQuestions(Long testId)` (lines 78-97)

**Key Code:**
```java
public List<Question> getRandomizedQuestions(Long testId) {
    List<Question> allQuestions = test.getQuestions();
    List<Question> randomizedQuestions = new ArrayList<>(allQuestions);
    Collections.shuffle(randomizedQuestions);  // Randomize order
    return randomizedQuestions;
}
```

**Usage:**
- Called in: `CandidateController.startTest()` (line 44)
- Questions randomized before sending to client
- Correct answers removed before sending

---

### 6. Automatic Scoring System

**Backend:**
- Method: `backend/src/main/java/com/skillevaluator/service/TestService.java`
  - `calculateScore(Test test, Map<Long, String> answers)` (lines 129-140)
  - `isAnswerCorrect(Question question, String userAnswer)` (lines 142-157)

**Key Code:**
```java
private int calculateScore(Test test, Map<Long, String> answers) {
    int totalScore = 0;
    for (Question question : test.getQuestions()) {
        String userAnswer = answers.get(question.getId());
        if (userAnswer != null && isAnswerCorrect(question, userAnswer)) {
            totalScore += question.getPoints();
        }
    }
    return totalScore;
}
```

**Scoring Flow:**
1. User submits test → Answers sent to backend
2. `submitTest()` calls `calculateScore()`
3. Each answer compared with correct answer
4. Points accumulated for correct answers
5. Score stored in TestSession
6. Score returned in response

---

### 7. Session Management (Duplicate Prevention)

**Backend:**
- Method: `backend/src/main/java/com/skillevaluator/service/TestService.java`
  - `startTestSession(Long testId, String username)` (lines 37-76)
- Repository: `backend/src/main/java/com/skillevaluator/repository/TestSessionRepository.java`
  - `findByTestAndCandidateAndIsCompletedFalse()`

**Key Code:**
```java
// Check for existing incomplete session
Optional<TestSession> existingSession = testSessionRepository
    .findByTestAndCandidateAndIsCompletedFalse(test, candidate);

if (existingSession.isPresent()) {
    TestSession session = existingSession.get();
    if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
        // Expire old session
        session.setIsCompleted(true);
        session.setStatus("EXPIRED");
        testSessionRepository.save(session);
    } else {
        return session; // Return existing valid session
    }
}
// Create new session if none exists
```

**Prevention Logic:**
- ✅ One active session per test per candidate
- ✅ Returns existing session if still valid
- ✅ Expires old sessions automatically
- ✅ Prevents multiple simultaneous attempts

---

## 🔄 Request Flow Examples

### Starting a Test
```
1. Frontend: POST /api/candidate/tests/{testId}/start
2. Backend: TestService.startTestSession()
   - Check for existing session
   - Create new session with expiration
3. Backend: TestService.getRandomizedQuestions()
   - Shuffle questions
   - Remove correct answers
4. Response: TestSessionResponse with questions and timeRemaining
5. Frontend: Start countdown timer
```

### Submitting a Test
```
1. Frontend: POST /api/candidate/tests/{testId}/submit
   Body: { answers: {...}, autoSubmit: false }
2. Backend: TestService.submitTest()
   - Validate session
   - Check expiration
   - Calculate score
   - Update session status
3. Response: { score, totalPoints, message }
4. Frontend: Display score and redirect
```

### Auto-Submission Flow
```
1. Frontend timer reaches 0
2. Frontend: handleAutoSubmit()
3. Frontend: POST /api/candidate/tests/{testId}/submit
   Body: { answers: {...}, autoSubmit: true }
4. Backend: TestService.submitTest()
   - Accepts even if expired (autoSubmit=true)
   - Sets status to "AUTO_SUBMITTED"
   - Calculates score
5. Response: Score and confirmation
```

---

## 🗄️ Database Schema Highlights

### TestSession Table
- `id` - Primary key
- `test_id` - Foreign key to Test
- `candidate_id` - Foreign key to User
- `started_at` - Session start time
- `expires_at` - Calculated expiration
- `is_completed` - Boolean flag
- `score` - Calculated score
- `status` - "IN_PROGRESS", "SUBMITTED", "AUTO_SUBMITTED", "EXPIRED"
- `answers` - JSON string of user answers

### Question Table
- `id` - Primary key
- `text` - Question text
- `type` - MCQ, TRUE_FALSE, SHORT_ANSWER
- `skill` - Skill category
- `difficulty` - EASY, MEDIUM, HARD
- `options` - Comma-separated (for MCQ)
- `correct_answer` - Correct answer
- `points` - Points for this question

---

## 🛠️ Configuration

### JWT Settings
```properties
# application.properties
jwt.secret=your-256-bit-secret-key-change-this-in-production-minimum-32-characters
jwt.expiration=86400000  # 24 hours in milliseconds
```

### CORS Settings
```properties
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

---

## 📌 Important Notes

1. **Security**: Correct answers are NEVER sent to the frontend
2. **Expiration**: Both client-side (timer) and server-side (expiresAt) checks
3. **Sessions**: One active session per test per candidate
4. **Scoring**: Happens server-side only, never trust client
5. **Randomization**: Questions shuffled on each test start
6. **Auto-submit**: Handled gracefully with `autoSubmit` flag

---

## 🐛 Common Issues & Solutions

### Issue: "Test session already completed"
- **Cause**: Trying to submit already completed session
- **Solution**: Check `isCompleted` flag before submission

### Issue: "Test session has expired"
- **Cause**: Trying to submit after expiration
- **Solution**: Use `autoSubmit=true` flag for auto-submissions

### Issue: "Active test session not found"
- **Cause**: Session doesn't exist or was deleted
- **Solution**: Start new session with `/start` endpoint

### Issue: Token expiration
- **Cause**: JWT token expired (default 24 hours)
- **Solution**: Re-login to get new token

---

## 📚 Related Files

- **Models**: All entities in `backend/src/main/java/com/skillevaluator/model/`
- **Services**: Business logic in `backend/src/main/java/com/skillevaluator/service/`
- **Controllers**: REST endpoints in `backend/src/main/java/com/skillevaluator/controller/`
- **Security**: JWT and security in `backend/src/main/java/com/skillevaluator/security/`
- **Frontend**: React components in `frontend/src/pages/` and `frontend/src/components/`

