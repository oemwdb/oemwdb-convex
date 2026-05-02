import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PERSPECTIVE_STORAGE_KEY, readStoredPerspective, type ViewerPerspective } from '@/lib/perspective';

interface DevModeContextType {
    isDevMode: boolean;
    perspective: ViewerPerspective;
    setPerspective: (nextPerspective: ViewerPerspective) => void;
    toggleDevMode: () => void;
    isAdmin: boolean;
    canUsePerspectiveSwitcher: boolean;
    isAuthenticatedView: boolean;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const DevModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAdmin, actualIsAuthenticated, isLoading } = useAuth();
    const [storedPerspective, setStoredPerspective] = useState<ViewerPerspective>(() => readStoredPerspective());

    useEffect(() => {
        if (isLoading) return;

        if (!actualIsAuthenticated) {
            window.localStorage.setItem(PERSPECTIVE_STORAGE_KEY, 'basic');
            setStoredPerspective('basic');
            return;
        }

        if (!isAdmin) {
            window.localStorage.setItem(PERSPECTIVE_STORAGE_KEY, 'user');
            setStoredPerspective('user');
        }
    }, [actualIsAuthenticated, isAdmin, isLoading]);

    useEffect(() => {
        const syncPerspective = () => {
            setStoredPerspective(readStoredPerspective());
        };

        window.addEventListener('storage', syncPerspective);
        window.addEventListener('viewer-perspective-change', syncPerspective);

        return () => {
            window.removeEventListener('storage', syncPerspective);
            window.removeEventListener('viewer-perspective-change', syncPerspective);
        };
    }, []);

    const perspective: ViewerPerspective = isLoading
        ? storedPerspective
        : !actualIsAuthenticated
        ? 'basic'
        : isAdmin
            ? storedPerspective
            : 'user';
    const isDevMode = isAdmin && actualIsAuthenticated && perspective === 'dev';
    const canUsePerspectiveSwitcher = isAdmin && actualIsAuthenticated;
    const isAuthenticatedView = actualIsAuthenticated && perspective !== 'basic';

    const setPerspective = (nextPerspective: ViewerPerspective) => {
        if (!canUsePerspectiveSwitcher) return;
        window.localStorage.setItem(PERSPECTIVE_STORAGE_KEY, nextPerspective);
        window.dispatchEvent(new Event('viewer-perspective-change'));
        setStoredPerspective(nextPerspective);
    };

    const toggleDevMode = () => {
        if (!canUsePerspectiveSwitcher) return;
        setPerspective(isDevMode ? 'user' : 'dev');
    };

    const value = useMemo(() => ({
        isDevMode,
        perspective,
        setPerspective,
        toggleDevMode,
        isAdmin,
        canUsePerspectiveSwitcher,
        isAuthenticatedView,
    }), [canUsePerspectiveSwitcher, isAdmin, isAuthenticatedView, isDevMode, perspective]);

    return (
        <DevModeContext.Provider value={value}>
            {children}
        </DevModeContext.Provider>
    );
};

export const useDevMode = () => {
    const context = useContext(DevModeContext);
    if (context === undefined) {
        throw new Error('useDevMode must be used within a DevModeProvider');
    }
    return context;
};
