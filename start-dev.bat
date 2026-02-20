@echo off
REM 원신 파티 코스트 계산기 - 개발 서버 실행 스크립트

echo.
echo ========================================
echo 원신 파티 코스트 계산기
echo 개발 서버 시작
echo ========================================
echo.

cd /d "%~dp0genshin-cost-calculator"

echo 개발 서버를 시작합니다...
echo.
echo 아래 주소를 브라우저에서 열어주세요:
echo   http://localhost:5173/
echo.
echo 종료하려면: Ctrl + C 를 누르세요
echo.

npm run dev

pause
