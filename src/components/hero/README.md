# Interactive Project Showcase Component

A beautiful 3D project showcase component built with Next.js, Framer Motion, and shadcn/ui that displays projects in a Spotify-inspired glass morphism design.

## ✨ Features

- **3D Card Carousel**: Projects display in perspective with smooth rotations
- **Glass Morphism**: Beautiful backdrop blur effects with gradient backgrounds
- **Smooth Animations**: 60fps animations powered by Framer Motion
- **Interactive States**: Hover to expand, click to view details
- **Keyboard Navigation**: Arrow keys and ESC support
- **Responsive Design**: Works seamlessly across all device sizes
- **Auto-rotation**: Optional automatic project cycling
- **Modal View**: Full-screen project details with navigation
- **Accessibility**: Screen reader support and keyboard navigation

## 📦 Components

### ProjectShowcase (Main Component)

The primary component that orchestrates the entire showcase experience.

```tsx
import { ProjectShowcase } from '@/components/hero';
import { getFeaturedProjects } from '@/data/projects';

const projects = getFeaturedProjects(3);

<ProjectShowcase 
  projects={projects}
  maxVisibleCards={3}
  autoRotate={true}
  rotationInterval={6000}
  enableKeyboardNav={true}
/>
```

### ProjectCard

Individual project card with hover effects and content display.

```tsx
<ProjectCard
  project={project}
  variant="center"
  index={1}
  onCardClick={() => openProjectModal(project)}
/>
```

### ProjectModal

Full-screen modal for detailed project viewing with navigation.

```tsx
<ProjectModal
  project={selectedProject}
  isOpen={!!selectedProject}
  onClose={closeProjectModal}
  onPrevious={() => navigateProject('prev')}
  onNext={() => navigateProject('next')}
  hasPrevious={true}
  hasNext={true}
/>
```

### GlassContainer

Reusable glass morphism container component.

```tsx
<GlassContainer variant="folder" className="p-8">
  {children}
</GlassContainer>
```

## 🎯 Usage

### Basic Implementation

```tsx
"use client";

import { ProjectShowcase } from '@/components/hero';

const projects = [
  {
    id: "1",
    title: "My Project",
    description: "Project description",
    image: "/project-image.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/user/project",
    category: "Web App"
  }
];

export default function MyPage() {
  return (
    <div>
      <ProjectShowcase 
        projects={projects}
        maxVisibleCards={3}
      />
    </div>
  );
}
```

### With Auto-rotation

```tsx
<ProjectShowcase 
  projects={projects}
  maxVisibleCards={3}
  autoRotate={true}
  rotationInterval={5000}
  enableKeyboardNav={true}
/>
```

### Hero Integration

```tsx
import { HeroWithProjectShowcase } from '@/components/hero';

export default function HomePage() {
  return <HeroWithProjectShowcase />;
}
```

## 🎨 Design System

### Colors

- **Primary Green**: `#1DB954` (Spotify-inspired)
- **Gradient**: `linear-gradient(135deg, #1DB954 0%, #1ed760 100%)`
- **Dark Background**: `#181818`
- **Glass Effect**: `rgba(255, 255, 255, 0.05)` with `backdrop-blur(29px)`

### Animation States

- **Closed**: Cards stacked with 3D perspective
- **Open**: Cards spread horizontally with full visibility  
- **Hover**: Individual card scale and glow effects
- **Modal**: Full-screen with overlay and blur

### Responsive Breakpoints

- **Desktop** (>1024px): 3 cards with full 3D effects
- **Tablet** (768px-1023px): 2 cards with adjusted spacing
- **Mobile** (<768px): 1 card with swipe gestures

## 🎮 Interactions

### Mouse

- **Hover Container**: Expands cards horizontally
- **Hover Card**: Scale effect with glow
- **Click Card**: Opens modal view
- **Click Outside**: Closes modal

### Keyboard

- **Arrow Left/Right**: Navigate between projects
- **Enter/Space**: Open selected project
- **ESC**: Close modal view

### Touch

- **Swipe Left/Right**: Navigate projects (mobile)
- **Tap**: Open project modal
- **Pinch**: Zoom effects

## 🔧 Configuration

### ProjectShowcaseProps

```typescript
interface ProjectShowcaseProps {
  projects: Project[];           // Required: Array of projects
  maxVisibleCards?: number;      // Default: 3
  autoRotate?: boolean;          // Default: false
  rotationInterval?: number;     // Default: 5000ms
  enableKeyboardNav?: boolean;   // Default: true
  className?: string;            // Optional CSS classes
}
```

### Project Interface

```typescript
interface Project {
  id: string;                    // Unique identifier
  title: string;                 // Project name
  description: string;           // Project description
  image: string;                 // Cover image URL
  technologies: string[];        // Tech stack array
  liveUrl?: string;             // Optional live demo URL
  githubUrl?: string;           // Optional GitHub URL
  category: string;             // Project category
}
```

## 🎯 Performance

- **Optimized Images**: Uses Next.js Image component
- **Lazy Loading**: Images load as needed
- **Smooth Animations**: Hardware-accelerated CSS transforms
- **Debounced Events**: Hover effects are debounced
- **Memory Management**: Proper cleanup of timeouts and listeners

## 🌐 Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Color Contrast**: WCAG AA compliant colors

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile
- **Fallbacks**: Graceful degradation for older browsers

## 🎨 Customization

### Theming

Override CSS variables in your global styles:

```css
:root {
  --showcase-primary: #1DB954;
  --showcase-background: #181818;
  --showcase-glass: rgba(255, 255, 255, 0.05);
}
```

### Animation Timing

Modify animation variants in `src/lib/animations/variants.ts`:

```typescript
export const cardVariants: Variants = {
  center: { 
    rotateY: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
};
```

### Styling

Use Tailwind classes or CSS modules for custom styling:

```tsx
<ProjectShowcase 
  className="my-custom-showcase"
  projects={projects}
/>
```

## 🧪 Testing

```bash
# Run type checking
npm run build

# Run development server
npm run dev

# Check for lint issues  
npm run lint
```

## 📄 License

This component is part of the personal portfolio project and follows the project's license terms.