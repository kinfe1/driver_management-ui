---
name: Driver Management UI
description: A responsive fleet operations system with calm blue accents and clear compliance surfaces.
colors:
  primary: "#1d4ed8"
  primary-strong: "#2563eb"
  neutral-bg: "#eff3fb"
  neutral-surface: "#ffffff"
  neutral-surface-soft: "#f8fafc"
  neutral-border: "#e5e7eb"
  neutral-border-strong: "#cbd5e1"
  text: "#0f172a"
  text-muted: "#475569"
  text-subtle: "#64748b"
  inverse: "#ffffff"
  success: "#16a34a"
  warning: "#f59e0b"
  danger: "#dc2626"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(2rem, 3vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  full: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.inverse}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
  button-secondary:
    backgroundColor: "{colors.neutral-surface-soft}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
  card-surface:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "22px 24px"
  input-default:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
  nav-link-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.inverse}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
---

# Design System: Driver Management UI

## 1. Overview

The design system is built for a practical fleet operations interface with a confident, efficient tone. It balances a strong blue brand accent against calm neutral surfaces, using clear spacing and purposeful hierarchy so admins and drivers can scan status quickly without distraction.

This system leans into crisp utility rather than decoration: grounded card layouts, direct text color, and restrained interaction states keep the experience focused on work rather than on ornamental styling.

Key Characteristics:
- A trusted blue accent used for primary actions, active state, and navigational emphasis.
- High-contrast text and neutral surfaces for readability across desktop and narrow views.
- Comfortable, layered spacing with rounded surfaces that feel modern but functional.

## 2. Colors

The palette is grounded in a bold brand blue with a soft, neutral background system for cards, forms, and surface layers.

### Primary
- **Fleet Blue** (#1d4ed8): The main accent for primary buttons, active navigation states, and high-priority interactive elements.
- **Fleet Blue Strong** (#2563eb): Used in gradients and stronger emphasis states where the primary blue needs depth.

### Neutral
- **Fog** (#eff3fb): The page background for the app shell and large workspace areas.
- **Paper** (#ffffff): Surface color for cards, tables, forms, and overlays.
- **Cloud** (#f8fafc): Soft surface tone for secondary panels, form states, and subtle containers.
- **Border Mist** (#e5e7eb): Light border and divider color for surface separation.
- **Border Cloud** (#cbd5e1): Stronger stroke color for inputs and interactive boundaries.
- **Ink** (#0f172a): Primary body text color for readability.
- **Slate** (#475569): Secondary text, metadata, and supporting labels.
- **Mist** (#64748b): Subtle text, helper copy, and muted states.
- **White** (#ffffff): Inverse text on brand blue and dark surfaces.

### Semantic
- **Success** (#16a34a): Approved statuses and positive badges.
- **Warning** (#f59e0b): Expiry warnings, pending attention states.
- **Danger** (#dc2626): Critical expiration and failure states.

## 3. Typography

**Display / Headline Font:** Inter (system-ui fallback)
**Body Font:** Inter (system-ui fallback)
**Label Font:** Inter (system-ui fallback)

The typographic system is neutral and consistent, with a single sans-serif family across display and body text. This keeps the interface direct and avoids visual friction between text styles.

### Hierarchy
- **Display** (700, clamp(2rem, 3vw, 2.6rem), 1.1): Primary page and section headings that anchor the experience.
- **Headline** (700, 2rem, 1.2): Secondary headings, dashboard titles, and card titles.
- **Title** (700, 1.15rem, 1.3): Labels for cards, section subheads, and form groups.
- **Body** (400, 0.98rem, 1.7): Paragraphs, table text, and general content copy. Keep paragraphs under 65–75ch for readability.
- **Label** (600, 0.95rem, 1.4): Field labels, button text, nav items, and inline metadata.

## 4. Elevation

Depth is conveyed through layered white surfaces and subtle shadows rather than heavy or decorative glass effects. Most surfaces are flat at rest; shadows appear on raised panels, floating cards, and the mobile navigation overlay.

### Shadow Vocabulary
- **Surface** (`0 20px 60px rgba(15, 23, 42, 0.08)`): Primary card and panel elevation across forms and content containers.
- **Floating** (`0 18px 50px rgba(15, 23, 42, 0.08)`): Secondary cards and summary panels that sit above page content.
- **Lift** (`0 14px 40px rgba(15, 23, 42, 0.08)`): Buttons, input focus rings, and smaller interactive surfaces.
- **Overlay** (`40px 0 80px rgba(9, 21, 35, 0.24)`): Mobile menu backdrop and off-canvas navigation.

## 5. Components

### Buttons
- **Shape:** medium rounded corners (`16px`).
- **Primary:** Solid Fleet Blue background with white text, medium padding, and a confident, visible call-to-action.
- **Secondary:** Soft white surface with slate text and a subtle visual tone for lower-priority actions.
- **Hover / Focus:** Maintain strong contrast. Use a slightly deeper blue or a subtle tonal shift on interactive surfaces.

### Cards / Containers
- **Corner Style:** large rounded edges (`20px` or `24px`).
- **Background:** white or soft gray-white surfaces anchored on the Fog page background.
- **Shadow Strategy:** use subtle drop shadows for raised cards; keep the effect airy and avoid heavy visual weight.
- **Border:** light border strokes on tables and entry panels for clarity.
- **Internal Padding:** generous spacing (22px–24px) to separate content cleanly.

### Inputs / Fields
- **Style:** white surfaces with a soft border and medium rounded corners (`16px`).
- **Focus:** shift border to blue and add a gentle blue ring or outline.
- **Error / Disabled:** reserve semantic red for failed states and use muted text for disabled text.

### Navigation
- **Style:** dark panel with light text and clear active states.
- **Active:** primary blue background with white text.
- **Default / Hover:** subtle tinted hover feedback and neutral link text to keep the sidebar calm.
- **Mobile:** an off-canvas slide-in nav that preserves the same surface and active styling.

## 6. Do's and Don'ts

### Do:
- **Do** use Fleet Blue (#1d4ed8) only for primary actions, active navigation, and high-value emphasis.
- **Do** keep body text on white or Fog backgrounds with Ink (#0f172a) for strong readability.
- **Do** use consistent, layered spacing and rounded surfaces to organize content hierarchically.
- **Do** keep forms, tables, and compliance states clear with simple borders, tertiary background fills, and semantic badge colors.

### Don't:
- **Don't** make the interface look like a marketing landing page or sales site.
- **Don't** lean into decorative or consumer mobile app styling; this is a practical operations tool.
- **Don't** use glassmorphism, excessive gradients, or overly flashy visuals as the product's default look.
- **Don't** add heavy, decorative shadows or border stripes; keep elevation subtle and structural.