'use client'

import React, { useState, useCallback } from 'react'
import { useDocumentInfo, useAuth } from '@payloadcms/ui'

type SendStatus = 'idle' | 'loading' | 'success' | 'error'

const NewsletterActions: React.FC = () => {
  const documentInfo = useDocumentInfo()
  const { user } = useAuth()
  const id = documentInfo?.id

  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)
  const [sendTestStatus, setSendTestStatus] = useState<SendStatus>('idle')
  const [sendLiveStatus, setSendLiveStatus] = useState<SendStatus>('idle')
  const [testEmail, setTestEmail] = useState((user as Record<string, unknown>)?.email as string || '')
  const [message, setMessage] = useState('')
  const [messageIsError, setMessageIsError] = useState(false)

  const handlePreview = useCallback(async () => {
    if (!id) {
      setMessage('Please save the newsletter first before previewing.')
      return
    }
    try {
      const response = await fetch(`/api/newsletters/preview?id=${id}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        const data = await response.json() as { message?: string }
        setMessage(data.message || 'Failed to load preview')
        return
      }
      const html = await response.text()
      setPreviewHtml(html)
      setShowPreview(true)
      setMessage('')
    } catch {
      setMessage('Failed to load preview')
    }
  }, [id])

  const handleSendTest = useCallback(async () => {
    if (!id) {
      setMessage('Please save the newsletter first before sending a test.')
      return
    }
    if (!testEmail) {
      setMessage('Please enter a test email address.')
      return
    }

    setSendTestStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletters/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, testEmail }),
      })

      const data = await response.json() as { message?: string }
      if (response.ok) {
        setSendTestStatus('success')
        setMessageIsError(false)
        setMessage(data.message ?? '')
      } else {
        setSendTestStatus('error')
        setMessageIsError(true)
        setMessage(data.message || 'Failed to send test email')
      }
    } catch {
      setSendTestStatus('error')
      setMessageIsError(true)
      setMessage('Network error while sending test email')
    }
  }, [id, testEmail])

  const handleSendLive = useCallback(async () => {
    if (!id) {
      setMessage('Please save the newsletter first before sending.')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to send this newsletter to all recipients? This action cannot be undone.',
    )
    if (!confirmed) return

    setSendLiveStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletters/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      })

      const data = await response.json() as { message?: string }
      if (response.ok) {
        setSendLiveStatus('success')
        setMessageIsError(false)
        setMessage(data.message ?? '')
      } else {
        setSendLiveStatus('error')
        setMessageIsError(true)
        setMessage(data.message || 'Failed to send newsletter')
      }
    } catch {
      setSendLiveStatus('error')
      setMessageIsError(true)
      setMessage('Network error while sending newsletter')
    }
  }, [id])

  if (!id) {
    return (
      <div style={styles.container}>
        <div style={styles.notice}>
          <strong>Newsletter Actions</strong>
          <p style={styles.noticeText}>
            Save the newsletter as a draft first to unlock preview and send options.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>Newsletter Actions</h3>

        <div style={styles.section}>
          <button type="button" onClick={handlePreview} style={styles.previewButton}>
            Preview Email
          </button>
        </div>

        {showPreview && previewHtml && (
          <div style={styles.previewContainer}>
            <div style={styles.previewHeader}>
              <span style={styles.previewLabel}>Email Preview</span>
              <button type="button" onClick={() => setShowPreview(false)} style={styles.closeButton}>
                Close
              </button>
            </div>
            <iframe
              srcDoc={previewHtml}
              title="Newsletter Preview"
              style={styles.previewFrame}
              sandbox="allow-same-origin"
            />
          </div>
        )}

        <div style={styles.section}>
          <label style={styles.label}>Send Test Email</label>
          <div style={styles.testRow}>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              style={styles.input}
            />
            <button
              type="button"
              onClick={handleSendTest}
              disabled={sendTestStatus === 'loading'}
              style={{
                ...styles.testButton,
                opacity: sendTestStatus === 'loading' ? 0.6 : 1,
              }}
            >
              {sendTestStatus === 'loading' ? 'Sending...' : 'Send Test'}
            </button>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.section}>
          <button
            type="button"
            onClick={handleSendLive}
            disabled={sendLiveStatus === 'loading'}
            style={{
              ...styles.sendLiveButton,
              opacity: sendLiveStatus === 'loading' ? 0.6 : 1,
            }}
          >
            {sendLiveStatus === 'loading'
              ? 'Sending to all recipients...'
              : 'Send Newsletter to All Recipients'}
          </button>
          <p style={styles.warning}>
            This will send the newsletter to all members in the selected recipient group. Make sure
            to send a test first.
          </p>
        </div>

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor: messageIsError ? '#fef2f2' : '#f0fdf4',
              borderColor: messageIsError ? '#fecaca' : '#bbf7d0',
              color: messageIsError ? '#991b1b' : '#166534',
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsletterActions

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '24px',
    marginBottom: '24px',
  },
  notice: {
    padding: '16px 20px',
    backgroundColor: '#fefce8',
    border: '1px solid #fde68a',
    borderRadius: '6px',
  },
  noticeText: {
    margin: '8px 0 0 0',
    fontSize: '14px',
    color: '#713f12',
  },
  card: {
    padding: '24px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
  },
  section: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '6px',
    color: '#374151',
  },
  testRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
  },
  previewButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    color: '#374151',
  },
  testButton: {
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  sendLiveButton: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  warning: {
    margin: '8px 0 0 0',
    fontSize: '12px',
    color: '#6b7280',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '20px 0',
  },
  message: {
    marginTop: '16px',
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '14px',
  },
  previewContainer: {
    marginBottom: '16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #d1d5db',
  },
  previewLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#374151',
  },
  closeButton: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    color: '#6b7280',
  },
  previewFrame: {
    width: '100%',
    height: '500px',
    border: 'none',
    backgroundColor: '#ffffff',
  },
}
