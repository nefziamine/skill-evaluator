# Skill Evaluator Platform

A secure, scalable web platform for automating technical assessments in recruitment.

## Tech Stack

- **Backend**: Java 21, Spring Boot 3, Spring Security, JWT
- **Frontend**: React.js (Vite), Material UI, Axios
- **Database**: PostgreSQL
- **DevOps**: Docker, Docker Compose

## Project Structure

```
skill-evaluator/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/skillevaluator/
│   │   │   │   ├── security/    # JWT & Security config
│   │   │   │   └── model/       # Domain models
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/               # React frontend
│   ├── src/
│   │   ├── services/      # API services
│   │   └── ...
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml      # Orchestration
└── README.md
```

## Features

- **Role-Based Access Control (RBAC)**: Admin, Recruiter, Candidate
- **JWT Authentication**: Secure session management
- **Test Engine**: MCQ, True/False, Short Answer questions
- **Candidate Experience**: Time-limited tests with auto-submission
- **Reporting**: Automatic scoring and recruiter dashboard

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Java 21 (for local development)
- Node.js 20+ (for local frontend development)

### Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Local Development

#### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

#### Database

The PostgreSQL database runs on `localhost:5432` with:
- Database: `skill_evaluator_db`
- Username: `postgres`
- Password: `postgres`

## API Endpoints

### Public
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Admin
- `/api/admin/**` - Admin-only endpoints

### Recruiter
- `/api/recruiter/**` - Recruiter endpoints (accessible by Admin too)

### Candidate
- `/api/candidate/**` - Candidate endpoints (accessible by all authenticated users)

## Security

- JWT tokens for authentication
- BCrypt password encoding
- Role-based endpoint protection
- CORS configuration for frontend communication

## Environment Variables

### Backend
- `JWT_SECRET`: Secret key for JWT signing (minimum 32 characters)
- `JWT_EXPIRATION`: Token expiration time in milliseconds (default: 86400000 = 24 hours)
- `SPRING_DATASOURCE_URL`: PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

### Frontend
- `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:8080/api)

## Next Steps

1. Implement User entity and repository
2. Create authentication endpoints (login/register)
3. Build question and test entities
4. Implement test engine logic
5. Create frontend authentication pages
6. Build candidate test interface
7. Develop recruiter dashboard

## License

MIT
