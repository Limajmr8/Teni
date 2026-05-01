# BAZAR Complete Startup Script
Write-Host "Starting BAZAR Platform..." -ForegroundColor Green

# 1. Start Supabase (Database, Edge Functions, Auth, Storage)
Write-Host "NOTE: Supabase local requires Docker. Skipping local DB start (using mock UI)..." -ForegroundColor Yellow
# npx supabase start

# 2. Deploy Edge Functions
# Write-Host "Deploying Edge Functions locally..." -ForegroundColor Cyan
# npx supabase functions serve schedule-batching --env-file ./apps/web/.env.local --no-verify-jwt --background

# 3. Start Next.js Web App (Hyperlocal & Heritage Marketplace + Counter PWA)
Write-Host "Starting Web Application (Next.js) on Port 3000..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev", "--workspace=web"

# 4. Start Next.js Warehouse App
Write-Host "Starting Warehouse Application (Next.js) on Port 3001..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev", "--workspace=warehouse"

# 5. Start Next.js Admin App
Write-Host "Starting Admin Application (Next.js) on Port 3003..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev", "--workspace=admin"

# 6. Start Expo Mobile App (Runner & Seller App)
Write-Host "Starting Mobile Application (Expo)..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "start", "--workspace=mobile"

Write-Host "BAZAR is running!" -ForegroundColor Green
Write-Host "- Consumer Web Platform: http://localhost:3000"
Write-Host "- Warehouse Ops: http://localhost:3001"
Write-Host "- Admin Dashboard: http://localhost:3003"
Write-Host "- Supabase Studio: http://localhost:54323"
Write-Host "- Expo Metro Bundler: See terminal for QR code"
