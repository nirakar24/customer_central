import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface RevenueChartProps {
  isLoading: boolean;
}

const RevenueChart = ({ isLoading }: RevenueChartProps) => {
  const [activeButton, setActiveButton] = useState<string>("monthly");
  
  // Sample data for chart
  const monthlyData = [
    { name: 'Jan', revenue: 4200000 },
    { name: 'Feb', revenue: 5500000 },
    { name: 'Mar', revenue: 4900000 },
    { name: 'Apr', revenue: 6200000 },
    { name: 'May', revenue: 6900000 },
    { name: 'Jun', revenue: 8300000 },
    { name: 'Jul', revenue: 7300000 },
    { name: 'Aug', revenue: 7900000 },
    { name: 'Sep', revenue: 8600000 },
    { name: 'Oct', revenue: 9200000 },
    { name: 'Nov', revenue: 8800000 },
    { name: 'Dec', revenue: 9600000 }
  ];
  
  const quarterlyData = [
    { name: 'Q1', revenue: 14600000 },
    { name: 'Q2', revenue: 21400000 },
    { name: 'Q3', revenue: 23800000 },
    { name: 'Q4', revenue: 27600000 }
  ];
  
  const yearlyData = [
    { name: '2020', revenue: 58000000 },
    { name: '2021', revenue: 72000000 },
    { name: '2022', revenue: 85000000 },
    { name: '2023', revenue: 87400000 }
  ];
  
  const [chartData, setChartData] = useState(monthlyData);
  
  useEffect(() => {
    switch (activeButton) {
      case "monthly":
        setChartData(monthlyData);
        break;
      case "quarterly":
        setChartData(quarterlyData);
        break;
      case "yearly":
        setChartData(yearlyData);
        break;
      default:
        setChartData(monthlyData);
    }
  }, [activeButton]);
  
  const formatYAxis = (value: number) => {
    return `₹${(value / 100000).toFixed(0)}L`;
  };
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-blue-500">
            Revenue: {`₹${(payload[0].value / 100000).toFixed(1)}L`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Revenue Trends</CardTitle>
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
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Revenue Trends</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant={activeButton === "monthly" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setActiveButton("monthly")}
            >
              Monthly
            </Button>
            <Button 
              variant={activeButton === "quarterly" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setActiveButton("quarterly")}
            >
              Quarterly
            </Button>
            <Button 
              variant={activeButton === "yearly" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setActiveButton("yearly")}
            >
              Yearly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip content={customTooltip} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#revenueGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
