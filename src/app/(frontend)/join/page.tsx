import { Navigation } from '@/components/Navigation'
import { MembershipForm } from '@/components/MembershipForm'

export const metadata = {
  title: 'Join Hellenic Next - Membership Application',
  description: 'Join our global community of Greek professionals. Apply for membership today.',
}

export default function JoinPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Join Our Community
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with Greek professionals from around the world. Whether you&apos;re in tech, business,
              or any other field, there&apos;s a place for you here.
            </p>
          </div>
          <MembershipForm />
        </div>
      </main>
    </>
  )
}
