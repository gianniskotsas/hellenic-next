import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Fix for R2 storage plugin not setting URL in production
        // Ensure url field is populated based on filename
        if (data.filename && !data.url) {
          data.url = `/api/media/file/${data.filename}`
        }
        return data
      },
    ],
  },
}
