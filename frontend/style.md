# BrewHub Design System & Style Guide
**Version 2.0 — Comprehensive Edition**

---

## 🎨 Design Philosophy

**Core Principles:**
- Bold, flat design with zero border radius (strictly 0px everywhere)
- Confident geometric compositions with strong hierarchy
- Editorial, magazine-like layouts with generous white space
- Modern, clean, and premium aesthetic
- Minimal visual noise — every element serves a purpose
- Strategic use of color for emphasis and emotional impact

---

## 🌈 Color System

### Primary Palette

```
Brew Black:       #121212  — Primary text, headings, CTAs
Brew White:       #F7F7F5  — Cards, elevated surfaces, button text
Brew Cream:       #EDECE8  — Page backgrounds, neutral base
```

### Accent Palette

```
Brew Yellow:      #E9B60A  — Primary accent, tags, highlights
Brew Teal:        #4AA5A2  — Secondary accent, decorative blocks
Brew Pink:        #E97F8A  — Tertiary accent, decorative blocks
Brew Blue:        #3973B8  — Quaternary accent, decorative blocks
```

### Color Usage Rules

**Backgrounds:**
- Primary page background: `#EDECE8` (Brew Cream)
- Elevated cards/surfaces: `#F7F7F5` (Brew White)
- Never use pure white (`#FFFFFF`) — always use Brew White

**Text:**
- Primary headings: `#121212` at 100% opacity
- Body text: `#121212` at 60-70% opacity
- Labels/metadata: `#121212` at 40-50% opacity
- Never use gray colors — always use black with opacity

**Accents:**
- Use accent colors for decorative blocks, tags, and product backgrounds
- Rotate accent colors when displaying multiple similar items
- Limit to 1-2 accent colors per view/section
- Yellow is the primary accent — use for most important highlights

**Opacity Scale:**
```
100% — Headlines, primary elements
70%  — Body text, descriptions
60%  — Secondary text
50%  — Labels, metadata
40%  — Dividers, decorative elements
30%  — Borders, subtle UI elements
20%  — Subtle dividers
10%  — Very subtle backgrounds
```

---

## ✍️ Typography

### Font Family
- **Primary:** Inter, DM Sans, or Satoshi (geometric sans-serif)
- **Fallback:** system-ui, -apple-system, sans-serif
- Never mix multiple font families in the same view

### Type Scale (Desktop → Mobile)

**Display Headings (Hero):**
```
clamp(32px, 8vw, 64px) — Fluid scaling
font-weight: 700 (bold)
line-height: 0.95 (tight)
letter-spacing: -0.02em (tight)
text-transform: Sentence case or lowercase for personality
```

**H1 - Page Headings:**
```
text-2xl sm:text-3xl (24px → 30px)
font-weight: 700 (bold)
letter-spacing: -0.01em
```

**H2 - Section Headings:**
```
text-xl sm:text-2xl (20px → 24px)
font-weight: 700 (bold)
letter-spacing: -0.01em
```

**H3 - Card Titles:**
```
text-xl sm:text-2xl (20px → 24px)
font-weight: 700 (bold)
letter-spacing: -0.01em
```

**Body Text:**
```
text-sm sm:text-base (14px → 16px)
font-weight: 400-500 (regular-medium)
line-height: 1.7
opacity: 60-70%
```

**Labels/Metadata:**
```
text-xs (12px) or text-[10px] sm:text-xs (10px → 12px)
font-weight: 700 (bold)
letter-spacing: 0.15em (wide)
text-transform: uppercase
opacity: 40-50%
```

**Button Text:**
```
text-xs (12px)
font-weight: 800-900 (black)
letter-spacing: 0.15em (wide)
text-transform: uppercase
```

**Large Numbers (Prices, Stats):**
```
text-3xl sm:text-4xl (30px → 36px)
font-weight: 900 (black)
letter-spacing: -0.02em (tight)
```

### Letter Spacing Rules

```
Tight spacing (-0.02em to -0.01em):
  → Headlines, display text, prices
  → Creates premium, confident feel

Normal spacing (0em):
  → Body text, paragraphs
  → Maximum readability

Wide spacing (0.03em to 0.2em):
  → Labels, tags, buttons, metadata
  → Creates sophistication and breathing room
```

### Typography Hierarchy Strategy

1. **Size contrast** — Dramatic differences between levels (4xl vs xs)
2. **Weight contrast** — Mix black (900) with regular (400)
3. **Opacity contrast** — 100% headlines vs 60% body
4. **Spacing contrast** — Tight tracking on display, wide on labels
5. **Case contrast** — Mix lowercase headlines with uppercase labels

---

## 📐 Layout & Spacing

### Container System

```css
Max Width Container:
  max-w-[1600px] mx-auto

Responsive Padding (Horizontal):
  px-4           (mobile: 16px)
  sm:px-6        (small: 24px)
  lg:px-12       (large: 48px)

Responsive Padding (Vertical):
  py-8           (mobile: 32px)
  sm:py-10       (small: 40px)
  lg:py-12       (large: 48px)
```

### Spacing Scale (Tailwind)

**Use this progression for consistency:**
```
Mobile → Tablet → Desktop

Tiny gaps:      gap-2  → gap-3   → gap-4    (8px → 12px → 16px)
Small gaps:     gap-4  → gap-6   → gap-8    (16px → 24px → 32px)
Medium gaps:    gap-6  → gap-8   → gap-10   (24px → 32px → 40px)
Large gaps:     gap-8  → gap-10  → gap-12   (32px → 40px → 48px)

Section spacing (mb):
  mb-6 sm:mb-8   (24px → 32px)
  mb-8 sm:mb-10  (32px → 40px)

Padding (cards):
  p-5 sm:p-6 lg:p-8  (20px → 24px → 32px)
```

### Grid System

**Product/Item Grids:**
```jsx
grid grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
gap-6 sm:gap-8 lg:gap-10

// Responsive gaps scale up with screen size
```

**Content Layout:**
```jsx
// Two-column layout (hero + sidebar)
flex flex-col lg:flex-row gap-6 lg:gap-12

// Stacks on mobile, side-by-side on desktop
```

### Responsive Breakpoints

```
sm:  640px  — Small tablets, large phones
md:  768px  — Tablets
lg:  1024px — Laptops, small desktops
xl:  1280px — Large desktops
```

---

## 🔲 Component Patterns

### Buttons

**Primary CTA:**
```jsx
<button className="
  bg-[#121212] 
  hover:bg-opacity-90 
  hover:scale-105 
  text-[#F7F7F5] 
  px-6 sm:px-8 
  py-3 sm:py-4 
  font-black 
  text-xs 
  tracking-[0.15em] 
  uppercase 
  transition-all 
  duration-200 
  hover:shadow-lg 
  cursor-pointer
" style={{ borderRadius: '0px' }}>
  BUTTON TEXT
</button>
```

**Secondary Button (Outline):**
```jsx
<button className="
  bg-transparent 
  border-2 border-[#121212] 
  text-[#121212] 
  hover:bg-[#121212] 
  hover:text-[#F7F7F5]
  px-6 sm:px-8 
  py-3 sm:py-4 
  font-black 
  text-xs 
  tracking-[0.15em] 
  uppercase 
  transition-all
" style={{ borderRadius: '0px' }}>
  BUTTON TEXT
</button>
```

**Disabled State:**
```jsx
<button disabled className="
  bg-[#121212] 
  bg-opacity-10 
  text-[#121212] 
  text-opacity-30 
  px-6 sm:px-8 
  py-3 sm:py-4 
  font-black 
  text-xs 
  tracking-[0.15em] 
  uppercase 
  cursor-not-allowed
" style={{ borderRadius: '0px' }}>
  DISABLED
</button>
```

**Category/Filter Buttons:**
```jsx
// Active state
<button className="
  bg-[#121212] 
  text-[#F7F7F5] 
  border-2 border-[#121212]
  px-4 sm:px-5 
  py-2 sm:py-3 
  font-bold 
  transition-all 
  text-xs sm:text-sm
" style={{ borderRadius: '0px', letterSpacing: '0.03em' }}>
  ACTIVE
</button>

// Inactive state
<button className="
  bg-white 
  text-[#121212] 
  border-2 border-transparent 
  hover:border-[#121212] 
  hover:border-opacity-20
  px-4 sm:px-5 
  py-2 sm:py-3 
  font-bold 
  transition-all 
  text-xs sm:text-sm
" style={{ borderRadius: '0px', letterSpacing: '0.03em' }}>
  INACTIVE
</button>
```

**Button Rules:**
- Always 0px border radius
- Hover: reduce opacity to 90%, scale to 105%, add shadow
- Use `cursor-pointer` for all interactive buttons
- Transition duration: 200ms for snappy feel
- Never use gradients
- Text always uppercase with wide tracking (0.15em)

---

### Cards

**Standard Card Pattern:**
```jsx
<div className="
  bg-[#F7F7F5] 
  overflow-hidden 
  transition-all 
  hover:translate-y-[-8px]
" style={{ 
  borderRadius: '0px',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.06)'
}}>
  {/* Card content */}
</div>
```

**Product Card (Complete Pattern):**
```jsx
<div className="
  group 
  overflow-hidden 
  bg-[#F7F7F5] 
  transition-all 
  hover:translate-y-[-8px]
" style={{ 
  borderRadius: '0px',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.06)'
}}>
  {/* Image area with accent background */}
  <div className="
    relative 
    aspect-[4/4] 
    flex items-center justify-center 
    overflow-hidden
  " style={{ backgroundColor: accentColor }}>
    <img 
      src={imageUrl} 
      alt={name}
      className="
        w-full h-full object-cover 
        transition-transform duration-500 
        group-hover:scale-105
      "
    />
    
    {/* Category badge */}
    <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
      <div className="bg-[#F7F7F5] px-3 sm:px-4 py-1.5 sm:py-2">
        <span className="
          text-[#121212] font-bold 
          text-[10px] sm:text-xs 
          tracking-[0.15em] uppercase 
          opacity-60
        ">
          CATEGORY
        </span>
      </div>
    </div>
  </div>
  
  {/* Content area */}
  <div className="p-5 sm:p-6 lg:p-8">
    {/* Card content */}
  </div>
</div>
```

**Card Rules:**
- Background: Always `#F7F7F5` (Brew White)
- Shadow: `0px 4px 12px rgba(0,0,0,0.06)` (subtle)
- Hover: Lift card up 8px with `translate-y-[-8px]`
- Image hover: Scale to 105% with smooth transition
- Internal padding: `p-5 sm:p-6 lg:p-8` (responsive)

---

### Form Inputs

**Text Input:**
```jsx
<input 
  type="text"
  placeholder="placeholder text..."
  className="
    w-full 
    px-4 sm:px-5 
    py-3 sm:py-4 
    border-2 border-[#121212] border-opacity-10 
    focus:border-[#121212] focus:border-opacity-30 
    transition-all 
    bg-white 
    text-[#121212] 
    text-sm sm:text-base 
    placeholder-[#121212] placeholder-opacity-30
  "
  style={{ borderRadius: '0px' }}
/>
```

**Input Label:**
```jsx
<label className="
  block 
  text-xs 
  font-bold 
  text-[#121212] 
  opacity-50 
  tracking-[0.15em] 
  uppercase 
  mb-3
">
  LABEL TEXT
</label>
```

**Input Rules:**
- Always 2px borders for visibility
- Border opacity: 10% default, 30% on focus
- No glow, no ring, no fancy focus states
- Background: White for inputs, not Brew White
- Placeholder: 30% opacity of text color

---

### Modals

**Modal Container & Backdrop:**
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop - dims background with blur */}
  <div
    className="absolute inset-0 bg-black/30 backdrop-blur-sm"
    onClick={onClose}
  />

  {/* Modal */}
  <div
    className="relative bg-[#F7F7F5] max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col z-10"
    style={{
      borderRadius: "0px",
      boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
    }}
  >
    {/* Modal content */}
  </div>
</div>
```

**Modal Header (Dark Theme):**
```jsx
<div
  className="bg-[#121212] px-6 sm:px-8 py-6"
  style={{ borderBottom: "2px solid rgba(247,247,245,0.1)" }}
>
  <div className="flex justify-between items-start gap-4">
    <div className="flex-1">
      {/* Accent tag */}
      <div className="inline-block mb-3">
        <div className="bg-[#E9B60A] px-4 py-1.5">
          <span className="text-[#121212] font-bold text-[10px] tracking-[0.15em] uppercase">
            TAG TEXT
          </span>
        </div>
      </div>
      
      {/* Title */}
      <h2
        className="text-2xl sm:text-3xl font-bold text-[#F7F7F5] mb-2"
        style={{ letterSpacing: "-0.01em" }}
      >
        Modal Title
      </h2>
      
      {/* Description */}
      <p
        className="text-sm text-[#F7F7F5] opacity-70"
        style={{ lineHeight: "1.6" }}
      >
        Supporting description text
      </p>
    </div>
    
    {/* Close button */}
    <button
      onClick={onClose}
      className="text-[#F7F7F5] hover:text-[#E9B60A] transition-colors text-3xl leading-none font-bold"
      style={{ marginTop: "-4px" }}
    >
      ×
    </button>
  </div>
</div>
```

**Modal Header (Alert/Confirmation - Pink Accent):**
```jsx
<div
  className="bg-[#E97F8A] px-6 sm:px-8 py-6"
  style={{ borderBottom: "2px solid rgba(18,18,18,0.1)" }}
>
  <div className="inline-block mb-3">
    <div className="bg-[#121212] px-4 py-1.5">
      <span className="text-[#F7F7F5] font-bold text-[10px] tracking-[0.15em] uppercase">
        Confirmation
      </span>
    </div>
  </div>
  <h2
    className="text-2xl sm:text-3xl font-bold text-[#121212] leading-tight"
    style={{ letterSpacing: "-0.01em" }}
  >
    Confirm Action
  </h2>
</div>
```

**Modal Content (Scrollable):**
```jsx
<div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
  {/* Scrollable content goes here */}
  
  {/* Example: Form controls, lists, etc */}
</div>
```

**Modal Footer:**
```jsx
<div
  className="bg-white px-6 sm:px-8 py-6"
  style={{
    borderTop: "2px solid rgba(18,18,18,0.1)",
    boxShadow: "0px -4px 12px rgba(0,0,0,0.06)",
  }}
>
  {/* Optional: Summary/Total section */}
  <div className="flex justify-between items-center mb-6">
    <div>
      <div className="text-xs font-bold text-[#121212] opacity-40 tracking-[0.1em] uppercase mb-1">
        Label
      </div>
      <div
        className="text-4xl font-black text-[#121212]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Value
      </div>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-3">
    <button
      onClick={onClose}
      className="flex-1 px-6 py-4 border-2 border-[#121212] text-[#121212] font-black text-xs tracking-[0.15em] uppercase transition-all hover:bg-[#121212] hover:text-[#F7F7F5] cursor-pointer"
      style={{ borderRadius: "0px" }}
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      className="flex-1 px-6 py-4 bg-[#121212] text-[#F7F7F5] font-black text-xs tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 hover:scale-105 cursor-pointer"
      style={{ borderRadius: "0px" }}
    >
      Confirm
    </button>
  </div>
</div>
```

**Modal Rules:**
- Backdrop: `bg-black/30 backdrop-blur-sm` for subtle dim with blur
- Always use `z-50` for modal container
- Modal max-width: `max-w-lg` (512px) for most modals
- Max-height: `max-h-[90vh]` to prevent overflow on small screens
- Header themes: Black for standard, Pink for alerts/confirmations
- Footer: White background with subtle top shadow
- Content area: Scrollable with `flex-1 overflow-y-auto`
- Structure: `flex flex-col` to keep header/footer fixed
- Close button: × symbol at 3xl size with hover color change

---

### Tags & Badges

**Accent Tag (Yellow highlight):**
```jsx
<div className="inline-block">
  <div className="bg-[#E9B60A] px-4 sm:px-6 py-2">
    <span className="
      text-[#121212] 
      font-bold 
      text-xs 
      tracking-[0.2em] 
      uppercase
    ">
      TAG TEXT
    </span>
  </div>
</div>
```

**Category Badge:**
```jsx
<div className="bg-[#F7F7F5] px-3 sm:px-4 py-1.5 sm:py-2">
  <span className="
    text-[#121212] 
    font-bold 
    text-[10px] sm:text-xs 
    tracking-[0.15em] 
    uppercase 
    opacity-60
  ">
    BADGE TEXT
  </span>
</div>
```

**Status Badge (Sold Out):**
```jsx
<div className="bg-[#121212] px-6 sm:px-8 py-3 sm:py-4">
  <span className="
    text-[#F7F7F5] 
    font-black 
    text-xs sm:text-sm 
    tracking-[0.2em]
  ">
    STATUS TEXT
  </span>
</div>
```

---

### Dividers

**Horizontal Divider with Text:**
```jsx
<div className="flex items-center gap-4 sm:gap-6">
  <div className="h-[2px] w-12 sm:w-16 bg-[#121212] opacity-20"></div>
  <p className="
    text-xs sm:text-sm 
    font-bold 
    text-[#121212] 
    opacity-40 
    tracking-[0.15em] 
    uppercase 
    whitespace-nowrap
  ">
    DIVIDER TEXT
  </p>
  <div className="h-[2px] flex-1 bg-[#121212] opacity-20"></div>
</div>
```

**Simple Divider:**
```jsx
<div className="h-[2px] w-full bg-[#121212] opacity-20"></div>
```

---

### Loading & Empty States

**Loading State:**
```jsx
<div className="text-center py-20 sm:py-32">
  <div className="
    inline-block 
    bg-[#F7F7F5] 
    px-8 sm:px-12 
    py-6 sm:py-8
  " style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.06)' }}>
    <p className="
      text-xl sm:text-2xl 
      text-[#121212] 
      opacity-60 
      font-bold 
      tracking-wide
    ">
      LOADING...
    </p>
  </div>
</div>
```

**Empty State:**
```jsx
<div className="text-center py-20 sm:py-32">
  <div className="
    inline-block 
    bg-[#F7F7F5] 
    px-10 sm:px-16 
    py-8 sm:py-12
  " style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.06)' }}>
    <p className="
      text-2xl sm:text-3xl 
      text-[#121212] 
      font-bold 
      mb-3 sm:mb-4 
      tracking-tight
    ">
      Primary Message
    </p>
    <p className="text-[#121212] opacity-50 text-base sm:text-lg">
      Secondary message or help text
    </p>
  </div>
</div>
```

---

## 🎭 Interaction & Animation

### Hover Effects

**Card Hover:**
```css
transition-all hover:translate-y-[-8px]
```

**Image Hover (within group):**
```css
transition-transform duration-500 group-hover:scale-105
```

**Button Hover:**
```css
hover:bg-opacity-90 hover:scale-105 hover:shadow-lg
/* OR for outline buttons */
hover:bg-[#121212] hover:text-[#F7F7F5]
```

**Navigation Link Hover:**
```css
hover:bg-[#F7F7F5] hover:text-[#121212]
/* White background with black text on hover */
```

**Animation Rules:**
- Keep transitions subtle and purposeful
- Use `transition-all` for most elements
- Button transitions: 200ms duration for snappy feel
- Image scales: 500ms duration for smooth feel
- Scale on hover: 105% maximum (hover:scale-105)
- Add shadow on button hover for depth
- Avoid bouncy or elastic easing — linear or ease
</text>

<old_text line=889>
// Primary button
className="bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
style={{ borderRadius: '0px' }}
- Never animate color gradients (we don't use them)

---

## 🖼️ Images & Icons

### Product Images

**Aspect Ratios:**
- Product cards: `aspect-[4/4]` (square, slightly shorter than 4:5)
- Hero images: `aspect-[16/9]` or `aspect-[21/9]` for ultra-wide
- Thumbnails: `aspect-square`

**Image Treatment:**
```jsx
<img 
  src={url} 
  alt={description}
  className="
    w-full h-full 
    object-cover 
    transition-transform duration-500 
    group-hover:scale-105
  "
/>
```

**Background for Empty States:**
- Use accent colors as solid backgrounds
- Rotate through: Yellow, Teal, Pink, Blue
- Include large emoji or icon at 15% opacity

### Icons

**Rules:**
- Use simple, geometric icons (Heroicons, Lucide, Phosphor)
- Stroke width: 2px (bold)
- Size: `w-4 h-4` to `w-6 h-6` typical range
- Color: Match text color with appropriate opacity
- Never use gradient or multi-color icons

**Icon in Input Example:**
```jsx
<svg className="
  w-4 h-4 sm:w-5 sm:h-5 
  text-[#121212] 
  opacity-30
" 
  fill="none" 
  stroke="currentColor" 
  strokeWidth={2}
>
  {/* SVG path */}
</svg>
```

---

## 📱 Responsive Design Strategy

### Mobile-First Approach

Always write mobile styles first, then add breakpoints:

```jsx
className="
  text-sm          // Mobile: 14px
  sm:text-base     // Tablet: 16px
  lg:text-lg       // Desktop: 18px
"
```

### Common Responsive Patterns

**Layout Stacking:**
```jsx
// Vertical on mobile, horizontal on desktop
flex flex-col lg:flex-row gap-6 lg:gap-12
```

**Grid Responsiveness:**
```jsx
// 1 column → 2 columns → 3 columns → 4 columns
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

**Padding Scaling:**
```jsx
p-4 sm:p-6 lg:p-8           // 16px → 24px → 32px
px-4 sm:px-6 lg:px-12       // Horizontal padding
py-8 sm:py-10 lg:py-12      // Vertical padding
```

**Text Sizing:**
```jsx
text-xs sm:text-sm          // 12px → 14px
text-sm sm:text-base        // 14px → 16px
text-xl sm:text-2xl         // 20px → 24px
text-3xl sm:text-4xl        // 30px → 36px
```

**Gap Scaling:**
```jsx
gap-4 sm:gap-6 lg:gap-8     // 16px → 24px → 32px
gap-6 sm:gap-8 lg:gap-10    // 24px → 32px → 40px
```

### Touch Targets (Mobile)

Minimum button/tap size: `44x44px` (iOS standard)

```jsx
// Ensure adequate touch targets
py-3 sm:py-4   // At least 12px vertical padding
px-6 sm:px-8   // At least 24px horizontal padding
```

---

## 🎯 Composition Patterns

### Hero Section (Compact)

```jsx
<div className="mb-8 sm:mb-10">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
    {/* Left: Title & Description */}
    <div className="flex-shrink-0">
      {/* Accent tag */}
      <div className="inline-block mb-3 sm:mb-4">
        <div className="bg-[#E9B60A] px-4 sm:px-6 py-2">
          <span className="text-[#121212] font-bold text-xs tracking-[0.2em] uppercase">
            TAG
          </span>
        </div>
      </div>
      
      {/* Hero heading */}
      <h1 className="text-[clamp(32px,8vw,64px)] font-bold text-[#121212] leading-[0.95] mb-3 sm:mb-4" 
          style={{ letterSpacing: '-0.02em' }}>
        Your Heading<br/>Goes Here
      </h1>
      
      {/* Subheading */}
      <p className="text-sm sm:text-base text-[#121212] opacity-70 max-w-md leading-relaxed"
         style={{ lineHeight: '1.7' }}>
        Supporting text that describes your section or feature
      </p>
    </div>
    
    {/* Right: Sidebar content, filters, etc */}
    <div className="flex-1 lg:max-w-3xl">
      {/* Content */}
    </div>
  </div>
</div>
```

### Section Divider with Count

```jsx
<div className="mb-6 sm:mb-8 flex items-center gap-4 sm:gap-6">
  <div className="h-[2px] w-12 sm:w-16 bg-[#121212] opacity-20"></div>
  <p className="text-xs sm:text-sm font-bold text-[#121212] opacity-40 tracking-[0.15em] uppercase whitespace-nowrap">
    {count} {count === 1 ? 'item' : 'items'}
  </p>
  <div className="h-[2px] flex-1 bg-[#121212] opacity-20"></div>
</div>
```

### Sidebar Card (Search/Filters)

```jsx
<div className="bg-[#F7F7F5] p-5 sm:p-6 lg:p-8" 
     style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.06)' }}>
  
  {/* Section 1 */}
  <div className="mb-5 sm:mb-6">
    <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
      Section Label
    </label>
    {/* Content */}
  </div>
  
  {/* Section 2 */}
  <div>
    <label className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3">
      Another Label
    </label>
    {/* Content */}
  </div>
</div>
```

### Navbar

```jsx
<nav
  className="bg-[#121212] text-[#F7F7F5] shadow-md"
  style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.1)" }}
>
  <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
    <div className="flex justify-between h-20 items-center">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          BrewHub
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/menu"
          className="px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all hover:bg-[#F7F7F5] hover:text-[#121212]"
          style={{ borderRadius: "0px" }}
        >
          Menu
        </Link>

        {/* Additional nav items... */}
        
        {/* CTA Button */}
        <Link
          href="/register"
          className="bg-[#E9B60A] text-[#121212] px-4 sm:px-6 py-2 sm:py-3 font-black text-xs sm:text-sm tracking-[0.15em] uppercase transition-all hover:bg-opacity-90 hover:scale-105 cursor-pointer"
          style={{ borderRadius: "0px" }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  </div>
</nav>
```

**Navbar Rules:**
- Background: Always black (`#121212`) for strong contrast
- Height: `h-20` (80px) for substantial presence
- Logo: Simple text, no emoji/icon boxes
- Link hover: White background with black text (`hover:bg-[#F7F7F5] hover:text-[#121212]`)
- CTA button: Yellow (`#E9B60A`) with scale hover effect
- Cart badge: Yellow square with black text, shows "9+" for 10+ items
- Responsive: Stack or hide items on mobile, show hamburger if needed

---

## ✅ Do's and Don'ts

### ✅ DO

- Use 0px border radius everywhere (sharp edges)
- Use opacity for color variations (never gray codes)
- Implement generous white space between sections
- Scale typography dramatically for hierarchy
- Use uppercase + wide tracking for labels/metadata
- Rotate accent colors for visual variety
- Keep shadows subtle (4-12px blur max)
- Use black borders at low opacity (10-30%)
- Implement hover states (lift cards, darken buttons)
- Use fluid typography with clamp() for large headings
- Test on mobile first, enhance for desktop

### ❌ DON'T

- Never use border radius (no rounded corners)
- Never use gradients (flat colors only)
- Never use pure grays (#808080, etc) — use black with opacity
- Never use pure white (#FFFFFF) — use #F7F7F5
- Don't mix more than 2 accent colors per screen
- Don't use glossy, neumorphic, or 3D effects
- Don't use fancy focus rings (simple border darkening)
- Don't make touch targets smaller than 44x44px
- Don't forget hover states on interactive elements
- Don't use different font families in the same view
- Don't use smooth/organic shapes — keep it geometric

---

## 🔧 Implementation Checklist

When creating a new component or page:

- [ ] Set background to `#EDECE8` (page) or `#F7F7F5` (cards)
- [ ] Ensure ALL elements have `borderRadius: '0px'` (inline style or Tailwind)
- [ ] Use `#121212` for all text with appropriate opacity
- [ ] Implement mobile-first responsive classes
- [ ] Add hover states to interactive elements
- [ ] Use geometric sans-serif font (Inter/DM Sans/Satoshi)
- [ ] Apply letter spacing: tight (-0.02em) for display, wide (0.15em) for labels
- [ ] Use uppercase for buttons, labels, and tags
- [ ] Implement proper touch targets (minimum 44x44px)
- [ ] Add subtle shadows to elevated surfaces (4-12px blur)
- [ ] Use accent colors strategically (1-2 per view)
- [ ] Ensure adequate white space (use spacing scale)
- [ ] Test on mobile (375px) and desktop (1440px+) viewports

---

## 📚 Quick Reference

### Most Common Classes

```jsx
// Page wrapper
className="min-h-screen bg-[#EDECE8]"

// Container
className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12"

// Card
className="bg-[#F7F7F5] p-5 sm:p-6 lg:p-8"
style={{ borderRadius: '0px', boxShadow: '0px 4px 12px rgba(0,0,0,0.06)' }}

// Primary button
className="bg-[#121212] hover:bg-opacity-90 hover:scale-105 text-[#F7F7F5] px-6 sm:px-8 py-3 sm:py-4 font-black text-xs tracking-[0.15em] uppercase transition-all duration-200 hover:shadow-lg cursor-pointer"
style={{ borderRadius: '0px' }}

// Input
className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#121212] border-opacity-10 focus:border-[#121212] focus:border-opacity-30 transition-all bg-white text-[#121212]"
style={{ borderRadius: '0px' }}

// Label
className="block text-xs font-bold text-[#121212] opacity-50 tracking-[0.15em] uppercase mb-3"

// Grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
```
