# Skill Evaluator Platform - Project Structure

## Complete Folder Structure

```
skill-evaluator/
│
├── backend/                                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/skillevaluator/
│   │   │   │   ├── SkillEvaluatorApplication.java    # Main Spring Boot application
│   │   │   │   ├── security/
│   │   │   │   │   ├── SecurityConfig.java          # Security configuration with JWT
│   │   │   │   │   ├── JwtTokenProvider.java        # JWT token generation & validation
│   │   │   │   │   └── JwtAuthenticationFilter.java # JWT authentication filter
│   │   │   │   └── model/
│   │   │   │       └── Role.java                    # Role enum (ADMIN, RECRUITER, CANDIDATE)
│   │   │   └── resources/
│   │   │       └── application.properties           # Application configuration
│   │   └── test/                                   # Test directory
│   ├── Dockerfile                                 # Backend Docker image
│   ├── .dockerignore                              # Docker ignore patterns
│   └── pom.xml                                    # Maven dependencies
│
├── frontend/                                     # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx                                # Main React component
│   │   ├── main.jsx                               # React entry point
│   │   ├── index.css                              # Global styles
│   │   └── services/
│   │       └── api.js                             # Axios API client with JWT interceptor
│   ├── public/                                    # Static assets
│   ├── Dockerfile                                 # Frontend Docker image
│   ├── nginx.conf                                 # Nginx configuration for production
│   ├── .dockerignore                              # Docker ignore patterns
│   ├── .eslintrc.cjs                              # ESLint configuration
│   ├── .gitignore                                 # Git ignore patterns
│   ├── index.html                                 # HTML template
│   ├── package.json                               # NPM dependencies
│   └── vite.config.js                             # Vite configuration
│
├── docker-compose.yml                             # Docker orchestration
├── .gitignore                                     # Root git ignore
├── README.md                                      # Project documentation
└── PROJECT_STRUCTURE.md                          # This file
```

## Key Components

### Backend Security Configuration

**SecurityConfig.java** provides:
- JWT-based authentication
- Role-based access control (RBAC)
- CORS configuration for frontend communication
- Stateless session management
- Endpoint protection by role:
  - `/api/auth/**` - Public
  - `/api/admin/**` - ADMIN only
  - `/api/recruiter/**` - RECRUITER and ADMIN
  - `/api/candidate/**` - All authenticated users

### JWT Implementation

- **JwtTokenProvider**: Generates and validates JWT tokens
- **JwtAuthenticationFilter**: Intercepts requests and validates JWT tokens
- Tokens include username and roles
- Configurable expiration time (default: 24 hours)

### Frontend Setup

- Vite for fast development and building
- Material UI for modern interface components
- Axios for API communication with automatic JWT token injection
- API client configured with interceptors for token management

### Docker Configuration

- **PostgreSQL**: Database service with health checks
- **Backend**: Multi-stage build with Maven
- **Frontend**: Multi-stage build with Nginx for production
- All services connected via Docker network
- Volume persistence for database data

## Role Hierarchy

1. **ADMIN**: Full system access
2. **RECRUITER**: Can access recruiter and candidate endpoints
3. **CANDIDATE**: Can access candidate endpoints only

## Next Development Steps

1. Create User entity with JPA
2. Implement UserRepository
3. Create AuthenticationController with login/register
4. Build Question and Test entities
5. Implement test engine logic
6. Create frontend authentication pages
7. Build candidate test interface
8. Develop recruiter dashboard

