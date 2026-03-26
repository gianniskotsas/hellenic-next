'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface Contact {
  id: string
  firstName?: string | null
  lastName?: string | null
  email: string
  subscribed: boolean
  properties: Record<string, string>
  contactBookId: string
  createdAt: string
  updatedAt: string
}

interface SubscribersResponse {
  contacts: Contact[]
  book: string
  page: number
  limit: number
}

const BOOK_LABELS: Record<string, string> = {
  all: 'All Contact Books',
  nl: 'Netherlands',
  global: 'Global',
}

const SubscribersView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [book, setBook] = useState<'all' | 'nl' | 'global'>('all')
  const [page, setPage] = useState(1)
  const limit = 25

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/subscribers?book=${book}&page=${page}&limit=${limit}`,
        { credentials: 'include' },
      )
      if (!response.ok) {
        const data = (await response.json()) as { message?: string }
        setError(data.message || 'Failed to fetch subscribers')
        setContacts([])
        return
      }
      const data = (await response.json()) as SubscribersResponse
      setContacts(data.contacts)
    } catch {
      setError('Network error while fetching subscribers')
      setContacts([])
    } finally {
      setLoading(false)
    }
  }, [book, page])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const handleBookChange = (newBook: 'all' | 'nl' | 'global') => {
    setBook(newBook)
    setPage(1)
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Subscribers</h1>
          <div style={styles.controls}>
            <select
              value={book}
              onChange={(e) => handleBookChange(e.target.value as 'all' | 'nl' | 'global')}
              style={styles.select}
            >
              <option value="all">All Contact Books</option>
              <option value="nl">Netherlands</option>
              <option value="global">Global</option>
            </select>
            <button type="button" onClick={fetchSubscribers} style={styles.refreshButton}>
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading subscribers...</p>
          </div>
        ) : contacts.length === 0 && !error ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText}>No subscribers found in {BOOK_LABELS[book] || book}.</p>
          </div>
        ) : (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>First Name</th>
                    <th style={styles.th}>Last Name</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Country</th>
                    <th style={styles.th}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} style={styles.tr}>
                      <td style={styles.td}>{contact.email}</td>
                      <td style={styles.td}>{contact.firstName || '—'}</td>
                      <td style={styles.td}>{contact.lastName || '—'}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: contact.subscribed ? '#dcfce7' : '#fee2e2',
                            color: contact.subscribed ? '#166534' : '#991b1b',
                          }}
                        >
                          {contact.subscribed ? 'Subscribed' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td style={styles.td}>{contact.properties?.country || '—'}</td>
                      <td style={styles.td}>{formatDate(contact.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={styles.pagination}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  ...styles.pageButton,
                  opacity: page <= 1 ? 0.5 : 1,
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>Page {page}</span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={contacts.length < limit}
                style={{
                  ...styles.pageButton,
                  opacity: contacts.length < limit ? 0.5 : 1,
                  cursor: contacts.length < limit ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SubscribersView

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  container: {
    backgroundColor: '#fafafa',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#111827',
  },
  controls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    color: '#374151',
    outline: 'none',
  },
  refreshButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    color: '#374151',
  },
  errorBanner: {
    padding: '12px 24px',
    backgroundColor: '#fef2f2',
    borderBottom: '1px solid #fecaca',
    color: '#991b1b',
    fontSize: '14px',
  },
  loadingContainer: {
    padding: '48px 24px',
    textAlign: 'center' as const,
  },
  loadingText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  emptyContainer: {
    padding: '48px 24px',
    textAlign: 'center' as const,
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  tableContainer: {
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '14px',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontWeight: 600,
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '12px 16px',
    color: '#374151',
    whiteSpace: 'nowrap' as const,
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 500,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
  pageButton: {
    padding: '6px 14px',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#374151',
  },
  pageInfo: {
    fontSize: '13px',
    color: '#6b7280',
  },
}
