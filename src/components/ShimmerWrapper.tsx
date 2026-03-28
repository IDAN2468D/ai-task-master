'use client';

import { motion } from 'framer-motion';

export default function ShimmerWrapper({ children, active = false }: { children: React.ReactNode, active?: boolean }) {
    if (!active) return <>{children}</>;

    return (
        <div className="relative group/shimmer">
            <motion.div
                className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[20px] blur-[2px] opacity-75 group-hover/shimmer:opacity-100 transition-opacity"
                animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    backgroundSize: "200% 200%",
                }}
            />
            <div className="relative bg-white dark:bg-[#111C44] rounded-[19px]">
                {children}
            </div>
        </div>
    );
}
