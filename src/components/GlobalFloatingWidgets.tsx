'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Lazy load heavy floating components - these are overlays, not needed at first paint
const AICompanion = dynamic(() => import('./AICompanion'), { ssr: false });
const VoiceActionOrb = dynamic(() => import('./VoiceActionOrb'), { ssr: false });
const CommandCenter = dynamic(() => import('./CommandCenter'), { ssr: false });
const PomodoroTimer = dynamic(() => import('./PomodoroTimer'), { ssr: false });

export default function GlobalFloatingWidgets() {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) return null;

    return (
        <>
            <AICompanion />
            <VoiceActionOrb />
            <CommandCenter />
            <PomodoroTimer />
        </>
    );
}
