/**
 * SiteNav — Navigation components. Exports four items:
 *
 *   SiteStaticHeader  — Full-height header (desktop: 156px, mobile: 72px),
 *                       position:absolute over the page hero. Includes the
 *                       contact strip, logo, and desktop nav with dropdowns.
 *   FixedCompactHeader — 62px fixed header that slides in from the top after
 *                       the user scrolls (z-[60]). Shares the same nav items.
 *   NavDropdown        — Desktop dropdown item: shows submenu on hover,
 *                       highlights link + chevron green on hover/active state.
 *   NAV_ITEMS          — Shared navigation data array (label, href, submenu).
 *   navWave            — Path to the wave SVG used as a section separator.
 *
 * Layout notes:
 * - Both headers share MobileNavDrawer — a slide-down panel with accordion items.
 * - NavDropdown uses onMouseEnter/Leave for desktop; click to toggle on mobile.
 * - isGreen state (hover OR active route) paints both the label and chevron primary green.
 */
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { ChevronRight, ChevronDown, Menu, X, Phone, Mail, MapPin } from 'lucide-react'

export const navChevron    = '/assets/d2ce0.svg'
export const navGlobe      = '/assets/a08c6.svg'
export const navLogo       = '/assets/2a651.png'
export const navWave       = '/assets/f8c08.svg'
export const navIconLoc    = '/assets/98cd1.svg'
export const navIconLocPin = '/assets/13dcb.svg'
export const navIconCircle = '/assets/c7212.svg'
export const navIconPhone  = '/assets/ab711.svg'
export const navIconEmail  = '/assets/a790e.svg'

export type SubmenuItem = { label: string; href?: string }
export type NavItem = { label: string; pathPrefix?: string; href?: string; submenu: SubmenuItem[] }

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'El Càmping',
    pathPrefix: '/el-camping',
    href: '/ ',
    submenu: [
      { label: 'Plànol del càmping' },
      { label: 'FAQs', href: '/el-camping/faqs' },
      { label: 'Tarifes' },
    ],
  },
  {
    label: 'Allotjaments',
    pathPrefix: '/allotjaments',
    href: '/allotjaments',
    submenu: [
      { label: 'Bungalow Tradicional',       href: '/allotjaments/bungalow-tradicional' },
      { label: 'Tiny Home',       href: '#' },
      { label: 'Hobbit XL',       href: '#' },
      { label: 'Hobbit',     href: '#' },
      { label: 'Mini Hobbit',     href: '#' },
      { label: 'Safari Glamping', href: '#' },
    ],
  },
  {
    label: 'Parcel·les',
    submenu: [
      { label: 'Parcel·la Standard' },
      { label: 'Parcel·la Mirador' },
    ],
  },
  { label: 'Serveis', href: '/serveis', submenu: [] },
  { label: 'Entorn', href: '/entorn', pathPrefix: '/entorn', submenu: [] },
  { label: 'Contacte', href: '/contacte', pathPrefix: '/contacte', submenu: [] },
]

// ── Mobile accordion item ─────────────────────────────────────────────────────
function MobileNavItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [subOpen, setSubOpen] = useState(false)
  const location = useLocation()
  const isActive = !!item.pathPrefix && location.pathname.startsWith(item.pathPrefix)
  const hasSubmenu = item.submenu.length > 0

  return (
    <div
      className="border-b last:border-0"
      style={{ borderColor: 'rgba(59,37,26,0.08)' }}
    >
      <div className="flex items-center">
        {item.href ? (
          <Link
            to={item.href}
            onClick={onClose}
            className="flex-1 py-4 font-body font-bold text-[15px] uppercase tracking-wide"
            style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-dark)' }}
          >
            {item.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => hasSubmenu && setSubOpen((o) => !o)}
            className="flex-1 text-left py-4 font-body font-bold text-[15px] uppercase tracking-wide"
            style={{ color: 'var(--color-dark)' }}
          >
            {item.label}
          </button>
        )}
        {hasSubmenu && (
          <button
            type="button"
            onClick={() => setSubOpen((o) => !o)}
            aria-label={`Desplegar ${item.label}`}
            className="p-3 flex items-center justify-center"
          >
            <ChevronDown
              size={16}
              strokeWidth={2}
              style={{ color: 'var(--color-grey)' }}
              className={`transition-transform duration-200 ${subOpen ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {hasSubmenu && (
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            subOpen ? 'max-h-[300px]' : 'max-h-0'
          }`}
        >
          <div className="pb-3 pl-4 flex flex-col gap-0.5">
            {item.submenu.map((sub) =>
              sub.href ? (
                <Link
                  key={sub.label}
                  to={sub.href}
                  onClick={onClose}
                  className="flex items-center gap-2 py-2 font-body text-[14px]"
                  style={{ color: 'var(--color-grey)' }}
                >
                  <ChevronRight size={12} strokeWidth={2.5} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  {sub.label}
                </Link>
              ) : (
                <span
                  key={sub.label}
                  className="flex items-center gap-2 py-2 font-body text-[14px]"
                  style={{ color: 'var(--color-grey)' }}
                >
                  <ChevronRight size={12} strokeWidth={2.5} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  {sub.label}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared mobile drawer ──────────────────────────────────────────────────────
function MobileNavDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation()
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // Close on route change
  useEffect(() => {
    onCloseRef.current()
  }, [location.pathname])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <div
      className={`fixed inset-0 z-[80] lg:hidden transition-all duration-300 ${
        isOpen ? 'visible' : 'invisible pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'rgba(59,37,26,0.45)' }}
        onClick={onClose}
        aria-hidden
      >
        {' '}
      </div>

      {/* Panel — slides down from top */}
      <div
        className={`absolute top-0 left-0 right-0 transition-transform duration-300 ease-out overflow-y-auto`}
        style={{
          background: 'var(--color-bg)',
          boxShadow: '0 8px 40px rgba(59,37,26,0.18)',
          maxHeight: '90vh',
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(59,37,26,0.08)' }}
        >
          <Link to="/" onClick={onClose} className="flex items-center">
            <img src={navLogo} alt="Càmping Vidrà" className="h-[42px] object-contain" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tancar menú"
            className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <X size={22} strokeWidth={2} style={{ color: 'var(--color-dark)' }} />
          </button>
        </div>

        {/* Nav items — accordion */}
        <nav className="px-6 py-2" aria-label="Navegació principal">
          {NAV_ITEMS.map((item) => (
            <MobileNavItem key={item.label} item={item} onClose={onClose} />
          ))}
        </nav>

        {/* Contact info block */}
        <div className="px-6 pb-8 pt-2">
          <div
            className="flex flex-col gap-4 p-5 rounded-2xl"
            style={{ background: 'var(--color-surface)' }}
          >
            <a
              href="tel:+34671404491"
              className="flex items-center gap-3 font-body text-[14px] hover:opacity-75 transition-opacity"
              style={{ color: 'var(--color-grey)' }}
            >
              <Phone size={16} strokeWidth={1.8} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              (+34) 671 40 44 91
            </a>
            <a
              href="mailto:informacio@campingvidra.com"
              className="flex items-center gap-3 font-body text-[14px] hover:opacity-75 transition-opacity"
              style={{ color: 'var(--color-grey)' }}
            >
              <Mail size={16} strokeWidth={1.8} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              informacio@campingvidra.com
            </a>
            <div
              className="flex items-center gap-3 font-body text-[14px]"
              style={{ color: 'var(--color-grey)' }}
            >
              <MapPin size={16} strokeWidth={1.8} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              Vidrà, Girona
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Desktop dropdown ──────────────────────────────────────────────────────────
export function NavDropdown({
  label,
  href,
  submenu,
  isActive,
}: {
  label: string
  href?: string
  submenu: SubmenuItem[]
  isActive?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasSubmenu = submenu.length > 0

  useEffect(() => {
    if (!isOpen) return
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [isOpen])

  const isGreen = isActive || isHovered

  return (
    <div
      ref={containerRef}
      className="relative group/navitem"
      onMouseEnter={() => {
        setIsHovered(true)
        if (hasSubmenu) setIsOpen(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        if (hasSubmenu) setIsOpen(false)
      }}
    >
      <div className="flex items-center">
        {href ? (
          <Link
            to={href}
            className="flex items-center px-[16px] py-[8px] font-body font-bold text-[16px] uppercase leading-[24px] shrink-0 transition-colors"
            style={{ color: isGreen ? 'var(--color-primary)' : 'var(--color-dark)' }}
          >
            {label}
          </Link>
        ) : (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center px-[16px] py-[8px] font-body font-bold text-[16px] uppercase leading-[24px] shrink-0 transition-colors"
            style={{ color: isGreen ? 'var(--color-primary)' : 'var(--color-dark)' }}
          >
            {label}
          </a>
        )}
        {hasSubmenu && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen((o) => !o)
            }}
            aria-expanded={isOpen}
            aria-label={`Desplegar ${label}`}
            className="pr-[12px] py-[8px] flex items-center transition-colors cursor-pointer"
          >
            <ChevronDown
              size={12}
              strokeWidth={3}
              className={`shrink-0 block transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`}
              style={{ color: isGreen ? 'var(--color-primary)' : 'var(--color-dark)' }}
            />
          </button>
        )}
      </div>

      {hasSubmenu && (
        <div
          className={`absolute top-full left-0 z-[70] min-w-[220px] rounded-2xl overflow-hidden transition-all duration-200 ${
            isOpen ? 'opacity-100 translate-y-1 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
          }`}
          style={{ background: 'var(--color-bg)', boxShadow: '0 8px 32px rgba(59,37,26,0.14)' }}
        >
          <div className="py-2" role="menu">
            {submenu.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  to={item.href}
                  role="menuitem"
                  className="flex items-center gap-2.5 px-5 py-2.5 font-body font-medium text-[14px] hover:bg-[rgba(59,37,26,0.06)] transition-colors no-underline"
                  style={{ color: 'var(--color-dark)' }}
                >
                  <ChevronRight size={12} strokeWidth={2.5} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  role="menuitem"
                  className="flex items-center gap-2.5 px-5 py-2.5 font-body font-medium text-[14px] hover:bg-[rgba(59,37,26,0.06)] transition-colors no-underline"
                  style={{ color: 'var(--color-dark)' }}
                >
                  <ChevronRight size={12} strokeWidth={2.5} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Full-height static header (hero overlay) ──────────────────────────────────
export function SiteStaticHeader() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50 h-[72px] lg:h-[156px]">
      {/* Mobile drawer */}
      <MobileNavDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="relative h-[72px] lg:h-[156px]">
        {/* Background fill */}
        <div
          className="absolute inset-x-0 top-0 bottom-0 lg:bottom-[38px]"
          style={{ background: 'var(--color-bg)' }}
        />
        {/* Wave — desktop only */}
        <div className="hidden lg:block absolute inset-x-0 bottom-0 overflow-hidden h-[62px] pointer-events-none -scale-y-100">
          <img src={navWave} alt="" aria-hidden className="w-full h-full object-cover block" />
        </div>

        {/* ── Mobile bar ── */}
        <div className="flex lg:hidden items-center justify-between px-6 h-[72px] relative z-10">
          <Link to="/" className="flex items-center">
            <img src={navLogo} alt="Càmping Vidrà" className="h-[44px] object-contain" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Obrir menú"
            className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <Menu size={22} strokeWidth={2} style={{ color: 'var(--color-dark)' }} />
          </button>
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden lg:block relative z-10 max-w-[1417px] mx-auto px-[48px]">
          <div className="flex items-center gap-[32px] h-[146px]">
            {/* Logo */}
            <Link to="/" className="flex items-center py-[16px] shrink-0">
              <img src={navLogo} alt="Càmping Vidrà" className="h-[58px] w-[194px] object-contain" />
            </Link>

            {/* Right column: contact strip + nav */}
            <div className="flex flex-col flex-1 min-w-0 justify-center">
              {/* Contact info strip */}
              <div className="flex items-center justify-end gap-[32px] pt-[20px] pb-[8px]">
                {/* Location */}
                <div className="flex items-center gap-[12px]">
                  <div className="relative size-[34px] shrink-0">
                    <img src={navIconLoc} alt="" aria-hidden className="absolute inset-0 size-full block" />
                    <div className="absolute left-[8px] top-[8px] size-[18px] flex items-center justify-center overflow-hidden">
                      <img src={navIconLocPin} alt="" aria-hidden className="w-[16px] h-[18px] block" />
                    </div>
                  </div>
                  <span
                    className="font-body font-medium text-[14px] leading-[28px] whitespace-nowrap"
                    style={{ color: 'var(--color-grey)' }}
                  >
                    Vidrà, Girona
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-[12px]">
                  <div className="relative size-[34px] shrink-0 flex items-center justify-center">
                    <img src={navIconCircle} alt="" aria-hidden className="absolute inset-0 size-full block" />
                    <img src={navIconPhone} alt="" aria-hidden className="relative z-10 size-[18px] block" />
                  </div>
                  <a
                    href="tel:+34671404491"
                    className="font-body font-medium text-[14px] leading-[28px] whitespace-nowrap hover:opacity-75 transition-opacity"
                    style={{ color: 'var(--color-grey)' }}
                  >
                    (+34) 671 40 44 91
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-[12px]">
                  <div className="relative size-[34px] shrink-0 flex items-center justify-center">
                    <img src={navIconCircle} alt="" aria-hidden className="absolute inset-0 size-full block" />
                    <img src={navIconEmail} alt="" aria-hidden className="relative z-10 size-[18px] block" />
                  </div>
                  <a
                    href="mailto:informacio@campingvidra.com"
                    className="font-body font-medium text-[14px] leading-[28px] whitespace-nowrap hover:opacity-75 transition-opacity"
                    style={{ color: 'var(--color-grey)' }}
                  >
                    informacio@campingvidra.com
                  </a>
                </div>
              </div>

              {/* Nav menu row */}
              <nav className="flex items-center justify-end pt-[16px] pb-[16px]" aria-label="Navegació principal">
                {NAV_ITEMS.map((item) => (
                  <NavDropdown
                    key={item.label}
                    label={item.label}
                    href={item.href}
                    submenu={item.submenu}
                    isActive={!!item.pathPrefix && location.pathname.startsWith(item.pathPrefix)}
                  />
                ))}
                {/* Language switcher */}
                <div className="flex items-center justify-end pl-[74px] shrink-0">
                  <div className="flex items-center gap-[8px] cursor-pointer hover:opacity-75 transition-opacity">
                    <img src={navGlobe} alt="" aria-hidden className="size-[18px] shrink-0 block" />
                    <span
                      className="font-body font-bold text-[16px] uppercase leading-[24px]"
                      style={{ color: 'var(--color-dark)' }}
                    >
                      CA
                    </span>
                    <img src={navChevron} alt="" aria-hidden className="w-[10px] h-[6px] shrink-0 block" />
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// ── Fixed compact header — slides in after scroll ─────────────────────────────
export function FixedCompactHeader({ isVisible }: { isVisible: boolean }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ background: 'var(--color-bg)' }}
      aria-hidden={!isVisible}
    >
      {/* Mobile drawer */}
      <MobileNavDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-[48px]">
        <div className="flex items-center gap-[32px] h-[62px]">
          <Link to="/" className="flex items-center shrink-0 py-[16px]">
            <img src={navLogo} alt="Càmping Vidrà" className="h-[32px] w-[108px] object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center justify-end flex-1" aria-label="Navegació principal (fixa)">
            {NAV_ITEMS.map((item) => (
              <NavDropdown
                key={item.label}
                label={item.label}
                href={item.href}
                submenu={item.submenu}
                isActive={!!item.pathPrefix && location.pathname.startsWith(item.pathPrefix)}
              />
            ))}
            <div className="flex items-center justify-end pl-[74px] shrink-0">
              <div className="flex items-center gap-[8px] cursor-pointer hover:opacity-75 transition-opacity">
                <img src={navGlobe} alt="" aria-hidden className="size-[18px] shrink-0 block" />
                <span
                  className="font-body font-bold text-[16px] uppercase leading-[24px]"
                  style={{ color: 'var(--color-dark)' }}
                >
                  CA
                </span>
                <img src={navChevron} alt="" aria-hidden className="w-[10px] h-[6px] shrink-0 block" />
              </div>
            </div>
          </nav>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center justify-end flex-1">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Obrir menú"
              className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            >
              <Menu size={22} strokeWidth={2} style={{ color: 'var(--color-dark)' }} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
