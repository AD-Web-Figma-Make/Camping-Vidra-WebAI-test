# Allotjaments Page — Execution Plan

## Context

The `/allotjaments` route does not exist yet. The Allotjaments nav item exists in `SiteNav.tsx > NAV_ITEMS` with five submenu entries (Bungalow, Tiny Home, Hobbit XL, Mini Hobbit, Safari Glamping) but none have an `href`. This plan creates `src/pages/AllotjamentsPage.tsx`, wires the route, and updates nav links — reusing the FaqsPage scroll/sticky pattern, kit components, and CSS design tokens throughout.

---

## 1. Source of Truth Matrix

| Concern | Authority | Where |
|---|---|---|
| **Color tokens** | `src/index.css` `@theme {}` block | `--color-primary`, `--color-secondary`, `--color-bg`, `--color-dark`, `--color-grey`, `--color-surface`, `--color-accent` |
| **Typography faces** | `src/index.css` | `font-heading` (`Quicksand`), `font-body` (`Quicksand`), `font-script` (`Grand Hotel`) — only these three, no raw `font-family` strings |
| **Shadows / surfaces** | `src/index.css` | `--shadow-card` |
| **Section order & hierarchy** | Allotjaments layout frame (Figma) | Governs: hero → intro → cards grid → featured block → amenities → reviews → CTA → footer |
| **Copy / labels** | Allotjaments content frame (Figma) | All heading text, body paragraphs, card names, CTA labels, breadcrumb trail |
| **Component shapes** | Digital Agency Kit guidelines | `AccommodationCard`, `AccommodationGrid`, `MediaTextBlock`, `AmenitiesGrid`, `FullWidthBanner`, `ReviewCard`, `ReviewGrid` |
| **Scroll/sticky behavior** | `src/pages/FaqsPage.tsx` | `isFixed`, `isBookingSticky`, `bookingRef` pattern — replicate verbatim |
| **BookingWidget** | `src/components/BookingWidget.tsx` | `variant="default"` in hero, `variant="sticky"` in the sliding bar |

**Non-authoritative signals to ignore:**
- Kit component default colors, fonts, or spacing (override via CSS variables, not inline hex)
- Any visual styling implied by the Figma combined wireframe frame (layout/copy only, no color import)
- `--color-cream` (alias for `--color-bg`, avoid duplicate references)

**Missing / ambiguous source areas:**
- AccommodationCard `price` values — use Figma content frame; if absent, omit the `price` prop
- ReviewCard `photoSrc` — use Figma content; if none provided, omit (shows initial-based avatar)
- Nav submenu `href` targets — `/allotjaments#bungalow`, `#tiny-home`, etc. unless Figma specifies dedicated sub-pages
- Whether a TarifsBlock section appears on this page — confirm from Figma layout; if present, use `TarifsBlock` kit component (Witbooking variant not available in kit dist — use custom implementation matching BookingWidget pattern)

---

## 2. Build Sequence

### Step 1 — Read kit docs before writing any UI
**Skill:** `make:make-kit` → `discovery.md` → read these files in order:
1. `node_modules/@make-kits/digital-agency-kit/guidelines/setup.md`
2. `node_modules/@make-kits/digital-agency-kit/guidelines/Guidelines.md` (full inline component specs)
3. Source files for each component used:
   - `dist/app/components/AccommodationCard.js`
   - `dist/app/components/AmenitiesGrid.js`
   - `dist/app/components/MediaTextBlock.js`
   - `dist/app/components/FullWidthBanner.js`
   - `dist/app/components/ReviewCard.js`

### Step 2 — Scaffold `AllotjamentsPage.tsx`
**File:** `src/pages/AllotjamentsPage.tsx`

Replicate the FaqsPage scroll/sticky shell exactly:
```
const [isFixed, setIsFixed] = useState(false)
const [isBookingSticky, setIsBookingSticky] = useState(false)
const bookingRef = useRef<HTMLDivElement>(null)
// useEffect: setIsFixed(scrollY > 300); setIsBookingSticky(bookingRef.bottom <= 62)
```

Top-level JSX order:
1. `<FixedCompactHeader isVisible={isFixed} />`
2. Sticky bar div (`z-[55]`, same translate pattern) → `<BookingWidget variant="sticky" />`
3. Hero `<section>` (`relative flex flex-col`, `minHeight: 600px`) containing:
   - Absolute bg image from Figma content frame
   - Gradient overlay (`linear-gradient` same values as FaqsPage)
   - `<SiteStaticHeader />`
   - Title div: breadcrumb (`Inici › Allotjaments`) + `<h1>` from Figma copy
   - Absolute bottom-0 container → `<BookingWidget ref={bookingRef} variant="default" />`
4. Content sections (pt-36 on first, to clear the widget overlap)
5. `<SiteFooter />`
6. Scroll-to-top button (`z-[65]`, `isFixed`-gated)

### Step 3 — Content sections (inside the page, from Figma layout order)
Each section uses a kit component where one matches; bespoke layout only for gaps.

| Section | Kit component | Import path |
|---|---|---|
| Intro (script label + h2 + body) | Bespoke (kit has no centered-intro component) | — |
| Accommodation cards grid | `AccommodationGrid` + `AccommodationCard` | `@make-kits/digital-agency-kit/dist/app/components/AccommodationCard.js` |
| Featured accommodation detail | `MediaTextBlock` | `@make-kits/digital-agency-kit/dist/app/components/MediaTextBlock.js` |
| Included amenities | `AmenitiesGrid` | `@make-kits/digital-agency-kit/dist/app/components/AmenitiesGrid.js` |
| Guest reviews | `ReviewGrid` + `ReviewCard` | `@make-kits/digital-agency-kit/dist/app/components/ReviewCard.js` |
| Booking CTA banner | `FullWidthBanner` | `@make-kits/digital-agency-kit/dist/app/components/FullWidthBanner.js` |

**AmenitiesGrid override:** wrap in `<div className="amenities-override">` — this class already exists in `src/index.css` with the circular icon container restyling (matches homepage pattern).

**Card style hardening:** AccommodationCard ships with its own default styling. After mount, override via CSS variable targeting in `src/index.css` (add an `.accommodation-override` wrapper rule if needed), not via inline styles or hex codes.

### Step 4 — Wiring and navigation
**File:** `src/AppRouter.tsx`
- Import `AllotjamentsPage` and add route: `<Route path="/allotjaments" element={<AllotjamentsPage />} />`

**File:** `src/components/SiteNav.tsx`
- In `NAV_ITEMS`, set the Allotjaments top-level item `pathPrefix` or confirm `useLocation` already highlights it
- For each submenu item (Bungalow, Tiny Home, Hobbit XL, Mini Hobbit, Safari Glamping), set `href: '/allotjaments#<anchor>'` (or the path the Figma layout frame specifies)
- In `AllotjamentsPage.tsx`, add matching `id` anchors on each accommodation card section

### Step 5 — Design token enforcement pass
Before considering the page done:
- Search for any raw hex value (`#`) in AllotjamentsPage.tsx — replace with CSS variable
- Search for any `font-family` string literal — replace with `font-heading`, `font-body`, or `font-script` utility class
- Search for any inline `style={{ color: … }}` where a Tailwind CSS variable class exists — migrate
- Confirm `boxShadow: 'var(--shadow-card)'` used on cards, not raw rgba values

---

## 3. Constraint Checklist (pass/fail)

| Constraint | How to verify | Pass signal |
|---|---|---|
| No style leakage from combined wireframe frame | No hex codes in AllotjamentsPage.tsx derived from Figma frame colors | `grep '#' src/pages/AllotjamentsPage.tsx` returns 0 matches outside comments |
| Verbatim copy reuse only | All text matches Figma content frame exactly | Manual diff against content source |
| Kit components used wherever available | Every card, grid, block, review uses the kit import | No hand-rolled card/grid/review div without a justification comment |
| Section order / hierarchy preserved | Visual order in JSX matches Figma layout frame top-to-bottom | Section IDs in JSX match layout frame section names |
| BookingWidget reused (not reinvented) | `import { BookingWidget }` from `'../components/BookingWidget'` | No inline booking bar HTML in AllotjamentsPage.tsx |
| Routing and internal CTAs updated | Route registered in AppRouter; nav submenu hrefs set | `AppRouter.tsx` has `/allotjaments`; all submenu `href` values non-empty |
| Typography faces only from CSS | No `font-['Quicksand']` string literals; use `font-body`, `font-heading`, `font-script` | `grep "font-\['" src/pages/AllotjamentsPage.tsx` returns 0 |
| `FixedCompactHeader` + sticky bar wired | Same scroll/sticky pattern as FaqsPage | Scroll to 300px+ triggers compact header; scroll past booking widget triggers bar |

---

## 4. Risk and Recovery

| # | Risk | Detection signal | Fast repair |
|---|---|---|---|
| 1 | **AccommodationCard internal styles clash with design tokens** — kit renders its own background, border-radius, or font colors that differ from the site's visual language | Cards look visually inconsistent with the homepage style (wrong font weight, off-brand border) | Add a `.accommodation-override` wrapper in `src/index.css` using CSS variable overrides (same pattern as `.amenities-override`); never use `!important` inline |
| 2 | **Sticky booking widget z-index collision** — new page-specific elements (a filter bar, a floating CTA) sit above `z-[55]` and obscure the sticky bar | Sticky booking bar appears behind another element when scrolling | Audit z-index assignments; sticky bar must be `z-[55]`; ensure no page element between 55 and 60 |
| 3 | **BookingWidget `translate-y-1/2` overlap miscalculated** — first content section doesn't have enough top padding, causing content to hide behind the widget | The intro section's first heading is hidden under the booking widget on load | First content section after the hero must use `pt-36` (same as FaqsPage); verify by scrolling to just below the hero |
| 4 | **Nav `pathPrefix` not matching route** — the Allotjaments nav item doesn't highlight as active when on `/allotjaments` | Nav item stays un-highlighted on the Allotjaments page | In `SiteNav.tsx`, verify the Allotjaments `NavItem.pathPrefix` value is `'/allotjaments'`; `SiteStaticHeader` uses `useLocation().pathname.startsWith(pathPrefix)` for active state |
| 5 | **Raw copy invented instead of sourced from Figma** — placeholder or lorem ipsum text committed in place of real Figma content | Any `lorem ipsum`, `TODO`, or non-Catalan placeholder text in the rendered page | Audit all string literals in AllotjamentsPage.tsx before delivery; block lorem/placeholder strings from landing in the file |
