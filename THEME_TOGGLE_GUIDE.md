# Theme Toggle Guide

## Overview

NodeFlow now includes a **Theme Toggle** component that allows users to switch between **light** and **dark** modes with a simple switch.

## Features

✨ **Smooth Transition** - Themes switch seamlessly with no page reload  
💾 **Persistent** - Your theme choice is saved in localStorage  
🎨 **System Sync** - Respects your initial browser/system preference  
🔄 **Consistent** - Works across all pages (Home, Dashboard, Editor)

## How to Use

### For Users

The theme toggle appears in the navigation bar on all pages:

1. **Look for the switch** with Sun (☀️) and Moon (🌙) icons
2. **Click or tap the switch** to toggle between themes
3. **Light mode** = Switch to the left (Sun)
4. **Dark mode** = Switch to the right (Moon)

Your preference is automatically saved and will persist across sessions.

### Location

The theme toggle is available in:

- **Homepage Navigation** - Top right, before "Docs" button
- **Dashboard Navigation** - Top right, before "Settings" button
- **Editor Toolbar** - Top right, after sidebar toggles

## Technical Implementation

### Components Created

#### 1. `components/ui/switch.tsx`

Shadcn UI switch component built on Radix UI primitives

```tsx
<Switch checked={isChecked} onCheckedChange={handleChange} />
```

#### 2. `components/theme-provider.tsx`

React Context provider that manages theme state

```tsx
<ThemeProvider defaultTheme="light" storageKey="nodeflow-ui-theme">
  {children}
</ThemeProvider>
```

#### 3. `components/theme-toggle.tsx`

The actual toggle UI component

```tsx
<ThemeToggle />
```

### Setup

The theme system is initialized in `app/layout.tsx`:

```tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="light" storageKey="nodeflow-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Key features:

- `suppressHydrationWarning` prevents React hydration warnings
- `defaultTheme="light"` sets initial theme (can be "light" or "dark")
- `storageKey` defines localStorage key for persistence

### Using the Theme in Your Code

To access the current theme in any client component:

```tsx
"use client";

import { useTheme } from "@/components/theme-provider";

export function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### CSS Theme Variables

Themes are defined in `app/globals.css` using CSS custom properties:

```css
:root {
  --background: oklch(1 0 0); /* White */
  --foreground: oklch(0.145 0 0); /* Dark Gray */
  /* ... more variables */
}

.dark {
  --background: oklch(0.145 0 0); /* Dark Gray */
  --foreground: oklch(0.985 0 0); /* Almost White */
  /* ... more variables */
}
```

The `.dark` class is automatically added to the `<html>` element when dark mode is active.

## Customization

### Changing Default Theme

Edit `app/layout.tsx`:

```tsx
<ThemeProvider defaultTheme="dark" storageKey="nodeflow-ui-theme">
```

### Changing Toggle Style

Edit `components/theme-toggle.tsx`:

```tsx
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked: boolean) =>
          setTheme(checked ? "dark" : "light")
        }
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
```

You can:

- Change icon sizes: `h-4 w-4` → `h-5 w-5`
- Remove icons completely
- Add tooltips
- Change gap spacing: `gap-2` → `gap-3`

### Adding to New Pages

Simply import and use:

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

export default function MyPage() {
  return (
    <nav>
      {/* other nav items */}
      <ThemeToggle />
    </nav>
  );
}
```

## Color Customization

To customize theme colors, edit the CSS variables in `app/globals.css`:

### Light Theme Colors

```css
:root {
  --primary: oklch(0.708 0.222 264.376); /* Purple accent */
  --background: oklch(1 0 0); /* White background */
  --foreground: oklch(0.145 0 0); /* Dark text */
}
```

### Dark Theme Colors

```css
.dark {
  --primary: oklch(0.708 0.222 264.376); /* Purple accent */
  --background: oklch(0.145 0 0); /* Dark background */
  --foreground: oklch(0.985 0 0); /* Light text */
}
```

Use [oklch color picker](https://oklch.com/) to choose new colors.

## Dependencies

- `@radix-ui/react-switch` - Switch primitive component
- `lucide-react` - Sun and Moon icons
- React Context API - Theme state management
- localStorage API - Persistence

## Browser Support

✅ All modern browsers (Chrome, Firefox, Safari, Edge)  
✅ Mobile browsers (iOS Safari, Chrome Mobile)  
✅ localStorage required for persistence

## Troubleshooting

### Theme doesn't persist on refresh

- Check browser allows localStorage
- Verify `storageKey` is consistent
- Check browser console for errors

### Flashing on page load

- Ensure `suppressHydrationWarning` is on `<html>` tag
- Theme is applied before React hydration

### Switch doesn't work

- Make sure page is a client component (`"use client"`)
- Check ThemeProvider wraps the component
- Verify `@radix-ui/react-switch` is installed

---

**Enjoy your new theme toggle!** 🌓
