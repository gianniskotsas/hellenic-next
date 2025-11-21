import { Navigation } from '@/components/Navigation'
import { MembershipForm } from '@/components/MembershipForm'

export const metadata = {
  title: 'Join Hellenic Next - Membership Application',
  description: 'Join our global community of Greek professionals. Apply for membership today.',
}

export default function JoinPage() {
  return (
    <>
      <main className="min-h-screen py-12 lg:py-20 px-4">
        <MembershipForm />
      </main>
    </>
  )
}
