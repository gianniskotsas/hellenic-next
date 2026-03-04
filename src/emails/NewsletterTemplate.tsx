import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
  Heading,
  Font,
  Img,
} from '@react-email/components'
import * as React from 'react'

export interface CtaButton {
  text: string
  url: string
}

export interface NewsletterTemplateProps {
  previewText?: string
  heading: string
  subtitle?: string
  heroImageUrl?: string
  bodyHtml: string
  ctaButtons?: CtaButton[]
  recipientName?: string
}

export const NewsletterTemplate: React.FC<NewsletterTemplateProps> = ({
  previewText,
  heading,
  subtitle,
  heroImageUrl,
  bodyHtml,
  ctaButtons,
  recipientName,
}) => {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>
              hellenic<span style={logoAccent}>&#9654;</span>
            </Text>
          </Section>

          {heroImageUrl && (
            <Section>
              <Img
                src={heroImageUrl}
                alt="Newsletter image"
                width="600"
                style={heroImg}
              />
            </Section>
          )}

          <Section style={content}>
            {recipientName && (
              <Text style={greeting}>Dear {recipientName},</Text>
            )}

            <Heading as="h1" style={h1}>
              {heading}
            </Heading>

            {subtitle && (
              <Text style={subtitleStyle}>{subtitle}</Text>
            )}

            <div
              style={bodyStyle}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {ctaButtons && ctaButtons.length > 0 && (
              <Section style={ctaSection}>
                {ctaButtons.map((cta, index) => (
                  <Button key={index} style={ctaButton} href={cta.url}>
                    {cta.text}
                  </Button>
                ))}
              </Section>
            )}
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Hellenic Next. All rights reserved.
            </Text>
            <Text style={footerText}>
              Connecting Greek professionals worldwide.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default NewsletterTemplate

const main: React.CSSProperties = {
  backgroundColor: '#f5f0ea',
  fontFamily: 'Inter, Arial, sans-serif',
}

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden',
  marginTop: '40px',
  marginBottom: '40px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}

const header: React.CSSProperties = {
  backgroundColor: '#2b2b2b',
  padding: '24px 40px',
  textAlign: 'center' as const,
}

const logo: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 700,
  margin: '0',
  letterSpacing: '-0.5px',
}

const logoAccent: React.CSSProperties = {
  color: '#f5f0ea',
}

const heroImg: React.CSSProperties = {
  width: '100%',
  display: 'block',
}

const content: React.CSSProperties = {
  padding: '40px',
}

const greeting: React.CSSProperties = {
  color: '#666666',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
}

const h1: React.CSSProperties = {
  color: '#2b2b2b',
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: '36px',
  margin: '0 0 12px 0',
}

const subtitleStyle: React.CSSProperties = {
  color: '#2b2b2b',
  fontSize: '18px',
  lineHeight: '26px',
  margin: '0 0 24px 0',
}

const bodyStyle: React.CSSProperties = {
  color: '#2b2b2b',
  fontSize: '16px',
  lineHeight: '26px',
}

const ctaSection: React.CSSProperties = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '16px',
}

const ctaButton: React.CSSProperties = {
  backgroundColor: '#2b2b2b',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 600,
  textDecoration: 'none',
  padding: '12px 32px',
  borderRadius: '6px',
  display: 'inline-block',
  marginBottom: '8px',
}

const divider: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
}

const footer: React.CSSProperties = {
  padding: '24px 40px',
  textAlign: 'center' as const,
}

const footerText: React.CSSProperties = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0',
}
