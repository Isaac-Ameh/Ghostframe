'use client';

import { ArrowRight, Upload, Brain, Zap, CheckCircle } from 'lucide-react';

export default function SimpleWorkflowVisualization() {
  const steps = [
    {
      icon: Upload,
      title: 'User Uploads Content',
      description: 'Text, documents, or data',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50'
    },
    {
      icon: Brain,
      title: 'GhostFrame → Kiro Specs',
      description: 'Triggers .kiro/hooks and specs',
      color: 'text-spectral-green',
      bgColor: 'bg-spectral-green/20',
      borderColor: 'border-spectral-green/50'
    },
    {
      icon: Zap,
      title: 'Kiro Agent Processing',
      description: 'Applies steering logic & AI',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50'
    },
    {
      icon: CheckCircle,
      title: 'Adaptive Response',
      description: 'Framework delivers results',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/50'
    }
  ];

  return (
    <div className="bg-midnight-black/30 border border-spectral-green/20 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-ghost-white mb-8 text-center">
        🤖 How Kiro Powers GhostFrame
      </h2>
      
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex flex-col lg:flex-row items-center">
              {/* Step */}
              <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-xl p-6 text-center min-w-[200px]`}>
                <Icon className={`h-8 w-8 ${step.color} mx-auto mb-3`} />
                <h3 className="font-bold text-ghost-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-300">{step.description}</p>
              </div>
              
              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="lg:mx-4 my-4 lg:my-0">
                  <ArrowRight className="h-6 w-6 text-spectral-green transform lg:rotate-0 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Kiro Integration Details */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
          <h4 className="font-semibold text-spectral-green mb-2">📋 .kiro/specs/</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• requirements.md</li>
            <li>• design.md</li>
            <li>• tasks.md</li>
          </ul>
        </div>

        <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
          <h4 className="font-semibold text-spectral-green mb-2">🎣 .kiro/hooks/</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• onUpload.js</li>
            <li>• onGenerate.js</li>
            <li>• onComplete.js</li>
          </ul>
        </div>

        <div className="bg-black/30 border border-spectral-green/20 rounded-lg p-4">
          <h4 className="font-semibold text-spectral-green mb-2">🧭 .kiro/steering/</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• personality.md</li>
            <li>• behavior.md</li>
            <li>• quality.md</li>
          </ul>
        </div>
      </div>
    </div>
  );
}