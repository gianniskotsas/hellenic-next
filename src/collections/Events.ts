import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'location', 'status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full event description and details',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Short summary for event listings',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Main event image/poster',
      },
    },
    {
      name: 'eventDetails',
      type: 'group',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          required: false,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
            description: 'Leave empty if single-day event',
          },
        },
        {
          name: 'startTime',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "6:30 PM" or "18:30"',
          },
        },
        {
          name: 'endTime',
          type: 'text',
          required: false,
          admin: {
            description: 'e.g., "10:30 PM" or "22:30"',
          },
        },
        {
          name: 'location',
          type: 'text',
          required: true,
          admin: {
            description: 'Venue name',
          },
        },
        {
          name: 'address',
          type: 'text',
          required: false,
          admin: {
            description: 'Full address',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: false,
        },
        {
          name: 'country',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'registration',
      type: 'group',
      fields: [
        {
          name: 'registrationUrl',
          type: 'text',
          required: false,
          admin: {
            description: 'External registration link (e.g., Eventbrite, Luma)',
          },
        },
        {
          name: 'registrationButtonText',
          type: 'text',
          required: false,
          admin: {
            description: 'Custom button text (default: "Register")',
          },
        },
        {
          name: 'maxAttendees',
          type: 'number',
          required: false,
          admin: {
            description: 'Maximum number of attendees (optional)',
          },
        },
        {
          name: 'registrationDeadline',
          type: 'date',
          required: false,
          admin: {
            description: 'Last day to register',
          },
        },
      ],
    },
    {
      name: 'organizers',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
    {
      name: 'attendeeCount',
      type: 'number',
      required: false,
      admin: {
        description: 'Number of people attending (e.g., "23 Going")',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Upcoming',
          value: 'upcoming',
        },
        {
          label: 'Ongoing',
          value: 'ongoing',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this event on the homepage',
      },
    },
    {
      name: 'tags',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Event categories/tags (e.g., networking, tech, social)',
      },
    },
  ],
  timestamps: true,
}
