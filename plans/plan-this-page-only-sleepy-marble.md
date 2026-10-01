# Plan: Serveis Page (`/serveis`)

## Context

The site has a `#serveis` anchor section on the homepage (App.tsx) and a footer link + nav entry both pointing to it. A dedicated `/serveis` route does not exist yet. The goal is to create a full inner page at `/serveis`, following the established inner-page pattern (AllotjamentsPage.tsx is the canonical reference), and wire routing in three places (AppRouter, SiteNav, SiteFooter + App.tsx CTA).

---

## 1. Source of Truth Matrix

| Authority | Source | File/Location |
|---|---|---|
| **Style** | `src/index.css` CSS variables (`--color-*`, `--font-*`). All colors, typography, spacing must use these tokens. | `src/index.css` |
| **Layout** | Figma "serveis" layout frame — call `get_design_context` at implementation time | Figma (to fetch) |
| **Copy** | Figma "serveis" content frame — use verbatim only | Figma (to fetch) |
| **Component API** | `@make-kits/digital-agency-kit` — `AmenitiesGrid` is the primary kit component | `node_modules/@make-kits/digital-agency-kit/guidelines/` |
| **Scaffold pattern** | `AllotjamentsPage.tsx` — hero, sticky booking bar, FixedCompactHeader, scroll-up button | `src/pages/AllotjamentsPage.tsx` |

**Non-authoritative signals to ignore:**
- Visual style from any Figma wireframe-only frame (use only CSS tokens)
- Inline colours or fonts from the Figma combined-frame export (reject any hardcoded hex/font not already in `index.css`)
- The existing `#serveis` section in `App.tsx` — treat as a preview/teaser only; the full page may have more sections and different layout

**Missing / ambiguous at plan time:**
- Hero cover image for `/serveis` (needs to come from Figma `get_design_context`)
- Full list of amenity items for the expanded grid (Figma "serveis" content frame)
- Whether the page has additional sections beyond a grid (e.g., a media section, CTA strip, or parcel·les cross-sell)
- Any new icon SVGs not yet in `public/assets/`

---

## 2. Build Sequence

### Step 1 — Kit & Design Context (prerequisite)
**Skill**: `make-kit` (mandatory first read before any UI)
**Then**: `figma-design-to-code` skill → `get_design_context` with the Figma "serveis" layout/content frame URL
**Goal**: Extract layout hierarchy, section order, copy, and any new asset URLs

### Step 2 — New page file: `src/pages/ServeisPage.tsx`
**Pattern**: Clone AllotjamentsPage.tsx scaffold exactly:
- `useState(isFixed, isBookingSticky)` + `useRef(bookingRef)` + scroll listener
- `<FixedCompactHeader isVisible={isFixed} />`
- Sticky booking bar (`z-[55]`, slides in at `translate-y-[62px]`)
- Hero section: 700px min-height, cover image (from Figma), `<SiteStaticHeader />` inside, `<BookingWidget ref={bookingRef} variant="default" />` anchored at bottom
- Breadcrumb: `Inici › Serveis`
- H1: `Serveis` (verbatim from Figma)
- Scroll-up floating button (identical to AllotjamentsPage)
- `<SiteFooter />`

**Content sections** (insert between hero and footer, in Figma section order):
- Intro header block — `font-script` label, H2, body paragraph (verbatim copy from Figma)
- **AmenitiesGrid** (kit component) — full services list from Figma, wrapped in `.amenities-override` div (reuse existing CSS, no new styles needed)
- Any additional sections revealed by `get_design_context` (e.g., media+text blocks, CTA strip)

**Imports to include:**
```ts
import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router'
import { SiteStaticHeader, FixedCompactHeader, navWave } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { BookingWidget } from '../components/BookingWidget'
import { AmenitiesGrid } from '@make-kits/digital-agency-kit/dist/app/components/AmenitiesGrid.js'
// + lucide icons for AmenitiesGrid items (same subset as App.tsx: Waves, Utensils, ShoppingBag, + any new ones)
```

**Asset references** (plain string constants at top of file):
```ts
const heroCover = '/assets/XXXX.png'  // from Figma
```

### Step 3 — Register route: `src/AppRouter.tsx`
Add one route:
```tsx
<Route path="/serveis" element={<ServeisPage />} />
```
Import `ServeisPage` at the top of the file, alongside the existing page imports.

### Step 4 — Wire SiteNav: `src/components/SiteNav.tsx`
Update the `NAV_ITEMS` "Serveis" entry (currently `{ label: 'Serveis', submenu: [] }`) to add `href`:
```ts
{ label: 'Serveis', href: '/serveis', submenu: [] },
```
Also update the nav component's link-rendering logic if it conditionally renders a `<Link>` only when `href` is present (check the existing pattern used for "Allotjaments").

### Step 5 — Wire footer + homepage CTA
**`src/components/SiteFooter.tsx`**: Change the "Serveis" entry from `<a href="/#serveis">` to `<Link to="/serveis">` (add `Link` import if not already present).

**`src/App.tsx`**: Change the `#serveis` section's "Veure tots els serveis" CTA from `<a href="#">` to `<Link to="/serveis">` (add `Link` import — it may already be imported).

---

## 3. Constraint Checklist

| Constraint | Enforcement |
|---|---|
| **No style leakage from Figma combined frame** | Reject any hex value or font-family not already defined as a CSS variable in `index.css`. Use only `var(--color-*)` and `font-heading` / `font-body` / `font-script` Tailwind utilities |
| **Verbatim copy only** | All heading, body, label text must match the Figma "serveis" content frame character-for-character |
| **Kit components used wherever available** | `AmenitiesGrid` is the correct kit component for the services grid. Do not build a bespoke grid |
| **Section order / hierarchy preserved** | Sections must appear in the order dictated by the Figma layout frame. Do not reorder |
| **Routing and internal CTAs updated** | AppRouter + SiteNav + SiteFooter + App.tsx homepage CTA all updated (Steps 3–5) |

---

## 4. Risk and Recovery

| # | Risk | Detection signal | Fast repair |
|---|---|---|---|
| 1 | **Hero image missing from `public/assets/`** — the Figma serveis frame uses a cover photo not yet in the repo | `get_design_context` returns an asset URL; `public/assets/` directory listing shows no matching file | Download via `figma attachments get <id>` or copy asset path from another page temporarily; note it in a comment |
| 2 | **AmenitiesGrid icon shape mismatch** — Figma shows different icon sizes/shapes vs. what `.amenities-override` CSS produces | Visual diff between preview and Figma screenshot | Extend `.amenities-override` rules in `index.css` using CSS variables only; do not add inline styles to the component |
| 3 | **Hardcoded colours or fonts from Figma export leak into the component** | Any `style={{ color: '#...' }}` or `className="text-[#...]"` that doesn't reference a CSS variable | Replace with the closest `var(--color-*)` token; flag any colour not in the design system to the user |
| 4 | **Nav `href` not rendering as `<Link>`** — SiteNav may only render `<Link>` when a specific condition is met | Nav "Serveis" item is a `<span>` or `<button>` instead of an anchor after change | Inspect `SiteNav.tsx` nav-item render path; ensure the `href` property triggers the same `<Link>` or `<a>` branch used by "Allotjaments" |
| 5 | **Footer still using `<a href="/#serveis">`** — page is created but footer anchor navigates to homepage hash instead of `/serveis` route | Clicking "Serveis" in footer scrolls to homepage section instead of navigating | Replace with `<Link to="/serveis">` and add `Link` import to `SiteFooter.tsx` |

---

## Critical Files

| File | Change |
|---|---|
| `src/pages/ServeisPage.tsx` | **Create** — new page, follows AllotjamentsPage scaffold |
| `src/AppRouter.tsx` | **Edit** — add `/serveis` route |
| `src/components/SiteNav.tsx` | **Edit** — add `href: '/serveis'` to Serveis nav item |
| `src/components/SiteFooter.tsx` | **Edit** — change anchor to `<Link to="/serveis">` |
| `src/App.tsx` | **Edit** — change "Veure tots els serveis" CTA to `<Link to="/serveis">` |

## Verification

1. Navigate to `http://localhost:8443/serveis` — page renders without blank screen
2. Scroll past the hero — sticky booking bar appears and compact nav slides in
3. Scroll to bottom — `<SiteFooter>` renders correctly
4. Click "Serveis" in the top nav — routes to `/serveis` (not a hash scroll)
5. Click "Serveis" in the footer — routes to `/serveis`
6. Click "Veure tots els serveis" on the homepage — routes to `/serveis`
7. All text matches Figma content frame verbatim
8. No hardcoded hex colours present in `ServeisPage.tsx` — only CSS variable references
