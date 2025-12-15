import { useState } from 'react';
import TremorDashboard from '../components/charts/TremorDashboard';
import RechartsDashboard from '../components/charts/RechartsDashboard';
import ChartJSDashboard from '../components/charts/ChartJSDashboard';
import NivoDashboard from '../components/charts/NivoDashboard';
import SplitView from '../components/charts/SplitView';

type ChartLibrary = 'tremor' | 'recharts' | 'chartjs' | 'nivo';

export default function ChartComparison() {
    const [viewMode, setViewMode] = useState<'single' | 'split'>('single');
    const [selectedLibrary, setSelectedLibrary] = useState<ChartLibrary>('tremor');
    const [leftLibrary, setLeftLibrary] = useState<ChartLibrary>('tremor');
    const [rightLibrary, setRightLibrary] = useState<ChartLibrary>('recharts');

    const libraries: { id: ChartLibrary; name: string }[] = [
        { id: 'tremor', name: 'Tremor' },
        { id: 'recharts', name: 'Recharts' },
        { id: 'chartjs', name: 'Chart.js' },
        { id: 'nivo', name: 'Nivo' },
    ];

    const renderDashboard = (library: ChartLibrary) => {
        switch (library) {
            case 'tremor':
                return <TremorDashboard />;
            case 'recharts':
                return <RechartsDashboard />;
            case 'chartjs':
                return <ChartJSDashboard />;
            case 'nivo':
                return <NivoDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Chart Library Comparison
                </h1>
                <p className="text-gray-600">
                    Compare different React charting libraries side-by-side
                </p>
            </div>

            {/* Controls */}
            <div className="max-w-7xl mx-auto mb-6 space-y-4">
                {/* View Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('single')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === 'single'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Single View
                    </button>
                    <button
                        onClick={() => setViewMode('split')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === 'split'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Split View
                    </button>
                </div>

                {/* Library Selectors */}
                {viewMode === 'single' ? (
                    <div className="flex gap-2 flex-wrap">
                        {libraries.map((lib) => (
                            <button
                                key={lib.id}
                                onClick={() => setSelectedLibrary(lib.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition ${selectedLibrary === lib.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {lib.name}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Left Panel
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {libraries.map((lib) => (
                                    <button
                                        key={lib.id}
                                        onClick={() => setLeftLibrary(lib.id)}
                                        className={`px-3 py-1.5 rounded text-sm font-medium transition ${leftLibrary === lib.id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {lib.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Right Panel
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {libraries.map((lib) => (
                                    <button
                                        key={lib.id}
                                        onClick={() => setRightLibrary(lib.id)}
                                        className={`px-3 py-1.5 rounded text-sm font-medium transition ${rightLibrary === lib.id
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {lib.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Dashboard Display */}
            <div className="max-w-7xl mx-auto">
                {viewMode === 'single' ? (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        {renderDashboard(selectedLibrary)}
                    </div>
                ) : (
                    <SplitView
                        leftContent={renderDashboard(leftLibrary)}
                        rightContent={renderDashboard(rightLibrary)}
                        leftLabel={libraries.find((l) => l.id === leftLibrary)?.name || ''}
                        rightLabel={libraries.find((l) => l.id === rightLibrary)?.name || ''}
                    />
                )}
            </div>
        </div>
    );
}
