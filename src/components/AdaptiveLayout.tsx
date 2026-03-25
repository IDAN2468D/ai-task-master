'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdaptiveLayout({ children }: { children: React.ReactNode }) {
    const [isFocusMode, setIsFocusMode] = useState(false);

    useEffect(() => {
        const handleFocus = (e: any) => {
            setIsFocusMode(e.detail.active);
        };
        window.addEventListener('ui-focus-mode', handleFocus);
        return () => window.removeEventListener('ui-focus-mode', handleFocus);
    }, []);

    return (
        <div className={`transition-all duration-700 ${isFocusMode ? 'scale-[0.98] blur-[2px] pointer-events-none opacity-40' : 'scale-100 blur-0'}`}>
            {children}
            {isFocusMode && (
                <div className="fixed inset-0 z-[8999] bg-slate-900/10 pointer-events-none" />
            )}
        </div>
    );
}
