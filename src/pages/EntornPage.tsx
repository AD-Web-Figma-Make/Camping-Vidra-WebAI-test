/**
 * EntornPage — Natural surroundings page (route "/entorn").
 *
 * Sections: inner-page Hero (BookingWidget), and editorial sections about the
 * natural environment and activities around Vidrà and the surrounding area.
 *
 * Layout notes:
 * - Follows the same inner-page hero template as AllotjamentsPage and ServeisPage
 *   (700px min-height, SiteStaticHeader painted over, BookingWidget at bottom).
 */
import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Play } from 'lucide-react'
import { SiteStaticHeader, FixedCompactHeader } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { BookingWidget } from '../components/BookingWidget'

// ── Assets ── Figma node 43:368 archive ───────────────────────────────────────
const heroCover              = '/assets/bf6c5.png'
const imgPadel               = '/assets/90701.svg'
const imgCamiOlivaBackground = '/assets/0ef30.svg'
const imgCircuitOrientacio   = '/assets/55719.svg'
const imgTerraCastells       = '/assets/7505b.svg'
const imgSenderisme          = '/assets/9f7ca.svg'
const imgSenderismeSlide1    = '/assets/09eb3.svg'
const imgSenderismeSlide2    = '/assets/084a0.svg'
const imgSenderismeSlide3    = '/assets/f2352.svg'
const imgArrowPrev           = '/assets/a6d89.svg'
const imgArrowNext           = '/assets/0927e.svg'
const imgDescobreixVidra     = '/assets/3961a.svg'
const imgFestaMajor          = '/assets/3fc47.svg'
const imgCloseIcon           = '/assets/625a3.svg'   // reused from ServeisPage
const imgSeparador           = '/assets/c4ade.svg'   // Figma node 46:965

// ── CTA button — supports primary, dark, and secondary-on-dark variants ─────
function CtaButton({
  children,
  onClick,
  variant = 'default',
  icon,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'secondary-dark'
  icon?: React.ReactNode
}) {
  if (variant === 'secondary-dark') {
    return (
      // using <button>: kit has no outlined pill CTA on dark backgrounds
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white font-body font-bold text-[15px] cursor-pointer transition-colors hover:bg-white hover:text-dark focus-visible:outline-none focus-visible:ring-2"
      >
        {icon}
        <span>{children}</span>
      </button>
    )
  }

  const isPrimary = variant === 'primary'
  return (
    // using <button>: kit has no pill CTA matching project theme
    <button
      type="button"
      onClick={onClick}
      className={`self-start flex items-center justify-center gap-2 px-8 py-4 rounded-full font-body font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 text-[15px] ${
        isPrimary ? 'bg-primary' : ''
      }`}
      style={isPrimary ? undefined : { fontSize: 16, background: 'var(--color-dark)' }}
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

// ── Senderisme side popup — content from Figma node 43:430 ───────────────────
const SLIDES = [imgSenderismeSlide1, imgSenderismeSlide2, imgSenderismeSlide3]
const SLIDE_ALTS = ['Senderisme — foto 1', 'Senderisme — foto 2', 'Senderisme — foto 3']

function SenderismePopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setSlide((s) => (s + 1) % SLIDES.length)

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
        aria-label="Senderisme"
        className={`fixed right-0 top-0 z-[90] min-h-[100dvh] w-[50vw] overflow-y-auto transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--color-bg)' }}
      >
        {/* Close button — matches GastronomiaPopup in ServeisPage */}
        {/* using <button>: kit has no CloseButton/IconButton variant matching this circular style */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tancar"
          className="absolute top-8 right-8 z-10 flex items-center justify-center size-[54px] rounded-full shrink-0 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
          style={{ background: 'var(--color-primary)' }}
        >
          <img src={imgCloseIcon} alt="" aria-hidden width={34} height={34} />
        </button>

        <div className="flex flex-col gap-10 px-16 py-24 pt-28">

          {/* Title — Figma node 43:438 */}
          <h3
            className="font-heading font-normal text-dark text-center m-0"
            style={{ fontSize: 26, lineHeight: '48px' }}
          >
            Senderisme
          </h3>

          {/* Body — Figma node 43:439 (three paragraphs) */}
          <div className="flex flex-col gap-3 text-center">
            <p className="font-body font-normal text-dark m-0" style={{ fontSize: 16, lineHeight: '1.6' }}>
              L&apos;aigua és present al llarg de molts dels recorreguts que podràs fer des de Vidrà. Ens situem en territori muntanyós, a 982m. d&apos;alçada, on els recorreguts venen marcats per cert desnivell passant pel mig de pastures i fagedes que ens regalen un paisatge desbordat per la natura.
            </p>
            <p className="font-body font-normal text-dark m-0" style={{ fontSize: 16, lineHeight: '1.6' }}>
              Des d&apos;aquí podrem fer 3 dels 100 cims essencials de la comarca: el castell de Milany, el Puig de les Àligues, i Santa Magdalena de Cambrils.
            </p>
            <p className="font-body font-normal text-dark m-0" style={{ fontSize: 16, lineHeight: '1.6' }}>
              Recordeu que cal tenir cura dels espais naturals, mantenir-los nets i gaudir-los en silenci.
            </p>
          </div>

          {/* Image carousel — Figma node 43:440 "slider" */}
          <div className="flex items-center gap-4">
            {/* using <button>: kit has no carousel nav button */}
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="shrink-0 size-[57px] flex items-center justify-center focus-visible:outline-none"
            >
              <img src={imgArrowPrev} alt="" aria-hidden width={57} height={57} style={{ transform: 'rotate(180deg)' }} />
            </button>

            <div className="flex-1 rounded-2xl overflow-hidden" style={{ aspectRatio: '579/414' }}>
              <img
                key={slide}
                src={SLIDES[slide]}
                alt={SLIDE_ALTS[slide]}
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Següent"
              className="shrink-0 size-[57px] flex items-center justify-center focus-visible:outline-none"
            >
              <img src={imgArrowNext} alt="" aria-hidden width={57} height={57} />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Imatge ${i + 1}`}
                className="size-[8px] rounded-full transition-colors focus-visible:outline-none"
                style={{ background: i === slide ? 'var(--color-primary)' : 'var(--color-grey)', opacity: i === slide ? 1 : 0.4 }}
              />
            ))}
          </div>

        </div>
      </aside>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EntornPage() {
  const [isFixed, setIsFixed] = useState(false)
  const [isBookingSticky, setIsBookingSticky] = useState(false)
  const [isSenderismeOpen, setIsSenderismeOpen] = useState(false)
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

      {/* ─── HERO ── Figma node 43:458 "page cover" ────────────────────────────
           Cover: bf6c5.png. H1 "Entorn". Breadcrumb "Inici > Entorn".
           BookingWidget (Witbooking) at bottom of hero.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: '700px' }}>
        <img
          src={heroCover}
          alt="Entorn — Càmping Vidrà"
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
          {/* Figma node I43:458;19:718 */}
          <p className="font-body font-normal text-white/70 m-0" style={{ fontSize: 16, lineHeight: 'normal' }}>
            Inici &rsaquo; Entorn
          </p>
          {/* Figma node I43:458;18:628 */}
          <h1
            className="font-heading font-bold text-white m-0 leading-[1.04]"
            style={{ fontSize: 'clamp(48px, 6vw, 72px)' }}
          >
            Entorn
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-[1440px] mx-auto px-12">
            <BookingWidget ref={bookingRef} variant="default" />
          </div>
        </div>
      </section>

      {/* ─── INTRO ── Figma node 43:446 "intro section" ────────────────────────
           pt-36 absorbs the BookingWidget translate-y-1/2 overlap.
           Label: node 43:449. H2: node 43:450. Body: node 43:447.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-24">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col items-center text-center gap-4">
          <p
            className="font-heading font-bold text-dark uppercase tracking-wide m-0"
            style={{ fontSize: 24, lineHeight: '32px' }}
          >
            Camping VIDRÀ
          </p>
          <h2
            className="font-heading font-bold text-dark m-0"
            style={{ fontSize: 40, lineHeight: '52px' }}
          >
            Descobreix Vidrà
          </h2>
          <p
            className="font-body text-dark leading-relaxed m-0 max-w-[920px]"
            style={{ fontSize: 16 }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur venenatis faucibus sollicitudin. Fusce turpis nibh, tempor at tristique non, aliquam nec turpis.
          </p>
        </div>
      </section>

      {/* ─── PÀDEL VIDRÀ ── Figma node 43:395 ─────────────────────────────────
           Image left (90701.svg), text right. H2: 43:402. Body: 43:403.
           Button: 43:404 "Reserva la teva pista". Note: 43:405.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/2' }}>
            <img
              src={imgPadel}
              alt="Pàdel Vidrà"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 40, lineHeight: '52px' }}
            >
              Pàdel Vidrà
            </h2>
            <p className="font-body text-dark leading-relaxed m-0" style={{ fontSize: 16 }}>
              Pots gaudir de la pista de pàdel i jugar un partit amb els teus amics, familiars i companys. El preu de la pista són 16 € per una hora i mitja de joc. Un cop heu fet la vostra reserva, us donaran un codi que us donarà accés per obrir les portes. Un cop fet tot això ja podreu gaudir de la jugada de pàdel.
            </p>
            <CtaButton variant="primary">Reserva la teva pista</CtaButton>
            <p className="font-body text-dark m-0" style={{ fontSize: 14, lineHeight: '1.5' }}>
              També pots fer la reserva trucant a recepció{' '}
              <span style={{ color: 'var(--color-grey)' }}>09h - 22:30h</span>
              <br />
              (+34) 671 40 44 91
            </p>
          </div>
        </div>
      </section>

      {/* ─── CAMÍ OLIBA GR151 ── Figma node 43:451 ─────────────────────────────
           Full-bleed background image (0ef30.svg). Centered overlay content.
           H2: 43:455. Body: 43:456. Button: 43:457 "Veure video".
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: 562 }}>
        <img
          src={imgCamiOlivaBackground}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        {/* Overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.32)' }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-8 px-16 py-20">
          <h2
            className="font-heading font-bold text-white m-0 whitespace-nowrap"
            style={{ fontSize: 40, lineHeight: '52px' }}
          >
            Camí Oliba GR151
          </h2>
          <p
            className="font-body font-normal text-white text-center m-0 max-w-[440px]"
            style={{ fontSize: 16, lineHeight: 'normal' }}
          >
            De Montserrat als Pirineus, el GR151 ens descobreix la ruta del romànic català. Podreu fer parada a menjar, descansar o dormir a Vidrà en el seu tram entre Rupit i Vallfogona del Ripollès.
          </p>
          <CtaButton
            variant="secondary-dark"
            icon={<Play size={16} fill="currentColor" strokeWidth={0} className="shrink-0" />}
          >
            Veure video
          </CtaButton>
        </div>
      </section>

      {/* ─── CIRCUIT D'ORIENTACIÓ ── Figma node 43:370 ─────────────────────────
           Text left, image right (55719.svg). H2: 43:374. Body: 43:375–43:377.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 40, lineHeight: '52px' }}
            >
              Circuit d&apos;orientació
            </h2>
            <p className="font-body text-dark leading-relaxed m-0" style={{ fontSize: 18, lineHeight: '24px' }}>
              A Vidrà hi trobareu 2 circuits d&apos;orientació permanents, un de curt pensat per a families i un de més llarg per als més valents.
            </p>
            <p className="font-body text-dark leading-relaxed m-0" style={{ fontSize: 16 }}>
              Una forma diferent i divertida de descobrir els millors racons del nostre municipi. Podeu recollir el vostre mapa als establiments i allotjaments del poble.
            </p>
            <p className="font-body text-dark leading-relaxed m-0" style={{ fontSize: 16 }}>
              El circuit d&apos;orientació consisteix a realitzar un recorregut passant per uns punts de control que haureu de marcar al mapa. Podeu fer el recorregut lliureament i al vostre aire per tal de trobar totes les fites.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/2' }}>
            <img
              src={imgCircuitOrientacio}
              alt="Circuit d'orientació"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── TERRA DE CASTELLS ── Figma node 43:407 ────────────────────────────
           Image left (7505b.svg), text right. H2: 43:414. Body: 43:415–43:416.
           Button: 43:417 "Saber més".
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="p-0">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/2' }}>
            <img
              src={imgTerraCastells}
              alt="Terra de castells"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 40, lineHeight: '52px' }}
            >
              Terra de castells
            </h2>
            <p className="font-body text-dark leading-relaxed m-0" style={{ fontSize: 18, lineHeight: '24px' }}>
              Del castell de Milany al de Besora, passant per el castell de Llaés i el parc del castell de Montesquiu, envoltats d&apos;ermites i santuaris indiquen que estem en un territori ple d&apos;història.
            </p>
            <p className="font-body text-dark leading-relaxed m-0" style={{ fontSize: 16 }}>
              Recomanem la visita al parc del castell de Montesquiu, on fareu un recorregut per la història del Bisaura i serà el punt de partida d&apos;activitats i caminades.
            </p>
            <CtaButton variant="primary">Saber més</CtaButton>
          </div>
        </div>
      </section>

      {/* ─── SENDERISME ── Figma node 43:419 ───────────────────────────────────
           Text left, image right (9f7ca.svg). H2: 43:426. Body: 43:427.
           Button: 43:428 "Saber més" → opens SenderismePopup.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 40, lineHeight: '52px' }}
            >
              Senderisme
            </h2>
            <p className="font-body text-dark leading-relaxed m-0" style={{ fontSize: 16, lineHeight: '24px' }}>
              Et podràs perdre entre fagedes mil·lenàries i resseguir rierols plens de salts d&apos;aigua i racons de gran bellesa.
            </p>
            <CtaButton variant="primary" onClick={() => setIsSenderismeOpen(true)}>Saber més</CtaButton>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/2' }}>
            <img
              src={imgSenderisme}
              alt="Senderisme"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── DESCOBREIX VIDRÀ ── Figma node 43:379 ─────────────────────────────
           Image left (3961a.svg), text right. H2: 43:381. Body: 43:382.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-0 pb-24 px-0">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/2' }}>
            <img
              src={imgDescobreixVidra}
              alt="Descobreix Vidrà"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 40, lineHeight: '52px' }}
            >
              Descobreix Vidrà
            </h2>
            <p className="font-body text-dark leading-relaxed m-0" style={{ fontSize: 18, lineHeight: '24px' }}>
              Benvinguts a Vidrà, la petita Suïssa Catalana! Trobaràs un joc de pistes per explicar-te com viuen els seus habitants i quins tresors s&apos;amaguen enmig d&apos;aquests boscos i muntanyes.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FESTA MAJOR DE VIDRÀ ── Figma node 43:384 ─────────────────────────
           Text left, image right (3fc47.svg). H2: 43:391. Body: 43:392.
           Button: 43:393 "Descarrega el programa del 2027".
           SVG shape separator pointing upwards at top — Figma node 46:965.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-10 pb-24 px-0" style={{ background: 'var(--color-surface)' }}>
        {/* SVG shape pointing upwards at top of section — Figma node 46:965 */}
        <div className="absolute inset-x-0 -top-[61px] h-[62px] overflow-hidden pointer-events-none w-full" style={{ lineHeight: 0 }}>
          <img
            src={imgSeparador}
            alt=""
            aria-hidden
            className="w-full h-full block"
            style={{ objectFit: 'fill' }}
          />
        </div>
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <h2
              className="font-heading font-bold text-dark m-0"
              style={{ fontSize: 40, lineHeight: '52px' }}
            >
              Festa major de Vidrà
            </h2>
            <p className="font-body text-dark leading-relaxed m-0" style={{ fontSize: 18, lineHeight: '24px' }}>
              Coneix totes les activitats que es duran a terme al poble del 20 al 23 de setembre, durant la festa major.
            </p>
            <CtaButton variant="primary">Descarrega el programa del 2027</CtaButton>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/2' }}>
            <img
              src={imgFestaMajor}
              alt="Festa major de Vidrà"
              className="w-full h-full object-cover"
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

      {/* ─── SENDERISME SIDE POPUP ─────────────────────────────────────────── */}
      <SenderismePopup open={isSenderismeOpen} onClose={() => setIsSenderismeOpen(false)} />

    </div>
  )
}
