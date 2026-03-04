import { render } from '@react-email/render'
import { NewsletterTemplate } from './NewsletterTemplate'
import { EventNewsletterTemplate } from './EventNewsletterTemplate'
import type { CtaButton } from './NewsletterTemplate'

interface MediaDoc {
  filename?: string
  url?: string
}

interface NewsletterDoc {
  template?: string | null
  subject: string
  previewText?: string | null
  heading: string
  subtitle?: string | null
  heroImage?: string | number | MediaDoc | null
  body: string
  ctaButtons?: Array<{ text: string; url: string }> | null
  eventDetails?: {
    eventDate?: string | null
    eventLocation?: string | null
  } | null
}

export function resolveImageUrl(
  media: string | number | MediaDoc | null | undefined,
  baseUrl: string,
): string | undefined {
  if (!media || typeof media === 'string' || typeof media === 'number') return undefined
  const doc = media as MediaDoc
  if (doc.url) return doc.url.startsWith('http') ? doc.url : `${baseUrl}${doc.url}`
  if (doc.filename) return `${baseUrl}/api/media/file/${doc.filename}`
  return undefined
}

export async function renderNewsletterHtml(
  newsletter: NewsletterDoc,
  baseUrl: string,
  recipientName?: string,
): Promise<string> {
  const heroImageUrl = resolveImageUrl(newsletter.heroImage, baseUrl)
  const ctaButtons: CtaButton[] = (newsletter.ctaButtons || []).filter(
    (b) => b.text && b.url,
  )

  if (newsletter.template === 'event') {
    return render(
      EventNewsletterTemplate({
        previewText: newsletter.previewText || undefined,
        heading: newsletter.heading,
        subtitle: newsletter.subtitle || undefined,
        heroImageUrl,
        eventDate: newsletter.eventDetails?.eventDate || undefined,
        eventLocation: newsletter.eventDetails?.eventLocation || undefined,
        body: newsletter.body,
        ctaButtons: ctaButtons.length > 0 ? ctaButtons : undefined,
      }),
    )
  }

  return render(
    NewsletterTemplate({
      previewText: newsletter.previewText || undefined,
      heading: newsletter.heading,
      subtitle: newsletter.subtitle || undefined,
      heroImageUrl,
      body: newsletter.body,
      ctaButtons: ctaButtons.length > 0 ? ctaButtons : undefined,
      recipientName,
    }),
  )
}
