'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();
export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ msg: '', visible: false });
    const showToast = useCallback((msg) => {
        setToast({ msg, visible: true });
        setTimeout(() => setToast(p => ({ ...p, visible: false })), 3500);
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className={`toast${toast.visible ? ' show' : ''}`}>
                <span>✅</span><span>{toast.msg}</span>
            </div>
        </ToastContext.Provider>
    );
}

export default function Toast() { return null; }
