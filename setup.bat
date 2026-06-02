@echo off
echo ============================================
echo   МедИнфо - Setup Script
echo   Medical News Platform
echo ============================================
echo.

echo [1/4] Инсталирање на backend зависности...
cd /d "%~dp0server"
call npm install
if %errorlevel% neq 0 (
    echo Грешка при инсталација на backend!
    pause
    exit /b 1
)
echo.

echo [2/4] Инсталирање на frontend зависности...
cd /d "%~dp0client"
call npm install
if %errorlevel% neq 0 (
    echo Грешка при инсталација на frontend!
    pause
    exit /b 1
)
echo.

echo [3/4] Креирање на PostgreSQL база...
echo Отворете го pgAdmin или psql и извршете го:
echo   database\schema.sql
echo   database\seed.sql
echo.
echo За да го направите тоа автоматски, уредете го server\.env
echo со точните податоци за вашата PostgreSQL инстанца.
echo.

echo [4/4] Инсталацијата е завршена!
echo.
echo ============================================
echo   Како да го стартувате проектот:
echo ============================================
echo.
echo   Терминал 1 - Backend:
echo     cd server
echo     npm run dev
echo.
echo   Терминал 2 - Frontend:
echo     cd client
echo     npm start
echo.
echo   Па потоа отворете http://localhost:3000
echo.
pause
