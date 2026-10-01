/**
 * App — Homepage (route "/")
 *
 * Sections: Hero (full-viewport with BookingWidget), Intro (media+text),
 * Allotjaments (2-banner hover cards), Serveis (AmenitiesGrid Kit),
 * Entorn (media+text), Contacte (info panel + Google Maps iframe), Footer.
 *
 * Layout notes:
 * - SiteStaticHeader is position:absolute over the hero — not fixed.
 * - FixedCompactHeader slides in from top after 25dvh scroll (z-[60]).
 * - Sticky BookingWidget bar sits at z-[55] below the fixed header.
 * - Scroll-to-top FAB appears together with the fixed header (z-[65]).
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AmenitiesGrid } from '@make-kits/digital-agency-kit/dist/app/components/AmenitiesGrid.js'
import {
  ArrowUp,
  Mail,
  Phone,
  ShoppingBag,
  Utensils,
  Waves,
} from 'lucide-react'
import { navWave } from './components/SiteNav'
import { SiteStaticHeader, FixedCompactHeader } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'
import { BookingWidget } from './components/BookingWidget'

const contactSeparator = '/assets/15dfc.svg' // separator wave shape from frame 17:230

// Public assets — served from /public/
const heroCover = '/assets/301d6.png'
const introPhoto = '/assets/9e922.png'
const bungalowImg = '/assets/217c2.png'
const parcellesImg = '/assets/31ed6.png'
const iconBungalow = '/assets/21918.svg'
const iconParcellesEllipse = '/assets/a51b3.svg'
const iconParcellesTent = '/assets/a5f40.svg'
const entornImg =
  'https://images.unsplash.com/photo-1627653422763-27cb851f7fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'



export default function App() {
  const [isFixed, setIsFixed] = useState(false)
  const [isBookingSticky, setIsBookingSticky] = useState(false)
  const bookingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setIsFixed(window.scrollY > window.innerHeight * 0.25)
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

      {/* ─── FIXED COMPACT HEADER — slides in after 25dvh scroll ─────────
           Design reference: Figma frame 13:9 (Fixed SiteNavigation).
      ──────────────────────────────────────────────────────────────────── */}
      <FixedCompactHeader isVisible={isFixed} />

      {/* ─── NAVIGATION ───────────────────────────────────────────────────
           Shared SiteStaticHeader: cream bg + wave + contact strip + nav.
      ──────────────────────────────────────────────────────────────────── */}
      <SiteStaticHeader />

      {/* ─── STICKY BOOKING BAR ──────────────────────────────────────────
           Slides in from behind the fixed nav when the hero booking widget
           scrolls past the 62px nav bottom. Full-width, labels hidden,
           compact height. z-[55] keeps it below the nav's z-[60].
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 right-0 z-[55] transition-transform duration-200 ease-in-out ${isBookingSticky ? 'translate-y-[62px]' : '-translate-y-full'}`}
        style={{ background: 'var(--color-bg)', boxShadow: '0 4px 20px rgba(59,37,26,0.12)', borderTop: '1px solid rgba(59,37,26,0.07)' }}
        aria-hidden={!isBookingSticky}
      >
        <BookingWidget variant="sticky" />
      </div>

      {/* ─── HERO ─────────────────────────────────────────────────────────
           Custom hero: HeroSection Kit component does not support a
           script-font pre-headline slot or an inline booking widget
           container anchored to the bottom of the hero section.
      ──────────────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative flex flex-col" style={{ minHeight: '100svh' }}>
        <img
          src={heroCover}
          alt="Càmping Vidrà"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        {/* Layered gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.72) 100%)',
          }}
        />

        {/* Hero headline */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center pt-[200px] pb-52 px-8 gap-3">
          <p className="font-script text-white leading-none m-0" style={{ fontSize: 42 }}>
            Benvinguts al
          </p>
          <h1
            className="font-heading font-bold text-white m-0 leading-[1.04]"
            style={{ fontSize: 'clamp(52px, 7vw, 86px)' }}
          >
            Càmping Vidrà
          </h1>
          <p className="font-body text-text-lg text-white m-0 max-w-[640px] leading-relaxed">
            Gaudeix d'una estada única on les teves vacances a la natura serán molt confortables.
          </p>
        </div>

        {/* ── BOOKING WIDGET ────────────────────────────────────────────
             Custom Witbooking widget: BookingWidgetWitbooking Kit component
             has hardcoded Spanish labels with no Catalan prop override.
             This wrapper reproduces the same field structure (date-range,
             guests, promo, search) with verbatim Catalan copy from the
             wireframe content source.
        ──────────────────────────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-[1440px] mx-auto px-12">
            <BookingWidget ref={bookingRef} variant="default" />
          </div>
        </div>
      </section>

      {/* ─── INTRO ────────────────────────────────────────────────────────
           Custom section: MediaTextBlock Kit component supports only one
           CTA prop; this section requires two CTAs (primary + outlined
           secondary) and a Grand Hotel script label above the heading.
      ──────────────────────────────────────────────────────────────────── */}
      <section id="el-camping">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 pt-16 sm:pt-24 md:pt-36 pb-10 md:pb-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Text column */}
          <div className="col-span-1 md:col-span-6 flex flex-col gap-5">
            <p className="font-script text-primary leading-none m-0" style={{ fontSize: 30 }}>
              Conviure a la natura
            </p>
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.05' }}
            >
              Vine a Càmping Vidrà
            </h2>
            <p className="font-body text-grey leading-relaxed m-0" style={{ fontSize: 17 }}>
              Vine a conviure amb la natura al Càmping Vidrà, envoltat de paisatges verds, aire pur
              i silenci, lluny del soroll de la ciutat, per descansar i gaudir de la
              tranquil·litat.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* using <a>: no Kit button component; pill rounded-full shape per active style source */}
              <a
                href="#allotjaments"
                className="px-8 py-4 rounded-full bg-primary text-white font-body font-bold text-[15px] hover:opacity-90 transition-opacity"
              >
                Consulta tarifes
              </a>
              {/* using <Link>: routes to /el-camping/faqs */}
              <Link
                to="/el-camping/faqs"
                className="px-8 py-4 rounded-full border-2 border-secondary text-secondary font-body font-bold text-[15px] hover:opacity-75 transition-opacity"
              >
                Veure les FAQs
              </Link>
            </div>
          </div>

          {/* Image column */}
          <div className="col-span-1 md:col-span-6">
            <div
              className="rounded-3xl overflow-hidden aspect-[4/3]"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <img
                src={introPhoto}
                alt="Càmping Vidrà — natura i tranquil·litat"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── ALLOTJAMENTS ─────────────────────────────────────────────────
           Figma reference 15:131. Two staggered 380×380 banner cards with
           crossfade between no-hover (content bottom, no CTA) and hover
           (image rotates 15deg, content centers, "Veure més" appears).
           AccommodationCard Kit component has no hover-state or rotate-image
           capability — custom implementation required.
           Mobile: text column first, then banners stacked vertically.
           Desktop: banners side-by-side (staggered), text panel on the right.
      ──────────────────────────────────────────────────────────────────── */}
      <section id="allotjaments">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 pt-10 pb-16 md:pb-[116px] flex flex-col md:flex-row md:items-start gap-6 md:gap-[18px]">

          {/* Text + CTA panel — first on mobile, last on desktop */}
          <div className="order-first md:order-last flex-1 md:self-center flex flex-col gap-5 md:pl-14 md:py-16">
            <p className="font-script text-primary leading-none m-0" style={{ fontSize: 30 }}>
              Allotjaments a la natura
            </p>
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.05' }}
            >
              Gaudeix d'una estada única
            </h2>
            <p className="font-body text-grey leading-relaxed m-0 text-[17px] pt-1">
              Descobreix els allotjaments del Càmping Vidrà: bungalows, hobbits i parcel·les en plena natura al poble de Vidrà. Una experiència única per desconnectar a la natura.
            </p>
          </div>

          {/* Banners group — second on mobile (stacked), first on desktop (side by side) */}
          <div className="order-last md:order-first flex flex-col md:flex-row md:items-start gap-5 md:gap-[18px]">

            {/* ── Bungalows banner ─────────────────────────────────────────
                 No-hover (15:132): content bottom-aligned, icon shown, no CTA.
                 Hover: image scales smoothly (zoom in), content centers, CTA appears.
                 Wired to /allotjaments page.
            ─────────────────────────────────────────────────────────────── */}
            <Link
              to="/allotjaments"
              className="group relative rounded-3xl overflow-hidden cursor-pointer block w-full md:w-[380px] md:h-[380px] md:shrink-0 aspect-square md:aspect-auto"
            >
              <img
                src={bungalowImg}
                alt="Bungalows"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.2]"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.05) 56%)' }}
              />

              {/* Default state — bottom-aligned, no button */}
              <div className="absolute inset-0 p-8 flex flex-col items-center justify-end gap-4 transition-opacity duration-300 group-hover:opacity-0">
                <img src={iconBungalow} alt="" className="size-14 shrink-0" />
                <h3 className="font-heading font-bold text-white text-[30px] text-center leading-[1.1] m-0">
                  Allotjaments
                </h3>
                <p className="font-body text-white/80 text-[16px] text-center leading-[1.42] m-0 pt-2">
                  Gaudeix d'una estada única en bungalows on les teves vacances a la natura seran molt confortables
                </p>
              </div>

              {/* Hover state — centered, button visible */}
              <div className="absolute inset-0 p-8 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <img src={iconBungalow} alt="" className="size-14 shrink-0" />
                <h3 className="font-heading font-bold text-white text-[30px] text-center leading-[1.1] m-0">
                  Bungalows
                </h3>
                <p className="font-body text-white/80 text-[16px] text-center leading-[1.42] m-0 pt-2">
                  Gaudeix d'una estada única en bungalows on les teves vacances a la natura seran molt confortables
                </p>
                <span
                  className="mt-2 border-2 border-white text-white font-body font-bold text-[15px] px-8 py-4 rounded-full group-hover:bg-white group-hover:text-dark transition-colors inline-block"
                >
                  Veure més
                </span>
              </div>
            </Link>

            {/* ── Parcel·les banner ─────────────────────────────────────────
                 Offset 80px lower than Bungalows per Figma stagger (desktop only).
                 Hover state (15:145): tent icon + ellipse, image scaled smoothly, CTA shown.
            ─────────────────────────────────────────────────────────────── */}
            <article
              className="group relative rounded-3xl overflow-hidden cursor-pointer w-full md:w-[380px] md:h-[380px] md:shrink-0 aspect-square md:aspect-auto md:mt-[80px]"
            >
              <img
                src={parcellesImg}
                alt="Parcel·les"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.2]"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.05) 56%)' }}
              />

              {/* Default state — bottom-aligned, no button */}
              <div className="absolute inset-0 p-8 flex flex-col items-center justify-end gap-4 transition-opacity duration-300 group-hover:opacity-0">
                <div className="relative size-14 shrink-0">
                  <img src={iconParcellesEllipse} alt="" className="absolute inset-0 w-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src={iconParcellesTent} alt="" className="size-9" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-white text-[30px] text-center leading-[1.1] m-0">
                  Parcel·les
                </h3>
                <p className="font-body text-white/80 text-[16px] text-center leading-[1.42] m-0 pt-2">
                  Gaudeix de parcel·les standard, parcel·les mirador i parcel·les natura
                </p>
              </div>

              {/* Hover state — centered, button visible */}
              <div className="absolute inset-0 p-8 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <div className="relative size-14 shrink-0">
                  <img src={iconParcellesEllipse} alt="" className="absolute inset-0 w-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src={iconParcellesTent} alt="" className="size-9" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-white text-[30px] text-center leading-[1.1] m-0">
                  Parcel·les
                </h3>
                <p className="font-body text-white/80 text-[16px] text-center leading-[1.42] m-0 pt-2">
                  Gaudeix de parcel·les standard, parcel·les mirador i parcel·les natura
                </p>
                {/* using <a>: no Kit component; pill rounded-full CTA per style source */}
                <a
                  href="#"
                  className="mt-2 border-2 border-white text-white font-body font-bold text-[15px] px-8 py-4 rounded-full hover:bg-white hover:text-dark transition-colors"
                >
                  Veure més
                </a>
              </div>
            </article>

          </div>

        </div>
      </section>

      {/* ─── SERVEIS ──────────────────────────────────────────────────────
           AmenitiesGrid Kit component — used for semantic item grid.
           Icon containers restyled to circular bg-primary via
           .amenities-override CSS rules in index.css (uses CSS variables).
      ──────────────────────────────────────────────────────────────────── */}
      <section id="serveis" className="bg-bg relative">
        {/* Top wave — flipped vertically, protrudes above the section border into the section above */}
        <div className="absolute inset-x-0 top-0 -translate-y-full overflow-hidden h-[62px] pointer-events-none">
          <img src={navWave} alt="" aria-hidden className="w-full h-full object-cover block" />
        </div>

        <div className="max-w-[1440px] mx-auto px-16 py-24">
          {/* Section header */}
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <p className="font-script text-primary leading-none m-0" style={{ fontSize: 30 }}>
              El càmping
            </p>
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.05' }}
            >
              Serveis i instal·lacions
            </h2>
            <p
              className="font-body text-grey leading-relaxed m-0"
              style={{ fontSize: 17, maxWidth: 580 }}
            >
              El Càmping Vidrà ofereix un Supermercat, Gelateria Carté D'Or, Bar-Restaurant, 2
              piscines, parc infantil, serveis complets, sala jocs, sala familiar i barbacoes.
            </p>
          </div>

          <div className="amenities-override">
            <AmenitiesGrid
              items={[
                {
                  icon: <Waves size={30} strokeWidth={1.6} />,
                  label: 'Piscines',
                  description:
                    'Perfectes per refrescar-se i relaxar-se amb vistes a la natura',
                },
                {
                  icon: <Utensils size={30} strokeWidth={1.6} />,
                  label: 'El Cabirol',
                  description:
                    'Bar restaurant amb terrassa on menjar alguna cosa, prendre begudes i descansar',
                },
                {
                  icon: <ShoppingBag size={30} strokeWidth={1.6} />,
                  label: 'Supermercat',
                  description:
                    "Ideal per gaudir d'una bona alimentació durant la vostra estada al càmping.",
                },
              ]}
            />
          </div>

          <div className="flex justify-center mt-14">
            <Link
              to="/serveis"
              className="px-10 py-4 rounded-full bg-primary text-white font-body font-bold text-[15px] hover:opacity-90 transition-opacity"
            >
              Veure tots els serveis
            </Link>
          </div>
        </div>

        {/* Bottom wave — normal orientation, protrudes below the section border into the section below */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full overflow-hidden h-[62px] pointer-events-none -scale-y-100">
          <img src={navWave} alt="" aria-hidden className="w-full h-full object-cover block" />
        </div>
      </section>

      {/* ─── ENTORN ───────────────────────────────────────────────────────
           Redesigned to match #el-camping section structure & styling.
           Mobile: stacks to single column (media then text).
      ──────────────────────────────────────────────────────────────────── */}
      <section id="entorn">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 pt-16 sm:pt-24 md:pt-36 pb-10 md:pb-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Media column */}
          <div className="col-span-1 md:col-span-6">
            <div
              className="rounded-3xl overflow-hidden aspect-[4/3]"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <img
                src={entornImg}
                alt="Descobreix Vidrà — entorn i natura"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>

          {/* Text column */}
          <div className="col-span-1 md:col-span-6 flex flex-col gap-5">
            <p className="font-script text-primary leading-none m-0" style={{ fontSize: 30 }}>
              Entorn
            </p>
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.05' }}
            >
              Descobreix Vidrà
            </h2>
            <p className="font-body text-grey leading-relaxed m-0" style={{ fontSize: 17 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempus molestie purus,
              ut pellentesque ligula sagittis eget. Phasellus at suscipit justo. Cras vel sem
              sodales sem rhoncus laoreet. Proin porta congue luctus.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#"
                className="px-8 py-4 rounded-full bg-primary text-white font-body font-bold text-[15px] hover:opacity-90 transition-opacity"
              >
                Coneix l'entorn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACTE ─────────────────────────────────────────────────────
           Left: custom contact-info panel — ContactForm Kit component is a
           static form with input fields, not a contact-info display block.
           Right: custom iframe — DirectionsIframe Kit component has a
           hardcoded placeholder iframe src not configurable via props;
           real Google Maps embed URL for Camping Vidrà required per prompt.
           Mobile: stacks vertically — contact panel above, map below.
      ──────────────────────────────────────────────────────────────────── */}
      <section id="contacte" className="relative pb-[62px]" style={{ backgroundColor: 'var(--color-secondary)' }}>
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 py-14 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch">
          {/* Contact info panel */}
          <div
            className="col-span-1 md:col-span-5 bg-white rounded-3xl p-8 md:p-10 flex flex-col gap-8"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex flex-col gap-2">
              <p className="font-script text-primary leading-none m-0" style={{ fontSize: 26 }}>
                Informació
              </p>
              <h3
                className="font-heading font-bold text-dark m-0"
                style={{ fontSize: 36, lineHeight: '1.15' }}
              >
                Contacta amb nosaltres
              </h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="font-body font-bold text-dark text-lg m-0">Horari de recepció</p>
              <p className="font-body text-grey text-base m-0">09h – 22:30h</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="font-body font-bold text-dark text-lg m-0">Telèfon de contacte</p>
              <a
                href="tel:+34671404491"
                className="flex items-center gap-3 font-body text-grey text-base hover:text-dark transition-colors"
              >
                <Phone size={17} className="text-primary shrink-0" strokeWidth={1.8} />
                (+34) 671 40 44 91
              </a>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="font-body font-bold text-dark text-lg m-0">E-mail</p>
              <a
                href="mailto:informacio@campingvidra.com"
                className="flex items-center gap-3 font-body text-grey text-base hover:text-dark transition-colors"
              >
                <Mail size={17} className="text-primary shrink-0" strokeWidth={1.8} />
                informacio@campingvidra.com
              </a>
            </div>

            <a
              href="#"
              className="self-start px-8 py-4 rounded-full bg-primary text-white font-body font-bold text-[15px] hover:opacity-90 transition-opacity"
            >
              Escriu-nos
            </a>
          </div>

          {/* Google Maps iframe — non-functional, visual only (pointerEvents none) */}
          {/* DirectionsIframe: replace src with confirmed Google Maps embed URL for client */}
          <div
            className="col-span-1 md:col-span-7 rounded-3xl overflow-hidden min-h-[300px] md:min-h-[460px]"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2990.4!2d2.30278!3d42.10148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a572feef9b5d1b%3A0xa7bc8dc9a2c4d0f6!2sVidr%C3%A0%2C%20Girona%2C%20Spain!5e0!3m2!1sca!2ses!4v1706000000000!5m2!1sca!2ses"
              width="100%"
              height="100%"
              className="block w-full h-full min-h-[300px] md:min-h-[460px]"
              style={{ border: 0, pointerEvents: 'none' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Camping Vidrà — Vidrà, Girona"
            />
          </div>
        </div>

        {/* Separator frame from Figma node 17:230 positioned absolutely at the bottom */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden h-[62px] pointer-events-none px-24 py-0">
          <img
            src={contactSeparator}
            alt=""
            aria-hidden
            className="w-full max-w-[1440px] mx-auto h-full object-cover block"
          />
        </div>
      </section>

      <SiteFooter />

      {/* ─── SCROLL-UP FLOATING BUTTON ────────────────────────────────────
           No kit FloatingActionButton or ScrollToTop component exists.
           Appears together with the fixed compact header (isFixed state).
           z-[65] sits above the fixed header (z-[60]) so it's always tappable.
      ──────────────────────────────────────────────────────────────────── */}
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
        style={{
          background: 'var(--color-primary)',
          boxShadow: '0 4px 20px rgba(59, 37, 26, 0.20)',
        }}
      >
        <ArrowUp size={20} strokeWidth={2.2} style={{ color: 'white' }} />
      </button>
    </div>
  )
}
