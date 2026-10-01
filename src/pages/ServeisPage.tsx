/**
 * ServeisPage — Services page (route "/serveis").
 *
 * Sections: inner-page Hero (BookingWidget), Intro, alternating MediaText sections
 * (Piscines, Supermercat, Parc infantil, Sala familiar), Gastronomia full-bleed
 * banner with GastronomiaPopup side drawer, Altres serveis AmenitiesGrid (Kit).
 *
 * GastronomiaPopup: fixed right-side drawer (50vw), slides in with a dark backdrop.
 * Triggered by the "Veure més" button inside the Gastronomia section.
 *
 * Layout notes:
 * - IconBadge is a small shared component (circular primary-green bg, white icon)
 *   used as a section-heading accent. Matches the .amenities-override icon style.
 * - AmenitiesGrid uses .amenities-override CSS class for the same circular icon treatment.
 * - Gastronomia banner uses a pre-masked PNG (29197.png) for the zigzag edge effect.
 */
import { useEffect, useRef, useState } from 'react'
import {
  ArrowUp,
  Waves,
  ShoppingBag,
  Baby,
  Sofa,
  Gamepad2,
  Car,
  WashingMachine,
  Flame,
  ConciergeBell,
  Building2,
} from 'lucide-react'
import { Link } from 'react-router'
import { SiteStaticHeader, FixedCompactHeader } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { BookingWidget } from '../components/BookingWidget'
import { AmenitiesGrid } from '@make-kits/digital-agency-kit/dist/app/components/AmenitiesGrid.js'

// ── Assets ────────────────────────────────────────────────────────────────────
// Hero cover photo — from Figma node 40:15
const heroCover     = '/assets/5be8f.png'
// Gastronomia subsection photos — from Figma node 37:221 archive
const imgGelateria  = '/assets/24c74.png'
const imgRestaurant = '/assets/37a54.png'
// Section photos — from Figma
const imgPiscines      = '/assets/da42c.svg'
const imgSupermercat   = '/assets/301d6.png'
const imgParcInfantil  = '/assets/0bb82.svg'
const imgSalaFamiliar  = '/assets/60102.svg'

// ── Reusable section icon badge ───────────────────────────────────────────────
// Matches the circular bg-primary icon style used in .amenities-override globally
function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-center size-[54px] rounded-full shrink-0"
      style={{ background: 'var(--color-primary)' }}
    >
      {children}
    </div>
  )
}

// ── Gastronomia side popup — Figma node 43:72 ────────────────────────────────
const imgCloseIcon   = '/assets/625a3.svg'
const imgRestaurantP = '/assets/37a54.png'
const imgGelateriaP  = '/assets/24c74.png'

function GastronomiaPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Overlay */}
      {/* using <div>: kit has no modal/drawer overlay primitive */}
      <div
        className={`fixed inset-0 z-[89] bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden
        onClick={onClose}
      />

      {/* Slide-in panel */}
      {/* using <aside>: kit has no SideDrawer / SlidePanel component */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Gastronomia"
        className={`fixed right-0 top-0 z-[90] min-h-[100dvh] w-[50vw] overflow-y-auto transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--color-bg)' }}
      >
        {/* Close button — top-right, primary-green circle with X icon */}
        {/* using <button>: kit has no CloseButton/IconButton variant matching this style */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tancar"
          className="absolute top-8 right-8 z-10 flex items-center justify-center size-[54px] rounded-full shrink-0 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
          style={{ background: 'var(--color-primary)' }}
        >
          <img src={imgCloseIcon} alt="" aria-hidden width={34} height={34} />
        </button>

        {/* Content — two rows matching Figma 43:72 */}
        <div className="flex flex-col gap-20 px-24 py-24 pt-28">

          {/* Row 1: text left, image right */}
          <div className="flex items-center justify-between gap-12">
            <div className="flex flex-col gap-6 max-w-[396px]">
              <p
                className="font-heading font-bold text-dark m-0"
                style={{ fontSize: 26, lineHeight: '33.8px' }}
              >
                Restaurant El Cabirol
              </p>
              <p
                className="font-body font-normal text-grey m-0"
                style={{ fontSize: 16, lineHeight: '26px' }}
              >
                Bar restaurant amb terrassa on menjar alguna cosa, prendre begudes i descansar
                després d&apos;un dia gaudint del càmping i l&apos;entorn natural proper
              </p>
            </div>
            <div
              className="shrink-0 rounded-2xl overflow-hidden w-[320px] aspect-[4/3]"
            >
              <img
                src={imgRestaurantP}
                alt="Restaurant El Cabirol"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Row 2: image left, text right */}
          <div className="flex items-center justify-between gap-12">
            <div
              className="shrink-0 rounded-2xl overflow-hidden w-[320px] aspect-[4/3]"
            >
              <img
                src={imgGelateriaP}
                alt="Gelateria Carté D'Or"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-6 max-w-[396px]">
              <p
                className="font-heading font-bold text-dark m-0"
                style={{ fontSize: 26, lineHeight: '33.8px' }}
              >
                Gelateria Carté D&apos;Or
              </p>
              <p
                className="font-body font-normal text-grey m-0"
                style={{ fontSize: 16, lineHeight: '26px' }}
              >
                Som l&apos;únic i el primer càmping a tota Espanya en inplementar una
                franquícia Carte D&apos;Or dins el càmping, oferint gelats de qualitat
                durant la vostra estada.
              </p>
            </div>
          </div>

        </div>
      </aside>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ServeisPage() {
  const [isFixed, setIsFixed] = useState(false)
  const [isBookingSticky, setIsBookingSticky] = useState(false)
  const [isGastroOpen, setIsGastroOpen] = useState(false)
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

      {/* ─── FIXED COMPACT HEADER ──────────────────────────────────────────── */}
      <FixedCompactHeader isVisible={isFixed} />

      {/* ─── STICKY BOOKING BAR ────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 right-0 z-[55] transition-transform duration-200 ease-in-out ${
          isBookingSticky ? 'translate-y-[62px]' : '-translate-y-full'
        }`}
        style={{
          background: 'var(--color-bg)',
          boxShadow: '0 4px 20px rgba(59,37,26,0.12)',
          borderTop: '1px solid rgba(59,37,26,0.07)',
        }}
        aria-hidden={!isBookingSticky}
      >
        <BookingWidget variant="sticky" />
      </div>

      {/* ─── HERO ──────────────────────────────────────────────────────────────
           Inner-page hero: 700px, full-bleed cover image.
           Breadcrumb: Inici › Serveis. H1 verbatim from Figma intro section.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: '700px' }}>
        <img
          src={heroCover}
          alt="Serveis — Càmping Vidrà"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.65) 100%)',
          }}
        />
        <SiteStaticHeader />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center pt-[180px] pb-48 px-8 gap-3">
          <p className="font-body font-normal text-white/70 text-[16px] leading-normal m-0">
            Inici &rsaquo; Serveis
          </p>
          <h1
            className="font-heading font-bold text-white m-0 leading-[1.04]"
            style={{ fontSize: 'clamp(48px, 6vw, 72px)' }}
          >
            Serveis
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-[1440px] mx-auto px-12">
            <BookingWidget ref={bookingRef} variant="default" />
          </div>
        </div>
      </section>

      {/* ─── INTRO ─────────────────────────────────────────────────────────────
           Verbatim from Figma node 37:344 "intro section".
           pt-36 absorbs the BookingWidget translate-y-1/2 overlap.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-24">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col items-center text-center gap-4">
          <p
            className="font-heading font-bold text-dark uppercase tracking-wide m-0"
            style={{ fontSize: 24, lineHeight: '32px' }}
          >
            Càmping Vidrà
          </p>
          <h2
            className="font-heading font-bold text-dark m-0"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.05' }}
          >
            Els nostres serveis
          </h2>
          <p
            className="font-body text-grey leading-relaxed m-0 max-w-[920px]"
            style={{ fontSize: 16 }}
          >
            El Càmping Vidrà ofereix un Supermercat, Gelateria Carté D&apos;Or, Bar-Restaurant, 2 piscines, parc infantil, serveis complets, sala jocs, sala familiar i barbacoes.
          </p>
        </div>
      </section>

      {/* ─── PISCINES ──────────────────────────────────────────────────────────
           Figma node 37:331. Image left, text right.
           Verbatim H2 and body from node 37:341 and 37:342.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img
              src={imgPiscines}
              alt="Piscines del Càmping Vidrà"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-5">
              <IconBadge>
                <Waves size={26} strokeWidth={1.8} className="text-white" />
              </IconBadge>
              <h3
                className="font-heading font-bold text-dark m-0"
                style={{ fontSize: 36, lineHeight: '1.2' }}
              >
                Dos piscines exteriors
              </h3>
            </div>
            <p className="font-body text-grey leading-relaxed m-0" style={{ fontSize: 16 }}>
              El Càmping Vidrà compta amb dues piscines exteriors: una de gran per a adults i una
              altra infantil, perfectes per refrescar-se i relaxar-se amb vistes a la natura.
            </p>
          </div>
        </div>
      </section>

      {/* ─── GASTRONOMIA ───────────────────────────────────────────────────────
           Figma node 42:40. Full-bleed food photo (29197.png) — the PNG already
           carries the zigzag-masked top/bottom edges. Custom fork-knife SVG icon
           inside primary-green badge. White-outlined pill button "Veure més".
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: 548 }}>
        {/* Food photo with baked-in zigzag mask — covers the full section */}
        <img
          src="/assets/29197.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 px-16 py-20">
          {/* Icon badge — primary green bg, custom SVG icon from Figma */}
          <div
            className="flex items-center justify-center size-[54px] rounded-full shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            <img src="/assets/d2828.svg" alt="" aria-hidden width={26} height={26} />
          </div>
          {/* Heading */}
          <h3
            className="font-heading font-bold text-white m-0"
            style={{ fontSize: 36, lineHeight: '1.2' }}
          >
            Gastronomia
          </h3>
          {/* Body */}
          <p
            className="font-body font-normal text-white text-center m-0 max-w-[440px]"
            style={{ fontSize: 16, lineHeight: 'normal' }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur venenatis faucibus
            sollicitudin. Fusce turpis nibh, tempor at tristique non, aliquam nec turpis.
          </p>
          {/* Outlined pill button — matches Figma border-2 border-white style */}
          {/* using <button>: kit has no outlined-pill ghost-on-image variant */}
          <button
            type="button"
            onClick={() => setIsGastroOpen(true)}
            className="flex items-center justify-center px-8 py-4 rounded-full border-2 border-white bg-transparent cursor-pointer transition-colors hover:bg-white/10"
          >
            <span
              className="font-heading font-bold text-white whitespace-nowrap"
              style={{ fontSize: 15, lineHeight: '22.5px' }}
            >
              Veure més
            </span>
          </button>
        </div>
      </section>

      {/* ─── SUPERMERCAT ─────────────────────────────────────────────
           Figma node 37:291. Text left, image right.
           Verbatim heading and body from nodes 37:298 and 37:299.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-5">
              <IconBadge>
                <ShoppingBag size={26} strokeWidth={1.8} className="text-white" />
              </IconBadge>
              <h3
                className="font-heading font-bold text-dark m-0"
                style={{ fontSize: 36, lineHeight: '1.2' }}
              >
                Supermercat
              </h3>
            </div>
            <p className="font-body text-grey leading-relaxed m-0" style={{ fontSize: 16 }}>
              Tenim productes congelats variats i un altre tipus de menjar,
              ideal per gaudir d&apos;una bona alimentació d&apos;una manera còmoda durant la vostra
              estada al càmping.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img
              src="/assets/17eb0.svg"
              alt="Supermercat"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── PARC INFANTIL ─────────────────────────────────────────────────────
           Figma node 37:271. Image left, text right.
           Verbatim heading and body from nodes 37:278 and 37:279.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="p-0">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img
              src={imgParcInfantil}
              alt="Parc infantil del Càmping Vidrà"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-5">
              <IconBadge>
                <Baby size={26} strokeWidth={1.8} className="text-white" />
              </IconBadge>
              <h3
                className="font-heading font-bold text-dark m-0"
                style={{ fontSize: 36, lineHeight: '1.2' }}
              >
                Parc infantil
              </h3>
            </div>
            <p className="font-body text-grey leading-relaxed m-0" style={{ fontSize: 16 }}>
              Tenim un parc infantil, on els nens juguen tranquils mentre les famílies gaudeixen
              de l&apos;entorn natural.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SALA FAMILIAR ─────────────────────────────────────────────────────
           Figma node 37:281. Text left, image right.
           Verbatim heading and body from nodes 37:288 and 37:289.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-5">
              <IconBadge>
                <Sofa size={26} strokeWidth={1.8} className="text-white" />
              </IconBadge>
              <h3
                className="font-heading font-bold text-dark m-0"
                style={{ fontSize: 36, lineHeight: '1.2' }}
              >
                Sala familiar
              </h3>
            </div>
            <p className="font-body text-grey leading-relaxed m-0" style={{ fontSize: 16 }}>
              Sala familiar acollidora amb llar de foc, ideal per jugar en família, compartir
              tardes amb campistes i gaudir d&apos;un ambient càlid.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img
              src={imgSalaFamiliar}
              alt="Sala familiar del Càmping Vidrà"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── ALTRES SERVEIS I INSTAL·LACIONS ───────────────────────────────────
           Figma node 37:223. AmenitiesGrid Kit component wrapped in
           .amenities-override (existing CSS — circular bg-primary icon badges).
           H2 verbatim from node 37:270. Items verbatim from nodes 37:230–37:268.
           New icons follow the homepage Lucide icon style (Waves, Utensils, ShoppingBag).
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative py-24" style={{ background: 'var(--color-surface)' }}>
        {/* SVG separator shape pointing upwards at top of section — Figma node 43:152 */}
        <div className="absolute inset-x-0 -top-[61px] h-[62px] overflow-hidden pointer-events-none w-full" style={{ lineHeight: 0 }}>
          <img
            src="/assets/c4ade.svg"
            alt=""
            aria-hidden
            className="w-full h-full block"
            style={{ objectFit: 'fill' }}
          />
        </div>
        <div className="max-w-[1440px] mx-auto px-16">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.05' }}
            >
              Altres serveis i instal·lacions
            </h2>
          </div>
          <div className="amenities-override">
            <AmenitiesGrid
              items={[
                {
                  icon: <Gamepad2 size={30} strokeWidth={1.6} />,
                  label: 'Sala de jocs i ping-pong',
                  description:
                    'Sala de jocs amb una taula de ping-pong, un futbolí i una taula de billar per passar una bona estona en qualsevol moment.',
                },
                {
                  icon: <ConciergeBell size={30} strokeWidth={1.6} />,
                  label: 'Servei de recepció',
                  description:
                    "Servei de recepció del Càmping Vidrà obert de 9h a 22.30h, oferint informació turística i assistència als clients durant l'estada.",
                },
                {
                  icon: <Building2 size={30} strokeWidth={1.6} />,
                  label: 'Dos mòduls de serveis',
                  description:
                    'Tenim dos mòduls de serveis, amb dutxes, aigüeres, lavabos i una rentadora industrial que garanteixen comoditat, neteja i accessibilitat per als campistes.',
                },
                {
                  icon: <Car size={30} strokeWidth={1.6} />,
                  label: 'Aparcament',
                  description:
                    'Aparcament davant de cada allotjament i zona exterior al costat de recepció per a més comoditat dels clients',
                },
                {
                  icon: <WashingMachine size={30} strokeWidth={1.6} />,
                  label: 'Rentadora',
                  description:
                    'Servei de bugaderia amb una rentadora de 10kg, pràctic, còmode i ideal per a estades llargues.',
                },
                {
                  icon: <Flame size={30} strokeWidth={1.6} />,
                  label: 'Zona de barbacoes',
                  description:
                    'El càmping compta amb tres zones de barbacoes en una zona habilitada',
                },
              ]}
            />
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
          isFixed
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ background: 'var(--color-primary)', boxShadow: '0 4px 20px rgba(59,37,26,0.20)' }}
      >
        <ArrowUp size={20} strokeWidth={2.2} style={{ color: 'white' }} />
      </button>

      {/* ─── GASTRONOMIA SIDE POPUP ─────────────────────────────────────────── */}
      <GastronomiaPopup open={isGastroOpen} onClose={() => setIsGastroOpen(false)} />

    </div>
  )
}
