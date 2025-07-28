# 🚀 Xanghay - Click & Play Setup

## Quick Start (For You & Your Dad)

### Windows Users:

1. **Double-click** `start-app.bat`
2. **Wait** for the application to start
3. **Browser opens automatically** to `http://localhost:5173`

### What Happens:

- ✅ **Frontend** starts (Vite dev server - smooth performance)
- ✅ **Backend** starts (Java JAR: `casa-marmo-back.jar`)
- ✅ **Browser** opens automatically
- ✅ **Ready to use!**

## Manual Commands (If Needed)

```bash
# Start everything (same as double-clicking start-app.bat)
npm run start-app

# Start just frontend
npm run dev

# Start just backend
npm run backend

# Start Electron app
npm run electron
```

## Prerequisites

- **Node.js** (v16 or higher)
- **Java** (v8 or higher)
- **Backend JAR**: `backend/casa-marmo-back.jar` ✅

## Troubleshooting

### If it doesn't start:

1. **Check Java**: Open command prompt and type `java -version`
2. **Check JAR file**: Make sure `backend/casa-marmo-back.jar` exists
3. **Check ports**: Make sure ports 5173 and 8080 are free

### If browser doesn't open:

- Wait a few seconds for the app to fully start
- Manually open: `http://localhost:5173`

### If you get errors:

- Try running `start-app.ps1` instead (PowerShell version)
- Check the console output for specific error messages

## File Structure

```
xanghay/
├── start-app.bat          # 🎯 MAIN STARTUP FILE (double-click this!)
├── start-app.ps1          # PowerShell version
├── backend/
│   └── casa-marmo-back.jar # Backend JAR file
├── src/                   # Frontend code
└── package.json          # Dependencies
```

## For Your Company

This setup uses the **dev version** as "production" because it runs smoother:

- **Hot reload** for instant updates
- **Better performance** than built version
- **Easy debugging** if needed
- **Perfect for internal company use**

Just double-click `start-app.bat` and you're ready to go! 🎯
