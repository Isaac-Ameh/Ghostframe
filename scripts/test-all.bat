@echo off
REM GhostFrame Test Runner Script for Windows
REM Runs all tests for both frontend and backend

echo 🎃 GhostFrame Test Suite Runner
echo ================================

set total_tests=0
set passed_tests=0

echo.
echo 🔧 Backend Tests
echo ==================

cd backend

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

REM Run backend tests
echo Running Backend Unit tests...
call npm test
if %errorlevel% equ 0 (
    echo ✅ Backend tests passed!
    set /a passed_tests+=1
) else (
    echo ❌ Backend tests failed!
)
set /a total_tests+=1

echo.
echo 🎨 Frontend Tests
echo ==================

cd ..\frontend

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Run frontend tests
echo Running Frontend Unit tests...
call npm test -- --watchAll=false
if %errorlevel% equ 0 (
    echo ✅ Frontend tests passed!
    set /a passed_tests+=1
) else (
    echo ❌ Frontend tests failed!
)
set /a total_tests+=1

echo.
echo 🔍 Type Checking
echo =================

cd ..\backend
echo Running Backend TypeScript check...
call npm run type-check
if %errorlevel% equ 0 (
    echo ✅ Backend TypeScript passed!
    set /a passed_tests+=1
) else (
    echo ❌ Backend TypeScript failed!
)
set /a total_tests+=1

cd ..\frontend
echo Running Frontend TypeScript check...
call npm run type-check
if %errorlevel% equ 0 (
    echo ✅ Frontend TypeScript passed!
    set /a passed_tests+=1
) else (
    echo ❌ Frontend TypeScript failed!
)
set /a total_tests+=1

echo.
echo 📊 Test Summary
echo ================
echo Total test suites: %total_tests%
echo Passed: %passed_tests%

if %passed_tests% equ %total_tests% (
    echo 🎉 All tests passed! GhostFrame is ready for the hackathon!
    exit /b 0
) else (
    echo ⚠️  Some tests failed. Please review the output above.
    exit /b 1
)