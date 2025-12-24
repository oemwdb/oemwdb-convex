import React, { createContext, useContext, useState, useEffect } from 'react';

interface DevModeContextType {
    isDevMode: boolean;
    toggleDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const DevModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDevMode, setIsDevMode] = useState<boolean>(() => {
        const saved = localStorage.getItem('isDevMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('isDevMode', JSON.stringify(isDevMode));
    }, [isDevMode]);

    const toggleDevMode = () => {
        setIsDevMode(prev => !prev);
    };

    return (
        <DevModeContext.Provider value={{ isDevMode, toggleDevMode }}>
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
