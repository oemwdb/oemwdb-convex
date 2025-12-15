
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface ChartData {
  name: string;
  revenue: number;
  expenses: number;
}

const OverviewChart = () => {
  const data: ChartData[] = [
    { name: "Jan", revenue: 24000, expenses: 18000 },
    { name: "Feb", revenue: 26000, expenses: 17000 },
    { name: "Mar", revenue: 19000, expenses: 15000 },
    { name: "Apr", revenue: 34000, expenses: 19000 },
    { name: "May", revenue: 31000, expenses: 21000 },
    { name: "Jun", revenue: 43000, expenses: 22000 },
    { name: "Jul", revenue: 50000, expenses: 24000 },
  ];

  return (
    <div className="bg-card p-5 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-card-foreground">Financial Overview</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-foreground"></span>
              <span className="text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-muted-foreground"></span>
              <span className="text-muted-foreground">Expenses</span>
            </div>
          </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, undefined]}
              contentStyle={{ 
                borderRadius: '6px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--foreground))"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewChart;
