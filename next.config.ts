import { withPayload } from '@payloadcms/next/withPayload'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

// Initialize OpenNext Cloudflare for local development
initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  images: {
    // Disable Next.js image optimization for Cloudflare Workers
    // Images are served directly from R2 via the custom media route
    unoptimized: true,
  },
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
