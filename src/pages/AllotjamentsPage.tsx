/**
 * AllotjamentsPage — Accommodation listing page (route "/allotjaments").
 *
 * Sections: inner-page Hero (700px min-height, BookingWidget), Intro text block,
 * Accommodation Cards grid (3-col desktop, 2-col tablet, 1-col mobile).
 *
 * AccommodationCard is a custom full-bleed overlay card (image behind text).
 * The Kit's AccommodationCard uses a top-image + below-content layout and has
 * no overlay variant, so this custom implementation is required.
 *
 * Card hover behaviour: CTA button expands from max-h-0 → max-h-[80px] so the
 * heading/description content is pushed upward without layout reflow.
 *
 * Layout notes:
 * - ACCOMMODATIONS data array drives the card grid — update content there.
 * - Cards with a `to` prop render a <Link>; others render a plain <a href="#">.
 * - All card CTA clicks call preventDefault (links are not yet live).
 */
import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router'
import { SiteStaticHeader, FixedCompactHeader } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { BookingWidget } from '../components/BookingWidget'

// Page-specific assets
const heroCover = '/assets/06292.png'

// Accommodation card images — verbatim from Figma frame 22:2498
const imgBungalow    = '/assets/a71ed.png'
const imgTinyHome    = '/assets/2f75a.png'
const imgHobbitXL   = '/assets/6e9af.png'
const imgHobbit     = '/assets/ba81c.png'
const imgMiniHobbit = '/assets/99292.png'
const imgGlamping   = '/assets/670bc.png'

// Card meta icons — updated from Figma frame 27:3200
const iconCircle = '/assets/d1260.svg'
const iconUser   = '/assets/6757f.svg'
const iconBed    = '/assets/bf9d4.svg'
const iconSize   = '/assets/391af.svg'

// ── Accommodation data — verbatim copy from Figma frame 22:2498 ──────────────
const ACCOMMODATIONS = [
  {
    id: 'bungalow',
    image: imgBungalow,
    title: 'Bungalow tradicional',
    description: 'Bungalow per a cinc persones, amb cuina, menjador, bany complet , calefacció i terrassa.',
    guests: 5,
    beds: 4,
    size: '52 m²',
    to: '/allotjaments/bungalow-tradicional',
  },
  {
    id: 'tiny-home',
    image: imgTinyHome,
    title: 'Tiny home',
    description: 'Petita casa acollidora, amb cuina, llit de matrimoni, sofà llit individual, taula office, calefacció i lavabo complet.',
    guests: 4,
    beds: 3,
    size: '36 m²',
  },
  {
    id: 'hobbit-xl',
    image: imgHobbitXL,
    title: 'Hòbbit XL',
    description: 'Hòbbit XL de fusta amb llit de matrimoni, llit individual, microones, nevera, bany amb dutxa, calefacció i terrassa.',
    guests: 3,
    beds: 2,
    size: '48 m²',
  },
  {
    id: 'hobbit',
    image: imgHobbit,
    title: 'Hòbbit',
    description: 'Hòbbit de fusta amb microones, nevera, taula amb cadires, calefacció i lavabo. Amb vistes al prepirineu',
    guests: 3,
    beds: 2,
    size: '40 m²',
  },
  {
    id: 'mini-hobbit',
    image: imgMiniHobbit,
    title: 'Mini Hòbbit',
    description: 'Mini hòbbit de fusta amb llit de matrimoni o dos llits individuals, calefacció i un petit porxo.',
    guests: 2,
    beds: 2,
    size: '32 m²',
  },
  {
    id: 'glamping',
    image: imgGlamping,
    title: 'Tenda Glamping Safari',
    description: 'Per dues persones, equipades amb un llit de matrimoni, mini armari per la roba, terrassa i taula exterior de fusta.',
    guests: 2,
    beds: 1,
    size: '34 m²',
  },
]

// ── Accommodation Card ────────────────────────────────────────────────────────
// using custom card: kit AccommodationCard is a top-image + below-content card
// and has no full-bleed image overlay variant — Figma design requires full-bleed
// image with overlay gradient, top-right stats, and bottom text+CTA.
function AccommodationCard({
  id,
  image,
  title,
  description,
  guests,
  beds,
  size,
  to,
}: (typeof ACCOMMODATIONS)[number]) {
  return (
    <article
      id={id}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ aspectRatio: '278 / 416' }}
    >
      {/* Full-bleed background image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      {/* Gradient overlay — dark bottom to transparent top, verbatim from Figma 27:3200 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] from-0% to-[rgba(0,0,0,0.18)] to-[49.5%]" />

      {/* Top stats row — guests · beds · size; icons from Figma 27:3200 */}
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

      {/* Bottom content — title, description, CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <h3 className="font-heading font-bold text-white m-0" style={{ fontSize: 26, lineHeight: '33.8px' }}>
            {title}
          </h3>
          <p className="font-body text-white/90 leading-6 m-0" style={{ fontSize: 16 }}>
            {description}
          </p>
        </div>

        {/* CTA — collapsed to 0 height by default; expands on hover, pushing heading+p upward */}
        {/* Link when a detail page exists, anchor otherwise; pill rounded-full per style source */}
        {to ? (
          <Link
            to={to}
            onClick={(e) => e.preventDefault()}
            className="self-start border-2 border-white text-white font-body font-bold text-[15px] px-8 py-4 rounded-full overflow-hidden max-h-0 opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 transition-[max-height,opacity] duration-500 ease-in-out hover:bg-white hover:text-dark"
          >
            Veure allotjament
          </Link>
        ) : (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="self-start border-2 border-white text-white font-body font-bold text-[15px] px-8 py-4 rounded-full overflow-hidden max-h-0 opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 transition-[max-height,opacity] duration-500 ease-in-out hover:bg-white hover:text-dark"
          >
            Veure allotjament
          </a>
        )}
      </div>
    </article>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AllotjamentsPage() {
  const [isFixed, setIsFixed] = useState(false)
  const [isBookingSticky, setIsBookingSticky] = useState(false)
  const bookingRef = useRef<HTMLDivElement>(null)

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
           Inner-page hero: 700px tall, full-bleed cover image.
           Background: page cover image from Figma node 22:2510 (06292.png).
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: '700px' }}>
        <img
          src={heroCover}
          alt="Allotjaments — Càmping Vidrà"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.65) 100%)' }}
        />

        {/* Static nav (painted over hero, not fixed) */}
        <SiteStaticHeader />

        {/* Hero title */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center pt-[180px] pb-48 px-8 gap-3">
          {/* Breadcrumb — verbatim from Figma node I22:2510;19:718 */}
          <p className="font-body font-normal text-white/70 text-[16px] leading-normal m-0">
            Inici &rsaquo; Allotjaments
          </p>
          {/* H1 — verbatim from Figma node I22:2510;18:628 */}
          <h1
            className="font-heading font-bold text-white m-0 leading-[1.04]"
            style={{ fontSize: 'clamp(48px, 6vw, 72px)' }}
          >
            Allotjaments
          </h1>
        </div>

        {/* Booking widget — half-overlapping the section border */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-[1440px] mx-auto px-12">
            <BookingWidget ref={bookingRef} variant="default" />
          </div>
        </div>
      </section>

      {/* ─── INTRO SECTION ───────────────────────────────────────────────────
           Verbatim from Figma node 22:2505 / 22:2506 / 22:2507.
           pt-36 absorbs the BookingWidget's translate-y-1/2 overlap.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-24 md:pt-36 pb-10 md:pb-16">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 flex flex-col items-center text-center gap-4">
          {/* Label — verbatim "ALLOTJAMENTS" from Figma node 22:2508 */}
          <p className="font-heading font-bold text-dark uppercase tracking-wide m-0" style={{ fontSize: 24, lineHeight: '32px' }}>
            Allotjaments
          </p>
          {/* Heading — verbatim from Figma node 22:2509 */}
          <h2
            className="font-heading font-bold text-dark m-0"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.05' }}
          >
            Els nostres allotjaments
          </h2>
          {/* Body — verbatim from Figma node 22:2506 */}
          <p
            className="font-body text-grey leading-relaxed m-0 max-w-[920px]"
            style={{ fontSize: 16 }}
          >
            Gaudeix d'una estada única en bungalows a una acollidora Tiny Home, els originals Hobbits XL, Hobbits i Mini Hobbits, així com a les exòtiques tendes Safari Glamping, on les teves vacances a la natura serán molt confortables
          </p>
        </div>
      </section>

      {/* ─── ACCOMMODATION CARDS GRID ─────────────────────────────────────────
           6 cards in a 3-column grid (3×2) — verbatim from Figma node 22:2498.
           Mobile: single column. Tablet: 2 columns. Desktop: 3 columns.
           Kit AccommodationCard: top-image + content-below layout, no overlay
           variant — full-bleed overlay design requires custom implementation.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACCOMMODATIONS.map((acc) => (
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
