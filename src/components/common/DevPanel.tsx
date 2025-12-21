
import React from 'react';
import { useDevMode } from '@/hooks/useDevMode';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Activity } from 'lucide-react';

export const DevPanel: React.FC = () => {
    const { isDevMode, toggleDevMode } = useDevMode();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg hover:opacity-100 transition-opacity opacity-50 hover:opacity-100">
            <Activity className={`w-4 h-4 ${isDevMode ? 'text-green-500' : 'text-muted-foreground'}`} />
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium">DEV MODE</span>
                <Switch
                    checked={isDevMode}
                    onCheckedChange={toggleDevMode}
                    className="scale-75"
                />
            </div>
        </div>
    );
};
