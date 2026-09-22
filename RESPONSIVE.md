# EveryAge Digital — Responsive Design System & Implementation Guide

EveryAge Digital features a mobile-first responsive architecture designed to deliver an editorial shopping experience across mobile phones (320px–639px), tablets (768px–1023px), and desktops (1024px–1280px+).

---

## 1. Breakpoint Architecture & Tokens

Tailwind CSS v4 breakpoints:
- **Base (Phone)**: `320px – 639px` (iPhone SE, iPhone 14/15/16, Pixel, Galaxy)
- **sm (Large Phone)**: `640px – 767px`
- **md (Tablet Portrait)**: `768px – 1023px` (iPad Mini, iPad Air)
- **lg (Tablet Landscape / Laptop)**: `1024px – 1279px`
- **xl (Desktop)**: `1280px+`

### Design Tokens (Unchanged Palette)
- **Primary Blue**: `#234F9E` (links, active buttons, tab indicators)
- **Primary Dark**: `#193B7A` / `#1D438A`
- **Warm Canvas**: `#F7F7F4` (background)
- **Surface**: `#FFFFFF`
- **Muted Surface**: `#F0F1ED`
- **Borders**: `#E2E5EB` / `#E4E7EC`
- **Text**: Primary `#151515`, Secondary `#667085`
- **Semantic Accents**: Editorial badge gold (`#F2EBDD` / `#A15C00`), Best-for emerald (`#10B981` / `#065F46`), Trade-off amber (`#F59E0B` / `#B45309`).

---

## 2. Global Mobile Rules & Touch Standards

1. **Mobile-First Priority**: All components declare baseline phone styling first, progressively enhancing with `sm:`, `md:`, and `lg:` min-width overrides.
2. **Touch Targets ($\ge 44\times 44$px)**:
   - Every tappable link, button, tab item, and action icon enforces a minimum $44\times 44$px hitbox via the `.touch-target` utility class.
   - Secondary card actions (wishlist, compare) provide enlarged $36$–$44$px hit areas on touch viewports.
3. **No Horizontal Body Scroll**:
   - `overflow-x: clip` applied on `html, body`.
   - Scrollable containers (tables, galleries, chip lists) are wrapped in self-contained `overflow-x-auto` regions with custom scrollbars.
4. **Tap Highlight & Active States**:
   - `-webkit-tap-highlight-color: transparent` across all elements.
   - Touch active states configured with scale-down (`active:scale-[0.98]`) or darkened backgrounds.
5. **Safe-Area Insets**:
   - Bottom mobile bars and pinned forms utilize `env(safe-area-inset-bottom)` (`pb-safe`) for edge-to-edge iOS and Android display compatibility.
6. **Prefers-Reduced-Motion**:
   - Media query `@media (prefers-reduced-motion: reduce)` disables card hover translateY lifts and drawer transitions.

---

## 3. Page-by-Page Responsive Specifications

### A. Navigation & Header
- **Phone (Base)**:
  - Sticky glassmorphic header (`bg-[#F7F7F4]/90 backdrop-blur-md`).
  - Search icon triggers `MobileSearchToggle`, sliding an animated search input immediately below the header.
  - Hamburger icon on the right opens a slide-down navigation drawer with body scroll lock and Escape key dismiss.
  - Primary navigation is delegated to the fixed bottom `MobileTabBar` (Shop, Collections, Books, Deals, Assistant), with secondary editorial links in the hamburger drawer.
- **Tablet (`md`) & Desktop (`lg`)**:
  - In-header navigation links visible inline; hamburger and bottom tab bar are hidden (`md:hidden`).
  - Search bar visible inline on desktop.

### B. Homepage (`/`)
- **Phone**:
  - Hero stacks vertically with full-width search input, text scaled to `text-3xl`, and 24px padding.
  - Product grid renders as **2 columns** with compact aspect-square images, stacked price/button row, and 12px gap.
- **Tablet (`md`)**:
  - Hero expands to 32px padding; 3-column product grid with 16px gap.
- **Desktop (`lg`+)**:
  - Full editorial hero with right-aligned search and 48px padding; 3–4 column grid with 20px gap.

### C. Shop Marketplace (`/shop`)
- **Phone**:
  - Sidebar is hidden.
  - Filter launch button with active badge counter opens `FilterBottomSheet` (slide-up bottom sheet with drag handle, scroll lock, category/format/merchant filters, and sticky Apply/Reset buttons).
  - Selected filters appear in a horizontally scrollable chip row with quick removal buttons.
  - Compact 2-column product grid.
- **Tablet (`md`)**:
  - Sidebar collapses into a horizontal scrollable category & format chip row directly above the grid.
  - 3-column product grid.
- **Desktop (`lg`)**:
  - Persistent left sidebar card with complete facet filters.

### D. Product Detail Page (`/product/[slug]`)
- **Phone**:
  - Single-column flow: Breadcrumbs → `ProductGallery` (swipeable carousel with dots indicator) → Title/Badges → Price Row → Sticky bottom CTA (`StickyProductCTA`) → Description → Best For / Trade-offs → Specs → Recommendations (2-col grid).
  - `StickyProductCTA` sits at `bottom-14` immediately above the `MobileTabBar`, ensuring no collision or visual occlusion. It features live price status, affiliate disclosure micro-text, and direct merchant link.
- **Tablet (`md`)**:
  - 2-column layout: 60% gallery (`md:col-span-7`) / 40% info (`md:col-span-5`).
  - Purchase CTA is inline (`hidden md:flex`), sticky bottom CTA is hidden.
- **Desktop (`lg`)**:
  - 5-column gallery / 7-column info layout with sticky information block.

### E. Product Comparison (`/compare`)
- **Phone**:
  - Horizontal-scroll table with the first column (**Attribute names**) pinned as `sticky left-0` with shadow depth.
  - Maximum 3 products shown on phone with a helpful prompt: *"Showing 3 of N products on phone. Remove one to add another, or view on tablet/desktop."*
  - $44$px touch targets on remove and outbound action buttons.
- **Tablet & Desktop (`md`+)**:
  - Displays all 4 comparison slots side by side.

### F. AI Shopping Assistant (`/assistant`)
- **Phone**:
  - Full-height immersive chat interface (`h-[calc(100dvh-13rem)]`).
  - Pinned bottom input bar with `pb-safe` safe-area padding.
  - Product recommendation cards are horizontally scrollable inside chat bubbles with snap scrolling (`overflow-x-auto snap-x`).
- **Tablet & Desktop (`md`+)**:
  - 60% chat message panel (`md:col-span-7`) on the left.
  - 40% interactive product preview panel (`md:col-span-5`) on the right, updating dynamically with verified specs, images, and live prices as items are discussed.

### G. Footer
- **Phone**:
  - Link sections convert to collapsible accordions (Marketplace, Shopping Tools, Editorial & Trust, Legal & Privacy) with chevron toggles.
  - Every footer link has a minimum $44$px height (`min-h-[44px]`).
- **Tablet & Desktop (`md`+)**:
  - 4-column multi-column layout on dark background (`site-footer`).

### H. Admin Operations (`/admin`)
- **Phone**:
  - Sidebar converts to top mobile header with hamburger drawer (`AdminMobileNav`).
  - Dashboard analytics cards stack 1-column.
  - Product catalog displays stacked cards (thumbnail + title + status + metrics + action buttons).
  - Product forms feature full-width inputs and a sticky bottom Save bar (`lg:hidden fixed bottom-0`).
- **Desktop (`md`+)**:
  - Fixed dark sidebar with full navigation.
  - Detailed product data tables with `overflow-x-auto` wrapper.

---

## 4. Testing & Verification Checklist

| Viewport | Page | Verification Item | Status |
|---|---|---|---|
| **320px** | All | Zero horizontal body scroll (`overflow-x: clip`) | Passed |
| **375px** | `/` | Hero text stacked, 2-col product grid, bottom tab bar | Passed |
| **375px** | `/shop` | Filter button opens bottom sheet, active chips work | Passed |
| **375px** | `/product/[slug]` | Swipeable gallery with dots, StickyProductCTA above tab bar | Passed |
| **375px** | `/compare` | Sticky-left attribute column, 3-product phone cap | Passed |
| **375px** | `/assistant` | Pinned input bar, horizontal suggestion cards | Passed |
| **375px** | `/admin` | Mobile top drawer, 1-col cards, stacked product cards | Passed |
| **768px** | `/shop` | Category chip row above grid, 3-column cards | Passed |
| **768px** | `/product/[slug]` | 60/40 gallery/info split, inline CTA, sticky CTA hidden | Passed |
| **768px** | `/assistant` | 60% chat / 40% product preview split | Passed |
| **1280px+**| All | Complete desktop layout identical to approved design | Passed |
| **All** | Interactive | Touch targets $\ge 44\times 44$px across buttons & nav | Passed |
| **All** | Motion | `prefers-reduced-motion` suppresses lift & transitions | Passed |
