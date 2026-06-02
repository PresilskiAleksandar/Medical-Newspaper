Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d D:\MedicalNewspaper\server && node server.js", 0, False
WScript.Sleep 3000
WshShell.Run "cmd /c cd /d D:\MedicalNewspaper\client && npx react-scripts start", 0, False
