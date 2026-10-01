# Plan: FAQs Page — `/el-camping/faqs`

## Context

The project is a single-page scroll layout with no routing wired yet. `react-router` v7.13.0 is already installed but unused. The task is to build a dedicated FAQs inner page at `/el-camping/faqs`, wire it into the router, update all existing FAQs anchor links (nav submenu, intro CTA, footer), and apply the project's design system (CSS variables, Quicksand + Grand Hotel fonts) throughout. No FAQ component exists in the Digital Agency Kit — a custom accordion will be built using kit primitives and design tokens.

---

## 1. Source of Truth Matrix

| Concern | Authority | Source |
|---|---|---|
| Colors, typography, spacing, radius, shadow | `src/index.css` CSS variables (`--color-*`, `--font-*`, `--shadow-card`) | **Style source** |
| Section order, layout composition, column widths | Figma "faqs" layout frame | **Layout source** |
| All copy (questions, answers, labels, headings) | Figma "faqs" content frame | **Content source** |
| Page-level component selection | Digital Agency Kit guidelines first, then custom | **Kit + style source** |
| Booking provider widget | Witbooking variant | `BookingWidget/Witbooking` |

**Non-authoritative signals to ignore:**
- Any colors, font sizes, or radii visible in the Figma frame that conflict with `src/index.css` variables — the CSS file wins.
- Kit component default visual styling (the kit is structural scaffold only per Guidelines.md).
- Any spacing or layout values from the current homepage sections that aren't confirmed in the faqs layout frame.

**Missing / ambiguous source areas:**
- Exact FAQ category groupings and Q&A pairs — must come verbatim from the content frame; do not invent.
- Whether a `FullWidthBanner` CTA exists between sections — confirm from layout frame at execution time.
- Inner-page hero image — confirm from content frame; do not reuse homepage hero image without explicit instruction.

---

## 2. Build Sequence

### Step 1 — Wire react-router into the app

**File:** `src/main.tsx`  
Wrap the root render with `<BrowserRouter>` (from `react-router`). No other changes.

```tsx
import { BrowserRouter } from 'react-router'
// wrap <App /> in <BrowserRouter>
```

**File:** `src/App.tsx`  
Convert `App` into the homepage route component (no structural changes — it remains the full scroll page). Add a `<Routes>` wrapper at the router level in a new `src/AppRouter.tsx`.

**File:** `src/AppRouter.tsx` (new)  
```tsx
import { Routes, Route } from 'react-router'
import App from './App'
import FaqsPage from './pages/FaqsPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/el-camping/faqs" element={<FaqsPage />} />
    </Routes>
  )
}
```

`main.tsx` renders `<BrowserRouter><AppRouter /></BrowserRouter>`.

---

### Step 2 — Update all FAQs anchor links in `App.tsx`

Three locations in `App.tsx` currently use `href="#"` for FAQs. Replace each with `<Link to="/el-camping/faqs">` using `react-router`'s `Link` component:

| Location | Current | Replace with |
|---|---|---|
| `NAV_ITEMS` submenu `'FAQs'` item (line ~53) | `<a href="#" onClick={e.preventDefault()}>` inside `NavDropdown` | `<Link to="/el-camping/faqs">` — remove `onClick` preventDefault |
| Intro section CTA `Veure les FAQs` (line ~487) | `<a href="#">` | `<Link to="/el-camping/faqs">` |
| Footer "Info" column `FAQs` item (line ~951) | `<a href="#">` | `<Link to="/el-camping/faqs">` |

`NavDropdown` receives the submenu item as a plain string. The component will need to map known route strings to paths — simplest approach: pass `{ label: string; href?: string }` objects in `submenu`, and render `<Link>` when `href` is present, `<a onClick={preventDefault}>` otherwise. Update `NAV_ITEMS` accordingly.

---

### Step 3 — Build `src/pages/FaqsPage.tsx`

**Structure (derived from layout frame at execution time):**

1. **Shared compact fixed header** — same `<header>` with `isFixed` logic from `App.tsx`. Extract this header into `src/components/SiteHeader.tsx` and import it in both `App.tsx` and `FaqsPage.tsx`. (Alternatively, replicate the header inline in `FaqsPage.tsx` if extraction is blocked by scope; extraction is preferred.)

2. **Inner-page Hero** — use `HeroSection` kit component (structural scaffold). Style per design system tokens. Copy and image from Figma faqs content frame verbatim.

3. **FAQ Accordion section** — custom component (kit has no FAQ/Accordion component). Build `src/components/FaqAccordion.tsx`:
   - Groups of questions (if grouped) — heading per group using `font-heading`, `var(--color-dark)`
   - Accordion items: question row (bold, `font-body`, `var(--color-dark)`) + chevron icon from `lucide-react` + expand/collapse state
   - Answer body: `font-body`, `var(--color-grey)`, `var(--color-surface)` or `var(--color-bg)` background
   - No raw hex anywhere — all values from CSS variables
   - Animated expand/collapse via CSS `max-height` transition or `motion` (already installed)
   - All copy verbatim from content frame

4. **CTA / FullWidthBanner** (if layout frame includes it) — use `FullWidthBanner` kit component. Witbooking `BookingWidget` if a booking CTA is needed.

5. **Shared footer** — replicate (or extract) the `<footer>` block from `App.tsx`.

6. **Scroll-up button** — replicate the existing fixed scroll-up button from `App.tsx`.

**Typography rules (no exceptions):**
- Script labels: `font-script` (`Grand Hotel`) via `font-['Grand_Hotel',cursive]` or `className="font-script"`
- All headings: `font-heading` (`Quicksand`, bold)
- All body/labels: `font-body` (`Quicksand`, medium/bold)
- No `text-xl`, `font-semibold`, or any Tailwind typography utility that bypasses the token — use `style={{ fontSize: '...' }}` only where the token scale doesn't resolve, referencing CSS variable values

**Color rules:**
- All colors via CSS variables: `var(--color-primary)`, `var(--color-dark)`, `var(--color-grey)`, etc.
- No raw hex in JSX or inline style

---

### Step 4 — Shared layout extraction (optional but preferred)

If the header and footer are large enough to drift between pages, extract to:
- `src/components/SiteHeader.tsx` — fixed compact header + full-height static header logic
- `src/components/SiteFooter.tsx` — footer grid + partners + copyright

Both `App.tsx` and `FaqsPage.tsx` import these. This prevents copy-paste drift.

---

### Step 5 — Verify routing and CTA wiring

- Navigate to `/el-camping/faqs` directly — page must render without 404.
- All three FAQs links in nav, intro, footer must route correctly via `<Link>`.
- Scroll-up button visible on scroll on FAQs page.
- Back-navigation: browser back returns to homepage scroll position.

---

## 3. Constraint Checklist

| Constraint | Pass condition |
|---|---|
| No style leakage from layout frame | All colors/fonts/radii come from `src/index.css` variables only — zero raw hex in `FaqsPage.tsx` or `FaqAccordion.tsx` |
| Verbatim copy only | Every FAQ question, answer, heading, and label matches the content frame exactly — no generated placeholder text |
| Kit components used where available | `HeroSection` for the hero, `FullWidthBanner` for any CTA banner, `BookingWidget/Witbooking` if a booking block is in the layout |
| No kit component used without reading its docs | Check each component's source API before use (no prop guessing) |
| Section order/hierarchy preserved | Sections rendered in the exact order from the layout frame |
| Routing and internal CTAs updated | All three FAQs `href="#"` anchors converted to `<Link to="/el-camping/faqs">` |
| Font-face compliance | Only `Grand Hotel` (script) and `Quicksand` (heading/body) used — no system fonts, no Tailwind generic `font-sans` |

---

## 4. Risk and Recovery

| Risk | Detection signal | Fast repair |
|---|---|---|
| **Router 404 on direct URL** — `BrowserRouter` works locally but Make's dev server doesn't serve all paths | Page shows blank or 404 on `/el-camping/faqs` refresh | Add `historyApiFallback: true` to `vite.config.ts` dev server options |
| **Style leakage from layout frame** — agent copies hex from Figma instead of using CSS variables | Raw `#xxxxxx` strings appear in `FaqsPage.tsx` | Global find for `#` in the new file; replace each with the matching `var(--color-*)` |
| **Kit component prop mismatch** — `HeroSection` props guessed from name, not from source | Component renders blank, throws, or shows kit default visual | Read `node_modules/@make-kits/digital-agency-kit/dist/app/components/HeroSection.js` source for exact prop names before writing JSX |
| **Header/footer drift** — FAQs page header diverges from homepage over future edits | Visual difference in nav or footer between pages | Extract both to shared components in Step 4; treat that as non-optional |
| **`<Link>` used inside `NavDropdown` without router context** — if `NavDropdown` renders outside the `<BrowserRouter>` | Runtime error: "useHref() may be used only in the context of a Router component" | Confirm `<BrowserRouter>` wraps the entire tree in `main.tsx` before updating `NavDropdown` |

---

## Critical Files to Modify

| File | Change |
|---|---|
| `src/main.tsx` | Add `<BrowserRouter>` wrapper |
| `src/App.tsx` | Remove direct render, update `NavDropdown` to accept `href` in submenu, update 3 FAQs links to `<Link>` |
| `src/AppRouter.tsx` | **New** — route table (`/` → `App`, `/el-camping/faqs` → `FaqsPage`) |
| `src/pages/FaqsPage.tsx` | **New** — full FAQs page |
| `src/components/FaqAccordion.tsx` | **New** — custom accordion (no kit equivalent) |
| `src/components/SiteHeader.tsx` | **New (optional)** — extracted shared header |
| `vite.config.ts` | Add `historyApiFallback: true` to dev server if needed |
