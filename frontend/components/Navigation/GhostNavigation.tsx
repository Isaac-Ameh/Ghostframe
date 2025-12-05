'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Package, 
  FileText, 
  Users, 
  Code, 
  ChevronDown,
  Brain,
  BookOpen,
  Upload,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface DropdownItem extends NavItem {
  category?: string;
}

export const GhostNavigation: React.FC = () => {
  const pathname = usePathname();
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Main navigation with Marketplace and Registry
  const mainNavItems: NavItem[] = [
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
      description: 'Module development tools'
    },
    {
      href: '/registry',
      label: 'Registry',
      icon: Package,
      description: 'All your modules'
    },
    {
      href: '/marketplace',
      label: 'Marketplace',
      icon: Package,
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

  // Modules dropdown items - Framework tools and demo modules
  const moduleDropdownItems: DropdownItem[] = [
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

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isModulesActive = () => {
    return moduleDropdownItems.some(item => isActive(item.href));
  };

  // Group dropdown items by category
  const groupedDropdownItems = moduleDropdownItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, DropdownItem[]>);

  return (
    <nav className="bg-grave-black/90 backdrop-blur-sm border-b border-specter-purple/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-2xl"
            >
              👻
            </motion.div>
            <div>
              <div className="text-xl font-bold text-ghost-white creepster-heading group-hover:text-pumpkin-orange transition-colors">
                GhostFrame
              </div>
              <div className="text-xs text-gray-400 -mt-1">
                Kiro AI Framework
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Main Nav Items */}
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-ghost-white hover:bg-specter-purple/50 hover:text-glow ${
                      active ? 'bg-specter-purple/20 text-pumpkin-orange' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-specter-purple/20 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}

            {/* Modules Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setModulesDropdownOpen(true)}
              onMouseLeave={() => setModulesDropdownOpen(false)}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-ghost-white hover:bg-specter-purple/50 hover:text-glow ${
                  isModulesActive() ? 'bg-specter-purple/20 text-pumpkin-orange' : ''
                }`}
              >
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">Modules</span>
                <motion.div
                  animate={{ rotate: modulesDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3 w-3" />
                </motion.div>
                {isModulesActive() && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-specter-purple/20 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>

              {/* Dropdown Menu with smooth transitions */}
              <AnimatePresence>
                {modulesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ 
                      duration: 0.2,
                      ease: [0.4, 0.0, 0.2, 1] // Custom easing for smooth feel
                    }}
                    className="absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-specter-purple/30 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {Object.entries(groupedDropdownItems).map(([category, items]) => (
                      <div key={category} className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {category}
                        </div>
                        {items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.href);
                          
                          return (
                            <Link key={item.href} href={item.href}>
                              <motion.div
                                whileHover={{ 
                                  scale: 1.02, 
                                  x: 4,
                                  backgroundColor: 'rgba(76, 29, 149, 0.1)' // specter-purple/10
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                                  active 
                                    ? 'bg-specter-purple/20 text-ghost-white border-l-2 border-pumpkin-orange' 
                                    : 'text-gray-300 hover:text-ghost-white'
                                }`}
                                onClick={() => setModulesDropdownOpen(false)}
                              >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">{item.label}</div>
                                  <div className="text-xs text-gray-400">{item.description}</div>
                                </div>
                              </motion.div>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/framework/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-specter-purple hover:bg-pumpkin-orange text-ghost-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-specter-purple/50 text-sm flex items-center space-x-2"
              >
                <Code className="h-4 w-4" />
                <span>Create Module</span>
              </motion.button>
            </Link>
            
            <motion.div 
              className="flex items-center space-x-2 text-sm"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-spectral-green rounded-full animate-pulse"></div>
              <span className="text-spectral-green font-medium">Kiro Ready</span>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-specter-purple hover:bg-pumpkin-orange text-ghost-white font-bold p-2 rounded-lg transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-specter-purple/30 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {/* Main Nav Items */}
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          active 
                            ? 'bg-specter-purple/20 text-ghost-white border-l-2 border-pumpkin-orange' 
                            : 'text-gray-300 hover:bg-specter-purple/10 hover:text-ghost-white'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-400">{item.description}</div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
                
                {/* Module Items */}
                <div className="pt-2 border-t border-specter-purple/30">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Modules
                  </div>
                  {moduleDropdownItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            active 
                              ? 'bg-specter-purple/20 text-ghost-white border-l-2 border-pumpkin-orange' 
                              : 'text-gray-300 hover:bg-specter-purple/10 hover:text-ghost-white'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
                
                {/* Mobile Actions */}
                <div className="pt-4 border-t border-specter-purple/30">
                  <Link href="/framework/create">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-pumpkin-orange hover:bg-pumpkin-orange/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Code className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Create Module</div>
                        <div className="text-xs text-gray-400">Build for the framework</div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};