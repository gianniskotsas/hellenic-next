import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Event, Media as MediaType } from '@/payload-types'
import { Calendar, MapPin, Users, ExternalLink, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RichTextRenderer } from '@/components/RichTextRenderer'

export const dynamic = 'force-dynamic'

interface EventPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const events = await payload.find({
    collection: 'events',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const event = events.docs[0]

  if (!event) {
    return {
      title: 'Event Not Found',
    }
  }

  return {
    title: `${event.title} | Hellenic Next`,
    description: event.excerpt || 'Join us for this event',
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const events = await payload.find({
    collection: 'events',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const event = events.docs[0]

  if (!event) {
    notFound()
  }

  const featuredImage = typeof event.featuredImage === 'object' ? event.featuredImage as MediaType : null
  const startDate = new Date(event.eventDetails.startDate)
  const endDate = event.eventDetails.endDate ? new Date(event.eventDetails.endDate) : null

  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const registrationUrl = event.registration?.registrationUrl
  const buttonText = event.registration?.registrationButtonText || 'Register'

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-[400px_1fr] gap-8 max-w-7xl mx-auto">
          {/* Left Column - Event Image & Host Info */}
          <div className="space-y-6">
            {/* Event Image */}
            {featuredImage?.url && (
              <div className="relative aspect-square w-full bg-card rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={featuredImage.url}
                  alt={featuredImage.alt || event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Hosted By Section */}
            {event.organizers && event.organizers.length > 0 && (
              <div className="bg-card rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
                  Hosted By
                </h3>
                <div className="space-y-4">
                  {event.organizers.map((organizer, index) => {
                    const avatar = typeof organizer.avatar === 'object' ? organizer.avatar as MediaType : null
                    return (
                      <div key={index} className="flex items-center gap-3">
                        {avatar?.url ? (
                          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={avatar.url}
                              alt={organizer.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-semibold text-lg">
                              {organizer.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-foreground">{organizer.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Attendee Count */}
            {event.attendeeCount && event.attendeeCount > 0 && (
              <div className="bg-card rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">{event.attendeeCount} Going</div>
                    <div className="text-sm text-muted-foreground">people attending</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Event Details */}
          <div className="space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {event.title}
              </h1>
            </div>

            {/* Date, Time, Location */}
            <div className="bg-card rounded-lg shadow p-6 space-y-4">
              {/* Date Badge */}
              <div className="flex items-start gap-4">
                <div className="bg-muted rounded-lg p-3 text-center min-w-[60px] flex-shrink-0">
                  <div className="text-xs font-semibold text-primary uppercase">
                    {startDate.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {startDate.getDate()}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground text-lg mb-1">{formattedDate}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {event.eventDetails.startTime}
                      {event.eventDetails.endTime && ` - ${event.eventDetails.endTime}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 pt-4 border-t border-border">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {event.eventDetails.location}
                  </h3>
                  {event.eventDetails.address && (
                    <p className="text-muted-foreground text-sm">{event.eventDetails.address}</p>
                  )}
                  {(event.eventDetails.city || event.eventDetails.country) && (
                    <p className="text-muted-foreground text-sm">
                      {event.eventDetails.city}
                      {event.eventDetails.country && `, ${event.eventDetails.country}`}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Button */}
            {registrationUrl && (
              <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Registration</h2>
                <p className="text-muted-foreground mb-4">
                  Welcome! To join the event, please register below.
                </p>
                <a href={registrationUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" className="w-full text-lg">
                    {buttonText}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                {event.registration?.registrationDeadline && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Registration closes on{' '}
                    {new Date(event.registration.registrationDeadline).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
                {event.registration?.maxAttendees && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Limited to {event.registration.maxAttendees} attendees
                  </p>
                )}
              </div>
            )}

            {/* About Event */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">About Event</h2>
              <div className="prose prose-lg max-w-none text-foreground">
                {event.description && (
                  <RichTextRenderer content={event.description} />
                )}
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tagItem, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {tagItem.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
