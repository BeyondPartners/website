/** @type {import('next').NextConfig} */
const nextConfig = {
  // Markdown lu via fs au runtime : sans ça, les fichiers ne sont pas embarqués dans la fonction Vercel.
  outputFileTracingIncludes: {
    '/[locale]/mentions-legales': ['./content/mentions-legales/**/*'],
  },
}

module.exports = nextConfig
