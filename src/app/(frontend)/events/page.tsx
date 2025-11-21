import { getPayload } from 'payload'
import config from '@/payload.config'
import Image from 'next/image'
import Link from 'next/link'
import { Event, Media as MediaType } from '@/payload-types'
import { Calendar, MapPin, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const payload = await getPayload({ config })

  const events = await payload.find({
    collection: 'events',
    where: {
      status: {
        in: ['upcoming', 'ongoing'],
      },
    },
    sort: 'eventDetails.startDate',
    limit: 50,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Upcoming Events</h1>
            <p className="text-lg text-muted-foreground">
              Join us for networking, learning, and connecting with the Hellenic tech community in
              the Netherlands
            </p>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {events.docs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.docs.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const featuredImage =
    typeof event.featuredImage === 'object' ? (event.featuredImage as MediaType) : null
  const startDate = new Date(event.eventDetails.startDate)
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Event Image */}
      {featuredImage?.url && (
        <div className="relative h-64 w-full bg-muted">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || event.title}
            fill
            className="object-cover"
          />
          {/* Date Badge */}
          <div className="absolute top-4 left-4 bg-card rounded-lg shadow-lg p-3 text-center min-w-[60px]">
            <div className="text-xs font-semibold text-muted-foreground uppercase">
              {startDate.toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className="text-2xl font-bold text-primary">{startDate.getDate()}</div>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
        {event.excerpt && (
          <CardDescription className="line-clamp-3">{event.excerpt}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3 text-sm">
          {/* Date and Time */}
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">{formattedDate}</div>
              <div className="text-muted-foreground">
                {event.eventDetails.startTime}
                {event.eventDetails.endTime && ` - ${event.eventDetails.endTime}`}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">{event.eventDetails.location}</div>
              {event.eventDetails.city && (
                <div className="text-muted-foreground">
                  {event.eventDetails.city}
                  {event.eventDetails.country && `, ${event.eventDetails.country}`}
                </div>
              )}
            </div>
          </div>

          {/* Attendee Count */}
          {event.attendeeCount && event.attendeeCount > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{event.attendeeCount} Going</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/events/${event.slug}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
