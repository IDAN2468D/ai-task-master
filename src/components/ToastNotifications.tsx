'use client';

import { CheckCircle, AlertTriangle, Info, X, Bell } from 'lucide-react';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => { } });

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    const icons = { success: CheckCircle, error: AlertTriangle, info: Info, warning: Bell };
    const colors = {
        success: 'bg-emerald-500 border-emerald-400',
        error: 'bg-red-500 border-red-400',
        info: 'bg-[#4318FF] border-[#4318FF]',
        warning: 'bg-amber-500 border-amber-400',
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-24 left-6 z-[10000] flex flex-col gap-3 max-w-sm">
                <AnimatePresence>
                    {toasts.map(toast => {
                        const Icon = icons[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white shadow-2xl border ${colors[toast.type]}`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-bold flex-1">{toast.message}</span>
                                <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-white/20 rounded-lg">
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
