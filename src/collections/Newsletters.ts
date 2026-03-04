import type { CollectionConfig } from 'payload'

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'template', 'recipientGroup', 'status', 'sentAt'],
    description: 'Create and send newsletters to community members.',
  },
  fields: [
    {
      name: 'template',
      type: 'select',
      required: true,
      defaultValue: 'general',
      label: 'Email Template',
      options: [
        { label: 'General Newsletter', value: 'general' },
        { label: 'Event Invitation', value: 'event' },
      ],
      admin: {
        description: 'Choose the email layout template',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Email Subject',
      admin: {
        description: 'The subject line of the newsletter email',
      },
    },
    {
      name: 'previewText',
      type: 'text',
      label: 'Preview Text',
      admin: {
        description: 'Short preview text shown in email clients (before opening)',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
      admin: {
        description: 'Main heading displayed in the email body',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      admin: {
        description: 'Displayed below the heading (e.g. "Networking & Holiday Cheer in Amsterdam")',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero / Illustration Image',
      admin: {
        description: 'An image displayed in the email (e.g. event illustration, banner). Logos are hardcoded in templates.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      label: 'Content',
      admin: {
        description: 'The main content of the newsletter. Use the toolbar for headings, bold, italic, lists, links, etc.',
      },
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: 'Call to Action Buttons',
      maxRows: 3,
      admin: {
        description: 'Add one or more CTA buttons. Leave empty for no buttons.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Button Text',
          admin: { description: 'e.g. "RSVP Now", "Read More", "Register"' },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Button URL',
        },
      ],
    },
    {
      name: 'eventDetails',
      type: 'group',
      label: 'Event Details',
      admin: {
        description: 'Only used when the Event Invitation template is selected.',
        condition: (_data, siblingData) => siblingData?.template === 'event',
      },
      fields: [
        {
          name: 'eventDate',
          type: 'text',
          label: 'When',
          admin: {
            description: 'e.g. "Wednesday, December 10th, 18:30"',
          },
        },
        {
          name: 'eventLocation',
          type: 'text',
          label: 'Location',
          admin: {
            description: 'e.g. "A Beautiful Mess, Amsterdam"',
          },
        },
      ],
    },
    {
      name: 'recipientGroup',
      type: 'select',
      required: true,
      defaultValue: 'all',
      label: 'Recipients',
      options: [
        { label: 'All Members', value: 'all' },
        { label: 'Global Subscribers', value: 'global' },
        { label: 'Netherlands Subscribers', value: 'nl' },
      ],
      admin: {
        description: 'Choose which group of members will receive this newsletter',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sending', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Status is updated automatically when sending',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'totalRecipients',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Total recipients targeted' },
    },
    {
      name: 'totalSent',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Emails successfully sent' },
    },
    {
      name: 'totalFailed',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Emails that failed to send' },
    },
    {
      name: 'newsletterActions',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/NewsletterActions',
        },
      },
    },
  ],
  timestamps: true,
}
