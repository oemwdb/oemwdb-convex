import { useState, useRef, useEffect } from 'react';

interface SplitViewProps {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
    leftLabel: string;
    rightLabel: string;
}

export default function SplitView({
    leftContent,
    rightContent,
    leftLabel,
    rightLabel,
}: SplitViewProps) {
    const [splitPosition, setSplitPosition] = useState(50); // percentage
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const newPosition = ((e.clientX - rect.left) / rect.width) * 100;

        // Clamp between 20% and 80%
        setSplitPosition(Math.max(20, Math.min(80, newPosition)));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = ' none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="relative flex h-[calc(100vh-300px)] bg-white rounded-lg shadow-lg overflow-hidden"
        >
            {/* Left Panel */}
            <div
                className="overflow-auto border-r-2 border-gray-200"
                style={{ width: `${splitPosition}%` }}
            >
                <div className="sticky top-0 bg-green-600 text-white px-4 py-2 font-semibold z-10">
                    {leftLabel}
                </div>
                <div className="p-6">{leftContent}</div>
            </div>

            {/* Draggable Divider */}
            <div
                onMouseDown={handleMouseDown}
                className={`absolute top-0 bottom-0 w-2 bg-blue-500 hover:bg-blue-600 cursor-col-resize transition-colors z-20 ${isDragging ? 'bg-blue-700' : ''
                    }`}
                style={{ left: `calc(${splitPosition}% - 4px)` }}
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-full" />
            </div>

            {/* Right Panel */}
            <div
                className="overflow-auto"
                style={{ width: `${100 - splitPosition}%` }}
            >
                <div className="sticky top-0 bg-purple-600 text-white px-4 py-2 font-semibold z-10">
                    {rightLabel}
                </div>
                <div className="p-6">{rightContent}</div>
            </div>
        </div>
    );
}
