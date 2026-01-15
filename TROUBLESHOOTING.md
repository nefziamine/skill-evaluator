# Troubleshooting Guide - AI Generation & User Creation Issues

## Issues Identified
1. **AI Test Generation** - Returns "Failed to generate test with AI"
2. **Admin User Creation** - Users not appearing after creation

## Changes Applied

### 1. Backend Configuration
- ✅ Added Gemini API key to `application.properties`
- ✅ Created `RestTemplate` bean in `SkillEvaluatorApplication.java`
- ✅ Updated `AiService.java` to use Gemini 1.5 Flash Latest API
- ✅ Added comprehensive logging to `AdminController.java`

### 2. Logging Points
The following log statements have been added:

**AdminController:**
- `ADMIN: Attempting to create user: {username}, Role={role}`
- `ADMIN: User created successfully: {userId}`
- `ADMIN: Fetching global statistics...`
- `ADMIN: Stats summary - Total Users: {count}`

**AiService (if I can add logging next):**
- Should log AI generation start, API response, and parsing steps

## Testing Steps

### Test 1: User Creation via Admin Dashboard
1. Open the Admin Dashboard at `http://localhost:3000/admin/dashboard`
2. Click "New User" button
3. Fill in the form:
   - Username: testuser1
   - Email: test@example.com
   - Password: password123
   - Role: Recruiter
4. Click "Create"
5. **Check backend logs** for:
   ```
   ADMIN: Attempting to create user: testuser1, Role=RECRUITER
   ADMIN: User created successfully: [ID]
   ```

**How to check logs:**
```bash
docker-compose logs --tail 100 backend | Select-String "ADMIN"
```

### Test 2: AI Test Generation
1. Open Recruiter Dashboard at `http://localhost:3000/recruiter/dashboard`
2. Click "AI Generate" button
3. Fill in:
   - Skill: Java
   - Difficulty: Medium
   - Question Count: 5
4. Click "Generate Test"
5. **Check backend logs** for AI-related output

**How to check logs:**
```bash
docker-compose logs --tail 100 backend | Select-String "AI","Error","Exception"
```

## Expected Behaviors

### User Creation Success
- Backend logs show "User created successfully"
- Frontend shows success message
- User appears in the Overview dashboard statistics
- User appears in User Management table

### AI Generation Success
- Backend makes HTTP request to Gemini API
- Receives JSON response
- Creates Test with generated questions
- Frontend shows "Test generated successfully"
- Test appears in the Tests table

## Common Issues & Fixes

### Issue: API Key Not Loading
**Symptom:** Logs show null or empty API key
**Fix:** Verify `gemini.api.key` is in application.properties and Docker container has it

### Issue: Network/CORS Error
**Symptom:** Frontend shows network error
**Fix:** Check browser console (F12) for CORS or network errors

### Issue: Database Connection
**Symptom:** User creation succeeds but doesn't persist
**Fix:** Verify PostgreSQL container is healthy with `docker-compose ps`

## Next Steps

1. Try creating a user and check the logs immediately
2. Try AI generation and check the logs
3. Share the log output with me so I can diagnose the exact issue
4. If needed, I can add more detailed logging to trace the exact failure point
