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
  Preview,
} from '@react-email/components'
import * as React from 'react'

export interface CtaButton {
  text: string
  url: string
}

export interface EventNewsletterTemplateProps {
  previewText?: string
  heading: string
  subtitle?: string
  heroImageUrl?: string
  eventDate?: string
  eventLocation?: string
  body: string
  ctaButtons?: CtaButton[]
}

export const EventNewsletterTemplate: React.FC<EventNewsletterTemplateProps> = ({
  previewText,
  heading,
  subtitle,
  heroImageUrl,
  eventDate,
  eventLocation,
  body,
  ctaButtons,
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        {previewText && <Preview>{previewText}</Preview>}
        <Body className="bg-[#2b2b2b] font-sans py-[40px] px-[20px]">
          <Container className="max-w-[600px] mx-auto bg-[#f5f0ea] px-[50px] py-[40px] rounded-3xl">

            {/* Logo - hardcoded */}
            <Section className="mb-[40px]">
              <Img
                src="https://pub-9a7afb92aeda47c8a8856a83903f29d1.r2.dev/hellenic-next/hellenicNext_logo_xmas.png"
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

            {/* Description */}
            <Section className="mb-[50px]">
              <Text className="text-[16px] text-[#2b2b2b] m-0 leading-[1.6]">
                {body}
              </Text>
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
              <Text className="text-[12px] text-[#666666] m-0 mb-[8px]">
                Hellenic Next Community
              </Text>
              <Text className="text-[12px] text-[#666666] m-0">
                &copy; {new Date().getFullYear()} Hellenic Next
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default EventNewsletterTemplate
