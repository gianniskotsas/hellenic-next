import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { FeaturedBlogPosts } from '@/components/FeaturedBlogPosts'

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
