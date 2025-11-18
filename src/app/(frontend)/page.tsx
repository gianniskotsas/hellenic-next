import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { FeaturedBlogPosts } from '@/components/FeaturedBlogPosts'

// Force dynamic rendering - required for Cloudflare Pages deployment
// as Payload CMS needs access to D1 database at runtime
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <FeaturedBlogPosts />
      </main>
    </>
  )
}
