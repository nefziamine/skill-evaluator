# Skill Evaluator Platform - Implementation Documentation

## 1. Project Overview
The **Skill Evaluator Platform** is a secure, scalable web application designed to automate technical assessments for recruitment. It features distinct workflows for Administrators, Recruiters, and Candidates, aimed at streamlined test creation (including AI assistance), candidate invitation, and detailed performance reporting.

## 2. Technical Architecture

### Backend
- **Framework**: Java 21 with Spring Boot 3
- **Security**: Spring Security with Stateless JWT Authentication
- **Database**: PostgreSQL (via JPA/Hibernate)
- **API Structure**: RESTful endpoints separated by role (`/auth`, `/admin`, `/recruiter`, `/candidate`)
- **Key Services**:
  - `AiService`: Generates questions based on skill/difficulty.
  - `JwtTokenProvider`: Handles secure token generation for login and invitations.

### Frontend
- **Framework**: React 18 (Vite)
- **UI Component Library**: Material UI (MUI v5)
- **State Management**: React Hooks (`useState`, `useEffect`) and Context API
- **Routing**: React Router DOM v6
- **Data Fetching**: Axios with interceptors for JWT injection

## 3. Implemented Features

### A. Authentication & Authorization
- **JWT-Based Login**: Secure session management with expiration.
- **Registration**: Public registration for recruiters (default) with validation.
- **Role-Based Access Control (RBAC)**:
  - `ADMIN`: Full system access.
  - `RECRUITER`: Manage own tests, questions, and candidates.
  - `CANDIDATE`: Take assigned tests only.

### B. Admin Dashboard
- **User Management**:
  - CRUD operations for Users (Create, Edit, Delete).
  - Search/Filter users by name, email, or role.
  - Lock/Unlock user accounts.
- **System Diagnostics**:
  - Real-time display of Database status, Storage usage, and API version.
- **Global Settings**:
  - Toggle "Maintenance Mode" and "Public Registrations".
- **Analytics Overview**:
  - High-level stats on total users, active tests, and completed assessments.

### C. Recruiter Dashboard
- **Test Management**:
  - **Create/Edit Tests**: customizable title, description, and timer (duration).
  - **Question Bank Integration**: Select questions manually or bulk-add.
- **AI Assessment Generation**:
  - Prompt-based generation: Select Skill (e.g., Java) + Difficulty + Count -> Auto-generates a full test.
- **Question Bank**:
  - **CRUD Support**: Create, Edit, Delete questions.
  - **Batch Operations**: Bulk delete selected questions.
  - **Filters**: Support for Question Type, Skill, and Difficulty.
- **Candidate Invitation**:
  - **Auto-Provisioning**: Generates a unique invite link. If the email doesn't exist, a temporary candidate account is auto-created.
- **Reporting & Analytics**:
  - **Candidate Comparison Matrix**: Compare multiple candidates side-by-side.
  - **Skill Breakdown**: Visualization of performance per skill (e.g., Java: 80%, SQL: 50%).
  - **PDF Export**: Option/Placeholder for exporting results.

### D. Candidate Experience
- **Secure Access**: Entry via unique invite links.
- **Test Interface**:
  - Timer-based auto-submission.
  - Support for Multiple Choice Questions (MCQ).
- **Instant Results**: Immediate feedback and score display upon completion.

## 4. Backend Data Models

| Entity | Description |
| :--- | :--- |
| **User** | System users (Admin, Recruiter, Candidate) with Role enums. |
| **Role** | Enum: `ADMIN`, `RECRUITER`, `CANDIDATE`. |
| **Test** | Represents an assessment bundle (Title, Duration, Creator). |
| **Question** | Individual items (Text, Options, Correct Answer, Points, Difficulty). |
| **TestSession** | A candidate's attempt. Tracks `startedAt`, `submittedAt`, `score`, and `answers` (JSON). |
| **SystemSetting** | Key-value pairs for global admin configurations. |

## 5. Gap Analysis (Vs. Typical Requirements)

Since the original requirements (`.docx` file) are binary and unreadable directly, the following gaps are identified based on industry standards for such platforms:

1.  **Email Delivery**:
    - *Current*: The system generates an invite link string.
    - *Missing*: Integration with an SMTP server (e.g., SendGrid, JavaMail) to actually *email* this link to the candidate.

2.  **Code Execution Engine**:
    - *Current*: Supports text/MCQ questions.
    - *Missing*: If "Technical Recruitment" implies live coding, there is no sandbox (Docker/Piston) to compile and run code snippets submitted by candidates.

3.  **Proctoring / Anti-Cheat**:
    - *Current*: Basic timer.
    - *Missing*: Tab-switch detection, webcam monitoring, or copy-paste disabling.

4.  **Advanced AI Integration**:
    - *Current*: `AiService` interface exists.
    - *Verification Needed*: Ensure `AiService` is connected to a real provider (OpenAI/Anthropic API) and not just returning static mock data.

## 6. API Endpoints Summary

**Auth**
- `POST /api/auth/login`
- `POST /api/auth/register`

**Recruiter**
- `GET /api/recruiter/tests`
- `POST /api/recruiter/generate-ai-test` (AI Feature)
- `POST /api/recruiter/invite-candidate` (Generates Link)
- `GET /api/recruiter/analytics`

**Admin**
- `GET /api/admin/users`
- `GET /api/admin/diagnostics`
- `POST /api/admin/settings`

## 7. Setup & Run

**Backend**:
```bash
cd backend
mvn spring-boot:run
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```
