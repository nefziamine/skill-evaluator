# Skill Evaluator Platform

> **A premium, AI-powered platform for technical talent assessment and skill-first hiring**

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Spring%20Boot%20%7C%20PostgreSQL-blue)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Overview

**Skill Evaluator** is a comprehensive, enterprise-grade technical recruitment platform that reimagines how organizations discover, assess, and hire engineering talent. Built with a modern tech stack and designed with a premium SaaS aesthetic, it provides:

- **AI-Powered Assessment Generation**: Automatically create skill-specific technical tests
- **Skill-First Hiring**: Focus on verified technical abilities, not just resumes
- **Premium User Experience**: Dark-themed, glassmorphic design with smooth animations
- **Role-Based Workflows**: Distinct experiences for Admins, Recruiters, and Candidates
- **Secure & Scalable**: JWT authentication, Docker deployment, and PostgreSQL database

---

## 🎯 Key Features

### For Recruiters
- 📝 **AI Test Generation**: Generate custom assessments based on skill, difficulty, and question count
- 🎯 **Browse Verified Talent**: Access a pool of candidates with skill badges and certifications
- 📊 **Advanced Analytics**: Detailed performance breakdowns, skill comparisons, and candidate rankings
- ✉️ **Automated Invitations**: Send test invites with auto-provisioned candidate accounts
- 📄 **Question Bank Management**: Create, edit, and organize questions by skill and difficulty

### For Candidates
- 🔒 **Secure Test Environment**: Timer-based assessments with auto-submission
- 📧 **Email & SMS Invites**: Access tests via unique links sent directly to you
- ✅ **Instant Results**: Get immediate feedback and performance scores
- 🏆 **Skill Badges**: Earn certifications for verified technical competencies

### For Administrators
- 👥 **User Management**: Full CRUD operations on users, roles, and permissions
- 🔧 **System Configuration**: Maintenance mode, registration toggles, and global settings
- 📈 **Platform Analytics**: Monitor system health, storage, and user activity
- 🔐 **Security Controls**: Lock/unlock accounts, manage access levels

---

## 🏗️ Architecture

```
skill-evaluator/
├── backend/                    # Spring Boot API
│   ├── src/main/java/
│   │   └── com/skillevaluator/
│   │       ├── controller/     # REST endpoints
│   │       ├── service/        # Business logic
│   │       ├── repository/     # Data access
│   │       ├── model/          # Entities (User, Test, Question)
│   │       ├── security/       # JWT & Auth config
│   │       └── dto/            # Data transfer objects
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── pages/              # Route components
│   │   │   ├── MainLanding/    # Landing page sections
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── BrowseTalent.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── Enterprise.jsx
│   │   │   ├── AIAdvanced.jsx
│   │   │   └── Tests.jsx
│   │   ├── components/         # Reusable UI
│   │   │   ├── Footer.jsx
│   │   │   ├── TopNav.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/           # API integration
│   │   └── App.jsx             # Routes & theme
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml          # Orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker** & **Docker Compose** (v24+)
- **Java 21** (for local backend development)
- **Node.js 20+** (for local frontend development)
- **PostgreSQL 15+** (or use Docker)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/nefziamine/skill-evaluator.git
cd skill-evaluator

# Start all services (backend, frontend, database)
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```

### Local Development

#### Backend Setup

```bash
cd backend

# Run with Maven
mvn clean install
mvn spring-boot:run

# The API will be available at http://localhost:8080
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

#### Database Setup

The PostgreSQL database will run on `localhost:5432`:
- **Database**: `skill_evaluator_db`
- **Username**: `postgres`
- **Password**: `postgres`

---

## 🔑 Environment Variables

### Backend (`application.properties`)

```properties
# JWT Configuration
jwt.secret=your-256-bit-secret-key-here-minimum-32-chars
jwt.expiration=86400000

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/skill_evaluator_db
spring.datasource.username=postgres
spring.datasource.password=postgres

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user (Recruiter/Admin) |
| POST | `/api/auth/login` | Login and receive JWT token |

### Recruiter Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recruiter/tests` | List all tests |
| POST | `/api/recruiter/tests` | Create new test |
| POST | `/api/recruiter/generate-ai-test` | AI-powered test generation |
| POST | `/api/recruiter/invite-candidate` | Send test invitation |
| GET | `/api/recruiter/analytics` | Performance analytics |
| GET | `/api/recruiter/questions` | Question bank |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/users` | Create user |
| PUT | `/api/admin/users/{id}` | Update user |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET | `/api/admin/diagnostics` | System health check |
| POST | `/api/admin/settings` | Update global settings |

### Candidate Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidate/tests` | Available tests for candidate |
| POST | `/api/test/{testId}` | Start test session |
| POST | `/api/test/{testId}/submit` | Submit test answers |

---

## 🎨 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Material-UI (MUI)** - Premium component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **tsParticles** - Animated background effects

### Backend
- **Java 21** - Latest LTS version
- **Spring Boot 3** - Enterprise framework
- **Spring Security** - Authentication & authorization
- **JWT** - Stateless session management
- **JPA/Hibernate** - ORM for database
- **PostgreSQL** - Production-grade database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **NGINX** - Reverse proxy for frontend

---

## 🔐 Security Features

- ✅ **JWT Authentication**: Secure, stateless token-based auth
- ✅ **BCrypt Password Hashing**: Industry-standard encryption
- ✅ **Role-Based Access Control (RBAC)**: Admin, Recruiter, Candidate roles
- ✅ **CORS Configuration**: Controlled cross-origin requests
- ✅ **Protected Routes**: Frontend & backend authorization checks
- ✅ **HTTP-Only Cookies**: (Optional) For enhanced token security

---

## 📊 Data Model

### Core Entities

**User**
- `id`, `username`, `email`, `password`, `role` (ADMIN, RECRUITER, CANDIDATE)
- `locked`, `createdAt`, `updatedAt`

**Test**
- `id`, `title`, `description`, `durationMinutes`, `totalPoints`
- `createdBy` (User), `questions` (Many-to-Many), `sessions`

**Question**
- `id`, `text`, `type` (MCQ, TRUE_FALSE, SHORT_ANSWER)
- `options` (JSON), `correctAnswer`, `points`, `skill`, `difficulty`

**TestSession**
- `id`, `candidate` (User), `test`, `startedAt`, `submittedAt`
- `score`, `answers` (JSON), `isPassed`

**SystemSetting**
- `id`, `key`, `value` (e.g., `maintenance_mode`, `public_registration`)

---

## 🎯 User Workflows

### Recruiter Journey
1. **Sign Up** → Create recruiter account
2. **Dashboard** → View analytics, active tests, candidate pipeline
3. **Create Test** → Use AI generation or manually build question bank
4. **Invite Candidates** → Auto-provision accounts via email
5. **Review Results** → Compare candidates, export reports

### Candidate Journey
1. **Receive Invite** → Email with unique test link
2. **Access Test** → No registration required (auto-provisioned)
3. **Complete Assessment** → Timer-based, auto-submits
4. **View Results** → Instant feedback and score

### Admin Journey
1. **Login** → Access admin dashboard
2. **Manage Users** → CRUD operations, lock/unlock accounts
3. **System Config** → Toggle features, monitor health
4. **Analytics** → Platform-wide metrics

---

## 🚧 Public Pages (No Auth Required)

- **Landing Page** (`/`) - Premium SaaS homepage with animated particles
- **How It Works** (`/how-it-works`) - Platform overview
- **Browse Talent** (`/talent`) - Preview verified candidates (login for actions)
- **Post a Job** (`/post-job`) - Job posting page (login to create)
- **Enterprise** (`/enterprise`) - Enterprise solutions
- **AI Advanced** (`/ai-advanced`) - AI capabilities showcase

---

## 📦 Deployment

### Docker Production Build

```bash
# Build and run in production mode
docker-compose -f docker-compose.yml up --build -d

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Stop all services
docker-compose down
```

### Frontend Build

```bash
cd frontend
npm run build

# Build output in dist/ folder
# Serve with NGINX or any static host
```

---

## 🛠️ Development Notes

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: Google Java Style Guide

### Testing
- **Backend**: JUnit 5 + Mockito
- **Frontend**: Vitest + React Testing Library

### Git Workflow
- `main` - Production-ready code
- `develop` - Integration branch
- Feature branches: `feature/feature-name`

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

- **Amine Nefzi** - *Full Stack Developer* - [GitHub](https://github.com/nefziamine)

---

## 📧 Support

For issues, feature requests, or questions:
- **Email**: contact@skillevaluator.com
- **GitHub Issues**: [Open an issue](https://github.com/nefziamine/skill-evaluator/issues)

---

## 🙏 Acknowledgments

- Material-UI for the premium component library
- tsParticles for beautiful background animations
- Spring Boot team for the robust backend framework
- React community for continuous innovation

---

**Built with ❤️ for modern technical recruitment**
