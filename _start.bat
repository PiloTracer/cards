@echo off
setlocal EnableExtensions EnableDelayedExpansion

:: ───────────────────────────────────────────────────────
:: CONFIGURATION
:: ───────────────────────────────────────────────────────
:: Use the compose file in this folder
set "COMPOSE_FILE=%~dp0docker-compose.yml"
:: Where to store your backups
set "BACKUP_DIR=%~dp0backups"

:: Ensure BACKUP_DIR exists
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

:: ───────────────────────────────────────────────────────
:: MAIN MENU
:: ───────────────────────────────────────────────────────
:MENU
cls
echo ====================================================
echo        Docker Compose Helper - Interactive Menu
echo ====================================================
echo [1]  Start full stack
echo [2]  Stop stack
echo [3]  Stop, remove ALL containers on host
echo [4]  Clean unused resources
echo [5]  Restart a single service
echo [6]  Backup volumes
echo [7]  Restore volumes from backups
echo [8]  View logs
echo [9]  Exit
echo ====================================================
set /p choice="Select an option [1-9]: "

if "%choice%"=="1" goto UP
if "%choice%"=="2" goto DOWN
if "%choice%"=="3" goto STOPALL
if "%choice%"=="4" goto CLEAN
if "%choice%"=="5" goto RESTART
if "%choice%"=="6" goto BACKUP
if "%choice%"=="7" goto RESTORE
if "%choice%"=="8" goto LOGS
if "%choice%"=="9" goto END

echo Invalid choice – please enter a number 1–9.
pause
goto MENU

:: ───────────────────────────────────────────────────────
:UP
echo.
echo ~ Starting full stack...
docker compose -f "%COMPOSE_FILE%" up -d --build
pause
goto MENU

:: ───────────────────────────────────────────────────────
:DOWN
echo.
echo >> Stopping stack...
docker compose -f "%COMPOSE_FILE%" down
pause
goto MENU

:: ───────────────────────────────────────────────────────
:STOPALL
echo.
echo Stopping and removing ALL containers on this host...
for /f "tokens=*" %%C in ('docker ps -q') do docker stop %%C 2>nul
for /f "tokens=*" %%C in ('docker ps -aq') do docker rm  %%C 2>nul
pause
goto MENU

:: ───────────────────────────────────────────────────────
:CLEAN
echo.
echo ...Pruning unused system resources (preserving volumes)...
docker compose -f "%COMPOSE_FILE%" down
docker system prune -a -f
pause
goto MENU

:: ───────────────────────────────────────────────────────
:RESTART
echo.
set /p svc="Enter service name to restart (e.g. backend): "
if "%svc%"=="" (
  echo No service name provided.
) else (
  echo ~ Restarting %svc%...
  docker compose -f "%COMPOSE_FILE%" restart %svc%
)
pause
goto MENU

:: ───────────────────────────────────────────────────────
:BACKUP
echo.
echo ~ Backing up volumes to "%BACKUP_DIR%"...
echo - db_data → db_data.tar.gz
docker run --rm -v db_data:/volume -v "%BACKUP_DIR%":/backup alpine ^
  sh -c "cd /volume && tar czf /backup/db_data.tar.gz ."
echo - redis_data → redis_data.tar.gz
docker run --rm -v redis_data:/volume -v "%BACKUP_DIR%":/backup alpine ^
  sh -c "cd /volume && tar czf /backup/redis_data.tar.gz ."
echo Backup complete.
pause
goto MENU

:: ───────────────────────────────────────────────────────
:RESTORE
echo.
echo ~ Restoring volumes from "%BACKUP_DIR%"...
if exist "%BACKUP_DIR%\db_data.tar.gz" (
  echo - Restoring db_data...
  docker run --rm -v db_data:/volume -v "%BACKUP_DIR%":/backup alpine ^
    sh -c "cd /volume && tar xzf /backup/db_data.tar.gz"
) else echo !! db_data backup not found.
if exist "%BACKUP_DIR%\redis_data.tar.gz" (
  echo - Restoring redis_data...
  docker run --rm -v redis_data:/volume -v "%BACKUP_DIR%":/backup alpine ^
    sh -c "cd /volume && tar xzf /backup/redis_data.tar.gz"
) else echo !! redis_data backup not found.
echo Restore operation complete.
pause
goto MENU

:: ───────────────────────────────────────────────────────
:LOGS
echo.
set /p svc="Enter service name to view logs (leave blank for all): "
if "%svc%"=="" (
  echo ~ Following logs for ALL services...
  docker compose -f "%COMPOSE_FILE%" logs -f
) else (
  echo ~ Following logs for %svc%...
  docker compose -f "%COMPOSE_FILE%" logs -f %svc%
)
pause
goto MENU

:: ───────────────────────────────────────────────────────
:END
echo Goodbye!
endlocal
exit /B 0
