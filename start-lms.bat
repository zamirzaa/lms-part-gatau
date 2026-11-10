@echo off
title e-Learning SMKN 1 Cibinong
echo ========================================================
echo   MEMULAI LMS e-Learning SMKN 1 Cibinong
echo   Alamat Browser: http://localhost:3000
echo ========================================================
echo.
cd /d "%~dp0"
call npm.cmd run dev
pause
