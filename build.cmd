@ECHO off

CD %~dp0
CALL build\deps.cmd
CALL build\gui.cmd
CALL build\pipy.cmd

IF NOT EXIST bin (MD bin)
COPY pipy\bin\Release\pipy.exe bin\pipy.exe

ECHO The final product is ready at bin\pipy.exe
