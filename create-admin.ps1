# Create Admin Account
# Run this in PowerShell

$body = @{
    username = "admin"
    email    = "admin@skillpro.com"
    password = "admin123"
    role     = "ADMIN"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Admin account created successfully!" -ForegroundColor Green
    Write-Host "Username: admin" -ForegroundColor Cyan
    Write-Host "Password: admin123" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Now:"
    Write-Host "1. Go to http://localhost:3000/login"
    Write-Host "2. Login with:  admin / admin123"
    Write-Host "3. Access the Admin Dashboard"
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "The account might already exist. Try logging in with existing admin credentials."
}
