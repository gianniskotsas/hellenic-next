import React from 'react'

interface RichTextRendererProps {
  content: any
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content || !content.root || !content.root.children) {
    return null
  }

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (node.type === 'paragraph') {
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </p>
      )
    }

    if (node.type === 'heading') {
      const HeadingTag = `h${node.tag}` as keyof React.JSX.IntrinsicElements
      const headingClasses = {
        h1: 'text-4xl font-bold mb-6 mt-8',
        h2: 'text-3xl font-bold mb-4 mt-6',
        h3: 'text-2xl font-semibold mb-3 mt-5',
        h4: 'text-xl font-semibold mb-2 mt-4',
        h5: 'text-lg font-semibold mb-2 mt-3',
        h6: 'text-base font-semibold mb-2 mt-3',
      }

      return (
        <HeadingTag key={index} className={headingClasses[node.tag as keyof typeof headingClasses]}>
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </HeadingTag>
      )
    }

    if (node.type === 'list') {
      const ListTag = node.tag === 'ol' ? 'ol' : 'ul'
      const listClass = node.tag === 'ol' ? 'list-decimal' : 'list-disc'

      return (
        <ListTag key={index} className={`${listClass} ml-6 mb-4 space-y-2`}>
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </ListTag>
      )
    }

    if (node.type === 'listitem') {
      return (
        <li key={index} className="leading-relaxed">
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </li>
      )
    }

    if (node.type === 'quote') {
      return (
        <blockquote
          key={index}
          className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground"
        >
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </blockquote>
      )
    }

    if (node.type === 'link') {
      return (
        <a
          key={index}
          href={node.fields?.url || '#'}
          target={node.fields?.newTab ? '_blank' : undefined}
          rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline"
        >
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </a>
      )
    }

    if (node.type === 'text') {
      let text = node.text || ''

      if (node.format) {
        if (node.format & 1) {
          // Bold
          text = <strong key={index}>{text}</strong>
        }
        if (node.format & 2) {
          // Italic
          text = <em key={index}>{text}</em>
        }
        if (node.format & 8) {
          // Code
          text = (
            <code key={index} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
              {text}
            </code>
          )
        }
        if (node.format & 16) {
          // Underline
          text = <u key={index}>{text}</u>
        }
        if (node.format & 32) {
          // Strikethrough
          text = <s key={index}>{text}</s>
        }
      }

      return text
    }

    if (node.type === 'linebreak') {
      return <br key={index} />
    }

    // Default: render children if available
    if (node.children) {
      return <React.Fragment key={index}>{node.children.map(renderNode)}</React.Fragment>
    }

    return null
  }

  return (
    <div className="prose prose-lg max-w-none">
      {content.root.children.map((node: any, index: number) => renderNode(node, index))}
    </div>
  )
}
