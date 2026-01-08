# Role-Based Implementation Guide

## ✅ Complete Role-Specific Features

### 🔐 Authentication Differences

#### **Public Registration (Candidates Only)**
- **Endpoint**: `POST /api/auth/register`
- **Restriction**: Only allows `CANDIDATE` role
- **Frontend**: `Register.jsx` - Simple candidate registration form
- **Behavior**: Any role specified in request is overridden to CANDIDATE

#### **Admin User Creation**
- **Endpoint**: `POST /api/admin/users`
- **Access**: ADMIN only
- **Frontend**: `AdminDashboard.jsx` - Full user management interface
- **Behavior**: Admin can create users with ANY role (ADMIN, RECRUITER, CANDIDATE)

#### **Login Flow (Role-Based Redirect)**
- **Endpoint**: `POST /api/auth/login`
- **Redirects**:
  - `ADMIN` → `/admin/dashboard`
  - `RECRUITER` → `/recruiter/dashboard`
  - `CANDIDATE` → `/tests`

---

## 👨‍💼 ADMIN Features

### Backend Endpoints (`/api/admin/**`)

1. **User Management**
   - `GET /api/admin/users` - List all users
   - `GET /api/admin/users/{id}` - Get user details
   - `POST /api/admin/users` - Create user (any role)
   - `PUT /api/admin/users/{id}` - Update user
   - `DELETE /api/admin/users/{id}` - Delete user

2. **Statistics**
   - `GET /api/admin/stats` - System statistics

### Frontend Pages

**AdminDashboard.jsx** - Full admin interface:
- User management table with CRUD operations
- Statistics cards (Total Users, Admins, Recruiters, Candidates)
- Create/Edit user dialog with role selection
- Enable/Disable user accounts
- Password reset functionality

### Key Features
- ✅ Create Admins, Recruiters, and Candidates
- ✅ View all users in the system
- ✅ Edit user details and roles
- ✅ Enable/Disable accounts
- ✅ Delete users (with self-deletion protection)
- ✅ View system statistics

---

## 👔 RECRUITER Features

### Backend Endpoints (`/api/recruiter/**`)

1. **Test Management**
   - `GET /api/recruiter/tests` - List all tests (own tests for recruiters, all for admins)
   - `GET /api/recruiter/tests/{id}` - Get test details
   - `POST /api/recruiter/tests` - Create test
   - `PUT /api/recruiter/tests/{id}` - Update test
   - `DELETE /api/recruiter/tests/{id}` - Delete test

2. **Question Bank Management**
   - `GET /api/recruiter/questions` - List questions (with filters: skill, difficulty, type)
   - `GET /api/recruiter/questions/{id}` - Get question details
   - `POST /api/recruiter/questions` - Create question
   - `PUT /api/recruiter/questions/{id}` - Update question
   - `DELETE /api/recruiter/questions/{id}` - Delete question

3. **Results & Analytics**
   - `GET /api/recruiter/tests/{testId}/sessions` - View test results
   - `GET /api/recruiter/candidates/{candidateId}/sessions` - View candidate's all results
   - `GET /api/recruiter/analytics` - Dashboard analytics

### Frontend Pages

**RecruiterDashboard.jsx** - Recruiter interface with tabs:
- **Tests Tab**:
  - List of created tests
  - Create/Edit/Delete tests
  - Assign questions to tests
  - View test results
  - Analytics cards

- **Question Bank Tab**:
  - Full question management
  - Create MCQ, True/False, Short Answer questions
  - Filter by skill, difficulty, type
  - Edit/Delete questions

**TestResults.jsx** - Detailed test results view:
- List all candidate attempts
- Score breakdown
- Average score calculation
- Status tracking

### Key Features
- ✅ Create and manage tests
- ✅ Build question bank with all question types
- ✅ Assign questions to tests
- ✅ View candidate results and scores
- ✅ Analytics dashboard
- ✅ Filter questions by skill/difficulty
- ✅ Test activation/deactivation

---

## 👤 CANDIDATE Features

### Backend Endpoints (`/api/candidate/**`)

1. **Test Taking**
   - `GET /api/candidate/tests` - List available tests
   - `POST /api/candidate/tests/{testId}/start` - Start test session
   - `POST /api/candidate/tests/{testId}/submit` - Submit test

2. **Results**
   - `GET /api/candidate/sessions` - Get my test sessions
   - `GET /api/candidate/sessions/{sessionId}/result` - Get detailed result

### Frontend Pages

**Tests.jsx** - Candidate test list:
- View available tests
- Start test button
- Link to results page

**TestSession.jsx** - Test taking interface:
- Real-time countdown timer
- Question navigation
- Support for all question types
- Auto-submission on expiration
- Progress indicator

**CandidateResults.jsx** - Personal results view:
- List of completed tests
- Score and percentage
- Test completion date
- View detailed results

### Key Features
- ✅ View available tests
- ✅ Take tests with time limits
- ✅ View own results only
- ✅ See score and percentage
- ✅ Test history

---

## 🔒 Security & Access Control

### Role Hierarchy

```
ADMIN
  ├── Can access all endpoints
  ├── Can create any role
  └── Can manage all users and tests

RECRUITER
  ├── Can create/manage own tests
  ├── Can manage question bank
  ├── Can view all test results
  └── Cannot create users

CANDIDATE
  ├── Can only take tests
  ├── Can view own results only
  └── Cannot create tests or questions
```

### Endpoint Protection

- `/api/admin/**` - ADMIN only
- `/api/recruiter/**` - RECRUITER + ADMIN
- `/api/candidate/**` - All authenticated users
- `/api/auth/**` - Public (except admin user creation)

### Frontend Route Protection

- `/admin/dashboard` - ADMIN only
- `/recruiter/dashboard` - RECRUITER + ADMIN
- `/tests`, `/test/:testId` - All authenticated
- `/candidate/results` - All authenticated

---

## 📊 Data Flow Examples

### Admin Creating a Recruiter
```
1. Admin logs in → Redirected to /admin/dashboard
2. Clicks "Create User"
3. Fills form: username, email, password, role=RECRUITER
4. POST /api/admin/users → Backend creates user
5. User appears in table with RECRUITER role
```

### Recruiter Creating a Test
```
1. Recruiter logs in → Redirected to /recruiter/dashboard
2. Clicks "Create Test" in Tests tab
3. Fills test details, selects questions from bank
4. POST /api/recruiter/tests → Backend creates test
5. Test appears in list, becomes available to candidates
```

### Candidate Taking a Test
```
1. Candidate logs in → Redirected to /tests
2. Views available tests
3. Clicks "Start Test"
4. POST /api/candidate/tests/{id}/start → Backend creates session
5. Questions randomized, timer starts
6. Answers questions, submits
7. POST /api/candidate/tests/{id}/submit → Backend calculates score
8. Redirected to results page
```

---

## 🎯 Key Differences Summary

| Feature | Admin | Recruiter | Candidate |
|---------|-------|-----------|-----------|
| **User Management** | ✅ Full CRUD | ❌ | ❌ |
| **Create Tests** | ✅ | ✅ | ❌ |
| **Create Questions** | ✅ | ✅ | ❌ |
| **View All Results** | ✅ | ✅ | ❌ |
| **Take Tests** | ✅ | ✅ | ✅ |
| **View Own Results** | ✅ | ✅ | ✅ |
| **Create Users** | ✅ (Any role) | ❌ | ❌ (Only self-register as candidate) |

---

## 🚀 Next Steps

1. **Add Navigation Bar** - Role-based navigation menu
2. **Enhance Results View** - Detailed answer review for recruiters
3. **Export Functionality** - Export results to CSV/PDF
4. **Bulk Operations** - Bulk question import, bulk test assignment
5. **Notifications** - Email notifications for test completion
6. **Advanced Analytics** - Charts and graphs for recruiters

---

## 📝 Testing Checklist

### Admin
- [ ] Login as admin → Should redirect to `/admin/dashboard`
- [ ] Create a recruiter user
- [ ] Create an admin user
- [ ] Edit user details
- [ ] Delete a user
- [ ] View statistics

### Recruiter
- [ ] Login as recruiter → Should redirect to `/recruiter/dashboard`
- [ ] Create a question (MCQ, True/False, Short Answer)
- [ ] Create a test
- [ ] Assign questions to test
- [ ] View test results
- [ ] View analytics

### Candidate
- [ ] Register new account → Should be CANDIDATE role
- [ ] Login as candidate → Should redirect to `/tests`
- [ ] View available tests
- [ ] Start a test
- [ ] Answer questions
- [ ] Submit test
- [ ] View results

---

**All role-specific features are now fully implemented!** 🎉

