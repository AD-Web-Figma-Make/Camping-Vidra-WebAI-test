# Pla d'execució: Pàgina Entorn — Càmping Vidrà

## Context

El lloc web del Càmping Vidrà ja té pàgines funcionals per a `/allotjaments` i `/serveis` que segueixen una bastida de referència comuna (capçalera flotant compacta, barra de reserves sticky, hero 700px, seccions de contingut, footer, botó "tornar a dalt"). L'objectiu és crear la pàgina `/entorn` replicant aquesta bastida i aplicant el contingut i la composició del marc Figma `entorn`, els tokens de disseny de `src/index.css`, i els components del Digital Agency Kit quan estiguin disponibles.

---

## 1. Matriu de font de veritat

| Decisió | Font autoritzada | Notes |
|---|---|---|
| **Colors** | `src/index.css` → `var(--color-*)` | `--color-primary`, `--color-secondary`, `--color-accent`, `--color-dark`, `--color-grey`, `--color-surface`, `--color-cream` |
| **Tipografia** | `src/index.css` → `var(--font-heading)`, `var(--font-body)`, `var(--font-script)` | Únicament Quicksand i Grand Hotel |
| **Ordre de seccions** | Marc Figma `entorn` (layout source) | L'ordre jeràrquic és vinculant |
| **Textos i CTAs** | Marc Figma `entorn` (content source) | Còpia literal; cap invenció |
| **Imatges** | Assets importats des del marc Figma `entorn` cap a `public/assets/` | Hashes de fitxer tal com provinguin |
| **Estructura de components** | Digital Agency Kit v1.1.1 (`@make-kits/digital-agency-kit`) | Estructura i behavior; mai els seus tokens per defecte |
| **Proveïdor de reserves** | Witbooking | `BookingWidget provider="witbooking"` |
| **Ruta** | `AppRouter.tsx` → `/entorn` | `SiteNav` ha de marcar l'element "Entorn" com actiu |

**Senyals no autoritzats (ignorar):**
- Colors, fonts o ombres per defecte del kit (gris, Inter, border-radius genèric)
- Traduccions al castellà o anglès fora del marc Figma
- Estils visuals d'altres pàgines que no estiguin al marc `entorn`
- Qualsevol estil visual implícit en wireframes o frames de disseny combinats

**Àrees ambigues / mancants (per resoldre durant execució):**
- Node-ID exacte del marc `entorn` dins el fitxer Figma `rJQ3t70vgoAWizzAk1e2io` → cal extreure'l en el pas 1 del build
- Presència o absència d'un mapa/DirectionsIframe al disseny
- Quantitat i contingut exacte de les targetes d'activitats o punts d'interès

---

## 2. Seqüència de construcció

### Pas 0 — Prerequisits (un sol torn, en paral·lel)
**Skill/eina:** `make-kit`
- Verificar que `@make-kits/digital-agency-kit@1.1.1` és present a `package.json` i instal·lat
- Llegir `node_modules/@make-kits/digital-agency-kit/guidelines/Guidelines.md` (ja fet; confirmar cap canvi de versió)
- Identificar el node-ID del marc `entorn` al fitxer Figma `rJQ3t70vgoAWizzAk1e2io` (explorar estructura del fitxer o demanar al usuari si no es troba)

### Pas 1 — Obtenir context de disseny Figma
**Skill/eina:** `figma-design-to-code` (invocar primer) → `get_design_context`
- Paràmetres: `fileKey: "rJQ3t70vgoAWizzAk1e2io"`, `nodeId: <node-id entorn>`, `skillNames: "figma-design-to-code"`
- Extreure: ordre de seccions, textos literals, referència d'assets (imatges), proporcions d'imatge, estructura de CTA
- **No extreure:** colors, fonts, radis, ombres del codi retornat (no autoritzats)
- Importar assets nous a `public/assets/` via `figma attachments get <id>`

### Pas 2 — Crear `src/pages/EntornPage.tsx`
**Bastida obligatòria** (idèntica a `AllotjamentsPage.tsx`):
```
useState: isFixed, isBookingSticky
useRef: bookingRef
useEffect: scroll listener (isFixed: scroll > 300; isBookingSticky: bookingRef.current.getBoundingClientRect().bottom <= 62)

<FixedCompactHeader isVisible={isFixed} />
Sticky booking bar (z-[55], translate-y transition)
Hero (minHeight: 700px, full-bleed image, gradient, SiteStaticHeader z-50, breadcrumb "Inici › Entorn", H1 "Entorn", BookingWidget ref={bookingRef} variant="default" provider="witbooking")
[Sections from Figma entorn frame — see §2.3]
<SiteFooter />
Scroll-up button (z-[65], size-[48px], bg-primary, ArrowUp icon)
```

**Seccions a construir (basades en patrons existents + marc entorn):**
A confirmar des de Figma, però el patró estàndard per a una pàgina d'entorn de càmping inclou:
1. **Intro** — label "Càmping Vidrà" uppercase, H2, cos de text
2. **Localització geogràfica** — `MediaTextBlock` (imatge + text, alternar esquerra/dreta)
3. **Activitats** — `AmenitiesGrid` (icones Lucide + etiquetes) dins `.amenities-override` per aplicar estils de projecte
4. **Punts d'interès** — seccions `MediaTextBlock` o grid de targetes (depenent del disseny Figma)
5. **Full-width banner** — `FullWidthBanner` si apareix al disseny
6. **Com arribar-hi** — `DirectionsIframe` si present al disseny

**Constraint de frames combinats:** Si el codi retornat per `get_design_context` inclou estils en línia (colors hex, font-family literals, border-radius), substituir-los per tokens `var(--color-*)` i classes Tailwind del projecte.

### Pas 3 — Cablejat de ruta i navegació
**Fitxers a modificar:**
- `src/AppRouter.tsx` → afegir `<Route path="/entorn" element={<EntornPage />} />`
- `src/components/SiteNav.tsx` → verificar que l'element "Entorn" de `NAV_ITEMS` apunti a `/entorn`; afegir `href="/entorn"` si falta

### Pas 4 — CSS overrides si cal
**Fitxer:** `src/index.css`
- Afegir classe `.entorn-override` si algun component del kit requereix ajust d'estil igual que `.amenities-override`
- Mantenir tokens; mai hardcodejar colors

### Pas 5 — Verificació visual
- Revisar que `FixedCompactHeader` apareix en scroll
- Revisar que la barra de reserves fa sticky correctament
- Revisar que totes les imatges carreguen
- Revisar ruta `/entorn` activa a la navegació

---

## 3. Checklist de restriccions (pass/fail)

| Restricció | Criteri |
|---|---|
| **Cap filtratge d'estils del kit** | Cap color hex, font-family o border-radius provinents dels tokens per defecte del kit present al JSX final |
| **Còpia literal exclusivament** | Tots els textos (H1, H2, paràgrafs, CTAs) provenen del marc Figma `entorn`; cap text inventat |
| **Components del kit usats on disponibles** | `MediaTextBlock`, `AmenitiesGrid`, `FullWidthBanner`, `DirectionsIframe` usats per les estructures corresponents; components bespoke únicament per a gaps |
| **Ordre de seccions preservat** | L'ordre jeràrquic del marc Figma `entorn` és respectat; cap secció reordenada |
| **Ruta i CTAs interns actualitzats** | `/entorn` registrat a `AppRouter.tsx`; "Entorn" a `SiteNav.tsx` apunta a `/entorn`; tots els CTA intern utilitzen `<Link to="...">` de react-router |
| **Bastida de referència respectada** | `FixedCompactHeader`, sticky booking bar, hero 700px, scroll-up button idèntics a `AllotjamentsPage.tsx` |
| **Tokens de disseny usats** | `var(--color-*)`, `var(--font-heading)`, `var(--font-body)` a tot el CSS; cap Tailwind color literal (`green-500`, `gray-800`, etc.) |

---

## 4. Riscos i recuperació

| Risc | Senyal de detecció | Acció de reparació |
|---|---|---|
| **1. Node-ID del marc Figma no trobat** | `get_design_context` retorna error o estructura incorrecta | Demanar al usuari el node-ID exacte (format `NNNN:NNNN`) des de la URL de Figma del marc `entorn` |
| **2. Filtratge d'estils del kit al codi generat** | El codi retornat per `get_design_context` conté colors hex, font `Inter`, `rounded-lg` literals | Substituir sistemàticament per `var(--color-*)` i `font-[family:var(--font-body)]` antes de copiar al fitxer |
| **3. Assets de Figma no importats correctament** | Imatges no carreguen en preview, consola mostra 404 per a `/assets/xxxxx.svg` | Executar `figma attachments get <id> --dest public/assets/<hash>.ext` per a cada asset faltant; actualitzar rutes en el component |
| **4. SiteNav no marca "Entorn" com actiu** | L'element de navegació no té l'estil actiu quan la ruta és `/entorn` | Inspeccionar `NAV_ITEMS` a `SiteNav.tsx`; afegir `href="/entorn"` si falta; verificar que el component usa `useLocation` per detectar ruta activa |
| **5. Scroll listener del sticky booking bar trenca el layout** | La barra de reserves no apareix / layout salta visualment | Copiar exactament l'`useEffect` de `AllotjamentsPage.tsx` (threshold `<= 62`); verificar que `bookingRef` apunta al `BookingWidget` correcte |

---

## Fitxers crítics a modificar

| Fitxer | Acció |
|---|---|
| `src/pages/EntornPage.tsx` | **Crear** — pàgina completa seguint la bastida de referència |
| `src/AppRouter.tsx` | **Editar** — afegir `<Route path="/entorn" element={<EntornPage />} />` |
| `src/components/SiteNav.tsx` | **Editar** — verificar/afegir `href="/entorn"` a l'element "Entorn" de `NAV_ITEMS` |
| `src/index.css` | **Editar** — afegir overrides de kit si cal (classe `.entorn-override`) |
| `public/assets/` | **Afegir** — assets d'imatge importats des del marc Figma `entorn` |

## Funcions i utilitats a reutilitzar

- `FixedCompactHeader`, `SiteStaticHeader` — `src/components/SiteNav.tsx`
- `SiteFooter` — `src/components/SiteFooter.tsx`
- `BookingWidget` — `src/components/BookingWidget.tsx`
- `MediaTextBlock`, `AmenitiesGrid`, `FullWidthBanner`, `DirectionsIframe` — `@make-kits/digital-agency-kit/dist/app/components/`
- Pattern d'scroll (`isFixed`, `isBookingSticky`) — `src/pages/AllotjamentsPage.tsx` (referència verbatim)
- `.amenities-override` CSS class — `src/index.css` (reutilitzar directament)

---

## Verificació end-to-end

1. Navegar a `/entorn` — la pàgina carrega sense errors de consola
2. Fer scroll > 300px — `FixedCompactHeader` apareix suaument
3. `BookingWidget` visible a la part inferior del hero; en fer scroll, la barra sticky apareix a z-[55]
4. Totes les imatges dels assets carreguen (no 404)
5. El botó "tornar a dalt" apareix quan `isFixed` és true
6. "Entorn" a la navegació principal té l'estil actiu quan la ruta és `/entorn`
7. Cap color hex hardcoded visible en el CSS generat; tots els colors via `var(--color-*)`
8. Textos coincideixen verbatim amb el marc Figma `entorn`
