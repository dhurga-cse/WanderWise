# 🎨 WanderWise UI/UX Design Guide

## Color Palette

```css
/* Primary Colors */
Blue:    #3B82F6  (rgb(59, 130, 246))
Purple:  #8B5CF6  (rgb(139, 92, 246))
Pink:    #EC4899  (rgb(236, 72, 153))

/* Semantic Colors */
Success: #10B981  (Green)
Warning: #F59E0B  (Orange)
Danger:  #EF4444  (Red)

/* Neutral Colors */
Gray-50:  #F9FAFB
Gray-100: #F3F4F6
Gray-600: #4B5563
Gray-800: #1F2937
Gray-900: #111827
```

## Typography

```css
Font Family: 'Inter', sans-serif
Font Weights: 300, 400, 500, 600, 700, 800

Headings:
- H1: 3rem (48px) - Bold
- H2: 2.25rem (36px) - Bold
- H3: 1.5rem (24px) - Semibold
- H4: 1.25rem (20px) - Semibold

Body:
- Large: 1.125rem (18px)
- Base: 1rem (16px)
- Small: 0.875rem (14px)
```

## Component Styles

### Buttons

**Primary Button:**
```css
Background: Linear gradient (Blue → Purple)
Padding: 12px 24px
Border Radius: 12px
Font Weight: 600
Hover: Shadow-lg + Scale(1.05)
Transition: All 0.3s
```

**Secondary Button:**
```css
Background: White/20 with backdrop blur
Border: 2px solid white
Padding: 12px 24px
Border Radius: 12px
Hover: Background white/30
```

### Cards

**Trip Card:**
```css
Background: White
Border Radius: 16px
Shadow: 0 10px 15px rgba(0,0,0,0.1)
Overflow: Hidden
Hover: Shadow-2xl + TranslateY(-5px)
Transition: All 0.3s
```

**Feature Card:**
```css
Background: Gradient (Blue-50 → Purple-50)
Padding: 32px
Border Radius: 16px
Shadow: lg
Hover: TranslateY(-10px)
```

### Forms

**Input Fields:**
```css
Border: 1px solid gray-300
Border Radius: 12px
Padding: 12px 16px
Focus: Ring-2 (Blue-500)
Transition: All 0.2s
Icon: Absolute left position
```

**Select Dropdown:**
```css
Same as input
Appearance: None (custom arrow)
Background: White
```

## Page Layouts

### Landing Page

```
┌─────────────────────────────────────┐
│  Navbar (Fixed, Blur Background)    │
├─────────────────────────────────────┤
│                                     │
│     HERO SECTION (Full Screen)     │
│   Background Image + Gradient       │
│   Centered Text + CTA Buttons       │
│   Scroll Indicator (Animated)       │
│                                     │
├─────────────────────────────────────┤
│     STATS SECTION (3 Columns)       │
│   [Icon] [Value] [Label]            │
├─────────────────────────────────────┤
│   FEATURES SECTION (4 Columns)      │
│   [Icon] [Title] [Description]      │
├─────────────────────────────────────┤
│   TESTIMONIALS (3 Columns)          │
│   Glass morphism cards              │
├─────────────────────────────────────┤
│   CTA SECTION (Centered)            │
│   Large heading + Button            │
├─────────────────────────────────────┤
│   FOOTER (Dark Background)          │
│   Logo + Links + Copyright          │
└─────────────────────────────────────┘
```

### Dashboard

```
┌─────────────────────────────────────┐
│  Navbar (Logo + User + Logout)      │
├─────────────────────────────────────┤
│  Header: "My Trips" + Create Button │
├─────────────────────────────────────┤
│                                     │
│  ┌─────┐  ┌─────┐  ┌─────┐         │
│  │Card │  │Card │  │Card │         │
│  │Image│  │Image│  │Image│         │
│  │Info │  │Info │  │Info │         │
│  └─────┘  └─────┘  └─────┘         │
│                                     │
│  Grid Layout (3 columns on desktop) │
│  Responsive (1 column on mobile)    │
│                                     │
└─────────────────────────────────────┘
```

### Trip Details

```
┌─────────────────────────────────────┐
│  Hero Banner (Destination Image)    │
│  Overlay + Trip Name                │
├─────────────────────────────────────┤
│  Info Cards (3 columns)             │
│  [Date] [Budget] [Remaining]        │
├─────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────┐    │
│  │              │  │          │    │
│  │  Expense     │  │ Expense  │    │
│  │  Chart       │  │ Form     │    │
│  │  (Pie)       │  │ & List   │    │
│  │              │  │          │    │
│  ├──────────────┤  └──────────┘    │
│  │              │                   │
│  │  Itinerary   │                   │
│  │  Text        │                   │
│  │              │                   │
│  └──────────────┘                   │
├─────────────────────────────────────┤
│  Hotel Recommendations              │
│  [Card] [Card] [Card] (Scroll →)    │
├─────────────────────────────────────┤
│  Food Recommendations               │
│  [Card] [Card] [Card] (Scroll →)    │
└─────────────────────────────────────┘
```

### Route Map

```
┌─────────────────────────────────────┐
│  Back Button                        │
├─────────────────────────────────────┤
│  Title: "Route Optimization"        │
├─────────────────────────────────────┤
│  Form: [Source] [Destination]       │
│  Button: "Get Optimized Route"      │
├─────────────────────────────────────┤
│  Stats: [Distance] [Duration]       │
├─────────────────────────────────────┤
│                                     │
│         INTERACTIVE MAP             │
│      (Leaflet with Polyline)        │
│                                     │
└─────────────────────────────────────┘
```

## Animation Patterns

### Page Entrance
```javascript
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.5 }
```

### Card Hover
```javascript
whileHover: { y: -10, scale: 1.02 }
transition: { duration: 0.3 }
```

### Staggered Children
```javascript
transition: { delay: index * 0.1 }
```

### Button Hover
```javascript
hover: { scale: 1.05, shadow: 'lg' }
```

## Spacing System

```css
/* Padding/Margin Scale */
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)

/* Component Spacing */
Card Padding: 24px (p-6)
Section Padding: 32px (p-8)
Page Padding: 24px (px-6)
Gap Between Cards: 24px (gap-6)
```

## Border Radius

```css
sm:  4px   (rounded-sm)
md:  8px   (rounded-md)
lg:  12px  (rounded-lg)
xl:  16px  (rounded-xl)
2xl: 24px  (rounded-2xl)
full: 9999px (rounded-full)

/* Usage */
Buttons: rounded-xl or rounded-full
Cards: rounded-2xl
Inputs: rounded-xl
Images: rounded-xl
```

## Shadows

```css
/* Shadow Scale */
sm:  0 1px 2px rgba(0,0,0,0.05)
md:  0 4px 6px rgba(0,0,0,0.1)
lg:  0 10px 15px rgba(0,0,0,0.1)
xl:  0 20px 25px rgba(0,0,0,0.1)
2xl: 0 25px 50px rgba(0,0,0,0.25)

/* Usage */
Cards: shadow-lg
Hover: shadow-2xl
Modals: shadow-xl
```

## Responsive Breakpoints

```css
/* Tailwind Breakpoints */
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
2xl: 1536px  (Extra large)

/* Grid Columns */
Mobile:  1 column
Tablet:  2 columns
Desktop: 3-4 columns
```

## Icon Usage

```javascript
/* Lucide React Icons */
Size: w-5 h-5 (20px) for inline
Size: w-6 h-6 (24px) for headers
Size: w-8 h-8 (32px) for features

Color: Matches theme
- Blue for primary actions
- Purple for secondary
- Green for success
- Red for danger
- Orange for warnings
```

## Loading States

```javascript
/* Skeleton Loader */
<div className="animate-pulse">
  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
  <div className="h-6 bg-gray-200 rounded mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
</div>
```

## Empty States

```javascript
/* No Data Display */
- Large emoji (text-6xl)
- Heading (text-2xl, bold)
- Description (text-gray-600)
- CTA Button
```

## Error States

```javascript
/* Error Message */
Background: red-50
Border: red-200
Text: red-600
Padding: 16px
Border Radius: 12px
```

## Hover Effects

```css
/* Interactive Elements */
Buttons: Scale(1.05) + Shadow
Cards: TranslateY(-5px) + Shadow-2xl
Links: Color change + Underline
Images: Scale(1.1) inside container
```

## Gradient Patterns

```css
/* Common Gradients */
Primary: from-blue-600 to-purple-600
Secondary: from-purple-600 to-pink-600
Success: from-green-500 to-teal-500
Hero: from-blue-600 via-purple-600 to-pink-500

/* Usage */
Backgrounds: bg-gradient-to-r
Text: bg-gradient-to-r bg-clip-text text-transparent
Overlays: Gradient with opacity
```

## Accessibility

```css
/* Focus States */
Focus Ring: ring-2 ring-blue-500
Outline: outline-none (with custom focus)
Contrast: WCAG AA compliant
Font Size: Minimum 14px
Touch Targets: Minimum 44x44px
```

## Best Practices

1. **Consistency** - Use same spacing, colors, shadows throughout
2. **Hierarchy** - Clear visual hierarchy with size and weight
3. **Whitespace** - Generous spacing for breathing room
4. **Contrast** - Sufficient contrast for readability
5. **Feedback** - Visual feedback for all interactions
6. **Performance** - Optimize images and animations
7. **Responsive** - Mobile-first approach
8. **Accessibility** - Keyboard navigation and screen readers

---

**This design system ensures a cohesive, professional look across the entire application!**
