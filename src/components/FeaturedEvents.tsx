import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Event, Media } from '@/payload-types'

export async function FeaturedEvents() {
  const payload = await getPayload({ config })

  // Fetch the 3 most recent upcoming/ongoing events
  const { docs: events } = await payload.find({
    collection: 'events',
    where: {
      status: {
        in: ['upcoming', 'ongoing'],
      },
    },
    limit: 3,
    sort: 'eventDetails.startDate',
  })

  if (!events || events.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground text-lg">
              Join us for networking, learning, and connecting
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/events">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event: Event) => {
            const featuredImage = typeof event.featuredImage === 'object' 
              ? event.featuredImage as Media | null 
              : null
            const imageUrl = featuredImage?.url || null
            const startDate = new Date(event.eventDetails.startDate)
            const formattedDate = startDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })

            return (
              <Link key={event.id} href={`/events/${event.slug}`} className="group">
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
                  {imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                      <Image
                        src={imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-card rounded-lg shadow-lg p-2 text-center min-w-[50px]">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">
                          {startDate.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {startDate.getDate()}
                        </div>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={event.eventDetails.startDate}>
                        {formattedDate}
                      </time>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </CardTitle>
                    {event.excerpt && (
                      <CardDescription className="line-clamp-2">
                        {event.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">{event.eventDetails.location}</div>
                        {event.eventDetails.city && (
                          <div className="text-xs">
                            {event.eventDetails.city}
                            {event.eventDetails.country && `, ${event.eventDetails.country}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/events">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

