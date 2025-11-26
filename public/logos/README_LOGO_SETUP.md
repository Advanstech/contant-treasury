# Logo Setup Instructions

## Current Status
The logo system is ready but needs the actual logo images to be placed in the `/public/logos/` folder.

## Required Files
Replace these placeholder files with the actual uploaded logo images:

1. `constant-treasury-logo-light.png` - Light theme version
2. `constant-treasury-logo-dark.png` - Dark theme version

## How to Replace
1. Take the uploaded logo images from the user
2. Save them as PNG files in `/public/logos/`
3. Name them exactly as shown above
4. Ensure they have transparent backgrounds

## Logo Component Features
- ✅ Automatic theme switching (light/dark)
- ✅ Responsive sizing (120px to 260px width)
- ✅ Proper aspect ratio maintenance
- ✅ Hover animations
- ✅ Accessibility support
- ✅ Next.js Image optimization

## Component Usage
```tsx
import { HeaderLogo, FooterLogo, AdminLogo } from '@/components/brand/Logo';

<HeaderLogo />   // 180x60px for header
<FooterLogo />   // 120x40px for footer  
<AdminLogo />    // 220x73px for admin dashboard
```

The logo will display properly once the real images are placed in the correct location.
