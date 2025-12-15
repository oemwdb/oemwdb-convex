import { Card, Title, Text, Metric, BarChart, DonutChart } from '@tremor/react';

// Sample data for the wheel database
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

export default function TremorDashboard() {
    return (
        <div className="space-y-6">
            {/* Big Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <Text>Total Brands</Text>
                    <Metric>185</Metric>
                    <Text className="text-sm text-gray-500 mt-2">Across all manufacturers</Text>
                </Card>
                <Card>
                    <Text>Total Vehicles</Text>
                    <Metric>144</Metric>
                    <Text className="text-sm text-gray-500 mt-2">Unique vehicle models</Text>
                </Card>
                <Card>
                    <Text>Total Wheels</Text>
                    <Metric>4,151</Metric>
                    <Text className="text-sm text-gray-500 mt-2">OEM wheel designs</Text>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Bar Chart */}
                <Card className="lg:col-span-2">
                    <Title>Wheels & Vehicles per Brand</Title>
                    <BarChart
                        className="mt-4 h-80"
                        data={brandData}
                        index="brand"
                        categories={['wheels', 'vehicles']}
                        colors={['blue', 'green']}
                        valueFormatter={(number) => `${number}`}
                        yAxisWidth={48}
                    />
                </Card>

                {/* Donut Chart */}
                <Card>
                    <Title>Top Brands</Title>
                    <DonutChart
                        className="mt-4"
                        data={brandData}
                        category="wheels"
                        index="brand"
                        colors={['slate', 'violet', 'indigo', 'rose', 'cyan']}
                        valueFormatter={(number) => `${number} wheels`}
                    />
                </Card>
            </div>

            {/* Bolt Pattern Distribution */}
            <Card>
                <Title>Popular Bolt Patterns</Title>
                <BarChart
                    className="mt-4 h-64"
                    data={boltPatternData}
                    index="pattern"
                    categories={['count']}
                    colors={['indigo']}
                    valueFormatter={(number) => `${number} wheels`}
                    yAxisWidth={48}
                    showLegend={false}
                />
            </Card>
        </div>
    );
}
