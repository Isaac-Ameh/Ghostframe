// 🎃 GhostFrame Navigation Configuration
// Centralized route management for automatic navigation generation

import {
  Home,
  Package,
  FileText,
  Users,
  Code,
  Brain,
  BookOpen,
  Upload,
  BarChart3,
  ShoppingCart,
  Layers
} from 'lucide-react';

export interface NavRoute {
  href: string;
  label: string;
  icon: any;
  description: string;
  category?: string;
}

// Main top-level navigation
export const mainNavRoutes: NavRoute[] = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
    description: 'Framework overview'
  },
  {
    href: '/framework',
    label: 'Framework',
    icon: Code,
    description: 'Module registry & tools'
  },
  {
    href: '/marketplace',
    label: 'Marketplace',
    icon: ShoppingCart,
    description: 'Discover & install modules'
  },
  {
    href: '/docs',
    label: 'Docs',
    icon: FileText,
    description: 'Documentation'
  },
  {
    href: '/community',
    label: 'Community',
    icon: Users,
    description: 'Join the community'
  }
];

// Modules dropdown navigation
export const moduleNavRoutes: NavRoute[] = [
  {
    href: '/framework/modules',
    label: 'All Modules',
    icon: Package,
    description: 'Browse all registered modules',
    category: 'Registry'
  },
  {
    href: '/framework/create',
    label: 'Create Module',
    icon: Code,
    description: 'Build a new module',
    category: 'Registry'
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    description: 'Framework analytics & management',
    category: 'Management'
  },
  {
    href: '/quiz-ghost',
    label: 'Quiz Ghost',
    icon: Brain,
    description: 'Educational content generation',
    category: 'Demo Modules'
  },
  {
    href: '/story-spirit',
    label: 'Story Spirit',
    icon: BookOpen,
    description: 'Narrative content creation',
    category: 'Demo Modules'
  },
  {
    href: '/upload',
    label: 'Upload',
    icon: Upload,
    description: 'Content processing & analysis',
    category: 'Tools'
  }
];

// Documentation sidebar navigation
export const docsNavRoutes: NavRoute[] = [
  {
    href: '/docs',
    label: 'Overview',
    icon: FileText,
    description: 'Documentation home'
  },
  {
    href: '/docs/framework',
    label: 'Framework Overview',
    icon: Layers,
    description: 'Core framework concepts'
  },
  {
    href: '/docs/cli',
    label: 'CLI Tools',
    icon: Code,
    description: 'Command-line interface'
  },
  {
    href: '/docs/marketplace',
    label: 'Marketplace Guide',
    icon: ShoppingCart,
    description: 'Publishing & discovery'
  }
];

// Marketplace navigation
export const marketplaceNavRoutes: NavRoute[] = [
  {
    href: '/marketplace',
    label: 'Browse',
    icon: Package,
    description: 'Explore modules'
  },
  {
    href: '/marketplace/submit',
    label: 'Publish',
    icon: Upload,
    description: 'Submit your module'
  }
];

/**
 * Get all available routes for automatic discovery
 */
export function getAllRoutes(): NavRoute[] {
  return [
    ...mainNavRoutes,
    ...moduleNavRoutes,
    ...docsNavRoutes,
    ...marketplaceNavRoutes
  ];
}

/**
 * Find route by href
 */
export function findRoute(href: string): NavRoute | undefined {
  return getAllRoutes().find(route => route.href === href);
}

/**
 * Get routes by category
 */
export function getRoutesByCategory(category: string): NavRoute[] {
  return getAllRoutes().filter(route => route.category === category);
}
