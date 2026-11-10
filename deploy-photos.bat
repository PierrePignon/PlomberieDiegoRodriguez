@echo off
REM ============================================================
REM  Script tout-en-un : vérifie les 2 photos, optimise WebP,
REM  commit et push. Double-clic pour lancer.
REM ============================================================

setlocal
cd /d "%~dp0"

set DEP=client\public\images\realisations\service-depannage.png
set MARBRE=client\public\images\realisations\sdb-moderne-marbre-beige.jpg

echo.
echo === Verification des 2 photos ===
if not exist "%DEP%" (
    echo [X] Photo manquante : %DEP%
    echo     Sauvegarde Photo 1 Diego sur chauffe-eau depuis le chat avec ce nom exact.
    goto :fail
) else (
    echo [OK] %DEP%
)

if not exist "%MARBRE%" (
    echo [X] Photo manquante : %MARBRE%
    echo     Sauvegarde Photo 2 SDB marbre beige depuis le chat avec ce nom exact.
    goto :fail
) else (
    echo [OK] %MARBRE%
)

echo.
echo === Generation des variantes WebP (400w / 800w / 1200w) ===
cd client
call npm run optimize-images
if errorlevel 1 (
    echo.
    echo [X] Erreur optimize-images. Essaie d abord : npm install
    cd ..
    goto :fail
)
cd ..

echo.
echo === Commit + push ===
git add .
git commit -m "Bandeau noir cards services + photo depannage Diego + SDB marbre + variantes WebP"
if errorlevel 1 (
    echo.
    echo Rien a committer ou erreur git. Verifie l etat avec : git status
    goto :fail
)

git push
if errorlevel 1 (
    echo.
    echo [X] Erreur push. Verifie ta connexion / credentials.
    goto :fail
)

echo.
echo ============================================================
echo   OK ! Cloudflare rebuild dans 3-5 min.
echo   Hard refresh https://plomberie-diego-rodriguez.fr dans 5 min.
echo ============================================================
echo.
pause
exit /b 0

:fail
echo.
echo === ECHEC ===
pause
exit /b 1
