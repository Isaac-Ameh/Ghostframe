'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  Eye, 
  Settings, 
  Filter,
  RefreshCw,
  Star,
  GitBranch,
  Clock,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  Shield
} from 'lucide-react';

// Types for module management
interface AIModule {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  domain: string;
  status: 'active' | 'development' | 'deprecated' | 'testing';
  createdAt: Date;
  updatedAt: Date;
  downloads: number;
  rating: number;
  tags: string[];
  kiroSpecs: {
    requirements: string;
    design: string;
    tasks: string;
  };
  hooks: string[];
  steering: boolean;
  compatibility: {
    specsVersion: string;
    hooksSupported: string[];
    steeringCompliant: boolean;
  };
  analytics: {
    activeUsers: number;
    executionCount: number;
    errorRate: number;
    avgResponseTime: number;
  };
}

interface ModuleFilter {
  domain?: string;
  status?: string;
  author?: string;
  tags?: string[];
  rating?: number;
  compatibility?: boolean;
}

interface ModuleManagementProps {
  userModules?: AIModule[];
  onModuleAction?: (action: string, moduleId: string, data?: any) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const ModuleManagementInterface: React.FC<ModuleManagementProps> = ({
  userModules = [],
  onModuleAction,
  isLoading = false,
  error
}) => {
  // State management
  const [modules, setModules] = useState<AIModule[]>(userModules);
  const [filteredModules, setFilteredModules] = useState<AIModule[]>(userModules);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ModuleFilter>({});
  const [selectedModule, setSelectedModule] = useState<AIModule | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'downloads' | 'rating'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time analytics updates
      setModules(prev => prev.map(module => ({
        ...module,
        analytics: {
          ...module.analytics,
          activeUsers: module.analytics.activeUsers + Math.floor(Math.random() * 3) - 1,
          executionCount: module.analytics.executionCount + Math.floor(Math.random() * 5)
        }
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = modules;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(module =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        module.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply domain filter
    if (activeFilter.domain) {
      filtered = filtered.filter(module => module.domain === activeFilter.domain);
    }

    // Apply status filter
    if (activeFilter.status) {
      filtered = filtered.filter(module => module.status === activeFilter.status);
    }

    // Apply author filter
    if (activeFilter.author) {
      filtered = filtered.filter(module => module.author === activeFilter.author);
    }

    // Apply rating filter
    if (activeFilter.rating) {
      filtered = filtered.filter(module => module.rating >= (activeFilter.rating || 0));
    }

    // Apply compatibility filter
    if (activeFilter.compatibility) {
      filtered = filtered.filter(module => module.compatibility.steeringCompliant);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'updated':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'downloads':
          aValue = a.downloads;
          bValue = b.downloads;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredModules(filtered);
  }, [modules, searchTerm, activeFilter, sortBy, sortOrder]);

  // Module actions
  const handleModuleAction = useCallback(async (action: string, moduleId: string, data?: any) => {
    setActionLoading(`${action}-${moduleId}`);
    try {
      if (onModuleAction) {
        await onModuleAction(action, moduleId, data);
      }
      
      // Update local state based on action
      switch (action) {
        case 'delete':
          setModules(prev => prev.filter(m => m.id !== moduleId));
          break;
        case 'publish':
          setModules(prev => prev.map(m => 
            m.id === moduleId ? { ...m, status: 'active' as const } : m
          ));
          break;
        case 'unpublish':
          setModules(prev => prev.map(m => 
            m.id === moduleId ? { ...m, status: 'development' as const } : m
          ));
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} module:`, error);
    } finally {
      setActionLoading(null);
    }
  }, [onModuleAction]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'development': return 'text-yellow-400 bg-yellow-400/10';
      case 'testing': return 'text-blue-400 bg-blue-400/10';
      case 'deprecated': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Get compatibility status
  const getCompatibilityStatus = (module: AIModule) => {
    const { compatibility } = module;
    if (compatibility.steeringCompliant && compatibility.hooksSupported.length > 0) {
      return { status: 'excellent', color: 'text-green-400', icon: CheckCircle };
    } else if (compatibility.steeringCompliant || compatibility.hooksSupported.length > 0) {
      return { status: 'good', color: 'text-yellow-400', icon: AlertCircle };
    } else {
      return { status: 'poor', color: 'text-red-400', icon: XCircle };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🎃 Module Management
              </h1>
              <p className="text-gray-300">
                Manage your GhostFrame modules with real-time updates and analytics
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleModuleAction('create', 'new')}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={20} />
                Create Module
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw size={20} />
                Refresh
              </motion.button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search modules by name, description, tags, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>

              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  showFilters ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                <Filter size={20} />
                Filters
              </motion.button>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-600 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Domain Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Domain</label>
                      <select
                        value={activeFilter.domain || ''}
                        onChange={(e) => setActiveFilter(prev => ({ ...prev, domain: e.target.value || undefined }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">All Domains</option>
                        <option value="education">Education</option>
                        <option value="creative">Creative</option>
                        <option value="productivity">Productivity</option>
                        <option value="research">Research</option>
                        <option value="utility">Utility</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                      <select
                        value={activeFilter.status || ''}
                        onChange={(e) => setActiveFilter(prev => ({ ...prev, status: e.target.value || undefined }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="development">Development</option>
                        <option value="testing">Testing</option>
                        <option value="deprecated">Deprecated</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="updated">Last Updated</option>
                        <option value="name">Name</option>
                        <option value="downloads">Downloads</option>
                        <option value="rating">Rating</option>
                      </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setActiveFilter({});
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex items-center gap-3 text-gray-300">
              <Loader className="animate-spin" size={24} />
              <span>Loading modules...</span>
            </div>
          </motion.div>
        )}

        {/* Module Grid/List */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            <AnimatePresence>
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  viewMode={viewMode}
                  onAction={handleModuleAction}
                  actionLoading={actionLoading}
                  getStatusColor={getStatusColor}
                  getCompatibilityStatus={getCompatibilityStatus}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredModules.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">👻</div>
            <h3 className="text-xl font-semibold text-white mb-2">No modules found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || Object.keys(activeFilter).length > 0
                ? 'Try adjusting your search or filters'
                : 'Create your first module to get started'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModuleAction('create', 'new')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Your First Module
            </motion.button>
          </motion.div>
        )}

        {/* Results Summary */}
        {!isLoading && filteredModules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-gray-400"
          >
            Showing {filteredModules.length} of {modules.length} modules
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Module Card Component
interface ModuleCardProps {
  module: AIModule;
  viewMode: 'grid' | 'list';
  onAction: (action: string, moduleId: string, data?: any) => Promise<void>;
  actionLoading: string | null;
  getStatusColor: (status: string) => string;
  getCompatibilityStatus: (module: AIModule) => { status: string; color: string; icon: any };
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  viewMode, 
  onAction, 
  actionLoading, 
  getStatusColor, 
  getCompatibilityStatus 
}) => {
  const compatibility = getCompatibilityStatus(module);
  const CompatibilityIcon = compatibility.icon;

  const cardContent = (
    <>
      {/* Header */}
      <div className={`flex items-start justify-between ${viewMode === 'list' ? 'mb-4' : 'mb-3'}`}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-semibold text-white ${viewMode === 'list' ? 'text-xl' : 'text-lg'}`}>
              {module.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
              {module.status}
            </span>
          </div>
          <p className={`text-gray-300 ${viewMode === 'list' ? 'text-base' : 'text-sm'}`}>
            {module.description}
          </p>
        </div>
        
        <div className="flex items-center gap-1 ml-4">
          <CompatibilityIcon className={compatibility.color} size={20} />
        </div>
      </div>

      {/* Metadata */}
      <div className={`grid gap-3 mb-4 ${viewMode === 'list' ? 'grid-cols-6' : 'grid-cols-2'}`}>
        <div className="flex items-center gap-2 text-gray-400">
          <Users size={16} />
          <span className="text-sm">{module.analytics.activeUsers}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Download size={16} />
          <span className="text-sm">{module.downloads}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Star size={16} />
          <span className="text-sm">{module.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <GitBranch size={16} />
          <span className="text-sm">v{module.version}</span>
        </div>
        {viewMode === 'list' && (
          <>
            <div className="flex items-center gap-2 text-gray-400">
              <Activity size={16} />
              <span className="text-sm">{module.analytics.executionCount}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={16} />
              <span className="text-sm">{module.analytics.avgResponseTime}ms</span>
            </div>
          </>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {module.tags.slice(0, viewMode === 'list' ? 6 : 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs"
          >
            {tag}
          </span>
        ))}
        {module.tags.length > (viewMode === 'list' ? 6 : 3) && (
          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs">
            +{module.tags.length - (viewMode === 'list' ? 6 : 3)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-700 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction('view', module.id)}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
        >
          <Eye size={16} />
          View
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction('edit', module.id)}
          disabled={actionLoading === `edit-${module.id}`}
          className="flex items-center gap-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
        >
          {actionLoading === `edit-${module.id}` ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            <Edit size={16} />
          )}
          Edit
        </motion.button>

        {module.status === 'development' ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction('publish', module.id)}
            disabled={actionLoading === `publish-${module.id}`}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
          >
            {actionLoading === `publish-${module.id}` ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <Upload size={16} />
            )}
            Publish
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction('unpublish', module.id)}
            disabled={actionLoading === `unpublish-${module.id}`}
            className="flex items-center gap-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
          >
            {actionLoading === `unpublish-${module.id}` ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <Settings size={16} />
            )}
            Unpublish
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction('validate', module.id)}
          disabled={actionLoading === `validate-${module.id}`}
          className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
        >
          {actionLoading === `validate-${module.id}` ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            <Shield size={16} />
          )}
          Validate
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction('delete', module.id)}
          disabled={actionLoading === `delete-${module.id}`}
          className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors disabled:opacity-50 ml-auto"
        >
          {actionLoading === `delete-${module.id}` ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            <Trash2 size={16} />
          )}
          Delete
        </motion.button>
      </div>
    </>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 ${
        viewMode === 'list' ? 'flex-row' : ''
      }`}
    >
      {cardContent}
    </motion.div>
  );
};

export default ModuleManagementInterface;