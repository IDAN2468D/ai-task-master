'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Battery, BatteryFull, BatteryMedium, BatteryLow } from 'lucide-react';

export type EnergyLevel = 'All' | 'High' | 'Medium' | 'Low';

interface EnergyLevelFilterProps {
  currentFilter: EnergyLevel;
  onFilterChange: (level: EnergyLevel) => void;
}

export default function EnergyLevelFilter({ currentFilter, onFilterChange }: EnergyLevelFilterProps) {
  const levels: { id: EnergyLevel; label: string; icon: React.ReactNode; color: string; activeBg: string }[] = [
    { id: 'All', label: 'הכל', icon: <Zap size={16} />, color: 'text-slate-500', activeBg: 'bg-slate-200 dark:bg-slate-700' },
    { id: 'High', label: 'אנרגיה גבוהה', icon: <BatteryFull size={16} />, color: 'text-amber-500', activeBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
    { id: 'Medium', label: 'אנרגיה בינונית', icon: <BatteryMedium size={16} />, color: 'text-blue-500', activeBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
    { id: 'Low', label: 'אנרגיה נמוכה', icon: <BatteryLow size={16} />, color: 'text-emerald-500', activeBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 w-full sm:w-max" dir="rtl">
      <div className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter hidden lg:flex items-center gap-2 whitespace-nowrap">
        <Battery size={14} />
        <span>סינון אנרגיה:</span>
      </div>
      
      <div className="flex bg-white dark:bg-slate-900 rounded-xl p-0.5 shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto no-scrollbar">
        {levels.map((level) => {
          const isActive = currentFilter === level.id;
          return (
            <button
              key={level.id}
              onClick={() => onFilterChange(level.id)}
              className="relative px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all outline-none flex-shrink-0"
            >
              {isActive && (
                <motion.div
                  layoutId="energy-filter-active"
                  className={`absolute inset-0 rounded-lg ${level.activeBg}`}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${isActive ? '' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                <span className={isActive ? '' : level.color}>{level.icon}</span>
                <span className="hidden sm:inline-block whitespace-nowrap">{level.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
