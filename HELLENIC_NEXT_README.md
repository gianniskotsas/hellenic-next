# Hellenic Next Website Documentation

A professional community website for connecting Greek professionals across the globe, built with Next.js 15, Payload CMS 3, and shadcn/ui components.

## 🎨 Design System

### Color Scheme

The website uses a warm, professional color palette:

- **Background**: `#f5f0ea` (Cream/Off-white) - Creates an inviting, warm feel
- **Primary/Foreground**: `#2b2b2b` (Dark Gray) - Main text color
- **Accent**: `#296ac0` (Blue) - CTAs and interactive elements
- **Secondary**: `#b5bbc8` (Light Gray) - Secondary text and subtle elements

### Typography

- **Font Family**: Inter (Google Fonts)
- **Modern, clean sans-serif** optimized for readability
- **Responsive sizing** that adapts to different screen sizes

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15.4.7 (App Router)
- **CMS**: Payload CMS 3.63.0
- **Database**: SQLite D1 (Cloudflare)
- **Storage**: Cloudflare R2
- **UI Components**: shadcn/ui (React 19.1.0)
- **Styling**: Tailwind CSS 4.1.17
- **Form Handling**: React Hook Form + Zod
- **Rich Text Editor**: Lexical Editor
- **Deployment**: Cloudflare Workers

### Project Structure

```
hellenic-next/
├── src/
│   ├── app/
│   │   ├── (frontend)/          # Public-facing pages
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── join/            # Membership form
│   │   │   ├── blog/            # Blog listing & posts
│   │   │   ├── about/           # About page
│   │   │   ├── api/             # API routes
│   │   │   ├── globals.css      # Global styles
│   │   │   └── layout.tsx       # Root layout
│   │   └── (payload)/           # Payload CMS admin
│   ├── collections/             # Payload CMS collections
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── Members.ts           # NEW: Membership submissions
│   │   ├── BlogPosts.ts         # NEW: Blog posts
│   │   └── BlogCategories.ts   # NEW: Blog categories
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── Navigation.tsx       # Site navigation
│   │   ├── Hero.tsx            # Hero section
│   │   ├── FeaturedBlogPosts.tsx
│   │   ├── MembershipForm.tsx
│   │   └── RichTextRenderer.tsx
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   └── payload.config.ts        # Payload configuration
├── components.json              # shadcn/ui config
├── tailwind.config.ts           # Tailwind configuration
└── package.json
```

## 📦 Collections (Payload CMS)

### 1. Members Collection

**Purpose**: Store membership form submissions

**Fields**:
- `firstName` (text, required)
- `lastName` (text, required)
- `email` (email, required, unique)
- `country` (select, required) - 195 countries available
- `status` (select) - pending/approved/rejected

**Access Control**:
- Create: Public (anyone can submit the form)
- Read/Update/Delete: Admin only

**Admin Panel**: `/admin/collections/members`

### 2. BlogPosts Collection

**Purpose**: Manage blog content

**Fields**:
- `title` (text, required)
- `slug` (text, required, unique)
- `excerpt` (textarea, required) - Short summary
- `featuredImage` (upload) - Main image
- `content` (richText, required) - Lexical editor
- `author` (group):
  - `name` (text, required)
  - `title` (text) - Job title/role
  - `bio` (textarea)
  - `avatar` (upload)
- `categories` (relationship) - Multiple categories
- `tags` (array) - Custom tags
- `publishedDate` (date, required)
- `status` (select) - draft/published/archived
- `featured` (checkbox) - Show on homepage
- `relatedPosts` (relationship) - Suggested posts

**Access Control**:
- Create/Update/Delete: Admin only
- Read: Public for published posts, admin for drafts

**Admin Panel**: `/admin/collections/blog-posts`

### 3. BlogCategories Collection

**Purpose**: Organize blog posts by category

**Fields**:
- `name` (text, required)
- `slug` (text, required, unique)
- `description` (textarea)

**Access Control**:
- Create/Update/Delete: Admin only
- Read: Public

**Admin Panel**: `/admin/collections/blog-categories`

## 🎯 Features Implemented

### 1. Home Page (`/`)

**Components**:
- Navigation bar with mobile menu
- Hero section with value propositions:
  - Global Network
  - Career Opportunities
  - Knowledge Sharing
- Featured blog posts section (displays up to 3 featured posts)

**Key Features**:
- Responsive design (mobile-first)
- Subtle Greek pattern background
- Clear CTAs ("Join Now", "Learn More")
- Dynamic content from Payload CMS

### 2. Membership Form (`/join`)

**Features**:
- Validated form with React Hook Form + Zod
- Required fields:
  - First Name
  - Last Name
  - Email (with email validation)
  - Country (searchable dropdown with 195 countries)
- Form states:
  - Idle
  - Submitting (with loading spinner)
  - Success (with confirmation message)
  - Error (with error details)
- Duplicate email detection
- Automatic submission to Payload CMS

**API Endpoint**: `/api/members` (POST)

**Validation**:
- Client-side: Zod schema
- Server-side: Field validation + unique email check

### 3. Blog Section

#### Blog Listing Page (`/blog`)

**Features**:
- Grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- Displays:
  - Featured image
  - Publication date
  - Title
  - Excerpt
  - Author info (name, title, avatar)
- Pagination (9 posts per page)
- "Back to Top" functionality
- Empty state message

#### Individual Blog Post Page (`/blog/[slug]`)

**Features**:
- Full post content with rich text rendering
- Featured image (hero style)
- Publication date and author info
- Category badges
- Author bio section (with avatar)
- Related posts section (up to 3 posts)
- "Back to Blog" navigation
- SEO-optimized metadata

**Rich Text Rendering**:
- Supports all Lexical editor features:
  - Headings (h1-h6)
  - Paragraphs
  - Lists (ordered/unordered)
  - Blockquotes
  - Links
  - Text formatting (bold, italic, code, underline, strikethrough)
  - Line breaks

### 4. About Page (`/about`)

**Features**:
- Mission statement
- Core values (4 cards):
  - Global Reach
  - Community First
  - Knowledge Sharing
  - Career Growth
- CTA section to join

### 5. Navigation Component

**Features**:
- Sticky header with backdrop blur
- Desktop menu (horizontal)
- Mobile menu (hamburger)
- Links:
  - Home
  - Blog
  - About
  - Join Now (primary button)
- Smooth transitions
- Responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js ^18.20.2 || >=20.9.0
- pnpm ^9 || ^10
- Cloudflare account (for deployment)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
# Create .env.local file
PAYLOAD_SECRET=your-secret-key-here
```

3. Generate types:
```bash
pnpm generate:types
```

4. Start development server:
```bash
pnpm dev
```

5. Access the site:
- Frontend: `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin`

### First-Time Setup

1. **Create Admin User**:
   - Visit `/admin`
   - Create your first admin account

2. **Add Blog Categories** (optional):
   - Go to `/admin/collections/blog-categories`
   - Create categories like "Tech", "Business", "Community", etc.

3. **Create Your First Blog Post**:
   - Go to `/admin/collections/blog-posts`
   - Fill in all required fields
   - Set status to "published"
   - Check "featured" to show on homepage

4. **Test Membership Form**:
   - Visit `/join`
   - Submit a test membership
   - Check `/admin/collections/members` to verify

## 📝 Content Management

### Creating a Blog Post

1. Navigate to `/admin/collections/blog-posts`
2. Click "Create New"
3. Fill in required fields:
   - **Title**: Post headline
   - **Slug**: URL-friendly version (e.g., "my-first-post")
   - **Excerpt**: 1-2 sentence summary
   - **Content**: Full post content (use Lexical editor)
   - **Author Name**: Your name
   - **Published Date**: When to publish
   - **Status**: Set to "published" when ready
4. Optional but recommended:
   - Upload a **Featured Image** (recommended: 1200x630px)
   - Add **Categories**
   - Add **Tags**
   - Fill in **Author Bio** and upload **Author Avatar**
   - Check **Featured** to show on homepage
5. Click "Save"

### Managing Members

1. Navigate to `/admin/collections/members`
2. View all membership submissions
3. Update **Status**:
   - **Pending**: Default for new submissions
   - **Approved**: Accepted member
   - **Rejected**: Declined application
4. Filter, search, and export data

### Organizing Categories

1. Navigate to `/admin/collections/blog-categories`
2. Create categories for organizing posts
3. Categories appear as badges on blog posts

## 🎨 Customization

### Changing Colors

Edit `src/app/(frontend)/globals.css`:

```css
:root {
  --background: 36 12% 93%;      /* Change background */
  --foreground: 0 0% 17%;        /* Change text color */
  --primary: 213 65% 45%;        /* Change accent/CTA color */
  --secondary: 220 15% 73%;      /* Change secondary color */
}
```

### Adding New Pages

1. Create a new file in `src/app/(frontend)/your-page/page.tsx`
2. Import and use the `Navigation` component
3. Add link to `src/components/Navigation.tsx`

### Customizing Components

All shadcn/ui components are in `src/components/ui/` and can be customized:
- Edit component files directly
- Or override styles with Tailwind classes

## 🔒 Security Features

### Form Validation
- Client-side validation with Zod schemas
- Server-side validation in API routes
- CSRF protection (Next.js default)

### Access Control
- Public routes: Home, Blog (published posts only), Join, About
- Protected routes: Admin panel, draft posts
- Role-based access in Payload collections

### Data Protection
- Email uniqueness validation
- SQL injection protection (Payload ORM)
- XSS protection (React default escaping)

## 📱 Responsive Design

The entire site is mobile-first and fully responsive:

**Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Key Responsive Features**:
- Hamburger menu on mobile
- Responsive grid layouts
- Flexible typography
- Touch-friendly tap targets
- Optimized images

## 🚀 Deployment

### Cloudflare Workers (Production)

1. Configure Wrangler:
```bash
# Update wrangler.jsonc with your settings
```

2. Deploy database:
```bash
pnpm run deploy:database
```

3. Deploy application:
```bash
pnpm run deploy:app
```

4. Access your site at your Cloudflare Workers URL

### Environment Variables

Required for production:
- `PAYLOAD_SECRET`: Strong random string
- `CLOUDFLARE_ENV`: production

## 🧪 Testing

Run tests:
```bash
pnpm test          # Unit tests (Vitest)
pnpm test:e2e      # E2E tests (Playwright)
```

## 📚 API Routes

### POST `/api/members`

Submit membership application

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "country": "GR"
}
```

**Success Response** (201):
```json
{
  "message": "Membership application submitted successfully",
  "member": {
    "id": "123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses**:
- 400: Missing/invalid fields
- 409: Email already exists
- 500: Server error

## 🎯 Future Enhancements

Potential additions for future development:

1. **Events System**: Calendar and event registration
2. **Job Board**: Post and browse job opportunities
3. **Member Directory**: Searchable member profiles
4. **Messaging**: Direct messages between members
5. **Groups**: Special interest groups and discussions
6. **Newsletter**: Email newsletter subscription
7. **Search**: Site-wide search functionality
8. **Comments**: Blog post comments
9. **Social Sharing**: Share buttons for blog posts
10. **Analytics**: Dashboard for admin insights

## 🐛 Troubleshooting

### Common Issues

**Issue**: Types not found
```bash
# Solution: Regenerate types
pnpm generate:types
```

**Issue**: Build fails
```bash
# Solution: Clear cache and rebuild
rm -rf .next
pnpm build
```

**Issue**: Database errors
```bash
# Solution: Check Cloudflare D1 binding
# Ensure wrangler.jsonc is configured correctly
```

## 📞 Support

For issues or questions:
1. Check the Payload CMS docs: https://payloadcms.com/docs
2. Check Next.js docs: https://nextjs.org/docs
3. Check shadcn/ui docs: https://ui.shadcn.com

## 📄 License

This project is built with:
- Next.js (MIT License)
- Payload CMS (MIT License)
- shadcn/ui (MIT License)
- Tailwind CSS (MIT License)

---

Built with ❤️ for the Hellenic Next community
