param(
  [switch]$Check
)

$ErrorActionPreference = 'Stop'
$profileUri = 'https://scholar.google.com/citations?user=mTYJRFwAAAAJ&hl=en&pagesize=100&sortby=pubdate'
$requestHeaders = @{
  'User-Agent' = 'Mozilla/5.0 (compatible; pimlphm-scholar-sync/1.0; +https://github.com/pimlphm/pimlphm.github.io)'
  'Accept-Language' = 'en-US,en;q=0.9'
}

$response = Invoke-WebRequest -Uri $profileUri -Headers $requestHeaders -UseBasicParsing -TimeoutSec 30
if ($response.StatusCode -ne 200) {
  throw "Scholar request failed with HTTP $($response.StatusCode)."
}
if (-not [string]$response.Content) {
  throw 'Scholar returned an empty profile response.'
}

$nodeArguments = @('scripts/sync-scholar.mjs', '--stdin')
if ($Check) {
  $nodeArguments += '--check'
}

$response.Content | & node @nodeArguments
if ($LASTEXITCODE -ne 0) {
  throw "Scholar validation failed with exit code $LASTEXITCODE."
}
