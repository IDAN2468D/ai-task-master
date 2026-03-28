'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BentoItemProps {
    children: ReactNode;
    className?: string;
    colSpan?: number;
    rowSpan?: number;
    priority?: number; // 0-100 logic-based rearrangement
}

export default function BentoContainer({ children, className = "" }: { children: ReactNode, className?: string }) {
    return (
        <motion.div 
            layout
            className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 w-full ${className}`}
        >
            {children}
        </motion.div>
    );
}

export function BentoItem({ children, className = "", colSpan = 1, rowSpan = 1, priority = 50 }: BentoItemProps) {
    const colClasses = {
        1: 'md:col-span-1',
        2: 'md:col-span-2',
        3: 'md:col-span-3',
        4: 'md:col-span-4',
        6: 'md:col-span-6',
        8: 'md:col-span-8',
        12: 'md:col-span-12',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: (priority / 100) * 0.2
            }}
            className={`${colClasses[colSpan as keyof typeof colClasses]} relative overflow-hidden ${className}`}
        >
            {children}
        </motion.div>
    );
}
