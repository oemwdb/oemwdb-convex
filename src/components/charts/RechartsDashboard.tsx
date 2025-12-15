import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const brandData = [
    { brand: 'BMW', wheels: 850, vehicles: 45 },
    { brand: 'Mercedes', wheels: 420, vehicles: 38 },
    { brand: 'Jaguar', wheels: 380, vehicles: 32 },
    { brand: 'Porsche', wheels: 240, vehicles: 28 },
    { brand: 'Audi', wheels: 180, vehicles: 22 },
];

const boltPatternData = [
    { pattern: '5x112', count: 245 },
    { pattern: '5x120', count: 198 },
    { pattern: '5x114.3', count: 156 },
    { pattern: '5x130', count: 89 },
    { pattern: '4x100', count: 67 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6'];

export default function RechartsDashboard() {
    return (
        <div className="space-y-6">
            {/* Big Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <p className="text-sm text-gray-600 font-medium">Total Brands</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">185</p>
                    <p className="text-xs text-gray-500 mt-2">Across all manufacturers</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <p className="text-sm text-gray-600 font-medium">Total Vehicles</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">144</p>
                    <p className="text-xs text-gray-500 mt-2">Unique vehicle models</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                    <p className="text-sm text-gray-600 font-medium">Total Wheels</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">4,151</p>
                    <p className="text-xs text-gray-500 mt-2">OEM wheel designs</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg p-6 border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Wheels & Vehicles per Brand
                    </h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={brandData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="brand" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="wheels" fill="#3b82f6" />
                            <Bar dataKey="vehicles" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-lg p-6 border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Brands</h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={brandData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => entry.brand}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="wheels"
                            >
                                {brandData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bolt Pattern Distribution */}
            <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Popular Bolt Patterns
                </h3>
                <ResponsiveContainer width="100%" height={256}>
                    <BarChart data={boltPatternData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="pattern" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366f1" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
