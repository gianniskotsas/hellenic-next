import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { BlogPost, Media } from '@/payload-types'

export const metadata = {
  title: 'Blog - Hellenic Next',
  description: 'Read the latest insights and updates from the Hellenic Next community.',
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const limit = 9

  const payload = await getPayload({ config })

  const { docs: posts, totalPages, hasNextPage, hasPrevPage } = await payload.find({
    collection: 'blog-posts',
    where: {
      status: {
        equals: 'published',
      },
    },
    limit,
    page,
    sort: '-publishedDate',
  })

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Header */}
        <div className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover insights, success stories, and updates from Greek professionals around the
              world.
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {posts.map((post: BlogPost) => {
                  const featuredImage = post.featuredImage as Media | null
                  const imageUrl = featuredImage?.url || null

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
                              {post.author.avatar &&
                                typeof post.author.avatar === 'object' && (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {hasPrevPage && (
                    <Button asChild variant="outline">
                      <Link href={`/blog?page=${page - 1}`}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Link>
                    </Button>
                  )}

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        asChild
                        variant={pageNum === page ? 'default' : 'outline'}
                        size="icon"
                      >
                        <Link href={`/blog?page=${pageNum}`}>{pageNum}</Link>
                      </Button>
                    ))}
                  </div>

                  {hasNextPage && (
                    <Button asChild variant="outline">
                      <Link href={`/blog?page=${page + 1}`}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
