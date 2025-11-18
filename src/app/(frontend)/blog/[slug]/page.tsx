import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Button } from '@/components/ui/button'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const post = docs[0]

  if (!post) {
    return {
      title: 'Post Not Found - Hellenic Next',
    }
  }

  return {
    title: `${post.title} - Hellenic Next Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          status: {
            equals: 'published',
          },
        },
      ],
    },
    limit: 1,
  })

  const post = docs[0]

  if (!post) {
    notFound()
  }

  const featuredImage = post.featuredImage
  const imageUrl = typeof featuredImage === 'object' ? featuredImage?.url : null

  // Get related posts
  const relatedPostsIds = post.relatedPosts
    ? post.relatedPosts
        .map((p: any) => (typeof p === 'object' ? p.id : p))
        .filter(Boolean)
    : []

  let relatedPosts: any[] = []

  if (relatedPostsIds.length > 0) {
    const { docs: related } = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          {
            id: {
              in: relatedPostsIds,
            },
          },
          {
            status: {
              equals: 'published',
            },
          },
        ],
      },
      limit: 3,
    })
    relatedPosts = related
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Back Button */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button asChild variant="ghost">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <article className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <header className="max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedDate}>
                  {new Date(post.publishedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>

              {post.author?.name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
              )}
            </div>

            {/* Categories/Tags */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category: any) => {
                  const cat = typeof category === 'object' ? category : null
                  if (!cat) return null

                  return (
                    <span
                      key={cat.id}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {cat.name}
                    </span>
                  )
                })}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {imageUrl && (
            <div className="relative w-full h-[400px] lg:h-[500px] mb-12 rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <RichTextRenderer content={post.content} />
            </div>

            {/* Author Bio */}
            {post.author && (post.author.bio || post.author.avatar) && (
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    {post.author.avatar && typeof post.author.avatar === 'object' && (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={post.author.avatar.url}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{post.author.name}</h3>
                      {post.author.title && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {post.author.title}
                        </p>
                      )}
                      {post.author.bio && (
                        <p className="text-muted-foreground">{post.author.bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost: any) => {
                    const relatedImage = relatedPost.featuredImage
                    const relatedImageUrl =
                      typeof relatedImage === 'object' ? relatedImage?.url : null

                    return (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="group"
                      >
                        <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                          {relatedImageUrl && (
                            <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
                              <Image
                                src={relatedImageUrl}
                                alt={relatedPost.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                              {relatedPost.title}
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
    </>
  )
}
