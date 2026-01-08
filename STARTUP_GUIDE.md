# 🚀 Skill Evaluator Platform - Startup Guide

## ✅ Services Status

All services are now **RUNNING** successfully!

### Running Services

| Service | Status | Port | URL |
|---------|--------|------|-----|
| **PostgreSQL** | ✅ Healthy | 5432 | `localhost:5432` |
| **Backend API** | ✅ Running | 8080 | `http://localhost:8080` |
| **Frontend** | ✅ Running | 3000 | `http://localhost:3000` |

## 📋 Quick Start Commands

### Start All Services
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### Check Service Status
```bash
docker-compose ps
```

## 🌐 Access the Application

### Frontend
- **URL**: http://localhost:3000
- **Status**: ✅ Running

### Backend API
- **URL**: http://localhost:8080
- **API Base**: http://localhost:8080/api
- **Status**: ✅ Running

### Database
- **Host**: localhost
- **Port**: 5432
- **Database**: skill_evaluator_db
- **Username**: postgres
- **Password**: postgres
- **Status**: ✅ Healthy

## 🧪 Test the Application

### 1. Register a New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Access Frontend
Open your browser and navigate to: **http://localhost:3000**

## 📝 Next Steps

1. **Access the Frontend**: Open http://localhost:3000 in your browser
2. **Register a Candidate**: Create a new account
3. **Login**: Use your credentials to access the platform
4. **Create Test Data**: Use the API or database to create tests and questions

## 🔧 Troubleshooting

### Backend Not Starting
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Database Connection Issues
```bash
# Check database health
docker-compose ps postgres

# View database logs
docker-compose logs postgres
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Port Already in Use
If ports 3000, 8080, or 5432 are already in use:
1. Stop the conflicting service
2. Or modify ports in `docker-compose.yml`

## 📊 Database Access

### Using psql (if installed)
```bash
docker exec -it skill-evaluator-db psql -U postgres -d skill_evaluator_db
```

### Using Docker
```bash
docker exec -it skill-evaluator-db psql -U postgres
```

## 🎯 API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Protected Endpoints (Require JWT Token)
- `GET /api/candidate/tests` - Get available tests
- `POST /api/candidate/tests/{testId}/start` - Start test
- `POST /api/candidate/tests/{testId}/submit` - Submit test
- `GET /api/candidate/sessions` - Get my sessions

## 🔐 Default Configuration

- **JWT Secret**: `your-256-bit-secret-key-change-this-in-production-minimum-32-characters`
- **JWT Expiration**: 24 hours (86400000 ms)
- **Database**: PostgreSQL 16
- **Backend**: Spring Boot 3.2.0 with Java 21
- **Frontend**: React 18 with Vite

## 📚 Documentation

- **Feature Verification**: See `FEATURE_VERIFICATION.md`
- **Quick Reference**: See `QUICK_REFERENCE.md`
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **Project Structure**: See `PROJECT_STRUCTURE.md`

---

**🎉 Your Skill Evaluator Platform is ready to use!**

Visit http://localhost:3000 to get started.

