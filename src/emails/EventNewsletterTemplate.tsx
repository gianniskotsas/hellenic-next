import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Tailwind,
  Row,
  Column,
  Img,
  Link,
  Preview,
} from '@react-email/components'
import * as React from 'react'
import { type CtaButton } from './NewsletterTemplate'

export interface EventNewsletterTemplateProps {
  previewText?: string
  heading: string
  subtitle?: string
  heroImageUrl?: string
  eventDate?: string
  eventLocation?: string
  bodyHtml: string
  ctaButtons?: CtaButton[]
}

export const EventNewsletterTemplate: React.FC<EventNewsletterTemplateProps> = ({
  previewText,
  heading,
  subtitle,
  heroImageUrl,
  eventDate,
  eventLocation,
  bodyHtml,
  ctaButtons,
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        {previewText && <Preview>{previewText}</Preview>}
        <Body className="bg-[#2b2b2b] font-sans py-[40px] px-[8px]">
          <Container className="max-w-[600px] mx-auto bg-[#f5f0ea] px-[50px] py-[40px] rounded-3xl">

            {/* Logo - hardcoded */}
            <Section className="mb-[40px]">
              <Img
                src="https://pub-9a7afb92aeda47c8a8856a83903f29d1.r2.dev/hellenic-next/hellenic_next_logo_transparent.png"
                alt="Hellenic Next Logo"
                width="40"
                height="40"
                className="w-16 h-16"
              />
            </Section>

            {/* Main Content with Optional Illustration */}
            <Section className="mb-[40px]">
              {heroImageUrl ? (
                <Row>
                  <Column className="w-[70%] align-top">
                    <Text className="text-[24px] font-serif text-[#2b2b2b] leading-[1.2] m-0 mb-[10px]">
                      Hellenic Next
                    </Text>
                    <Text className="text-[36px] font-black text-[#2b2b2b] leading-[0.9] m-0 mb-[16px]">
                      {heading}
                    </Text>
                    {subtitle && (
                      <Text className="text-[18px] font-medium text-[#2b2b2b] m-0 mb-[32px] leading-[1.3]">
                        {subtitle}
                      </Text>
                    )}
                  </Column>
                  <Column className="w-[30%] align-top text-center px-8">
                    <Img
                      src={heroImageUrl}
                      alt="Event Illustration"
                      width="200"
                      height="140"
                      className="object-cover"
                    />
                  </Column>
                </Row>
              ) : (
                <>
                  <Text className="text-[24px] font-serif text-[#2b2b2b] leading-[1.2] m-0 mb-[10px]">
                    Hellenic Next
                  </Text>
                  <Text className="text-[36px] font-black text-[#2b2b2b] leading-[0.9] m-0 mb-[16px]">
                    {heading}
                  </Text>
                  {subtitle && (
                    <Text className="text-[18px] font-medium text-[#2b2b2b] m-0 mb-[32px] leading-[1.3]">
                      {subtitle}
                    </Text>
                  )}
                </>
              )}
            </Section>

            {/* Event Details */}
            {(eventDate || eventLocation) && (
              <Section className="mb-[32px]">
                {eventDate && (
                  <Text className="text-[16px] text-[#2b2b2b] m-0 mb-[12px] leading-[1.5]">
                    <span className="font-normal">When:</span>{' '}
                    <span className="font-bold">{eventDate}</span>
                  </Text>
                )}
                {eventLocation && (
                  <Text className="text-[16px] text-[#2b2b2b] m-0 leading-[1.5]">
                    <span className="font-normal">Location:</span>{' '}
                    <span className="font-bold">{eventLocation}</span>
                  </Text>
                )}
              </Section>
            )}

            {/* Rich text body */}
            <Section className="mb-[50px]">
              <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            </Section>

            {/* CTA Buttons */}
            {ctaButtons && ctaButtons.length > 0 && (
              <Section className="text-center mb-[40px]">
                {ctaButtons.map((cta, index) => (
                  <Button
                    key={index}
                    href={cta.url}
                    className="bg-[#2b2b2b] text-white text-[18px] font-semibold px-[50px] py-[16px] w-full rounded-2xl mx-auto box-border text-center no-underline mb-[12px]"
                  >
                    {cta.text}
                  </Button>
                ))}
              </Section>
            )}

            {/* Footer */}
            <Section className="text-center">
              <Img
                alt="Hellenic Next"
                height="42"
                src="https://pub-9a7afb92aeda47c8a8856a83903f29d1.r2.dev/hellenic-next/hellenic_next_logo_transparent.png"
                width="42"
                style={{ margin: '0 auto', display: 'block' }}
              />
              <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
                Hellenic Next
              </Text>
              <Text className="mt-0 mb-[16px] text-[14px] text-gray-500 leading-[24px]">
                Connecting Greeks in tech.
              </Text>
              <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                <tr>
                  <td style={{ padding: '0 8px' }}>
                    <Link href="https://chat.whatsapp.com/CF8KK6Sx6JsCRlqi3g9AZC?mode=gi_t&utm_source=ig&utm_medium=social&utm_content=link_in_bio">
                      <Img alt="WhatsApp" height="28" width="28" src="https://pub-9a7afb92aeda47c8a8856a83903f29d1.r2.dev/social-icons/outline-black/whatsapp.png" />
                    </Link>
                  </td>
                  <td style={{ padding: '0 8px' }}>
                    <Link href="https://www.linkedin.com/company/hellenic-next">
                      <Img alt="LinkedIn" height="28" width="28" src="https://pub-9a7afb92aeda47c8a8856a83903f29d1.r2.dev/social-icons/outline-black/linkedin.png" />
                    </Link>
                  </td>
                  <td style={{ padding: '0 8px' }}>
                    <Link href="https://www.instagram.com/hellenicnext?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
                      <Img alt="Instagram" height="28" width="28" src="https://pub-9a7afb92aeda47c8a8856a83903f29d1.r2.dev/social-icons/outline-black/instagram.png" />
                    </Link>
                  </td>
                  <td style={{ padding: '0 8px' }}>
                    <Link href="https://hellenicnext.com">
                      <Img alt="Website" height="28" width="28" src="https://pub-9a7afb92aeda47c8a8856a83903f29d1.r2.dev/social-icons/outline-black/webpage.png" />
                    </Link>
                  </td>
                </tr>
              </table>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default EventNewsletterTemplate
