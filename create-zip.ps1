# Script pour créer un ZIP du thème WordPress exportable
# Exclut les fichiers de développement et inclut uniquement les fichiers nécessaires

# Dossiers à exclure complètement
$excludeDirs = @('node_modules', '.git', '.vscode', '.idea', 'coverage', 'tests', '__tests__', '.cache')

# Fichiers à exclure
$excludeFiles = @('*.swp', '*.sublime-*', '.DS_Store', 'Thumbs.db', 'npm-debug.log', 'yarn-debug.log', 'yarn-error.log', '.env*', 'package-lock.json', 'package.json', 'webpack.config.js', 'create-zip.ps1', 'RAPPORT_VALIDATION_WORDPRESS_ORG.md')

# Lire la version depuis style.css
$styleCss = Get-Content 'style.css' -Raw
if ($styleCss -match 'Version:\s*([\d.]+)') {
    $version = $matches[1]
} else {
    $version = Get-Date -Format 'yyyyMMdd'
}

# Nom du fichier ZIP avec version
$zipName = "G2RD-theme-v$version.zip"
$zipPath = Join-Path (Split-Path -Parent $PWD) $zipName

# Supprimer l'ancien ZIP s'il existe
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Ancien ZIP supprime: $zipName"
}

Write-Host "Creation du ZIP du thème G2RD (version $version)..."
Write-Host "Exclusion des fichiers de developpement..."

# Obtenir tous les fichiers
$allFiles = Get-ChildItem -Path . -Recurse -File

# Filtrer les fichiers à exclure
$filesToZip = $allFiles | Where-Object {
    $file = $_
    $shouldExclude = $false
    
    # Vérifier les dossiers exclus
    foreach ($excludeDir in $excludeDirs) {
        if ($file.FullName -like "*\$excludeDir\*") {
            $shouldExclude = $true
            break
        }
    }
    
    # Inclure TOUS les fichiers build/ car ils sont nécessaires pour le fonctionnement des blocs
    # Les block.json référencent les fichiers build/ (editorScript, viewScript, etc.)
    # On exclut seulement les fichiers source maps (.map) qui ne sont pas nécessaires en production
    if (-not $shouldExclude -and $file.FullName -like "*\build\*") {
        $buildFileName = Split-Path $file.Name -Leaf
        # Exclure uniquement les source maps et fichiers de développement
        if ($buildFileName -like "*.map" -or $buildFileName -like "*.dev.*") {
            $shouldExclude = $true
        }
        # Tous les autres fichiers build sont nécessaires (index.js, index.css, *-frontend.js, save.js, view.js, etc.)
    }
    
    # Vérifier les fichiers exclus par pattern
    if (-not $shouldExclude) {
        foreach ($pattern in $excludeFiles) {
            if ($file.Name -like $pattern) {
                $shouldExclude = $true
                break
            }
        }
    }
    
    return -not $shouldExclude
}

Write-Host "Ajout de $($filesToZip.Count) fichiers au ZIP..."

# Créer un fichier temporaire pour stocker la liste des fichiers
$tempFile = [System.IO.Path]::GetTempFileName()

try {
    # Créer le ZIP en utilisant .NET pour un meilleur contrôle
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    
    # Créer le ZIP
    $zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
    
    $fileCount = 0
    foreach ($file in $filesToZip) {
        $relativePath = $file.FullName.Substring($PWD.Path.Length + 1)
        $entry = $zip.CreateEntry($relativePath.Replace('\', '/'))
        $entryStream = $entry.Open()
        $fileStream = [System.IO.File]::OpenRead($file.FullName)
        $fileStream.CopyTo($entryStream)
        $fileStream.Close()
        $entryStream.Close()
        $fileCount++
        
        if ($fileCount % 50 -eq 0) {
            Write-Host "  $fileCount fichiers ajoutes..."
        }
    }
    
    $zip.Dispose()
    
    $zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "ZIP cree avec succes!" -ForegroundColor Green
    Write-Host "Fichier: $zipName" -ForegroundColor Cyan
    Write-Host "Emplacement: $zipPath" -ForegroundColor Cyan
    Write-Host "Taille: $zipSize MB" -ForegroundColor Cyan
    Write-Host "Nombre de fichiers: $fileCount" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Le fichier ZIP est pret pour l'installation sur un nouveau site WordPress." -ForegroundColor Yellow
    
} catch {
    Write-Host "Erreur lors de la creation du ZIP: $_" -ForegroundColor Red
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
    }
} finally {
    if (Test-Path $tempFile) {
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    }
}

