'use client';

import { motion } from 'framer-motion';
import { useId } from 'react';

interface AnimatedBeamProps {
    fromRef: React.RefObject<HTMLDivElement>;
    toRef: React.RefObject<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement>;
    duration?: number;
    delay?: number;
    pathColor?: string;
    gradientStart?: string;
    gradientStop?: string;
}

export default function AnimatedBeam({
    fromRef,
    toRef,
    containerRef,
    duration = 2,
    delay = 0,
    pathColor = "rgba(67, 24, 255, 0.2)",
    gradientStart = "#4318FF",
    gradientStop = "#00E5FF",
}: AnimatedBeamProps) {
    const id = useId();

    return (
        <svg
            className="absolute inset-0 pointer-events-none w-full h-full"
            style={{ zIndex: 10 }}
        >
            <defs>
                <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={gradientStart} stopOpacity="0" />
                    <stop offset="50%" stopColor={gradientStart} stopOpacity="1" />
                    <stop offset="100%" stopColor={gradientStop} stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path
                d="M 0 0" // Path will be updated via ref logic in a real Aceternity impl, but here we simplify or use a basic line for POC
                stroke={pathColor}
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    duration,
                    delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            {/* Real implementation would calculate the path between clientBoundingRects of refs */}
            <BeamLine fromRef={fromRef} toRef={toRef} containerRef={containerRef} gradientId={id} />
        </svg>
    );
}

function BeamLine({ fromRef, toRef, containerRef, gradientId }: any) {
    const [path, setPath] = React.useState("");

    React.useEffect(() => {
        const updatePath = () => {
            if (fromRef.current && toRef.current && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const fromRect = fromRef.current.getBoundingClientRect();
                const toRect = toRef.current.getBoundingClientRect();

                const startX = fromRect.left - containerRect.left + fromRect.width / 2;
                const startY = fromRect.top - containerRect.top + fromRect.height / 2;
                const endX = toRect.left - containerRect.left + toRect.width / 2;
                const endY = toRect.top - containerRect.top + toRect.height / 2;

                setPath(`M ${startX} ${startY} L ${endX} ${endY}`);
            }
        };

        updatePath();
        window.addEventListener('resize', updatePath);
        return () => window.removeEventListener('resize', updatePath);
    }, [fromRef, toRef, containerRef]);

    return (
        <motion.path
            d={path}
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    );
}

import React from 'react';
