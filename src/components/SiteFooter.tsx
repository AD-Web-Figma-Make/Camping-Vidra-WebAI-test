/**
 * SiteFooter — Global site footer. Used on every page.
 *
 * Sections:
 *   1. Green links area (bg --color-secondary): logo + social, contact, nav, info columns.
 *   2. Mountain separator SVG (1dc8b.svg): scaleY(-1) so peaks point downward.
 *   3. Partners row (white bg): partner/certification logo strip.
 *   4. Copyright strip (bg --color-dark).
 *
 * Layout notes:
 * - Green section has no bottom padding — the separator sits flush against it.
 * - .styled-list in index.css provides the footer nav link styling.
 * - Partner logo heights are intentionally non-uniform (sourced from brand assets).
 */
import { Link } from 'react-router'
import { ChevronRight, Instagram, Mail, MapPin, Phone } from 'lucide-react'

const logo = '/assets/27799.png'
// Mountain separator SVG (1577×45.66px, fill=#3E4A38, peaks designed to point up)
// Applied with scaleY(-1): flat green top merges with green section above,
// jagged mountain peaks point downward into white partners area below.
const footerSeparator = '/assets/1dc8b.svg'

const partnerLogos = [
  { src: '/assets/9f2fd.png',  alt: 'Associació LEADER Ripollès Ges Bisaura',              h: 56 },
  { src: '/assets/3a1c9.png',  alt: 'Càmpings in Girona Costa Brava Pirineus',             h: 66 },
  { src: '/assets/fc472.png',  alt: 'Biosphere Certified',                                 h: 66 },
  { src: '/assets/df0c3.png',  alt: "Punt d'Informació Turística",                         h: 67 },
  { src: '/assets/75bb7.png',  alt: 'Fons Europeu Agrícola de Desenvolupament Rural',      h: 34 },
  { src: '/assets/fed09.png',  alt: "Generalitat de Catalunya - Departament d'Agricultura", h: 77 },
]

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-white">

      {/* ── Green links section ─────────────────────────────────────────────
           No bottom padding — the mountain separator sits flush against it.
           Mobile: single column stack. Tablet: 2-col. Desktop: 12-col grid.
      ─────────────────────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-secondary)' }}>
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 pt-12 lg:pt-16 pb-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">

          {/* Col 1 — Logo + social */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col gap-7 pb-10 lg:pb-16">
            <img
              src={logo}
              alt="Càmping Vidrà"
              className="h-14 w-auto object-contain object-left"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className="flex flex-col gap-3">
              <p className="font-body font-bold text-white text-sm m-0">Segueix-nos</p>
              <div className="flex items-center gap-5">
                <a href="#" aria-label="TikTok" className="text-white/55 hover:text-white transition-colors">
                  <TikTokIcon />
                </a>
                <a href="#" aria-label="Instagram" className="text-white/55 hover:text-white transition-colors">
                  <Instagram size={18} strokeWidth={1.8} />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2 — Contact */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-5 pb-10 lg:pb-16">
            <p className="font-body font-bold text-white text-sm m-0">Contacta amb nosaltres</p>
            <div className="flex flex-col gap-4">
              <a
                href="tel:+34671404491"
                className="flex items-center gap-3 font-body text-white/55 text-sm hover:text-white transition-colors"
              >
                <Phone size={15} strokeWidth={1.8} className="shrink-0" />
                (+34) 671 40 44 91
              </a>
              <a
                href="mailto:informacio@campingvidra.com"
                className="flex items-center gap-3 font-body text-white/55 text-sm hover:text-white transition-colors"
              >
                <Mail size={15} strokeWidth={1.8} className="shrink-0" />
                informacio@campingvidra.com
              </a>
              <span className="flex items-start gap-3 font-body text-white/55 text-sm">
                <MapPin size={15} strokeWidth={1.8} className="mt-0.5 shrink-0" />
                Camí Santa Barbara, s/n 17515 Vidrà, Girona
              </span>
            </div>
          </div>

          {/* Col 3 — Navegació */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-5 pb-10 lg:pb-0">
            <p className="font-body font-bold text-white text-sm m-0">Navegació</p>
            <ul className="styled-list">
              {[
                { label: 'El Càmping', href: '/' },
                { label: 'Serveis', href: '/serveis' },
                { label: 'Allotjaments', href: '/allotjaments' },
                { label: 'Parcel·les', href: '/#allotjaments' },
                { label: 'Entorn', href: '/#entorn' },
                { label: 'Contacte', href: '/#contacte' },
              ].map((item) => (
                <li key={item.label}>
                  {item.href.startsWith('/') && !item.href.includes('#') ? (
                    <Link to={item.href} className="flex items-center gap-1.5">
                      <ChevronRight size={14} className="shrink-0 opacity-70" />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <a href={item.href} className="flex items-center gap-1.5">
                      <ChevronRight size={14} className="shrink-0 opacity-70" />
                      <span>{item.label}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Info */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-5 pb-10 lg:pb-16">
            <p className="font-body font-bold text-white text-sm m-0">Info</p>
            <ul className="styled-list">
              <li>
                <Link to="/el-camping/faqs" className="flex items-center gap-1.5">
                  <ChevronRight size={14} className="shrink-0 opacity-70" />
                  <span>FAQs</span>
                </Link>
              </li>
              {['Avís Legal', 'Política de privacitat', 'Política de cookies'].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-1.5">
                    <ChevronRight size={14} className="shrink-0 opacity-70" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Mountain separator ─────────────────────────────────────────────
           Sits between the green links section and the white partners row.
           scaleY(-1): flips the SVG so the flat green edge is at top
           (merging seamlessly with the green section above) and the jagged
           mountain peaks point downward into the white area below.
           The SVG has preserveAspectRatio="none" so it stretches to fill.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="w-full overflow-hidden" style={{ lineHeight: 0 }}>
        <img
          src={footerSeparator}
          alt=""
          aria-hidden
          style={{ display: 'block', width: '100%', height: '46px', transform: 'scaleY(-1)' }}
        />
      </div>

      {/* ── Partners row ───────────────────────────────────────────────────
           using <div>: no Kit component exists for a partner-logo strip.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 py-8 flex items-center justify-center gap-4 sm:gap-6 lg:gap-[34px] flex-wrap">
          {partnerLogos.map((partner) => (
            <img
              key={partner.src}
              src={partner.src}
              alt={partner.alt}
              style={{ height: partner.h, width: 'auto' }}
              className="object-contain block"
            />
          ))}
        </div>
      </div>

      {/* ── Copyright strip ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--color-dark)' }}>
        <div className="max-w-[1440px] mx-auto px-5 py-5 text-center">
          <p className="font-body text-white text-sm m-0">Camping Vidrà © 2026</p>
        </div>
      </div>

    </footer>
  )
}
