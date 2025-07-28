# 🔍 Debugging Guide for Input Freezing Issues

## Debugging Tools Added

I've added several debugging tools to help identify the exact cause of the input freezing:

### 1. **Performance Monitor** (Top-right corner)

- Shows real-time render performance
- Tracks memory usage
- Detects long tasks (>50ms)
- Shows render count and timing

### 2. **Input Debugger** (Bottom-left corner)

- Monitors all input events
- Tracks focus/blur events
- Logs render events
- Shows timing for each interaction

### 3. **Enhanced Console Logging**

- DinheiroInput now logs every render and change
- Tracks timing for each onChange event
- Warns when operations take >50ms

## How to Debug the Freezing Issue

### Step 1: Start the App

```bash
npm run dev
```

### Step 2: Open Browser DevTools

- Press `F12`
- Go to **Console** tab
- Clear the console

### Step 3: Enable Input Debugging

1. Look for the **Input Debugger** in the bottom-left corner
2. Click **"Start Monitoring"**
3. The button should turn red

### Step 4: Reproduce the Freezing

1. Go to **AddPagamentos** page
2. Try to interact with the money input field
3. Watch the console for logs
4. Monitor the performance indicators

### Step 5: Check for Patterns

Look for these warning signs in the console:

#### 🚨 **Long Tasks**

```
🚨 LONG TASK DETECTED: { duration: 123.45, name: "Script", startTime: 1234 }
```

#### 🚨 **Slow Input Changes**

```
🚨 SLOW DinheiroInput onChange: 67.89ms
```

#### 🔍 **Excessive Renders**

```
🔍 DinheiroInput render #15
🔍 DinheiroInput render #16
🔍 DinheiroInput render #17
```

#### ❌ **Errors**

```
❌ DinheiroInput onChange error
```

## Common Causes to Look For

### 1. **React Hook Form Issues**

- Multiple Controllers updating simultaneously
- Circular dependencies in form state
- Excessive re-renders from form validation

### 2. **react-number-format Issues**

- Format conflicts with React Hook Form
- Focus management problems
- Memory leaks from unmounted components

### 3. **Electron-Specific Issues**

- Main process blocking renderer
- IPC communication delays
- Hardware acceleration conflicts

### 4. **Memory Issues**

- Growing memory usage in Performance Monitor
- Memory leaks from unmounted components
- Large data sets causing slow renders

## Debugging Commands

### Check Current Performance

```javascript
// In browser console
console.log("Memory:", performance.memory);
console.log(
  "Navigation timing:",
  performance.getEntriesByType("navigation")[0]
);
```

### Monitor Specific Component

```javascript
// Add this to any component to track renders
useEffect(() => {
  console.log("Component rendered:", performance.now());
});
```

### Check for Memory Leaks

```javascript
// In browser console
const used = performance.memory.usedJSHeapSize;
const total = performance.memory.totalJSHeapSize;
console.log(
  `Memory usage: ${Math.round(used / 1024 / 1024)}MB / ${Math.round(
    total / 1024 / 1024
  )}MB`
);
```

## What to Report

When the freezing happens, please report:

1. **Console logs** - Copy all logs from the moment you start interacting until it freezes
2. **Performance Monitor values** - Screenshot the top-right monitor
3. **Input Debugger events** - Screenshot the bottom-left debugger
4. **Steps to reproduce** - Exact sequence of actions
5. **Browser/Electron version** - Version information

## Quick Fixes to Try

### 1. **Disable Hardware Acceleration** (Temporary)

```javascript
// In electron/main.cjs, uncomment this line:
app.disableHardwareAcceleration();
```

### 2. **Reduce Form Complexity**

```javascript
// In AddPagamentos, try removing one Controller at a time
// to isolate which one is causing issues
```

### 3. **Simplify Input Components**

```javascript
// Temporarily replace DinheiroInput with a regular input
<input
  type="number"
  value={field.value}
  onChange={(e) => field.onChange(e.target.value)}
/>
```

## Expected Debug Output

### Normal Operation:

```
🔍 DinheiroInput render #1
🔍 DinheiroInput onChange start
🔍 DinheiroInput onChange end: 2.34ms
🔍 DinheiroInput focus
```

### Problematic Operation:

```
🔍 DinheiroInput render #1
🔍 DinheiroInput render #2
🔍 DinheiroInput render #3
🔍 DinheiroInput onChange start
🚨 SLOW DinheiroInput onChange: 67.89ms
🔍 DinheiroInput onChange end: 67.89ms
🚨 LONG TASK DETECTED: { duration: 123.45 }
```

## Next Steps

1. **Run the debugging tools**
2. **Reproduce the freezing**
3. **Collect the logs and screenshots**
4. **Share the debugging output**
5. **I'll analyze the patterns and provide targeted fixes**

The debugging tools will help us pinpoint exactly where the bottleneck is occurring! 🔍
