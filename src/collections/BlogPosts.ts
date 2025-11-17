import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedDate', 'updatedAt'],
    description: 'Blog posts for the Hellenic Next community',
  },
  access: {
    read: ({ req: { user } }) => {
      // Public can read published posts
      if (user) return true

      return {
        status: {
          equals: 'published',
        },
      }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Post Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly version of the title (e.g., "connecting-greek-professionals-globally")',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      label: 'Excerpt',
      admin: {
        description: 'Short summary of the post (used in listings and previews)',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Featured Image',
      admin: {
        description: 'Main image for the blog post',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Post Content',
    },
    {
      name: 'author',
      type: 'group',
      label: 'Author Information',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Author Name',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Author Title/Role',
          admin: {
            description: 'e.g., "Community Manager", "Guest Contributor"',
          },
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Author Bio',
          admin: {
            description: 'Brief biography of the author',
          },
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Author Avatar',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
      label: 'Categories',
      admin: {
        description: 'Select one or more categories for this post',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for additional organization and filtering',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      label: 'Published Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Post',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this post in the featured section on the homepage',
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      label: 'Related Posts',
      admin: {
        description: 'Manually select related posts to show at the end of this article',
      },
    },
  ],
  timestamps: true,
}
