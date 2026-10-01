declare module '@make-kits/digital-agency-kit/dist/app/components/AmenitiesGrid.js' {
  import { FC, ReactNode } from 'react'
  interface AmenitiesItem {
    icon?: ReactNode
    label: string
    description?: string
  }
  interface AmenitiesGridProps {
    heading?: string
    items: AmenitiesItem[]
  }
  export const AmenitiesGrid: FC<AmenitiesGridProps>
}
declare module '@make-kits/digital-agency-kit/dist/app/components/SiteNavigation.js' {
  import { FC } from 'react'
  export const SiteNavigation: FC<Record<string, unknown>>
}
declare module '@make-kits/digital-agency-kit/dist/app/components/HeroSection.js' {
  import { FC } from 'react'
  interface HeroSectionProps {
    imageSrc?: string
    overlayOpacity?: number
    align?: 'left' | 'center' | 'right'
    headline?: string
    subheadline?: string
    ctaLabel?: string
    ctaHref?: string
  }
  export const HeroSection: FC<HeroSectionProps>
}
declare module '@make-kits/digital-agency-kit/dist/app/components/BookingWidget/Witbooking.js' {
  import { FC } from 'react'
  export const BookingWidgetWitbooking: FC<Record<string, unknown>>
}
declare module '@make-kits/digital-agency-kit/dist/app/components/MediaTextBlock.js' {
  import { FC } from 'react'
  interface MediaTextBlockProps {
    imagePosition?: 'left' | 'right'
    imageSrc?: string
    imageAlt?: string
    heading?: string
    body?: string
    ctaLabel?: string
    ctaHref?: string
  }
  export const MediaTextBlock: FC<MediaTextBlockProps>
}
declare module '@make-kits/digital-agency-kit/dist/app/components/AccommodationCard.js' {
  import { FC } from 'react'
  interface AccommodationCardProps {
    imageSrc?: string
    imageAlt?: string
    name?: string
    description?: string
    features?: string[]
    price?: string
    ctaLabel?: string
    ctaHref?: string
  }
  export const AccommodationCard: FC<AccommodationCardProps>
}
declare module '@make-kits/digital-agency-kit/dist/app/components/DirectionsIframe.js' {
  import { FC } from 'react'
  interface DirectionsIframeProps {
    heading?: string
    address?: string
  }
  export const DirectionsIframe: FC<DirectionsIframeProps>
}
declare module '@make-kits/digital-agency-kit/dist/app/components/SiteFooter.js' {
  import { FC } from 'react'
  interface NavLink { label: string; href: string }
  interface SocialLink { platform: string; href: string }
  interface SiteFooterProps {
    navLinks?: NavLink[]
    socialLinks?: SocialLink[]
    address?: string
    phone?: string
    email?: string
    copyright?: string
  }
  export const SiteFooter: FC<SiteFooterProps>
}
