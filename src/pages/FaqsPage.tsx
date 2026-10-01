/**
 * FaqsPage — Frequently Asked Questions page (route "/el-camping/faqs").
 *
 * Sections: inner-page Hero, accordion FAQ list.
 * Accordion items toggle open/closed on click; only one item is open at a time.
 */
import { useEffect, useRef, useState } from 'react'
import {
  ArrowUp,
  Mail,
  Minus,
  Phone,
  Plus,
} from 'lucide-react'
import { SiteStaticHeader, FixedCompactHeader } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { BookingWidget } from '../components/BookingWidget'

// Page-specific assets
const faqsHeroImg = '/assets/6457a.png' // FAQs page cover image from Figma frame 17:550

// ── FAQ data — verbatim copy from Figma frame 17:543 ──────────────────────────
const FAQ_ITEMS = [
  {
    question: 'Mauris tristique, orci porttitor mattis gravida, lacus magna hendrerit purus, at tempus libero lacus laoreet purus?',
    answer: 'Maecenas ac consequat tortor. Nullam sagittis congue enim nec consectetur. Mauris nec pellentesque lectus. Fusce ex massa, pretium sit amet ultrices eu, facilisis vel nisi. Fusce in quam eu enim consequat interdum vel at mi.',
  },
  {
    question: 'Duis nec accumsan diam, a laoreet nibh. Vivamus lobortis tincidunt nulla, et rutrum ligula?',
    answer: null,
  },
  {
    question: 'Ut purus nulla, gravida et eros non, eleifend dignissim quam?',
    answer: null,
  },
  {
    question: 'Integer facilisis auctor ante eget congue?',
    answer: null,
  },
  {
    question: 'Aenean sed porta sapien?',
    answer: null,
  },
  {
    question: 'Nunc id sodales sapien?',
    answer: null,
  },
  {
    question: 'Pellentesque tortor justo, eleifend at elementum nec, sollicitudin non enim?',
    answer: null,
  },
]

// Category tags — verbatim from Figma frame 17:573, non-interactive
const FAQ_CATEGORIES = [
  { label: 'El càmping', active: true },
  { label: 'Allotjaments', active: false },
  { label: 'Parcel·les', active: false },
  { label: 'Serveis i instal·lacions', active: false },
  { label: 'Entorn', active: false },
  { label: 'Normativa del càmping', active: false },
]

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
function FaqAccordion() {
  // First item starts open per design instruction
  const [openIndex, setOpenIndex] = useState<number>(0)

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? -1 : i))

  return (
    <div className="flex flex-col">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i}>
            {isOpen ? (
              /* Active / open state */
              <div
                className="rounded-2xl mb-4"
                style={{
                  background: 'var(--color-surface)',
                  borderLeft: '4px solid var(--color-primary)',
                  boxShadow: '0 2px 12px rgba(59,37,26,0.07)',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-start gap-4 p-6 text-left"
                  aria-expanded="true"
                >
                  {/* Minus icon — primary circle */}
                  <span
                    className="flex-shrink-0 flex items-center justify-center size-8 rounded-full mt-0.5"
                    style={{ background: 'var(--color-primary)' }}
                    aria-hidden
                  >
                    <Minus size={14} strokeWidth={3} style={{ color: 'white' }} />
                  </span>
                  <span
                    className="font-['Quicksand',sans-serif] font-bold text-[18px] leading-[1.4]"
                    style={{ color: 'var(--color-dark)' }}
                  >
                    {item.question}
                  </span>
                </button>
                {/* Answer body */}
                <div className="px-6 pb-6 pl-[4.5rem]">
                  <p
                    className="font-['Quicksand',sans-serif] font-medium text-[16px] leading-relaxed"
                    style={{ color: 'var(--color-grey)' }}
                  >
                    {item.answer ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis congue enim nec consectetur.'}
                  </p>
                </div>
              </div>
            ) : (
              /* Default / closed state */
              <div
                className={`${i < FAQ_ITEMS.length - 1 ? 'mb-0' : ''}`}
                style={{ borderBottom: '1px solid rgba(59,37,26,0.10)' }}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-start gap-4 py-5 text-left group"
                  aria-expanded="false"
                >
                  {/* Plus icon — primary border circle */}
                  <span
                    className="flex-shrink-0 flex items-center justify-center size-8 rounded-full mt-0.5 border-2 transition-colors group-hover:bg-primary group-hover:border-primary"
                    style={{ borderColor: 'var(--color-primary)' }}
                    aria-hidden
                  >
                    <Plus
                      size={13}
                      strokeWidth={2.5}
                      className="transition-colors group-hover:text-white"
                      style={{ color: 'var(--color-primary)' }}
                    />
                  </span>
                  <span
                    className="font-['Quicksand',sans-serif] font-bold text-[18px] leading-[1.4] transition-opacity group-hover:opacity-70"
                    style={{ color: 'var(--color-dark)' }}
                  >
                    {item.question}
                  </span>
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FaqsPage() {
  const [isFixed, setIsFixed] = useState(false)
  const [isBookingSticky, setIsBookingSticky] = useState(false)
  const bookingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      // Inner-page hero is shorter (~600px) so trigger at 300px
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
           Inner-page hero: fixed 600px tall, same nav layout as homepage.
           Background: FAQs cover image (6457a.png from Figma frame 17:550).
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col" style={{ minHeight: '600px' }}>
        <img
          src={faqsHeroImg}
          alt="FAQs — Càmping Vidrà"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.65) 100%)' }}
        />

        {/* Full-height static header — shared cream-bg nav, "El Càmping" active */}
        <SiteStaticHeader />

        {/* Hero title content */}
        <div className="relative z-10 grow-0 basis-auto h-[740px] flex flex-col items-center justify-center text-center pt-[180px] pb-48 px-8 gap-3">
          {/* Breadcrumb — verbatim from Figma node I17:550;19:718 */}
          <p className="font-['Quicksand',sans-serif] font-medium text-white/70 text-[16px] leading-normal m-0">
            Inici &rsaquo; El càmping &rsaquo; FAQS
          </p>
          {/* Heading — verbatim from Figma node I17:550;18:628 */}
          <h1
            className="font-['Quicksand',sans-serif] font-bold text-white m-0 leading-[1.04]"
            style={{ fontSize: 'clamp(48px, 6vw, 72px)' }}
          >
            FAQS
          </h1>
        </div>

        {/* Booking widget — shared BookingWidget component */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-[1440px] mx-auto px-12">
            <BookingWidget ref={bookingRef} variant="default" />
          </div>
        </div>
      </section>

      {/* ─── INTRO SECTION ────────────────────────────────────────────────────
           Section label + heading + paragraph — verbatim from Figma frame 17:545.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-16">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col items-center text-center gap-4">
          {/* Script label — "Camping" verbatim from Figma node 17:548 */}
          <p className="font-['Grand_Hotel',cursive] leading-none m-0" style={{ fontSize: 30, color: 'var(--color-primary)' }}>
            Camping
          </p>
          {/* Heading — verbatim from Figma node 17:549 */}
          <h2
            className="font-['Quicksand',sans-serif] font-bold m-0"
            style={{ fontSize: 56, lineHeight: '1.05', color: 'var(--color-dark)' }}
          >
            FAQS
          </h2>
          {/* Body paragraph — verbatim from Figma node 17:546 */}
          <p
            className="font-['Quicksand',sans-serif] font-medium leading-relaxed m-0 max-w-[720px]"
            style={{ fontSize: 17, color: 'var(--color-grey)' }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur venenatis faucibus sollicitudin. Fusce turpis nibh, tempor at tristique non, aliquam nec turpis.
          </p>
        </div>
      </section>

      {/* ─── FAQ SECTION ──────────────────────────────────────────────────────
           Left: category tags (non-interactive, static) — verbatim from Figma 17:573.
           Right: FAQ accordion — first item open, rest collapsed.
           Kit has no FAQ/Accordion component — custom implementation.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="max-w-[1440px] mx-auto px-16">
          <div className="flex gap-16 items-start">

            {/* Category tags sidebar — non-interactive */}
            <aside className="shrink-0 w-[220px] flex flex-col gap-3 pt-2" aria-label="Categories de FAQs">
              {FAQ_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center justify-center px-6 py-4 rounded-full text-center"
                  style={
                    cat.active
                      ? { background: 'var(--color-dark)', color: 'white' }
                      : { background: 'transparent', border: '2px solid var(--color-dark)', color: 'var(--color-dark)' }
                  }
                  aria-current={cat.active ? 'true' : undefined}
                >
                  <span className="font-['Quicksand',sans-serif] font-bold text-[15px] leading-normal">
                    {cat.label}
                  </span>
                </div>
              ))}
            </aside>

            {/* FAQ accordion */}
            <div className="flex-1 min-w-0">
              <FaqAccordion />
            </div>

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
