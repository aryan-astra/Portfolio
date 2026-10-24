$ErrorActionPreference = "Stop"
$repo = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$baseline = Join-Path $repo "audits/baseline"
$sourceCommit = "d417043187d1d660efade427b08399532a96b77c"
$nl = [Environment]::NewLine
$publishDir = Join-Path $repo "public/og"
if (Test-Path -LiteralPath $publishDir) { throw "The frozen archive already exists. Back it up and move it out of public/og before deliberately regenerating it." }

if ([IO.Path]::GetFullPath($baseline) -ne [IO.Path]::GetFullPath((Join-Path $repo "audits/baseline"))) { throw "Unsafe baseline path: $baseline" }
if (Test-Path -LiteralPath $baseline) { Remove-Item -LiteralPath $baseline -Recurse -Force }
New-Item -ItemType Directory -Path $baseline | Out-Null
Push-Location $repo
try {
  $archiveTar = Join-Path $repo "audits/baseline-source.tar"
  git archive --format=tar --output=$archiveTar $sourceCommit
  if ($LASTEXITCODE -ne 0) { throw "Could not archive source commit $sourceCommit" }
  tar -xf $archiveTar -C $baseline
  if ($LASTEXITCODE -ne 0) { throw "Could not extract source commit $sourceCommit" }
  Remove-Item -LiteralPath $archiveTar -Force
} finally { Pop-Location }
Push-Location $baseline
try {
  npm ci --ignore-scripts
  if ($LASTEXITCODE -ne 0) { throw "Could not install the original locked dependencies" }
} finally { Pop-Location }

function Replace-Once([string]$relativePath, [string]$old, [string]$new) {
  $path = Join-Path $baseline $relativePath
  $content = [IO.File]::ReadAllText($path)
  if (-not $content.Contains($old)) { throw "Expected text missing in $relativePath" }
  [IO.File]::WriteAllText($path, $content.Replace($old, $new), [Text.UTF8Encoding]::new($false))
}

# Keep these adaptations confined to the extracted snapshot.
Replace-Once "next.config.ts" '  output: "export",' ('  output: "export",' + $nl + '  basePath: "/og",' + $nl + '  assetPrefix: "/og",')
Replace-Once "components/Navbar.tsx" '{ label: "work", href: "/#projects" }' '{ label: "work", href: "/og/#projects" }'
Replace-Once "components/Navbar.tsx" '{ label: "contact", href: "/#contact" }' '{ label: "contact", href: "/og/#contact" }'
Replace-Once "components/sections/Hero.tsx" 'href="/#projects"' 'href="/og/#projects"'
Replace-Once "app/layout.tsx" '  metadataBase: new URL("https://aryans.is-a.dev"),' ('  metadataBase: new URL("https://aryans.is-a.dev"),' + $nl + '  alternates: { canonical: "https://aryans.is-a.dev/og/" },' + $nl + '  robots: { index: false, follow: false },')
Replace-Once "app/layout.tsx" 'url: "https://aryans.is-a.dev",' 'url: "https://aryans.is-a.dev/og/",'
Replace-Once "app/projects/[slug]/page.tsx" '    description: project.oneLiner,' ('    description: project.oneLiner,' + $nl + '    alternates: { canonical: "https://aryans.is-a.dev/og/projects/" + slug + "/" },')
Replace-Once "app/writing/[slug]/page.tsx" '    description: post.description,' ('    description: post.description,' + $nl + '    alternates: { canonical: "https://aryans.is-a.dev/og/writing/" + slug + "/" },')
Replace-Once "app/writing/page.tsx" '  description: "Notes on shipping, local AI, and hackathons.",' ('  description: "Notes on shipping, local AI, and hackathons.",' + $nl + '  alternates: { canonical: "https://aryans.is-a.dev/og/writing/" },')
Replace-Once "app/resume/page.tsx" 'import MobileResumeDoc from "@/components/resume/MobileResumeDoc";' ('import type { Metadata } from "next";' + $nl + 'import MobileResumeDoc from "@/components/resume/MobileResumeDoc";' + $nl + $nl + 'export const metadata: Metadata = { alternates: { canonical: "https://aryans.is-a.dev/og/resume/" } };')
Replace-Once "app/sitemap.ts" '  const baseUrl = "https://aryans.is-a.dev";' '  const baseUrl = "https://aryans.is-a.dev/og";'
Replace-Once "components/resume/MobileResumeDoc.tsx" '"/resume/Aryan-Shukla' '"/og/resume/Aryan-Shukla'
Replace-Once "lib/resume.ts" '"/resume/Aryan-Shukla' '"/og/resume/Aryan-Shukla'

$archiveOut = Join-Path $baseline "out"
Push-Location $baseline
try {
  npm run build -- --webpack
  if ($LASTEXITCODE -ne 0) { throw "Baseline build failed with exit code $LASTEXITCODE" }
} finally { Pop-Location }
if (-not (Test-Path -LiteralPath (Join-Path $archiveOut "index.html"))) { throw "Expected static export missing: $archiveOut/index.html" }
New-Item -ItemType Directory -Path $publishDir -Force | Out-Null
Copy-Item -Path (Join-Path $archiveOut "*") -Destination $publishDir -Recurse -Force

Write-Output "Built archive from $sourceCommit into $publishDir"
