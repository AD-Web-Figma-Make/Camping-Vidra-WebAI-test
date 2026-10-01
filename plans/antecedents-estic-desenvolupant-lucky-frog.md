# Plan: Pàgina Contacte — Càmping Vidrà

## Context

"Contacte" is the only nav item without a real route. Currently it points nowhere (`href="#"`, `e.preventDefault()`), and the contact block lives as a homepage section (`id="contacte"` in `App.tsx`, lines 449–531). The task is to promote that block to a standalone `/contacte` page, extend it with a kit `ContactForm`, wire the route and nav link, and keep the homepage section intact.

---

## 1. Source of Truth Matrix

| Authority axis | Source | Signal |
|---|---|---|
| **Style** | `src/index.css` (`@theme` block) | `var(--color-*)`, `--font-heading`, `--font-body`, `--font-script`, `--shadow-card` |
| **Layout** | `AllotjamentsPage.tsx` scaffold | Hero 700 px, FixedCompactHeader, sticky booking bar, z-index stack, FAB |
| **Copy** | `App.tsx` lines 449–531 (existing contact section) | Verbatim: labels, hours, phone, email, CTA text |
| **Kit components** | `@make-kits/digital-agency-kit` — `ContactForm`, `DirectionsIframe` (partial) | Kit components take precedence over bespoke UI |
| **Ignore** | Kit default colors/typography, any lorem-ipsum or placeholder copy | Kit is BYODS; its visual defaults are irrelevant |
| **Missing / ambiguous** | Hero background image for `/contacte` (no Figma node queried) | Use `bf6c5.png` (EntornPage hero) as safe fallback, or pick any landscape PNG from `public/assets/` — to be confirmed |

---

## 2. Build Sequence

### Step 0 — Install kit (pre-req)
Invoke `make-kit` skill to reconcile `package.json` and install `@make-kits/digital-agency-kit@1.1.1` before importing any kit component.

### Step 1 — Create `src/pages/ContactePage.tsx`

**Scaffold**: copy scroll/state/ref boilerplate from `AllotjamentsPage.tsx` verbatim:
- `useState` → `isFixed`, `isBookingSticky`
- `useRef` → `bookingRef`
- `useEffect` scroll listener → threshold `scrollY > 300`, checks `bookingRef.current.getBoundingClientRect().bottom <= 62`

**Section order** (top → bottom):

| # | Element | Notes |
|---|---|---|
| 0 | `<FixedCompactHeader isVisible={isFixed} />` | `fixed z-[60]` |
| 1 | Sticky booking bar `<div>` | `fixed top-0 z-[55]`, `BookingWidget variant="sticky"` |
| 2 | Hero `<section>` | `minHeight: 700px`, full-bleed cover image, dark gradient, `<SiteStaticHeader />`, breadcrumb "Inici › Contacte", `<h1>Contacte</h1>`, `<BookingWidget ref={bookingRef} variant="default" />` at `absolute bottom-0` |
| 3 | Contact info + map `<section>` | Port verbatim from `App.tsx` lines 449–531: `bg-[--color-secondary]`, 12-col grid (col-span-5 info panel, col-span-7 iframe), bottom wave separator `/assets/15dfc.svg`. Change "Escriu-nos" `<a href="#">` → `<a href="#formulari">` to scroll to form section |
| 4 | Contact form `<section>` | `id="formulari"`, `bg-[--color-bg]`, centered heading "Escriu-nos" above kit `ContactForm`. Style the kit form to match: primary button classes `bg-primary rounded-full font-body font-bold text-[15px] text-white`, inputs use `var(--color-dark)` border |
| 5 | `<SiteFooter />` | from `src/components/SiteFooter` |
| 6 | Scroll-up FAB | `fixed bottom-8 right-8 z-[65] bg-primary` with `<ArrowUp />` lucide icon |

**Kit component usage**:
- `ContactForm` → `import { ContactForm } from '@make-kits/digital-agency-kit'` — used in section 4. Override submit button classes to match project CTA style (`bg-primary rounded-full font-body font-bold text-[15px] text-white px-8 py-4`).
- `DirectionsIframe` → **skip** (its `address` prop is a non-functional stub; the real iframe in App.tsx is already correct). Use the custom iframe block ported from App.tsx.

**Asset constants** at top of file:
```ts
const heroCover       = '/assets/bf6c5.png'   // confirmed fallback — update if Figma source provides a different asset
const contactSeparator = '/assets/15dfc.svg'  // verbatim from App.tsx
```

### Step 2 — Register route in `src/AppRouter.tsx`

Add after the `/entorn` route:
```tsx
import ContactePage from './pages/ContactePage'
// ...
<Route path="/contacte" element={<ContactePage />} />
```

### Step 3 — Wire nav in `src/components/SiteNav.tsx`

Update the Contacte entry in `NAV_ITEMS` (line 50):
```ts
// before
{ label: 'Contacte', submenu: [] },
// after
{ label: 'Contacte', href: '/contacte', pathPrefix: '/contacte', submenu: [] },
```
This makes `NavDropdown` render a `<Link to="/contacte">` instead of the `e.preventDefault()` anchor, and activates the `isActive` highlight when on `/contacte`.

---

## 3. Constraint Checklist

| Constraint | Rule |
|---|---|
| No style leakage from kit | Kit's default colors and fonts are not applied; all style comes from `var(--color-*)` and `--font-*` tokens in `src/index.css` |
| Verbatim copy reuse | Contact info copy ported character-for-character from `App.tsx` lines 456–500; no invention |
| Kit components used first | `ContactForm` used for form section; custom iframe only because `DirectionsIframe.address` is a non-functional stub |
| Section order preserved | Info panel → Map → Form → Footer matches existing App.tsx order and Figma "contacto" layout |
| Routing + nav wired | `/contacte` route added to AppRouter; `href` + `pathPrefix` added to `NAV_ITEMS[5]`; "Escriu-nos" CTA scrolls to `#formulari` |
| Scaffold parity | Identical scroll/sticky/FAB behavior as AllotjamentsPage and EntornPage |
| App.tsx unchanged | Homepage `#contacte` section preserved; new page is additive only |

---

## 4. Risk and Recovery

| Risk | Detection signal | Fast repair |
|---|---|---|
| **Hero image missing / wrong** | White or broken-image hero on `/contacte` | Swap `heroCover` constant to any confirmed `public/assets/*.png` that exists |
| **Kit `ContactForm` button style leak** | Submit button renders with kit default colors instead of `bg-primary` | Add className override prop or wrap submit button with a `[&_button[type=submit]]` Tailwind selector in the form wrapper |
| **Nav "Contacte" still not routing** | Clicking nav item stays on `#` | Confirm `NAV_ITEMS[5]` patch applied; check that `NavDropdown` render path reaches the `<Link to={href}>` branch |
| **Sticky booking bar z-index conflict** | Booking bar renders over the compact header | Verify `z-[55]` on booking bar and `z-[60]` on FixedCompactHeader match AllotjamentsPage exactly |
| **`ContactForm` import path wrong** | TS/runtime error on import | Check `node_modules/@make-kits/digital-agency-kit/dist/index.js` exports; if `ContactForm` is not named, import directly from `@make-kits/digital-agency-kit/dist/app/components/ContactForm` |

---

## Files to Create / Modify

| Action | File |
|---|---|
| **Create** | `src/pages/ContactePage.tsx` |
| **Modify** | `src/AppRouter.tsx` — add `/contacte` route |
| **Modify** | `src/components/SiteNav.tsx` — add `href` + `pathPrefix` to Contacte nav item |
| **No change** | `src/App.tsx` — homepage #contacte section stays intact |
| **No change** | `src/index.css` — no new tokens needed |

---

## Verification

1. Navigate to `http://localhost:$PORT/contacte` — page loads with hero, contact info, map, form, footer.
2. Scroll down — `FixedCompactHeader` slides in at 300px, sticky booking bar appears after hero bottom passes threshold.
3. Nav "Contacte" item in both `SiteStaticHeader` and `FixedCompactHeader` — click routes to `/contacte` and highlights green.
4. "Escriu-nos" button in contact panel — scrolls smoothly to `#formulari`.
5. `ContactForm` submit button uses `bg-primary` green, `rounded-full`, matches other CTAs on the site.
6. Scroll-up FAB visible and returns to top.
7. No visual regressions on `/`, `/allotjaments`, `/entorn` (homepage contact section unchanged).
