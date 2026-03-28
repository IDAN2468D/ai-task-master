'use client';

import React, { useEffect, useState, useId, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBeamProps {
    fromId: string;
    toId: string;
    duration?: number;
    delay?: number;
    pathColor?: string;
    gradientStart?: string;
    gradientStop?: string;
    reverse?: boolean;
}

export default function AnimatedBeam({
    fromId,
    toId,
    duration = 3,
    delay = 0,
    pathColor = "rgba(67, 24, 255, 0.1)",
    gradientStart = "#4318FF",
    gradientStop = "#00E5FF",
    reverse = false,
}: AnimatedBeamProps) {
    const id = useId();
    const svgRef = useRef<SVGSVGElement>(null);
    const [path, setPath] = useState("");

    useEffect(() => {
        const updatePath = () => {
            const container = svgRef.current;
            const fromEl = document.getElementById(fromId);
            const toEl = document.getElementById(toId);

            if (container && fromEl && toEl) {
                const containerRect = container.getBoundingClientRect();
                const fromRect = fromEl.getBoundingClientRect();
                const toRect = toEl.getBoundingClientRect();

                let startX = fromRect.left - containerRect.left + fromRect.width / 2;
                let startY = fromRect.top - containerRect.top + fromRect.height / 2;
                let endX = toRect.left - containerRect.left + toRect.width / 2;
                let endY = toRect.top - containerRect.top + toRect.height / 2;

                if (reverse) {
                  [startX, endX] = [endX, startX];
                  [startY, endY] = [endY, startY];
                }

                // Create a curved path (quadratic bezier)
                const controlX = (startX + endX) / 2;
                const controlY = Math.min(startY, endY) - 50;

                setPath(`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
            }
        };

        updatePath();
        const timeoutId = setTimeout(updatePath, 1000); // Wait for potential layout shifts
        window.addEventListener('resize', updatePath);
        return () => {
          window.removeEventListener('resize', updatePath);
          clearTimeout(timeoutId);
        };
    }, [fromId, toId, reverse]);

    return (
        <svg
            ref={svgRef}
            className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
            style={{ zIndex: 0 }}
        >
            <defs>
                <linearGradient id={id} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={gradientStart} stopOpacity="0" />
                    <stop offset="50%" stopColor={gradientStart} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={gradientStop} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={path}
                stroke={pathColor}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
            />
            <motion.path
                d={path}
                stroke={`url(#${id})`}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                    duration,
                    delay,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </svg>
    );
}

