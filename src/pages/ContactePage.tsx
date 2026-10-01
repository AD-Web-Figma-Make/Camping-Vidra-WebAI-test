/**
 * ContactePage — Contact page (route "/contacte").
 *
 * Sections: inner-page Hero (BookingWidget), contact info panel + Google Maps iframe.
 * Layout matches the homepage Contacte section but rendered as a full page.
 */
import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { SiteStaticHeader, FixedCompactHeader } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { BookingWidget } from '../components/BookingWidget'

const heroCover = '/assets/89128.png'

export default function ContactePage() {
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
      {/* ── Fixed compact header ──────────────────────────────────────────── */}
      <FixedCompactHeader isVisible={isFixed} />

      {/* ── Sticky booking bar ────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 right-0 z-[55] transition-transform duration-200 ease-in-out ${
          isBookingSticky ? 'translate-y-[62px]' : '-translate-y-full'
        }`}
        style={{ background: 'var(--color-bg)', boxShadow: '0 4px 20px rgba(59,37,26,0.12)', borderTop: '1px solid rgba(59,37,26,0.07)' }}
        aria-hidden={!isBookingSticky}
      >
        <BookingWidget variant="sticky" />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: '700px' }}>
        {/* Cover image */}
        <img
          src={heroCover}
          alt="Contacte — Càmping Vidrà"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        {/* Gradient overlay — matches inner-page template */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.65) 100%)' }}
        />

        {/* Navigation on top of hero */}
        <SiteStaticHeader />

        {/* Hero text */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center pt-[180px] pb-48 px-8 gap-3">
          <p className="font-body font-normal text-white/70 text-[16px] leading-normal m-0">
            Inici &rsaquo; Contacte
          </p>
          <h1
            className="font-heading font-bold text-white m-0 leading-[1.04]"
            style={{ fontSize: 'clamp(48px, 6vw, 72px)' }}
          >
            Contacte
          </h1>
        </div>

        {/* Booking widget anchored at hero bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-[1440px] mx-auto px-12">
            <BookingWidget ref={bookingRef} variant="default" />
          </div>
        </div>
      </section>

      {/* ── INTRO ─────────────────────────────────────────────────────────── */}
      {/* top padding accounts for the booking widget translate-y-1/2 offset on desktop */}
      <section className="pt-16 md:pt-24 lg:pt-36 pb-12 lg:pb-16 px-6">
        <div className="max-w-[720px] mx-auto text-center flex flex-col gap-5 lg:gap-6">
          <p
            className="font-script text-primary leading-none m-0"
            style={{ fontSize: 30 }}
          >
            Contacte
          </p>
          <h2
            className="font-heading font-bold text-dark m-0"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: '1.05' }}
          >
            Vols venir al Càmping?
          </h2>
          <div className="font-body text-base leading-relaxed flex flex-col gap-2" style={{ color: 'var(--color-grey)' }}>
            <p className="m-0">
              {` En aquest cas ens pots trucar, escriure'ns via e-mail, o bé enviar-nos la teva consulta mitjançant aquest formulari. Estarem encantats de resoldre qualsevol dubte que tinguis. Ets un proveïdor i vols presentar-nos el teu catàleg? Truca'ns!`}
            </p>
            <p className="m-0">
              {`Estàs buscant feina i vols treballar amb nosaltres? Envia'ns el teu currículum a `}
              <a
                href="mailto:informacio@campingvidra.com"
                className="underline underline-offset-2 hover:opacity-75 transition-opacity"
                style={{ color: 'var(--color-primary)' }}
              >
                informacio@campingvidra.com
              </a>
              {` amb una carta de motivació i et trucarem.`}
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO + FORM ───────────────────────────────────────────── */}
      <section className="pb-16 lg:pb-24 px-4 md:px-6">
        {/*
          Mobile/tablet: single column — info panel stacks above the form.
          Desktop (lg): 12-column grid with info panel at col-span-4 and form at col-span-8.
        */}
        <div className="max-w-[1440px] mx-auto px-0 md:px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Contact info panel */}
          <div
            className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 p-6 lg:p-10 rounded-2xl"
            style={{ background: 'var(--color-surface)' }}
          >
            <h3
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 36, lineHeight: '1.15' }}
            >
              Contacta amb nosaltres
            </h3>

            {/* Horari de recepció */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Clock size={18} strokeWidth={1.8} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <p className="font-body font-bold text-base m-0" style={{ color: 'var(--color-dark)' }}>Horari de recepció</p>
              </div>
              <p className="font-body text-base m-0 pl-[26px]" style={{ color: 'var(--color-grey)' }}>09h - 22:30h</p>
            </div>

            {/* Telèfon */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Phone size={18} strokeWidth={1.8} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <p className="font-body font-bold text-base m-0" style={{ color: 'var(--color-dark)' }}>Telèfon de contacte</p>
              </div>
              <a
                href="tel:+34671404491"
                className="font-body text-base hover:opacity-75 transition-colors pl-[26px]"
                style={{ color: 'var(--color-grey)' }}
              >
                (+34) 671 40 44 91
              </a>
            </div>

            {/* E-mail */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mail size={18} strokeWidth={1.8} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <p className="font-body font-bold text-base m-0" style={{ color: 'var(--color-dark)' }}>E-mail</p>
              </div>
              <a
                href="mailto:informacio@campingvidra.com"
                className="font-body text-base hover:opacity-75 transition-colors pl-[26px] break-all"
                style={{ color: 'var(--color-grey)' }}
              >
                informacio@campingvidra.com
              </a>
            </div>

            {/* Com arribar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin size={18} strokeWidth={1.8} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <p className="font-body font-bold text-base m-0" style={{ color: 'var(--color-dark)' }}>Com arribar</p>
              </div>
              <p className="font-body text-base m-0 pl-[26px]" style={{ color: 'var(--color-grey)' }}>
                Camí Santa Barbara, s/n 17515 Vidrà, Girona
              </p>
            </div>
          </div>

          {/* Contact form */}
          {/* using native form elements: kit ContactForm has fixed field structure (name, email, phone, subject, message) that doesn't match Figma-specified fields and order (nom, telèfon, email, missatge) */}
          <div id="formulari" className="lg:col-span-8 flex flex-col gap-5">
            {/* Nom i cognoms */}
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                placeholder="Nom i cognoms"
                className="w-full font-body text-base px-5 py-4 outline-none transition-colors"
                style={{
                  border: '1px solid rgba(106,95,89,0.4)',
                  background: 'white',
                  color: 'var(--color-dark)',
                  borderRadius: 0,
                }}
                readOnly
              />
            </div>

            {/* Telèfon */}
            <div className="flex flex-col gap-1.5">
              <input
                type="tel"
                placeholder="Telèfon"
                className="w-full font-body text-base px-5 py-4 outline-none transition-colors"
                style={{
                  border: '1px solid rgba(106,95,89,0.4)',
                  background: 'white',
                  color: 'var(--color-dark)',
                  borderRadius: 0,
                }}
                readOnly
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <input
                type="email"
                placeholder="Email"
                className="w-full font-body text-base px-5 py-4 outline-none transition-colors"
                style={{
                  border: '1px solid rgba(106,95,89,0.4)',
                  background: 'white',
                  color: 'var(--color-dark)',
                  borderRadius: 0,
                }}
                readOnly
              />
            </div>

            {/* Missatge */}
            <div className="flex flex-col gap-1.5">
              <textarea
                placeholder="Missatge"
                rows={7}
                className="w-full font-body text-base px-5 py-4 outline-none transition-colors resize-none"
                style={{
                  border: '1px solid rgba(106,95,89,0.4)',
                  background: 'white',
                  color: 'var(--color-dark)',
                  borderRadius: 0,
                }}
                readOnly
              />
            </div>

            {/* GDPR checkbox */}
            <div className="flex items-start gap-4">
              <input
                id="gdpr"
                type="checkbox"
                defaultChecked={false}
                disabled
                className="shrink-0 size-6 mt-0.5"
                style={{
                  border: '1px solid rgba(106,95,89,0.4)',
                  background: 'white',
                  accentColor: 'var(--color-primary)',
                }}
              />
              <label htmlFor="gdpr" className="font-body text-base" style={{ color: 'var(--color-dark)' }}>
                He llegit i accepto la Política de privacitat
              </label>
            </div>

            {/* Submit */}
            {/* using <button>: kit ContactForm submit cannot be separated from the full form component */}
            <button
              type="submit"
              className="self-start px-8 py-4 rounded-full font-body font-bold text-[15px] text-white hover:opacity-90 transition-opacity"
              style={{ background: 'var(--color-primary)' }}
            >
              Enviar
            </button>
          </div>
        </div>
      </section>

      {/* ── LOCALITZACIÓ ──────────────────────────────────────────────────── */}
      <section className="pb-16 lg:pb-24 px-4 md:px-6">
        <div className="max-w-[1440px] mx-auto px-0 md:px-4 lg:px-10 flex flex-col gap-8">
          <h3
            className="font-heading font-bold text-dark text-center m-0"
            style={{ fontSize: 36, lineHeight: '1.15' }}
          >
            Localització
          </h3>
          <div
            className="w-full rounded-3xl overflow-hidden"
            style={{ boxShadow: 'var(--shadow-card)', minHeight: 280 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2990.4!2d2.30278!3d42.10148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a572feef9b5d1b%3A0xa7bc8dc9a2c4d0f6!2sVidr%C3%A0%2C%20Girona%2C%20Spain!5e0!3m2!1sca!2ses!4v1706000000000!5m2!1sca!2ses"
              width="100%"
              height="480"
              style={{ border: 0, display: 'block', pointerEvents: 'none' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Camping Vidrà — Vidrà, Girona"
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <SiteFooter />

      {/* ── SCROLL-UP FAB ─────────────────────────────────────────────────── */}
      {/* using <button>: kit has no FloatingActionButton / ScrollToTop component */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Tornar a dalt"
        className={`fixed bottom-8 right-8 z-[65] flex items-center justify-center size-[48px] rounded-full transition-all duration-300 ease-in-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 ${
          isFixed ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ background: 'var(--color-primary)', boxShadow: '0 4px 20px rgba(59,37,26,0.20)' }}
      >
        <ArrowUp size={20} strokeWidth={2.2} style={{ color: 'white' }} />
      </button>
    </div>
  )
}
