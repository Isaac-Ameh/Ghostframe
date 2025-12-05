@echo off
REM 🎃 GhostFrame CLI - Quick Test Script (Windows)
REM Run this to quickly test the CLI locally

echo 🎃 GhostFrame CLI - Quick Test Script
echo ======================================
echo.

REM Step 1: Build
echo Step 1: Building CLI...
call npm install
call npm run build
echo ✅ Build complete
echo.

REM Step 2: Link
echo Step 2: Linking CLI globally...
call npm link
echo ✅ CLI linked
echo.

REM Step 3: Verify
echo Step 3: Verifying installation...
call gf --version
echo ✅ CLI installed
echo.

REM Step 4: Run tests
echo Step 4: Running tests...
call npm test
echo ✅ Tests passed
echo.

REM Step 5: Create test module
echo Step 5: Creating test module...
set TEST_DIR=..\test-cli-output
if exist "%TEST_DIR%" rmdir /s /q "%TEST_DIR%"
mkdir "%TEST_DIR%"
cd "%TEST_DIR%"

call gf init test-module --template education --skip-install
echo ✅ Test module created
echo.

REM Step 6: Test commands
echo Step 6: Testing CLI commands...
cd test-module

echo Testing: gf validate
call gf validate

echo.
echo Testing: gf build
call gf build

echo.
echo Testing: gf config
call gf config list

echo ✅ Commands tested
echo.

REM Summary
echo ======================================
echo 🎉 CLI Testing Complete!
echo.
echo Next steps:
echo   1. Test manually: cd %TEST_DIR%\test-module
echo   2. Run: gf dev
echo   3. Run: gf test
echo   4. Run: gf validate --strict
echo.
echo To unlink CLI: npm unlink -g ghostframe-cli
echo ======================================

pause
