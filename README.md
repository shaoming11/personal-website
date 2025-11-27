# Shaoming Wu - Personal Portfolio

A minimalistic, animated personal portfolio website built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Clean, minimalistic aesthetic with dark theme
- **Smooth Animations**: Framer Motion animations with fade-ins, smooth transitions, and parallax effects
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Fast Performance**: Optimized with Next.js 16+ and static generation
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Accessibility**: Compliant with web accessibility standards

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the site.

## Customization

### Personal Information
Update the content in each component to match your information:

- **Hero Section**: `src/components/Hero.tsx`
- **About Section**: `src/components/About.tsx` 
- **Experience**: `src/components/Experience.tsx`
- **Projects**: `src/components/Projects.tsx`
- **Skills**: `src/components/Skills.tsx`
- **Contact**: `src/components/Contact.tsx`

### Contact Information
Update the contact links in `src/components/Contact.tsx`:
- Email address
- LinkedIn profile
- GitHub profile

### SEO and Metadata
Update metadata in `src/app/layout.tsx`:
- Title and description
- Keywords
- Author information

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Other Platforms

The site can also be deployed to:
- Netlify
- AWS Amplify
- Railway
- Any platform supporting Next.js

## Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
└── components/
    ├── Hero.tsx            # Hero section
    ├── About.tsx           # About section
    ├── Experience.tsx      # Experience timeline
    ├── Projects.tsx        # Project showcase
    ├── Skills.tsx          # Skills display
    └── Contact.tsx         # Contact form & links
```

## Performance

- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Minimized with Next.js optimization
- **Images**: Next.js Image optimization ready

## License

This project is open source and available under the [MIT License](LICENSE).
