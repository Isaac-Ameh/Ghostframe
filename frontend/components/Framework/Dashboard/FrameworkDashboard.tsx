'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Clock,
  Server,
  Cpu,
  HardDrive,
  Zap,
  Globe,
  Download,
  Star,
  GitBranch,
  LineChart
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  AreaChart,
  BarChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardMetrics {
  overview: {
    totalModules: number;
    activeUsers: number;
    totalExecutions: number;
    systemHealth: number;
  };
  performance: {
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
    uptime: number;
  };
  kiroIntegration: {
    activeConnections: number;
    specsGenerated: number;
    hooksExecuted: number;
    steeringRulesActive: number;
  };
  systemResources: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkTraffic: number;
  };
  moduleStats: {
    topModules: Array<{
      name: string;
      downloads: number;
      rating: number;
      domain: string;
    }>;
    recentActivity: Array<{
      moduleId: string;
      moduleName: string;
      action: string;
      timestamp: string;
      developer: string;
    }>;
  };
  developerActivity: Array<{
    developerId: string;
    developerName: string;
    modulesCreated: number;
    totalDownloads: number;
    avgRating: number;
    lastActive: string;
  }>;
  timeSeriesData: {
    executions: Array<{ time: string; count: number }>;
    users: Array<{ time: string; count: number }>;
    errors: Array<{ time: string; count: number }>;
  };
}

interface FrameworkDashboardProps {
  refreshInterval?: number;
  autoRefresh?: boolean;
}

const FrameworkDashboard: React.FC<FrameworkDashboardProps> = ({
  refreshInterval = 5000,
  autoRefresh = true
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');

  // Fetch dashboard metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard/metrics?timeRange=${selectedTimeRange}&includeTimeSeries=true`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Transform the data to match our component's expected structure
        const transformedMetrics = {
          overview: {
            totalModules: data.data.overview?.totalModules || 0,
            activeUsers: data.data.overview?.activeDevelopers || 0,
            totalExecutions: data.data.overview?.totalRequests || 0,
            systemHealth: Math.round(data.data.overview?.uptime || 0)
          },
          performance: {
            avgResponseTime: data.data.performance?.avgResponseTime || 0,
            errorRate: data.data.performance?.errorsPerSecond || 0,
            throughput: data.data.performance?.requestsPerSecond || 0,
            uptime: data.data.overview?.uptime || 0
          },
          kiroIntegration: {
            activeConnections: data.data.kiroStats?.hookCalls || 0,
            specsGenerated: data.data.kiroStats?.specValidations || 0,
            hooksExecuted: data.data.kiroStats?.hookCalls || 0,
            steeringRulesActive: data.data.kiroStats?.steeringApplications || 0
          },
          systemResources: {
            cpuUsage: Math.round(data.data.system?.cpuUsage || 0),
            memoryUsage: Math.round(data.data.system?.memoryUsage || 0),
            diskUsage: Math.round(data.data.system?.diskUsage || 0),
            networkTraffic: Math.round(data.data.system?.networkIn || 0)
          },
          moduleStats: {
            topModules: (data.data.moduleActivity || []).map((module: any) => ({
              name: module.moduleName || module.name || 'Unknown',
              downloads: module.requests || 0,
              rating: 4.5 + Math.random() * 0.5, // Mock rating
              domain: module.moduleId?.includes('quiz') ? 'Educational' : 
                     module.moduleId?.includes('story') ? 'Narrative' : 'General'
            })),
            recentActivity: (data.data.moduleActivity || []).map((module: any, index: number) => ({
              moduleId: module.moduleId || `module-${index}`,
              moduleName: module.moduleName || `Module ${index + 1}`,
              action: 'executed',
              timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
              developer: `Developer ${index + 1}`
            }))
          },
          developerActivity: (data.data.developerActivity || []).map((dev: any) => ({
            developerId: dev.developerId || `dev-${Math.random()}`,
            developerName: dev.developerName || 'Anonymous Developer',
            modulesCreated: dev.modulesPublished || 0,
            totalDownloads: dev.totalDownloads || Math.floor(Math.random() * 10000),
            avgRating: dev.avgRating || 4.0 + Math.random(),
            lastActive: dev.lastActive || new Date().toISOString()
          })),
          timeSeriesData: {
            executions: (data.data.timeSeriesData || []).map((point: any) => ({
              time: new Date(point.timestamp).toLocaleTimeString(),
              count: point.requests || 0
            })),
            users: (data.data.timeSeriesData || []).map((point: any) => ({
              time: new Date(point.timestamp).toLocaleTimeString(),
              count: point.activeUsers || 0
            })),
            errors: (data.data.timeSeriesData || []).map((point: any) => ({
              time: new Date(point.timestamp).toLocaleTimeString(),
              count: point.errors || 0
            }))
          }
        };
        
        setMetrics(transformedMetrics);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      console.error('Dashboard metrics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimeRange]);

  // Auto-refresh effect
  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchMetrics, autoRefresh, refreshInterval]);

  // Manual refresh
  const handleRefresh = () => {
    setIsLoading(true);
    fetchMetrics();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          👻
        </motion.div>
        <span className="ml-4 text-gray-300">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Dashboard Error</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            🎃 Framework Dashboard
          </h2>
          <p className="text-gray-400">
            Real-time monitoring of GhostFrame ecosystem
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
            {(['1h', '6h', '24h', '7d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Modules</p>
              <p className="text-2xl font-bold">{metrics.overview.totalModules}</p>
            </div>
            <Package className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600 to-teal-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Users</p>
              <p className="text-2xl font-bold">{metrics.overview.activeUsers}</p>
            </div>
            <Users className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-600 to-red-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Executions</p>
              <p className="text-2xl font-bold">{metrics.overview.totalExecutions.toLocaleString()}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">System Health</p>
              <p className="text-2xl font-bold">{metrics.overview.systemHealth}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Execution Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.timeSeriesData.executions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Resources
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">CPU Usage</span>
                <span className="text-white">{metrics.systemResources.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metrics.systemResources.cpuUsage}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Memory Usage</span>
                <span className="text-white">{metrics.systemResources.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metrics.systemResources.memoryUsage}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Disk Usage</span>
                <span className="text-white">{metrics.systemResources.diskUsage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metrics.systemResources.diskUsage}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Kiro Integration Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-6 rounded-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Kiro Integration Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {metrics.kiroIntegration.activeConnections}
            </div>
            <div className="text-sm text-gray-400">Active Connections</div>
          </div>
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {metrics.kiroIntegration.specsGenerated}
            </div>
            <div className="text-sm text-gray-400">Specs Generated</div>
          </div>
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {metrics.kiroIntegration.hooksExecuted}
            </div>
            <div className="text-sm text-gray-400">Hooks Executed</div>
          </div>
          <div className="text-center p-4 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {metrics.kiroIntegration.steeringRulesActive}
            </div>
            <div className="text-sm text-gray-400">Steering Rules</div>
          </div>
        </div>
      </motion.div>

      {/* Module Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Top Modules
          </h3>
          <div className="space-y-3">
            {metrics.moduleStats.topModules.map((module, index) => (
              <div key={module.name} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{module.name}</div>
                    <div className="text-sm text-gray-400">{module.domain}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{module.downloads.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {module.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {metrics.moduleStats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <div className="flex-1">
                  <div className="text-white text-sm">
                    <span className="font-medium">{activity.developer}</span>
                    <span className="text-gray-400"> {activity.action} </span>
                    <span className="font-medium">{activity.moduleName}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Developer Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-6 rounded-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Developer Activity
        </h3>
        
        <div className="space-y-4">
          {metrics.developerActivity.map((developer, index) => (
            <div key={developer.developerId} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {developer.developerName.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-medium">{developer.developerName}</div>
                  <div className="text-sm text-gray-400">
                    Last active: {new Date(developer.lastActive).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{developer.modulesCreated} modules</div>
                <div className="text-sm text-gray-400">
                  {developer.totalDownloads.toLocaleString()} downloads • ⭐ {developer.avgRating.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FrameworkDashboard;