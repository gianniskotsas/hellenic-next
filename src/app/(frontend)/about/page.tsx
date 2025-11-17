import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Users, Lightbulb, Target } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About Us - Hellenic Next',
  description:
    'Learn about Hellenic Next, the global community connecting Greek professionals in tech and business.',
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-muted/30 py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                About Hellenic Next
              </h1>
              <p className="text-lg text-muted-foreground">
                We&apos;re building a global community that connects Greek professionals across
                industries and continents, fostering collaboration, innovation, and mutual growth.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To empower Greek professionals worldwide by creating meaningful connections,
                sharing knowledge, and opening doors to new opportunities.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Global Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our community spans continents, connecting professionals from Silicon Valley
                    to Athens, London to Sydney, and everywhere in between.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Community First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe in the power of community. Every member brings unique experiences
                    and perspectives that enrich our collective knowledge.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Knowledge Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Through our blog, events, and networking opportunities, we facilitate the
                    exchange of ideas, best practices, and industry insights.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Career Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We&apos;re committed to helping our members advance their careers through
                    mentorship, job opportunities, and professional development resources.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-accent/20 rounded-xl p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Ready to Join Us?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Become part of a thriving community of Greek professionals who are shaping the
                future of technology and business worldwide.
              </p>
              <Button asChild size="lg">
                <Link href="/join">Apply for Membership</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
