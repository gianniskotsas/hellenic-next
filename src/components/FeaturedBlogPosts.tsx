import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Calendar } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function FeaturedBlogPosts() {
  const payload = await getPayload({ config })

  // Fetch featured blog posts
  const { docs: posts } = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        {
          status: {
            equals: 'published',
          },
        },
        {
          featured: {
            equals: true,
          },
        },
      ],
    },
    limit: 3,
    sort: '-publishedDate',
  })

  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Featured Stories
            </h2>
            <p className="text-muted-foreground text-lg">
              Insights and updates from our community
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post: any) => {
            const featuredImage = post.featuredImage
            const imageUrl = typeof featuredImage === 'object' ? featuredImage?.url : null

            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  {imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.publishedDate}>
                        {new Date(post.publishedDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  {post.author?.name && (
                    <CardContent>
                      <div className="flex items-center gap-3">
                        {post.author.avatar && typeof post.author.avatar === 'object' && (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={post.author.avatar.url}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {post.author.name}
                          </p>
                          {post.author.title && (
                            <p className="text-xs text-muted-foreground">
                              {post.author.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
