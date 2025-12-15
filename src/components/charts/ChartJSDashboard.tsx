import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const brandData = {
    labels: ['BMW', 'Mercedes', 'Jaguar', 'Porsche', 'Audi'],
    datasets: [
        {
            label: 'Wheels',
            data: [850, 420, 380, 240, 180],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
        },
        {
            label: 'Vehicles',
            data: [45, 38, 32, 28, 22],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
        },
    ],
};

const pieData = {
    labels: ['BMW', 'Mercedes', 'Jaguar', 'Porsche', 'Audi'],
    datasets: [
        {
            data: [850, 420, 380, 240, 180],
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(249, 115, 22, 0.8)',
                'rgba(20, 184, 166, 0.8)',
            ],
            borderWidth: 2,
            borderColor: '#fff',
        },
    ],
};

const boltPatternData = {
    labels: ['5x112', '5x120', '5x114.3', '5x130', '4x100'],
    datasets: [
        {
            label: 'Count',
            data: [245, 198, 156, 89, 67],
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
        },
    ],
};

export default function ChartJSDashboard() {
    return (
        <div className="space-y-6">
            {/* Big Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <p className="text-sm font-medium opacity-90">Total Brands</p>
                    <p className="text-4xl font-bold mt-2">185</p>
                    <p className="text-xs opacity-75 mt-2">Across all manufacturers</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <p className="text-sm font-medium opacity-90">Total Vehicles</p>
                    <p className="text-4xl font-bold mt-2">144</p>
                    <p className="text-xs opacity-75 mt-2">Unique vehicle models</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <p className="text-sm font-medium opacity-90">Total Wheels</p>
                    <p className="text-4xl font-bold mt-2">4,151</p>
                    <p className="text-xs opacity-75 mt-2">OEM wheel designs</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg p-6 border shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Wheels & Vehicles per Brand
                    </h3>
                    <div className="h-80">
                        <Bar
                            data={brandData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'top' },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Doughnut Chart */}
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Brands</h3>
                    <div className="h-80 flex items-center justify-center">
                        <Doughnut
                            data={pieData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Bolt Pattern Distribution */}
            <div className="bg-white rounded-lg p-6 border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Popular Bolt Patterns
                </h3>
                <div className="h-64">
                    <Bar
                        data={boltPatternData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
