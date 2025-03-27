import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface CustomerChartProps {
  isLoading: boolean;
}

const CustomerChart = ({ isLoading }: CustomerChartProps) => {
  const [activeButton, setActiveButton] = useState<string>("new");
  
  // Sample data for chart
  const customerData = [
    { name: 'Jan', new: 21, returning: 15, churned: 5 },
    { name: 'Feb', new: 28, returning: 18, churned: 8 },
    { name: 'Mar', new: 32, returning: 22, churned: 6 },
    { name: 'Apr', new: 18, returning: 25, churned: 4 },
    { name: 'May', new: 25, returning: 30, churned: 7 },
    { name: 'Jun', new: 34, returning: 28, churned: 5 }
  ];
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Customer Growth</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Skeleton className="h-[240px] rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Customer Growth</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={activeButton === "new" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveButton("new")}
            >
              New
            </Button>
            <Button
              variant={activeButton === "returning" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveButton("returning")}
            >
              Returning
            </Button>
            <Button
              variant={activeButton === "churned" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveButton("churned")}
            >
              Churned
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customerData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip content={customTooltip} />
              <Legend />
              <Bar 
                dataKey="new" 
                name="New Customers" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                hide={activeButton !== "new" && activeButton !== "all"}
              />
              <Bar 
                dataKey="returning" 
                name="Returning" 
                fill="#22C55E" 
                radius={[4, 4, 0, 0]} 
                hide={activeButton !== "returning" && activeButton !== "all"}
              />
              <Bar 
                dataKey="churned" 
                name="Churned" 
                fill="#EF4444" 
                radius={[4, 4, 0, 0]}
                hide={activeButton !== "churned" && activeButton !== "all"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerChart;
