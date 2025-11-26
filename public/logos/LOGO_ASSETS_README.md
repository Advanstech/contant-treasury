# Constant Treasury Logo Assets

## Overview
This directory contains all logo assets for the Constant Treasury platform. The current assets are placeholders and need to be replaced with actual Constant Capital Ghana branding.

## Required Assets

### SVG Files (Primary)
- `constant-treasury-light.svg` - Light theme logo (120x32px)
- `constant-treasury-dark.svg` - Dark theme logo (120x32px)  
- `constant-treasury-icon-light.svg` - Light theme icon (32x32px)
- `constant-treasury-icon-dark.svg` - Dark theme icon (32x32px)

**Requirements:**
- Use path elements, not text elements (for cross-browser compatibility)
- Include Constant Capital orange (#F97316) as primary color
- Light theme: Dark text (#1F2937) for "Constant", orange for "Treasury"
- Dark theme: Light text (#F3F4F6) for "Constant", orange for "Treasury"
- Transparent background
- Scalable vector format

### PNG Fallback Files
- `constant-treasury-light@1x.png` - Standard resolution (120x32px)
- `constant-treasury-light@2x.png` - Retina displays (240x64px)
- `constant-treasury-light@3x.png` - High-DPI displays (360x96px)
- `constant-treasury-dark@1x.png` - Standard resolution (120x32px)
- `constant-treasury-dark@2x.png` - Retina displays (240x64px)
- `constant-treasury-dark@3x.png` - High-DPI displays (360x96px)

**Requirements:**
- PNG-24 format with transparency
- Optimized for web (use tools like TinyPNG)
- Crisp edges and anti-aliasing
- Consistent branding across all resolutions

## Brand Guidelines

### Colors
- **Primary Orange**: #F97316 (hsl(25, 95%, 53%))
- **Light Text**: #F3F4F6 (for dark backgrounds)
- **Dark Text**: #1F2937 (for light backgrounds)
- **Background**: Transparent

### Typography
- **Font**: Use paths that match the Constant Capital brand font
- **Weight**: Bold/Semi-bold for "Constant", Bold for "Treasury"
- **Spacing**: Professional kerning and alignment

### Logo Structure
```
[CT Icon] [Constant] [Treasury]
  32px    80px       40px
```

## Implementation Notes

### Component Usage
The logo system uses the `Logo` component from `/src/components/brand/Logo.tsx`:

```tsx
import { HeaderLogo, FooterLogo, AdminLogo, MobileLogo } from '@/components/brand/Logo';

// Header (medium size, full logo)
<HeaderLogo />

// Footer (small size, full logo)  
<FooterLogo />

// Admin (large size, full logo)
<AdminLogo />

// Mobile (small size, icon only)
<MobileLogo />
```

### Theme Switching
The system automatically switches between light and dark variants based on the current theme using `next-themes`.

### Performance
- SVG files are the primary format (preferred)
- PNG files serve as fallbacks for older browsers
- Next.js Image component handles optimization
- Proper srcSet for responsive displays

## Replacement Process

1. **Create SVG Assets**
   - Convert Constant Capital logo to SVG paths
   - Ensure proper color usage for themes
   - Test cross-browser compatibility

2. **Generate PNG Fallbacks**
   - Export from SVG at multiple resolutions
   - Optimize for web performance
   - Maintain visual consistency

3. **Update Component (if needed)**
   - The Logo component should work without changes
   - Update alt text if visual description changes
   - Test theme switching functionality

4. **Quality Assurance**
   - Test in all browsers (Chrome, Firefox, Safari, Edge)
   - Verify theme switching works correctly
   - Check responsive behavior
   - Validate accessibility compliance

## File Naming Convention

```
constant-treasury-{theme}.{format}{resolution?}
- theme: light | dark
- format: svg | png
- resolution: @1x | @2x | @3x (PNG only)
```

## Contact
For branding questions or asset requests, contact the design team at Constant Capital Ghana.

---
© 2025 Constant Capital Ghana. All rights reserved.
