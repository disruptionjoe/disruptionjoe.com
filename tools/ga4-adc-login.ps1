param(
  [string]$ClientIdFile
)

$gcloudPath = 'C:\Users\joe\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd'
$scopes = 'https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform'

if (-not (Test-Path $gcloudPath)) {
  Write-Error "gcloud was not found at $gcloudPath. Install Google Cloud SDK first."
  exit 1
}

if (-not $ClientIdFile) {
  Write-Host ''
  Write-Host 'Google Analytics requires an OAuth client JSON file for the analytics.readonly scope.' -ForegroundColor Yellow
  Write-Host 'Download a Desktop app OAuth client JSON from Google Cloud Console first, then paste the full file path here.' -ForegroundColor Yellow
  Write-Host ''
  $ClientIdFile = Read-Host 'Path to OAuth client JSON'
}

if (-not $ClientIdFile) {
  Write-Error 'No client JSON path was provided.'
  exit 1
}

$ClientIdFile = $ClientIdFile.Trim()
$ClientIdFile = $ClientIdFile.Trim('"')

if (-not (Test-Path $ClientIdFile)) {
  Write-Error "Client JSON file not found: $ClientIdFile"
  Write-Host ''
  Write-Host 'Create it here:' -ForegroundColor Yellow
  Write-Host 'https://console.cloud.google.com/apis/credentials' -ForegroundColor Cyan
  Write-Host 'Credential type: OAuth client ID -> Desktop app -> Download JSON' -ForegroundColor Yellow
  exit 1
}

Write-Host ''
Write-Host 'Starting ADC login...' -ForegroundColor Green
Write-Host 'A browser should open automatically. If it does not, gcloud should print a Google URL you can open manually.' -ForegroundColor Green
Write-Host ''

& $gcloudPath auth application-default login "--client-id-file=$ClientIdFile" "--scopes=$scopes"
