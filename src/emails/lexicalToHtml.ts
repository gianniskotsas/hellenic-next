/**
 * Converts Payload CMS Lexical rich-text JSON into email-safe inline-styled HTML.
 *
 * Palette:
 *   background  #f5f0ea
 *   primary     #2b2b2b
 *   muted       #666666
 */

interface LexicalNode {
  type: string
  text?: string
  format?: number
  tag?: string
  listType?: string
  children?: LexicalNode[]
  fields?: { url?: string; newTab?: boolean }
  // indent for nested lists
  indent?: number
}

interface LexicalRoot {
  root?: {
    children?: LexicalNode[]
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderTextNode(node: LexicalNode): string {
  let html = escapeHtml(node.text || '')
  const fmt = node.format || 0

  if (fmt & 1) html = `<strong>${html}</strong>`
  if (fmt & 2) html = `<em>${html}</em>`
  if (fmt & 8) html = `<u>${html}</u>`
  if (fmt & 16) {
    html = `<code style="background-color:#f0ebe4;padding:2px 6px;border-radius:3px;font-family:monospace;font-size:14px;">${html}</code>`
  }
  if (fmt & 4) html = `<s>${html}</s>`

  return html
}

function renderChildren(children: LexicalNode[] | undefined): string {
  if (!children) return ''
  return children.map((child) => renderNode(child)).join('')
}

function renderNode(node: LexicalNode): string {
  switch (node.type) {
    case 'text':
      return renderTextNode(node)

    case 'linebreak':
      return '<br />'

    case 'paragraph':
      return `<p style="margin:0 0 16px 0;line-height:1.6;color:#2b2b2b;font-size:16px;">${renderChildren(node.children)}</p>`

    case 'heading': {
      const sizes: Record<string, string> = {
        h1: 'font-size:28px;line-height:1.3;',
        h2: 'font-size:24px;line-height:1.3;',
        h3: 'font-size:20px;line-height:1.3;',
        h4: 'font-size:18px;line-height:1.3;',
        h5: 'font-size:16px;line-height:1.3;',
        h6: 'font-size:14px;line-height:1.3;',
      }
      const tag = node.tag || 'h2'
      const sizeStyle = sizes[tag] || sizes.h2
      return `<${tag} style="margin:0 0 12px 0;color:#2b2b2b;font-weight:700;${sizeStyle}">${renderChildren(node.children)}</${tag}>`
    }

    case 'list': {
      const tag = node.tag === 'ol' ? 'ol' : 'ul'
      const listStyle = node.tag === 'ol' ? 'decimal' : 'disc'
      return `<${tag} style="margin:0 0 16px 0;padding-left:24px;list-style-type:${listStyle};color:#2b2b2b;font-size:16px;line-height:1.6;">${renderChildren(node.children)}</${tag}>`
    }

    case 'listitem': {
      const inner = renderChildren(node.children)
      return `<li style="margin:0 0 6px 0;">${inner}</li>`
    }

    case 'quote':
      return `<blockquote style="margin:0 0 16px 0;padding:12px 20px;border-left:4px solid #2b2b2b;color:#666666;font-style:italic;">${renderChildren(node.children)}</blockquote>`

    case 'link': {
      const href = node.fields?.url || '#'
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeHtml(href)}"${target} style="color:#2b2b2b;text-decoration:underline;">${renderChildren(node.children)}</a>`
    }

    case 'horizontalrule':
      return '<hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />'

    default:
      if (node.children) return renderChildren(node.children)
      return ''
  }
}

/**
 * Convert Lexical JSON (as stored by Payload CMS rich text field) to
 * inline-styled HTML suitable for email rendering.
 *
 * Accepts either the full Lexical object `{ root: { children: [...] } }`
 * or a plain string (returned as-is for backward compat with textarea data).
 */
export function lexicalToHtml(content: LexicalRoot | string | null | undefined): string {
  if (!content) return ''
  if (typeof content === 'string') return content

  const children = content.root?.children
  if (!children || children.length === 0) return ''

  return children.map((node) => renderNode(node)).join('')
}
