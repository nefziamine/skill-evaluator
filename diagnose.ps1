# Diagnostic Script - Run in PowerShell
# This will help identify the exact issues

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SKILL EVALUATOR DIAGNOSTICS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Docker Containers
Write-Host "[1] Checking Docker Containers..." -ForegroundColor Yellow
docker-compose ps

# 2. Check Backend Health
Write-Host "`n[2] Testing Backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/admin/stats" -Method GET -Headers @{"Authorization"="Bearer test"} -ErrorAction SilentlyContinue
    Write-Host "Backend is accessible at http://localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "Backend connection issue: $_" -ForegroundColor Red
}

# 3. Check Frontend
Write-Host "`n[3] Testing Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction SilentlyContinue
    Write-Host "Frontend is accessible at http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "Frontend connection issue: $_" -ForegroundColor Red
}

# 4. Check Backend Logs for Errors
Write-Host "`n[4] Recent Backend Errors:" -ForegroundColor Yellow
docker-compose logs --tail 50 backend | Select-String "Exception","Error","WARN" | Select-Object -Last 10

# 5. Check if AI endpoint exists
Write-Host "`n[5] AI Generation Endpoint Check:" -ForegroundColor Yellow
docker-compose logs backend | Select-String "AI GENERATION","generate-ai-test" | Select-Object -Last 5

# 6. Check Admin endpoint
Write-Host "`n[6] Admin User Creation Check:" -ForegroundColor Yellow
docker-compose logs backend | Select-String "ADMIN:","createUser" | Select-Object -Last 5

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "2. Press F12 to open Developer Tools" -ForegroundColor White
Write-Host "3. Go to Console tab" -ForegroundColor White
Write-Host "4. Try to create a user or generate AI test" -ForegroundColor White
Write-Host "5. Copy any RED error messages you see" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
