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
    defaultColumns: ['subject', 'recipientGroup', 'status', 'sentAt'],
    description: 'Create and send newsletters to community members.',
  },
  fields: [
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
      label: 'Newsletter Heading',
      admin: {
        description: 'The main heading displayed in the email body',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Newsletter Content',
      admin: {
        description: 'The main content of the newsletter. Supports HTML for formatting.',
        rows: 12,
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Call to Action Text',
      admin: {
        description: 'Button text (e.g., "Read More", "Register Now"). Leave empty for no button.',
      },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'Call to Action URL',
      admin: {
        description: 'URL the button links to',
      },
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
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'totalRecipients',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Total recipients targeted',
      },
    },
    {
      name: 'totalSent',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Emails successfully sent',
      },
    },
    {
      name: 'totalFailed',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Emails that failed to send',
      },
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
