import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';

const brandData = [
    { brand: 'BMW', wheels: 850, vehicles: 45 },
    { brand: 'Mercedes', wheels: 420, vehicles: 38 },
    { brand: 'Jaguar', wheels: 380, vehicles: 32 },
    { brand: 'Porsche', wheels: 240, vehicles: 28 },
    { brand: 'Audi', wheels: 180, vehicles: 22 },
];

const pieData = [
    { id: 'BMW', value: 850, label: 'BMW' },
    { id: 'Mercedes', value: 420, label: 'Mercedes' },
    { id: 'Jaguar', value: 380, label: 'Jaguar' },
    { id: 'Porsche', value: 240, label: 'Porsche' },
    { id: 'Audi', value: 180, label: 'Audi' },
];

const boltPatternData = [
    { pattern: '5x112', count: 245 },
    { pattern: '5x120', count: 198 },
    { pattern: '5x114.3', count: 156 },
    { pattern: '5x130', count: 89 },
    { pattern: '4x100', count: 67 },
];

export default function NivoDashboard() {
    return (
        <div className="space-y-6">
            {/* Big Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90">Total Brands</p>
                    <p className="text-4xl font-bold mt-2">185</p>
                    <p className="text-xs opacity-75 mt-2">Across all manufacturers</p>
                </div>
                <div className="bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 rounded-lg p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90">Total Vehicles</p>
                    <p className="text-4xl font-bold mt-2">144</p>
                    <p className="text-xs opacity-75 mt-2">Unique vehicle models</p>
                </div>
                <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 rounded-lg p-6 text-white shadow-lg">
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
                    <div style={{ height: 320 }}>
                        <ResponsiveBar
                            data={brandData}
                            keys={['wheels', 'vehicles']}
                            indexBy="brand"
                            margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
                            padding={0.3}
                            valueScale={{ type: 'linear' }}
                            colors={{ scheme: 'nivo' }}
                            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            axisBottom={{
                                tickRotation: -15,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    translateX: 120,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemsSpacing: 2,
                                },
                            ]}
                        />
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Brands</h3>
                    <div style={{ height: 320 }}>
                        <ResponsivePie
                            data={pieData}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            colors={{ scheme: 'paired' }}
                            borderWidth={1}
                            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                            arcLinkLabelsSkipAngle={10}
                            arcLinkLabelsTextColor="#333333"
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                        />
                    </div>
                </div>
            </div>

            {/* Bolt Pattern Distribution */}
            <div className="bg-white rounded-lg p-6 border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Popular Bolt Patterns
                </h3>
                <div style={{ height: 256 }}>
                    <ResponsiveBar
                        data={boltPatternData}
                        keys={['count']}
                        indexBy="pattern"
                        margin={{ top: 20, right: 60, bottom: 50, left: 60 }}
                        padding={0.3}
                        valueScale={{ type: 'linear' }}
                        colors={{ scheme: 'purple_blue' }}
                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    />
                </div>
            </div>
        </div>
    );
}
