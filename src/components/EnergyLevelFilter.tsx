'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BatteryFull, BatteryMedium, BatteryLow, Sparkles, BrainCircuit } from 'lucide-react';

export type EnergyLevel = 'All' | 'High' | 'Medium' | 'Low';

interface EnergyLevelFilterProps {
  currentFilter: EnergyLevel;
  onFilterChange: (level: EnergyLevel) => void;
}

export default function EnergyLevelFilter({ currentFilter, onFilterChange }: EnergyLevelFilterProps) {
  const levels: { 
    id: EnergyLevel; 
    label: string; 
    icon: any; 
    color: string;
    activeGlow: string;
    gradient: string;
  }[] = [
    { 
      id: 'All', 
      label: 'Network', 
      icon: Zap, 
      color: 'text-indigo-400 group-hover:text-indigo-300',
      activeGlow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',
      gradient: 'from-indigo-600/40 to-indigo-500/20'
    },
    { 
      id: 'High', 
      label: 'Focus Peak', 
      icon: BatteryFull, 
      color: 'text-amber-400 group-hover:text-amber-300',
      activeGlow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
      gradient: 'from-amber-600/40 to-orange-500/20'
    },
    { 
      id: 'Medium', 
      label: 'Standard', 
      icon: BatteryMedium, 
      color: 'text-cyan-400 group-hover:text-cyan-300',
      activeGlow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
      gradient: 'from-cyan-600/40 to-blue-500/20'
    },
    { 
      id: 'Low', 
      label: 'Recovery', 
      icon: BatteryLow, 
      color: 'text-emerald-400 group-hover:text-emerald-300',
      activeGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      gradient: 'from-emerald-600/40 to-teal-500/20'
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-2 bg-white/5 dark:bg-black/30 backdrop-blur-2xl rounded-[32px] border border-white/10 dark:border-white/5 w-full sm:w-max group/container transition-all duration-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]" dir="rtl">
      <div className="flex items-center gap-3 px-4 py-2 text-[10px] font-black tracking-[0.3em] text-indigo-500 dark:text-indigo-400 uppercase">
        <BrainCircuit size={15} className="animate-pulse" />
        <span className="opacity-80">Cognitive Neural Engine</span>
      </div>
      
      <div className="flex w-full sm:w-auto p-1.5 bg-black/10 dark:bg-white/5 rounded-[24px] gap-2 items-center">
        {levels.map((level) => {
          const isActive = currentFilter === level.id;
          const Icon = level.icon;
          return (
            <button
              key={level.id}
              onClick={() => onFilterChange(level.id)}
              className={`
                group relative flex-1 sm:flex-none px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider
                transition-all duration-500 outline-none overflow-hidden
                ${isActive ? 'text-white' : 'text-slate-400/80 hover:text-white hover:bg-white/5'}
              `}
            >
              <AnimatePresence>
                {isActive && (
                    <>
                    <motion.div
                        layoutId="energy-filter-active"
                        className={`absolute inset-0 bg-gradient-to-br ${level.gradient} border border-white/20`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                    <div className={`absolute inset-0 ${level.activeGlow} opacity-60`} />
                    </>
                )}
              </AnimatePresence>
              
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                <Icon size={14} className={`transition-transform duration-500 group-hover:scale-120 group-hover:rotate-6 ${isActive ? 'text-white' : level.color}`} />
                <span className="whitespace-nowrap">{level.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

