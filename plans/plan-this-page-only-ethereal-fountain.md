# Plan: Bungalow Tradicional Detail Page (`/allotjaments/bungalow-tradicional`)

## Context

The project currently has a listing page (`/allotjaments`) with six AccommodationCards. Clicking the "Bungalow tradicional" card navigates nowhere — the CTA is a hash anchor. This plan builds the single-accommodation detail page for Bungalow Tradicional, wires it into the router and nav, and establishes the template pattern for the remaining five detail pages.

Booking provider is **Witbooking**: kit ships a Witbooking BookingWidget variant, but **no** Witbooking TarifsBlock variant — generic TarifsBlock is used for pricing.

---

## 1. Source of Truth Matrix

| Concern | Authority | Notes |
|---|---|---|
| **Colors, typography, spacing, radii, shadows** | `src/index.css` — `@theme {}` block | `--color-*`, `--font-*`, `--shadow-card` only; use Tailwind token classes (`bg-primary`, `text-dark`, `font-heading`, etc.) or `var(--color-*)` in `style={{}}` for conditional/compound values |
| **Font faces** | `@import` at line 1 of `index.css` (Google Fonts: Quicksand 500/700 + Grand Hotel) | `font-body` and `font-heading` resolve to Quicksand; `font-script` resolves to Grand Hotel. No other faces exist. |
| **Page layout — section order, proportions, composition** | Figma layout source ("bungalow tradicional" frame) | Section order, column ratios, image placement, hero height |
| **Copy — headings, body text, labels, CTAs** | Figma content source ("bungalow tradicional" frame) | All text nodes used verbatim; no generated copy |
| **Component structure and interaction patterns** | Digital Agency Kit guidelines (`node_modules/@make-kits/digital-agency-kit/guidelines/`) | Kit is structural scaffold — use its component shapes; restyle from `index.css` tokens |
| **Page shell (header, footer, scroll behavior, sticky bar)** | `AllotjamentsPage.tsx` (established pattern) | Replicate exactly: `isFixed` + `isBookingSticky` state, `bookingRef`, scroll listener, `FixedCompactHeader`, `SiteStaticHeader`, `SiteFooter`, `BookingWidget` both variants |
| **Inner-hero template** | `AllotjamentsPage.tsx` hero section (lines ~192–228) | Kit rule: all inner-page heroes must share identical layout — same breadcrumb placement, same text alignment, same graphic accent usage |
| **Booking widget** | Existing `src/components/BookingWidget.tsx` (custom, project-styled) | Witbooking kit variant not used here — project's custom BookingWidget is already styled to design system and used on all other pages |
| **Pricing/availability block** | Kit `TarifsBlock` (generic, Witbooking has no TarifsBlock variant) | Import: `@make-kits/digital-agency-kit/dist/app/components/TarifsBlock.js` |
| **Amenities/features grid** | Kit `AmenitiesGrid` | Same import pattern as homepage: `@make-kits/digital-agency-kit/dist/app/components/AmenitiesGrid.js` with `.amenities-override` class |

**Non-authoritative signals to ignore:**
- Kit default visual language (colors, font sizes, corner radii inside kit component defaults) — always overridden by `index.css` tokens
- Any style embedded in the Figma layout/content frame — layout frame provides structure only, not color/typography directives
- Raw hex values from Figma inspector — never use; always map to the nearest `--color-*` token

**Missing / ambiguous source areas (resolve before build):**
- Exact section order for this page (hero → description → amenities → gallery → pricing?) — needs Figma layout frame
- Whether a gallery section exists and how many images it uses
- Whether a ReviewCard section is included
- Whether a DirectionsIframe section is included
- Bungalow-specific amenity icons and their labels (AmenitiesGrid data)
- Pricing table rows (TarifsBlock data: season, price per night, unit)

---

## 2. Build Sequence

### Step 1 — Read the Figma sources
- Open "bungalow tradicional" layout frame and content frame in Figma
- Extract: section order, column ratios, image asset node IDs, all copy verbatim
- Do **not** import colors, font sizes, or spacing from the frame

### Step 2 — Get design context via MCP
- Invoke `figma-design-to-code` skill
- Call `get_design_context` with the bungalow-tradicional Figma node
- Download asset archive; install to `public/assets/`
- Map every asset to its `AccommodationCard` image or section photo slot

### Step 3 — Read kit component APIs
Before writing any JSX, read:
- `node_modules/@make-kits/digital-agency-kit/guidelines/components.md` → TarifsBlock section
- Confirm TarifsBlock import path by reading `node_modules/@make-kits/digital-agency-kit/guidelines/Guidelines.md`
- Confirm AmenitiesGrid import from existing App.tsx pattern (`/dist/app/components/AmenitiesGrid.js`)
- Read `MediaTextBlock` docs if layout frame shows alternating image+text blocks

### Step 4 — Create the page file
**File to create:** `src/pages/BungalowTradPage.tsx`

Shell structure (replicate from `AllotjamentsPage.tsx`):
```
- isFixed + isBookingSticky state + bookingRef + scroll listener (verbatim copy)
- <FixedCompactHeader isVisible={isFixed} />
- Sticky booking bar div (verbatim copy, contains <BookingWidget variant="sticky" />)
- Hero <section> (minHeight 700px, same structure as AllotjamentsPage hero)
  - Bungalow cover image (full-bleed)
  - Gradient overlay (same values as AllotjamentsPage)
  - <SiteStaticHeader /> painted absolutely
  - Breadcrumb: "Inici › Allotjaments › Bungalow tradicional"
  - H1: verbatim from content source
  - <BookingWidget ref={bookingRef} variant="default" />
- [Sections from layout source — exact order TBD per Figma]
- <SiteFooter />
- Floating scroll-up button (verbatim copy from AllotjamentsPage)
```

**Styling rule for every element:** Use `font-body`, `font-heading`, `font-script` Tailwind classes for typography. Use `bg-primary`, `text-dark`, `text-grey`, `bg-surface`, `shadow-card` for color/shadow. Use `var(--color-*)` in `style={{}}` only when combining with other CSS properties or applying conditionally.

### Step 5 — Wire router
**File:** `src/AppRouter.tsx`
- Add import: `import BungalowTradPage from './pages/BungalowTradPage'`
- Add route: `<Route path="/allotjaments/bungalow-tradicional" element={<BungalowTradPage />} />`

### Step 6 — Wire nav submenu
**File:** `src/components/SiteNav.tsx` — `NAV_ITEMS` array, Allotjaments submenu, index 0:
- Change: `{ label: 'Bungalow (5pax)', href: '/allotjaments#bungalow' }`
- To: `{ label: 'Bungalow (5pax)', href: '/allotjaments/bungalow-tradicional' }`

### Step 7 — Wire AccommodationCard CTA
**File:** `src/pages/AllotjamentsPage.tsx`
- The bungalow card's CTA `<a href="#bungalow">` must become a React Router `<Link to="/allotjaments/bungalow-tradicional">` (or full `<a>` with the path)
- Only change the bungalow card — scope is this card only; other five cards are unchanged

### Step 8 — Combined-frame hard constraints (apply throughout)
Per kit Guidelines rule for `/content-layout-from-wireframe`:
- Section order and copy from frame → verbatim
- Visual style (colors, radii, fonts, spacing values) → **never** from frame → always `index.css` tokens
- No style utility classes derived from inspecting the frame's visual appearance

---

## 3. Constraint Checklist

| Constraint | Pass Condition |
|---|---|
| No style leakage from combined frame | Zero raw hex codes in output; zero font-size/weight values taken from Figma inspector; all colors resolve to `var(--color-*)` or Tailwind token class |
| Verbatim copy reuse only | Every text string in the page matches the content source exactly; no paraphrasing or generated copy |
| Kit components used wherever available | TarifsBlock, AmenitiesGrid, MediaTextBlock (if applicable) imported from `@make-kits/digital-agency-kit`; custom JSX only where kit has no matching component |
| Section order/hierarchy preserved | Section sequence matches layout source frame top-to-bottom |
| Routing and internal CTAs updated | `/allotjaments/bungalow-tradicional` returns `200` in the dev server; nav submenu item links correctly; AccommodationCard CTA on `/allotjaments` navigates to the detail page |
| Inner-hero identical to AllotjamentsPage hero | Same height, same breadcrumb placement, same overlay gradient values, same structural composition |
| No new font families introduced | Only `font-body` / `font-heading` / `font-script` used; no `font-['SomeOtherFont']` |
| BookingWidget pattern consistent | Same `isBookingSticky` + `bookingRef` + `sticky` variant bar present; same visual output as other pages |

---

## 4. Risk and Recovery

| Risk | Detection Signal | Fast Repair |
|---|---|---|
| **Style leakage from Figma frame** — inline hex or raw `fontSize: 28` values imported directly from `get_design_context` response | Grep `#[0-9a-fA-F]{3,6}` and `fontSize:` in the new page file; any hit is a leak | Replace hex with nearest `--color-*` token; replace raw size with `font-heading` + `style={{ fontSize: X }}` where X matches kit type scale |
| **TarifsBlock import path wrong** — kit uses `.js` extension and `/dist/app/components/` path that differs between kit versions | Browser console: `Cannot find module '@make-kits/digital-agency-kit/...'` | Read `node_modules/@make-kits/digital-agency-kit/package.json` → `exports` map to find the correct path; or `ls node_modules/@make-kits/digital-agency-kit/dist/app/components/` |
| **Hero diverges from AllotjamentsPage pattern** — different overlay gradient, different breadcrumb placement, or different min-height | Visual inspection side-by-side; check gradient CSS value string; check breadcrumb `position` class | Copy the exact hero `<section>` block from `AllotjamentsPage.tsx` lines 192–228 and substitute only the image src, H1 text, and breadcrumb last segment |
| **BookingWidget sticky bar not triggering** — `isBookingSticky` never flips because `bookingRef` not forwarded correctly | Scroll down on the page; sticky bar never appears OR appears immediately | Confirm `BookingWidget` uses `forwardRef`; confirm `<BookingWidget ref={bookingRef} variant="default" />` in the hero bottom slot; confirm `rect.bottom <= 62` threshold matches `FixedCompactHeader` height |
| **AccommodationCard CTA still points to hash anchor** — clicking Bungalow card on `/allotjaments` stays on same page | Click bungalow card; URL does not change to `/allotjaments/bungalow-tradicional` | In `AllotjamentsPage.tsx`, change only the bungalow card CTA from `<a href="#bungalow">` to `<Link to="/allotjaments/bungalow-tradicional">` (import `Link` from `react-router`) |

---

## Critical Files to Modify

| File | Change |
|---|---|
| `src/pages/BungalowTradPage.tsx` | **Create** — new page following AllotjamentsPage shell pattern |
| `src/AppRouter.tsx` | Add one `<Route>` for `/allotjaments/bungalow-tradicional` |
| `src/components/SiteNav.tsx` | Update one `NAV_ITEMS` submenu href from hash to route path |
| `src/pages/AllotjamentsPage.tsx` | Change bungalow `AccommodationCard` CTA from hash `<a>` to `<Link>` |

## Reusable Patterns to Copy (not reinvent)

- **Page shell** (scroll state + sticky bar + floating button): `AllotjamentsPage.tsx` lines 157–174 and 274–288
- **Inner hero block**: `AllotjamentsPage.tsx` lines 192–228
- **AmenitiesGrid import + override class**: `src/App.tsx` (search for `AmenitiesGrid` import)

## Verification

1. Dev server running — navigate to `/allotjaments/bungalow-tradicional` → page loads without 404
2. Scroll to 301px → `FixedCompactHeader` slides in; scroll further → sticky booking bar appears
3. Click nav "Allotjaments" → submenu shows "Bungalow (5pax)" → click → navigates to detail page
4. On `/allotjaments` listing page → click Bungalow card CTA → navigates to `/allotjaments/bungalow-tradicional`
5. Grep new file for raw hex: `grep -E '#[0-9a-fA-F]{3,6}' src/pages/BungalowTradPage.tsx` → zero results
6. Grep new file for non-system fonts: `grep -E "font-\['" src/pages/BungalowTradPage.tsx` → zero results (only `font-body`, `font-heading`, `font-script` allowed)
