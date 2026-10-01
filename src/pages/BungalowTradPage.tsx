/**
 * BungalowTradPage — Single accommodation detail page (route "/allotjaments/bungalow-tradicional").
 *
 * Sections: inner-page Hero (BookingWidget), Intro with feature stats, Photo Gallery
 * (3-image panoramic strip, 530px tall, offset 116px for overlap effect), Equipament
 * grid, wave separator, Altres Allotjaments bleed-right carousel.
 *
 * Layout notes:
 * - Gallery section uses translate-y-[116px] to overlap Intro and Equipament sections.
 *   Equipament has pt-[196px] to compensate the overlap.
 * - Bleed-right carousel: left text column has fixed 440px width; the card strip fills
 *   the remaining viewport width. CSS class .bleed-carousel (defined in index.css)
 *   forces each card to (100% - 3rem) / 2.5 width so exactly 2.5 cards are always visible.
 * - visibleRelated shows 3 items starting from relatedIdx, wrapping via modulo.
 * - All AccommodationCard CTAs call preventDefault (not yet live routes).
 */
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import { Link } from 'react-router'
import { SiteStaticHeader, FixedCompactHeader, navWave } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { BookingWidget } from '../components/BookingWidget'

// ── Assets — installed from Figma archive 27:5945 ──────────────────────────
const imgHero      = '/assets/41e8a.png'   // bungalow cover photo

// Gallery images
const imgGallery1  = '/assets/4e866.svg'
const imgGallery2  = '/assets/f4dd6.svg'
const imgGallery3  = '/assets/e27ba.svg'

// Equipament icons — installed from Figma nodes 33:22, 33:24, 33:26, 33:30
const imgIconSofa    = '/assets/c0dce.svg'
const imgIconKitchen = '/assets/1f088.svg'
const imgIconShower  = '/assets/e86ec.svg'
const imgIconTerrace = '/assets/872fa.svg'

// Carousel arrow button — shared style matching the floating scroll-up button
const arrowBtnCls = 'flex items-center justify-center size-[48px] rounded-full shrink-0 hover:opacity-90 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2'
const arrowBtnStyle = { background: 'var(--color-primary)', boxShadow: '0 4px 20px rgba(59,37,26,0.20)' } as const

// Stat icons — reused from AllotjamentsPage pattern
const iconCircle   = '/assets/d1260.svg'
const iconUser     = '/assets/6757f.svg'
const iconBed      = '/assets/bf9d4.svg'
const iconSize     = '/assets/391af.svg'

// Other accommodation images (already in public/assets)
const imgTinyHome    = '/assets/2f75a.png'
const imgHobbitXL    = '/assets/6e9af.png'
const imgHobbit      = '/assets/ba81c.png'
const imgMiniHobbit  = '/assets/99292.png'
const imgGlamping    = '/assets/670bc.png'

// ── Intro feature stats — verbatim values from Figma 27:5970 ───────────────
const FEATURES = [
  { icon: iconUser, label: '5 pax' },
  { icon: iconBed,  label: '1 llit doble' },
  { icon: iconBed,  label: '3 llits individuals' },
  { icon: iconSize, label: '52m²' },
]

// ── Equipament items — verbatim from Figma 27:5947; icons from 33:22–33:30 ─
const EQUIPAMENT = [
  { label: 'Sofà llit',                icon: imgIconSofa    },
  { label: 'Cuina equipada',           icon: imgIconKitchen },
  { label: '1 bany amb dutxa o banyera', icon: imgIconShower },
  { label: 'Terrassa',                 icon: imgIconTerrace },
]

// ── Other accommodations for the related carousel — verbatim from 27:5997 ──
const OTHER_ACCS = [
  {
    id: 'tiny-home',
    image: imgTinyHome,
    title: 'Tiny home',
    description: 'Petita casa acollidora, amb cuina, llit de matrimoni, sofà llit individual, taula office, calefacció i lavabo complet.',
    guests: 4, beds: 3, size: '36 m²',
  },
  {
    id: 'hobbit-xl',
    image: imgHobbitXL,
    title: 'Hòbbit XL',
    description: 'Hòbbit XL de fusta amb llit de matrimoni, llit individual, microones, nevera, bany amb dutxa, calefacció i terrassa.',
    guests: 3, beds: 2, size: '48 m²',
  },
  {
    id: 'hobbit',
    image: imgHobbit,
    title: 'Hòbbit',
    description: 'Hòbbit de fusta amb microones, nevera, taula amb cadires, calefacció i lavabo. Amb vistes al prepirineu',
    guests: 3, beds: 2, size: '40 m²',
  },
  {
    id: 'mini-hobbit',
    image: imgMiniHobbit,
    title: 'Mini Hòbbit',
    description: 'Mini hòbbit de fusta amb llit de matrimoni o dos llits individuals, calefacció i un petit porxo.',
    guests: 2, beds: 2, size: '32 m²',
  },
  {
    id: 'glamping',
    image: imgGlamping,
    title: 'Tenda Glamping Safari',
    description: 'Per dues persones, equipades amb un llit de matrimoni, mini armari per la roba, terrassa i taula exterior de fusta.',
    guests: 2, beds: 1, size: '34 m²',
  },
]

// ── Related Accommodation Card — always shows CTA (no hover-hide) ──────────
// using custom card: same full-bleed overlay design as AllotjamentsPage AccommodationCard
function AccommodationCard({
  image, title, description, guests, beds, size, id,
}: (typeof OTHER_ACCS)[number]) {
  return (
    <article
      className="group relative rounded-2xl overflow-hidden shrink-0"
      style={{ width: 278, height: 416 }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] from-0% to-[rgba(0,0,0,0.18)] to-[49.5%]" />

      {/* Stats row */}
      <div className="absolute top-0 right-0 left-0 p-6 flex items-center justify-end gap-4">
        {[
          { icon: iconUser, value: guests, stat: 'guests' },
          { icon: iconBed,  value: beds,   stat: 'beds' },
          { icon: iconSize, value: size,   stat: 'size' },
        ].map(({ icon, value, stat }) => (
          <div key={stat} className="flex items-center gap-1.5">
            <div className="relative size-[34px] shrink-0 flex items-center justify-center">
              <img src={iconCircle} alt="" aria-hidden className="absolute inset-0 size-full block" />
              <img src={icon} alt="" aria-hidden className="relative z-10 size-[16px] block" />
            </div>
            <span className="font-body font-bold text-[14px] text-white leading-6">{value}</span>
          </div>
        ))}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-heading font-bold text-white m-0" style={{ fontSize: 22, lineHeight: '28px' }}>
            {title}
          </h3>
          <p className="font-body text-white/90 leading-6 m-0 line-clamp-3" style={{ fontSize: 14 }}>
            {description}
          </p>
        </div>
        {/* CTA — collapsed by default; expands on hover, matching AllotjamentsPage behavior */}
        <Link
          to={`/allotjaments#${id}`}
          onClick={(e) => e.preventDefault()}
          className="self-start border-2 border-white text-white font-body font-bold text-[14px] px-6 py-3 rounded-full overflow-hidden max-h-0 opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 transition-[max-height,opacity] duration-500 ease-in-out hover:bg-white hover:text-dark"
        >
          Veure allotjament
        </Link>
      </div>
    </article>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BungalowTradPage() {
  const [isFixed, setIsFixed] = useState(false)
  const [isBookingSticky, setIsBookingSticky] = useState(false)
  const bookingRef = useRef<HTMLDivElement>(null)
  const [relatedIdx, setRelatedIdx] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setIsFixed(window.scrollY > 300)
      if (bookingRef.current) {
        const rect = bookingRef.current.getBoundingClientRect()
        setIsBookingSticky(rect.bottom <= 62)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visibleRelated = [
    OTHER_ACCS[relatedIdx % OTHER_ACCS.length],
    OTHER_ACCS[(relatedIdx + 1) % OTHER_ACCS.length],
    OTHER_ACCS[(relatedIdx + 2) % OTHER_ACCS.length],
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* ─── FIXED COMPACT HEADER ────────────────────────────────────────── */}
      <FixedCompactHeader isVisible={isFixed} />

      {/* ─── STICKY BOOKING BAR ──────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 right-0 z-[55] transition-transform duration-200 ease-in-out ${isBookingSticky ? 'translate-y-[62px]' : '-translate-y-full'}`}
        style={{ background: 'var(--color-bg)', boxShadow: '0 4px 20px rgba(59,37,26,0.12)', borderTop: '1px solid rgba(59,37,26,0.07)' }}
        aria-hidden={!isBookingSticky}
      >
        <BookingWidget variant="sticky" />
      </div>

      {/* ─── HERO ────────────────────────────────────────────────────────────
           Inner-page hero — identical template to AllotjamentsPage hero.
           Cover: bungalow photo 41e8a.png (Figma node I27:5996;6015:27295).
           Breadcrumb: "Inici › Allotjament › Bungalow tradicional" (27:I5996;19:718).
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: '700px' }}>
        <img
          src={imgHero}
          alt="Bungalow tradicional — Càmping Vidrà"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.65) 100%)' }}
        />
        <SiteStaticHeader />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center pt-[180px] pb-48 px-8 gap-3">
          {/* Breadcrumb — verbatim from Figma node I27:5996;19:718 */}
          <p className="font-body font-normal text-white/70 text-[16px] leading-normal m-0">
            Inici &rsaquo; Allotjament &rsaquo; Bungalow tradicional
          </p>
          {/* H1 — verbatim from Figma node I27:5996;18:628 */}
          <h1
            className="font-heading font-bold text-white m-0 leading-[1.04]"
            style={{ fontSize: 'clamp(48px, 6vw, 72px)' }}
          >
            Bungalow tradicional
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-[1440px] mx-auto px-12">
            <BookingWidget ref={bookingRef} variant="default" />
          </div>
        </div>
      </section>

      {/* ─── INTRO SECTION ───────────────────────────────────────────────────
           Verbatim from Figma node 27:5970. pt-36 absorbs BookingWidget overlap.
           Label: "ALLOTJAMENT" (27:5973). H2: "Bungalow tradicional" (27:5974).
           Body: 27:5971. Feature stats: 27:5975.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-16">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col items-center text-center gap-4">
          <p
            className="font-heading font-bold text-dark uppercase tracking-wide m-0"
            style={{ fontSize: 24, lineHeight: '32px' }}
          >
            ALLOTJAMENT
          </p>
          <h2
            className="font-heading font-bold text-dark m-0"
            style={{ fontSize: 40, lineHeight: '52px' }}
          >
            Bungalow tradicional
          </h2>
          <p
            className="font-body text-dark leading-relaxed m-0 max-w-[920px]"
            style={{ fontSize: 16 }}
          >
            Todos ellos equipados con calefacción y una amplia terraza donde podrá disfrutar de la tranquilidad de la zona; cocina perfectamente equipada, microondas incluido; lavabo con bañera que no incluye toallas. Pero se pueden alquilar.
          </p>

          {/* Feature stats — 4 items: pax, llit doble, llits individuals, m² */}
          <div className="flex items-start justify-center gap-16 pt-10">
            {FEATURES.map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="relative size-[64px] shrink-0 flex items-center justify-center">
                  <img src={iconCircle} alt="" aria-hidden className="absolute inset-0 size-full block" />
                  <img src={icon} alt="" aria-hidden className="relative z-10 size-[28px] block" />
                </div>
                <span className="font-body text-dark text-[14px] leading-6">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHOTO GALLERY ───────────────────────────────────────────────────
           3-image full-viewport-width gallery from Figma node 27:5964.
           Left: 4e866.svg, Center: f4dd6.svg (dominant), Right: e27ba.svg.
           Arrows: 995f5.svg (prev), a74b0.svg (next).
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden translate-y-[116px]" style={{ height: 530 }}>
        <div className="absolute inset-0 flex justify-center gap-6">
          <div className="w-[calc(50%-400px-12px)] shrink-0 overflow-hidden rounded-r-[24px] rounded-l-none">
            <img src={imgGallery1} alt="" aria-hidden className="w-full h-full object-cover" />
          </div>
          <div className="w-[800px] shrink-0 overflow-hidden rounded-[24px]">
            <img src={imgGallery2} alt="Interior bungalow" className="w-full h-full object-cover" />
          </div>
          <div className="w-[calc(50%-400px-12px)] shrink-0 overflow-hidden rounded-l-[24px] rounded-r-none">
            <img src={imgGallery3} alt="" aria-hidden className="w-full h-full object-cover" />
          </div>
        </div>
        {/* Prev arrow */}
        <button
          type="button"
          aria-label="Imatge anterior"
          className={`absolute left-8 top-1/2 -translate-y-1/2 ${arrowBtnCls}`}
          style={arrowBtnStyle}
        >
          <ArrowLeft size={22} strokeWidth={2.2} className="text-white" />
        </button>
        {/* Next arrow */}
        <button
          type="button"
          aria-label="Imatge següent"
          className={`absolute right-8 top-1/2 -translate-y-1/2 ${arrowBtnCls}`}
          style={arrowBtnStyle}
        >
          <ArrowRight size={22} strokeWidth={2.2} className="text-white" />
        </button>
      </section>

      {/* ─── EQUIPAMENT ──────────────────────────────────────────────────────
           Verbatim from Figma node 27:5947.
           H2 "Equipament" (27:5963). 4 items (27:5949): Sofà llit, Cuina
           equipada, 1 bany amb dutxa o banyera, Terrassa.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-[196px] pb-[96px] px-0" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col items-center gap-16">
          <h2
            className="font-heading font-bold text-dark m-0 text-center"
            style={{ fontSize: 40, lineHeight: '52px' }}
          >
            Equipament
          </h2>
          <div className="flex items-start justify-center gap-16 flex-wrap">
            {EQUIPAMENT.map(({ label, icon }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="relative size-[56px] shrink-0 flex items-center justify-center">
                  <img src={iconCircle} alt="" aria-hidden className="absolute inset-0 size-full block" />
                  <img src={icon} alt="" aria-hidden className="relative z-10 size-[28px] block" />
                </div>
                <span className="font-body text-dark leading-normal" style={{ fontSize: 16 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width SVG wave right below Equipament section */}
      <div className="w-full leading-none overflow-hidden -mt-1 bg-transparent">
        <img src={navWave} alt="" aria-hidden className="w-full h-auto block scale-y-[-1]" />
      </div>

      {/* ─── ALTRES ALLOTJAMENTS ─────────────────────────────────────────────
           Verbatim from Figma node 27:5997.
           Left: label "ALLOTJAMENTS" (27:6005), H2 "Coneix els altres
           allotjaments" (27:6006), body (27:6007), CTA → /allotjaments (27:6008).
           Right: 3 related AccommodationCards with carousel controls.
      ──────────────────────────────────────────────────────────────────────── */}
      {/* Bleed-right carousel section: full-viewport-width row so the carousel
           extends to the screen edge on all sizes. paddingLeft mirrors the
           standard max-width container's left content edge (px-16 + centering
           offset). Card widths are overridden to always show exactly 2.5 cards,
           guaranteeing the third card is clipped at the viewport right edge
           regardless of screen width. */}
      <section className="py-24 overflow-hidden">
        <div
          className="flex items-center gap-16"
          style={{ paddingLeft: 'max(4rem, calc((100vw - 1440px) / 2 + 4rem))' }}
        >

          {/* Left text column */}
          <div className="flex flex-col gap-6 shrink-0" style={{ width: 440 }}>
            <div className="flex flex-col gap-2">
              <p
                className="font-heading font-bold text-dark uppercase m-0"
                style={{ fontSize: 24, lineHeight: '32px' }}
              >
                ALLOTJAMENTS
              </p>
              <h2
                className="font-heading font-bold text-dark m-0"
                style={{ fontSize: 40, lineHeight: '52px' }}
              >
                Coneix els altres allotjaments
              </h2>
            </div>
            <p
              className="font-body text-dark leading-normal m-0"
              style={{ fontSize: 16 }}
            >
              Gaudeix d&#39;una estada única en bungalows a una acollidora Tiny Home, els originals Hobbits XL, Hobbits i Mini Hobbits, així com a les exòtiques tendes Safari Glamping, on les teves vacances a la natura serán molt confortables
            </p>

            {/* Carousel prev/next controls */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                aria-label="Allotjaments anteriors"
                onClick={() => setRelatedIdx((i) => (i - 1 + OTHER_ACCS.length) % OTHER_ACCS.length)}
                className={arrowBtnCls}
                style={{ background: 'var(--color-primary)' }}
              >
                <ArrowLeft size={22} strokeWidth={2.2} className="text-white" />
              </button>
              <button
                type="button"
                aria-label="Allotjaments següents"
                onClick={() => setRelatedIdx((i) => (i + 1) % OTHER_ACCS.length)}
                className={arrowBtnCls}
                style={{ background: 'var(--color-primary)' }}
              >
                <ArrowRight size={22} strokeWidth={2.2} className="text-white" />
              </button>
            </div>

            {/* CTA → back to all accommodations */}
            <Link
              to="/allotjaments"
              className="self-start px-8 py-4 rounded-full border-2 border-secondary text-secondary font-body font-bold text-[15px] hover:opacity-75 transition-opacity"
            >
              Veure tots els allotjaments
            </Link>
          </div>

          {/* Carousel: flex-1 fills all remaining width to the viewport right edge.
               .bleed-carousel style above sets article width to (100%-3rem)/2.5
               so exactly 2.5 cards are visible; third card is always clipped. */}
          <div className="bleed-carousel flex gap-6 overflow-hidden flex-1 self-center">
            {visibleRelated.map((acc) => (
              <AccommodationCard key={acc.id} {...acc} />
            ))}
          </div>

        </div>
      </section>

      <SiteFooter />

      {/* ─── SCROLL-UP FLOATING BUTTON ─────────────────────────────────────── */}
      {/* using <button>: kit has no FloatingActionButton / ScrollToTop component */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Tornar a dalt"
        className={`fixed bottom-8 right-8 z-[65] flex items-center justify-center size-[48px] rounded-full transition-all duration-300 ease-in-out hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 ${
          isFixed ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ background: 'var(--color-primary)', boxShadow: '0 4px 20px rgba(59,37,26,0.20)' }}
      >
        <ArrowUp size={20} strokeWidth={2.2} style={{ color: 'white' }} />
      </button>

    </div>
  )
}
