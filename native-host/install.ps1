param([string]$ExtensionId = 'geofeekkkbkaaiknpbllcjefbgchnpml')
$ErrorActionPreference = 'Stop'
if ($ExtensionId -ne 'geofeekkkbkaaiknpbllcjefbgchnpml') { throw 'This source build requires the ID fixed by extension/manifest.json. Update both the host origin and manifest key when publishing with a different ID.' }
$binary = Join-Path $PSScriptRoot 'WebFileLauncher.Host.exe'
if (-not (Test-Path -LiteralPath $binary)) { throw 'WebFileLauncher.Host.exe is missing. Extract the complete package.' }
$signature = Get-AuthenticodeSignature -LiteralPath $binary
Write-Output "Host signature: $($signature.Status). Installation does not override Smart App Control or enterprise policy."
$manifestPath = Join-Path (Split-Path -Parent $binary) 'host.json'
@{name='io.github.web_file_launcher';description='Web File Launcher local bridge';path=$binary;type='stdio';allowed_origins=@("chrome-extension://$ExtensionId/")} | ConvertTo-Json | Set-Content -LiteralPath $manifestPath -Encoding utf8
$keys = @('HKCU:\Software\Google\Chrome\NativeMessagingHosts\io.github.web_file_launcher','HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\io.github.web_file_launcher')
foreach ($key in $keys) { New-Item -Path $key -Force | Out-Null; Set-Item -LiteralPath $key -Value $manifestPath }
Write-Output 'Registered for Chrome and Edge (current Windows user). Keep this repository folder in place.'
