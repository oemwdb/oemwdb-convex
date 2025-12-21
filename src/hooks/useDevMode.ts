
import { useState, useEffect } from 'react';

const DEV_MODE_KEY = 'oemwdb_dev_mode';

export const useDevMode = () => {
    const [isDevMode, setIsDevMode] = useState<boolean>(() => {
        const stored = localStorage.getItem(DEV_MODE_KEY);
        return stored === 'true';
    });

    const toggleDevMode = () => {
        setIsDevMode(prev => {
            const newValue = !prev;
            localStorage.setItem(DEV_MODE_KEY, String(newValue));
            // Dispatch a custom event so other components can react immediately if needed
            window.dispatchEvent(new Event('dev-mode-change'));
            return newValue;
        });
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem(DEV_MODE_KEY);
            setIsDevMode(stored === 'true');
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('dev-mode-change', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('dev-mode-change', handleStorageChange);
        };
    }, []);

    return { isDevMode, toggleDevMode };
};
