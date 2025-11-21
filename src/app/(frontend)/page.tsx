import NavbarDemo from '@/components/resizable-navbar-demo'
import { Hero } from '@/components/Hero'
import { FeaturedEvents } from '@/components/FeaturedEvents'
import { FeaturedBlogPosts } from '@/components/FeaturedBlogPosts'

// Force dynamic rendering - required for Cloudflare Pages deployment
// as Payload CMS needs access to D1 database at runtime
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return (
    <>
      <main className="px-4">
        <Hero />
        <FeaturedEvents />
        <FeaturedBlogPosts />
      </main>
    </>
  )
}
