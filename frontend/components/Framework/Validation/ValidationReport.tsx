'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Package,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ValidationResult {
  category: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  message: string;
  details?: string;
  recommendations?: string[];
}

interface ValidationReport {
  moduleId: string;
  timestamp: Date;
  overallScore: number;
  status: 'compliant' | 'non-compliant' | 'warning';
  results: ValidationResult[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
    total: number;
  };
  recommendations: string[];
  estimatedFixTime?: string;
}

interface ValidationReportProps {
  report: ValidationReport | null;
  isLoading?: boolean;
  onRevalidate?: () => void;
}

export const ValidationReport: React.FC<ValidationReportProps> = ({
  report,
  isLoading = false,
  onRevalidate
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-500';
      case 'non-compliant':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'schema':
        return <Package className="h-5 w-5" />;
      case 'kiro':
        return <Zap className="h-5 w-5" />;
      case 'endpoints':
        return <TrendingUp className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
      case 'performance':
        return <TrendingUp className="h-5 w-5" />;
      case 'dependencies':
        return <Package className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const groupResultsByCategory = (results: ValidationResult[]) => {
    return results.reduce((acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    }, {} as Record<string, ValidationResult[]>);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-6 w-6 text-blue-500" />
          </motion.div>
          <span className="text-white">Running validation...</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <div className="text-gray-400 mb-4">No validation report available</div>
        {onRevalidate && (
          <button
            onClick={onRevalidate}
            className="ghost-button flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Run Validation</span>
          </button>
        )}
      </div>
    );
  }

  const groupedResults = groupResultsByCategory(report.results);

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`text-2xl font-bold ${getStatusColor(report.status)}`}>
              {report.overallScore}%
            </div>
            <div>
              <div className="text-white font-semibold">
                Validation Score
              </div>
              <div className={`text-sm ${getStatusColor(report.status)} capitalize`}>
                {report.status.replace('-', ' ')}
              </div>
            </div>
          </div>
          
          {onRevalidate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRevalidate}
              className="ghost-button flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Re-run Validation</span>
            </motion.button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${report.overallScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-3 rounded-full ${
              report.overallScore >= 90 ? 'bg-green-500' :
              report.overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-500">{report.summary.passed}</div>
            <div className="text-xs text-gray-400">Passed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-500">{report.summary.warnings}</div>
            <div className="text-xs text-gray-400">Warnings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-500">{report.summary.failed}</div>
            <div className="text-xs text-gray-400">Failed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-300">{report.summary.total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Last validated: {new Date(report.timestamp).toLocaleString()}</span>
          </div>
          {report.estimatedFixTime && (
            <div>
              Estimated fix time: {report.estimatedFixTime}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Results by Category */}
      <div className="space-y-4">
        {Object.entries(groupedResults).map(([category, results]) => {
          const isExpanded = expandedCategories.has(category);
          const categoryScore = Math.round(
            results.reduce((sum, r) => sum + r.score, 0) / results.length
          );
          const hasFailures = results.some(r => r.status === 'fail');
          const hasWarnings = results.some(r => r.status === 'warning');

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category)}
                  <div className="text-left">
                    <div className="text-white font-semibold">{category}</div>
                    <div className="text-sm text-gray-400">
                      {results.length} check{results.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`text-lg font-bold ${
                    hasFailures ? 'text-red-500' :
                    hasWarnings ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {categoryScore}%
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700"
                  >
                    <div className="p-4 space-y-3">
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg"
                        >
                          {getStatusIcon(result.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-white font-medium">{result.name}</div>
                              <div className={`text-sm font-semibold ${
                                result.status === 'pass' ? 'text-green-500' :
                                result.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                              }`}>
                                {result.score}%
                              </div>
                            </div>
                            <div className="text-sm text-gray-300 mb-2">
                              {result.message}
                            </div>
                            {result.details && (
                              <div className="text-xs text-gray-400 mb-2">
                                {result.details}
                              </div>
                            )}
                            {result.recommendations && result.recommendations.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-xs font-semibold text-gray-300">
                                  Recommendations:
                                </div>
                                {result.recommendations.map((rec, recIndex) => (
                                  <div key={recIndex} className="text-xs text-gray-400 ml-2">
                                    • {rec}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Recommendations */}
      {report.recommendations.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Recommendations</span>
          </h3>
          <div className="space-y-2">
            {report.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                <div className="text-yellow-500 mt-1">•</div>
                <div>{recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};