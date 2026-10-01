/**
 * BookingWidget — Static visual placeholder for the Witbooking booking engine.
 *
 * Props:
 *   variant: "default" | "sticky"
 *     - "default": full widget anchored to the bottom of the hero section,
 *       translated 50% down so it straddles the section boundary.
 *       On mobile, renders a "Reserva ara" toggle button; fields expand
 *       via a portal dropdown positioned below the CTA card.
 *     - "sticky": compact bar used inside the fixed sliding booking bar.
 *       On mobile, fields expand inline (pushes bar height downward).
 *
 * Layout notes:
 * - The default variant uses createPortal to escape the hero's overflow:hidden.
 * - Portal top position is calculated from the CTA card's rendered bounding rect
 *   (after translate-y-1/2), so it stays anchored regardless of hero height.
 * - This is a presentation-only component — no real form submission logic.
 */
import { forwardRef, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, ChevronDown, Search } from 'lucide-react'

interface BookingWidgetProps {
  /** "default" = full hero widget with labels.
   *  "sticky"  = compact bar (used inside the fixed sliding bar). */
  variant?: 'default' | 'sticky'
}

// Shared booking form fields — reused in both default portal and sticky inline dropdown
function BookingExpandedFields() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <span
          className="font-body font-bold text-[10px] tracking-widest uppercase leading-none"
          style={{ color: 'var(--color-grey)' }}
        >
          Dates de la seva estada
        </span>
        <div
          className="flex items-center justify-between px-5 py-[14px] rounded-xl border-2 bg-white"
          style={{ borderColor: 'rgba(106,95,89,0.25)' }}
        >
          <span className="font-body text-[14px] flex items-center gap-3" style={{ color: 'var(--color-dark)' }}>
            10/06/2027
            <span className="font-bold" style={{ color: 'var(--color-primary)' }}>→</span>
            12/06/2027
          </span>
          <Calendar size={15} strokeWidth={1.8} style={{ color: 'var(--color-grey)', flexShrink: 0 }} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span
          className="font-body font-bold text-[10px] tracking-widest uppercase leading-none"
          style={{ color: 'var(--color-grey)' }}
        >
          Nº de persones
        </span>
        <div
          className="flex items-center justify-between px-5 py-[14px] rounded-xl border-2 bg-white"
          style={{ borderColor: 'rgba(106,95,89,0.25)' }}
        >
          <span className="font-body text-[14px]" style={{ color: 'var(--color-dark)' }}>2 adults</span>
          <ChevronDown size={14} strokeWidth={2} style={{ color: 'var(--color-grey)', flexShrink: 0 }} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span
          className="font-body font-bold text-[10px] tracking-widest uppercase leading-none"
          style={{ color: 'var(--color-grey)' }}
        >
          Codi promocional
        </span>
        <div
          className="flex items-center px-5 py-[14px] rounded-xl border-2 bg-white"
          style={{ borderColor: 'rgba(106,95,89,0.25)' }}
        >
          <span className="font-body text-[14px]" style={{ color: 'rgba(106,95,89,0.55)' }}>Afegir promocode</span>
        </div>
      </div>

      {/* using <button>: kit BookingWidget has no standalone search CTA */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 px-8 py-[14px] rounded-full font-body font-bold text-[15px] text-white hover:opacity-90 transition-opacity"
        style={{ background: 'var(--color-primary)' }}
      >
        <Search size={15} strokeWidth={2.2} />
        Buscar
      </button>
    </div>
  )
}

export const BookingWidget = forwardRef<HTMLDivElement, BookingWidgetProps>(
  ({ variant = 'default' }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false)

    // Used only for the default variant's portal dropdown positioning
    const ctaCardRef = useRef<HTMLDivElement>(null)
    const [portalTop, setPortalTop] = useState(0)

    // Close default dropdown on scroll (sticky stays open — it's fixed, not in flow)
    useEffect(() => {
      if (!isExpanded || variant === 'sticky') return
      const close = () => setIsExpanded(false)
      window.addEventListener('scroll', close, { passive: true })
      return () => window.removeEventListener('scroll', close)
    }, [isExpanded, variant])

    const handleDefaultToggle = () => {
      if (!isExpanded && ctaCardRef.current) {
        // getBoundingClientRect() returns the rendered (post-transform) bounding box,
        // so rect.bottom is the visual bottom of the translated CTA card.
        const rect = ctaCardRef.current.getBoundingClientRect()
        setPortalTop(rect.bottom + 8)
      }
      setIsExpanded((o) => !o)
    }

    // ── Sticky variant ────────────────────────────────────────────────────────
    if (variant === 'sticky') {
      return (
        <div ref={ref}>
          {/* Mobile: CTA toggle + inline expanding fields below the fixed bar */}
          <div className="lg:hidden">
            <div className="px-4 py-3">
              {/* using <button>: kit BookingWidget has no mobile toggle CTA variant */}
              <button
                type="button"
                onClick={() => setIsExpanded((o) => !o)}
                className="w-full flex items-center justify-center gap-2 px-6 py-[10px] rounded-full font-body font-bold text-[14px] text-white hover:opacity-90 transition-opacity"
                style={{ background: 'var(--color-primary)' }}
                aria-expanded={isExpanded}
              >
                <Search size={13} strokeWidth={2.2} />
                Reserva ara
                <ChevronDown
                  size={13}
                  strokeWidth={2}
                  className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* Inline dropdown — expands the fixed sticky bar downward */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[480px]' : 'max-h-0'
              }`}
            >
              <div
                className="px-4 pt-1 pb-5 border-t"
                style={{ borderColor: 'rgba(59,37,26,0.10)' }}
              >
                <BookingExpandedFields />
              </div>
            </div>
          </div>

          {/* Desktop: original compact row */}
          <div className="hidden lg:flex items-center gap-3 px-8 py-3">
            <div className="flex-[2.2] min-w-0">
              <div
                className="flex items-center justify-between px-5 py-[10px] rounded-xl border-2 bg-white"
                style={{ borderColor: 'rgba(106,95,89,0.25)' }}
              >
                <span className="font-body text-[14px] flex items-center gap-3" style={{ color: 'var(--color-dark)' }}>
                  10/06/2027
                  <span className="font-bold" style={{ color: 'var(--color-primary)' }}>→</span>
                  12/06/2027
                </span>
                <Calendar size={14} strokeWidth={1.8} style={{ color: 'var(--color-grey)', flexShrink: 0 }} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="flex items-center justify-between px-5 py-[10px] rounded-xl border-2 bg-white"
                style={{ borderColor: 'rgba(106,95,89,0.25)' }}
              >
                <span className="font-body text-[14px]" style={{ color: 'var(--color-dark)' }}>2 adults</span>
                <ChevronDown size={13} strokeWidth={2} style={{ color: 'var(--color-grey)', flexShrink: 0 }} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="flex items-center px-5 py-[10px] rounded-xl border-2 bg-white"
                style={{ borderColor: 'rgba(106,95,89,0.25)' }}
              >
                <span className="font-body text-[14px]" style={{ color: 'rgba(106,95,89,0.55)' }}>Afegir promocode</span>
              </div>
            </div>

            {/* using <button>: kit BookingWidget has no standalone CTA button component */}
            <button
              type="button"
              className="flex items-center gap-2 px-8 py-[10px] rounded-full font-body font-bold text-[15px] text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
              style={{ background: 'var(--color-primary)' }}
            >
              <Search size={14} strokeWidth={2.2} />
              Buscar
            </button>
          </div>
        </div>
      )
    }

    // ── Default variant ───────────────────────────────────────────────────────
    return (
      <div ref={ref}>
        {/* Mobile layout */}
        <div className="lg:hidden">
          {/*
            CTA card: self-contained with its own padding.
            translate-y-1/2 is 50% of THIS card's own height only — the dropdown
            is a sibling (not inside), so expanding it never changes this calculation.
          */}
          <div
            ref={ctaCardRef}
            className="rounded-2xl px-5 py-5 translate-y-1/2"
            style={{ background: 'var(--color-bg)', boxShadow: '0 -6px 40px rgba(0,0,0,0.14)' }}
          >
            {/* using <button>: kit BookingWidget has no mobile toggle CTA variant */}
            <button
              type="button"
              onClick={handleDefaultToggle}
              className="w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-body font-bold text-[15px] text-white hover:opacity-90 transition-opacity"
              style={{ background: 'var(--color-primary)' }}
              aria-expanded={isExpanded}
            >
              <Search size={16} strokeWidth={2.2} />
              Reserva ara
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/*
            Portal dropdown: renders in document.body, completely outside the hero's
            overflow-hidden boundary. Position is fixed, measured from the CTA card's
            rendered bounding rect (getBoundingClientRect accounts for the translate).
            The CTA card height never changes, so its translate-y(50%) stays constant.
          */}
          {createPortal(
            <div
              className={`fixed left-0 right-0 z-[90] px-4 lg:hidden transition-all duration-300 ease-out ${
                isExpanded
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{ top: portalTop }}
            >
              <div
                className="rounded-2xl px-5 py-5"
                style={{
                  background: 'var(--color-bg)',
                  boxShadow: '0 8px 32px rgba(59,37,26,0.16)',
                }}
              >
                <BookingExpandedFields />
              </div>
            </div>,
            document.body
          )}
        </div>

        {/* Desktop: original horizontal layout, translated down by half its height */}
        <div
          className="hidden lg:flex items-end gap-4 rounded-2xl px-8 py-6 translate-y-1/2"
          style={{ background: 'var(--color-bg)', boxShadow: '0 -6px 40px rgba(0,0,0,0.14)' }}
        >
          <div className="flex-[2.2] flex flex-col gap-2 min-w-0">
            <span
              className="font-body font-bold text-[10px] tracking-widest uppercase leading-none"
              style={{ color: 'var(--color-grey)' }}
            >
              Dates de la seva estada
            </span>
            <div
              className="flex items-center justify-between px-5 py-[14px] rounded-xl border-2 bg-white"
              style={{ borderColor: 'rgba(106,95,89,0.25)' }}
            >
              <span className="font-body text-[14px] flex items-center gap-3" style={{ color: 'var(--color-dark)' }}>
                10/06/2027
                <span className="font-bold" style={{ color: 'var(--color-primary)' }}>→</span>
                12/06/2027
              </span>
              <Calendar size={15} strokeWidth={1.8} style={{ color: 'var(--color-grey)', flexShrink: 0 }} />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <span
              className="font-body font-bold text-[10px] tracking-widest uppercase leading-none"
              style={{ color: 'var(--color-grey)' }}
            >
              Nº de persones
            </span>
            <div
              className="flex items-center justify-between px-5 py-[14px] rounded-xl border-2 bg-white"
              style={{ borderColor: 'rgba(106,95,89,0.25)' }}
            >
              <span className="font-body text-[14px]" style={{ color: 'var(--color-dark)' }}>2 adults</span>
              <ChevronDown size={14} strokeWidth={2} style={{ color: 'var(--color-grey)', flexShrink: 0 }} />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <span
              className="font-body font-bold text-[10px] tracking-widest uppercase leading-none"
              style={{ color: 'var(--color-grey)' }}
            >
              Codi promocional
            </span>
            <div
              className="flex items-center px-5 py-[14px] rounded-xl border-2 bg-white"
              style={{ borderColor: 'rgba(106,95,89,0.25)' }}
            >
              <span className="font-body text-[14px]" style={{ color: 'rgba(106,95,89,0.55)' }}>Afegir promocode</span>
            </div>
          </div>

          {/* using <button>: kit BookingWidget has no standalone CTA button component */}
          <button
            type="button"
            className="flex items-center gap-2 px-10 py-[14px] rounded-full font-body font-bold text-[15px] text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            <Search size={15} strokeWidth={2.2} />
            Buscar
          </button>
        </div>
      </div>
    )
  }
)
BookingWidget.displayName = 'BookingWidget'
