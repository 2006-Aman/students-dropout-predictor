Param(
    [string]$ApiHost = "http://127.0.0.1:8000",
    [int]$UiPort = 5173,
    [switch]$DeployVercel,
    [switch]$Prod,
    [string]$VercelProjectName = ""
)

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "[OK]   $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[ERR]  $msg" -ForegroundColor Red }

function Test-Cmd($cmd) {
    $null = & cmd /c "where $cmd" 2>$null
    return $LASTEXITCODE -eq 0
}

try {
    $root = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $root
    Write-Info "Project root: $root"

    # -------------------- Backend --------------------
    Write-Info "Setting up Python virtual environment..."
    if (-not (Test-Path "$root/venv/Scripts/python.exe")) {
        python -m venv venv
        Write-Ok "Virtualenv created"
    } else {
        Write-Info "Virtualenv already exists"
    }

    $py = Join-Path $root 'venv/Scripts/python.exe'
    & $py -m pip install --upgrade pip > $null
    Write-Info "Installing backend requirements..."
    & $py -m pip install -r "$root/requirements.txt"
    Write-Ok "Backend dependencies installed"

    # Start API in new PowerShell window
    $backendCmd = "Set-Location `"$root`"; `n"
    $backendCmd += ".`\venv`\Scripts`\Activate.ps1; `n"
    $backendCmd += "python api.py"
    Write-Info "Starting backend API (http://127.0.0.1:8000)..."
    Start-Process powershell -ArgumentList "-NoExit","-Command",$backendCmd | Out-Null

    # -------------------- Frontend --------------------
    $fe = Join-Path $root 'frontend'
    if (-not (Test-Path $fe)) { throw "Frontend directory not found: $fe" }

    Write-Info "Installing frontend dependencies..."
    Set-Location $fe
    if (Test-Path "$fe/package-lock.json") {
        npm ci
    } else {
        npm install
    }

    Write-Info "Building frontend..."
    $env:VITE_API_BASE_URL = $ApiHost
    npm run build
    Write-Ok "Frontend built (frontend/dist)"

    if ($DeployVercel) {
        Write-Info "Preparing Vercel deployment..."

        if (-not (Test-Cmd node)) { throw "Node.js is required but not found. Install from https://nodejs.org" }
        if (-not (Test-Cmd npm)) { throw "npm is required but not found. Install Node.js which includes npm." }

        if (-not (Test-Cmd vercel)) {
            Write-Info "Installing Vercel CLI globally..."
            npm install -g vercel | Out-Null
        }

        if (-not (Test-Cmd vercel)) { throw "Vercel CLI not available after install. Please add npm global bin to PATH or install manually." }

        Write-Info "Checking Vercel authentication..."
        $whoami = & vercel whoami 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Warn "You are not logged in to Vercel. Please run: vercel login"
            Write-Warn "After logging in, re-run this script with -DeployVercel [and -Prod if desired]."
            throw "Vercel login required"
        } else {
            Write-Ok "Vercel authenticated: $whoami"
        }

        # Ensure vercel.json exists with basic config (do not overwrite if present)
        $vercelConfig = Join-Path $fe 'vercel.json'
        if (-not (Test-Path $vercelConfig)) {
            Write-Info "Creating basic vercel.json configuration..."
            $cfg = @{
                version = 2
                builds = @(@{ src = "package.json"; use = "@vercel/static-build"; config = @{ distDir = "dist" } })
                routes = @(@{ src = "/(.*)"; dest = "/index.html" })
                env = @{ VITE_API_BASE_URL = $ApiHost }
            } | ConvertTo-Json -Depth 5
            $cfg | Out-File -FilePath $vercelConfig -Encoding UTF8 -Force
            Write-Ok "vercel.json created"
        } else {
            Write-Info "vercel.json already exists"
        }

        # Optionally link to a specific Vercel project
        if ($VercelProjectName -and $VercelProjectName.Trim().Length -gt 0) {
            Write-Info "Linking Vercel project: $VercelProjectName"
            & vercel link --cwd $fe --project $VercelProjectName --yes | Out-Null
        }

        Write-Info "Deploying to Vercel (preview)..."
        & vercel --cwd $fe --yes --confirm | Write-Host
        if ($LASTEXITCODE -ne 0) { throw "Vercel preview deployment failed" }

        if ($Prod) {
            Write-Info "Promoting deployment to production..."
            & vercel --cwd $fe --prod --yes --confirm | Write-Host
            if ($LASTEXITCODE -ne 0) { throw "Vercel production deployment failed" }
            Write-Ok "Production deployment completed"
        }
    } else {
        # Serve built UI locally
        $serveCmd = "Set-Location `"$fe`"; `n"
        $serveCmd += "npx serve -s dist -l $UiPort"
        Write-Info "Starting static server for UI on http://localhost:$UiPort ..."
        Start-Process powershell -ArgumentList "-NoExit","-Command",$serveCmd | Out-Null
    }

    # -------------------- Done --------------------
    Start-Sleep -Seconds 2
    if (-not $DeployVercel) {
        Write-Ok "UI:  http://localhost:$UiPort"
        Write-Ok "API: $ApiHost (docs at $ApiHost/docs)"
        Write-Info "Opening browser..."
        Start-Process "http://localhost:$UiPort" | Out-Null
    }
}
catch {
    Write-Err $_.Exception.Message
    exit 1
}
