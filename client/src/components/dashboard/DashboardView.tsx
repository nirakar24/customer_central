import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MetricCard from "./MetricCard";
import RevenueChart from "./RevenueChart";
import CustomerChart from "./CustomerChart";
import SalesPipeline from "./SalesPipeline";
import TeamPerformance from "./TeamPerformance";
import RecentActivity from "./RecentActivity";
import TasksCard from "./TasksCard";

const DashboardView = () => {
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load dashboard data",
      variant: "destructive",
    });
  }
  
  // Format numbers for display
  const formatCurrency = (value: number) => {
    const inLakhs = value / 100000;
    return `₹${inLakhs.toFixed(1)}L`;
  };
  
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  const formatNumber = (value: number) => {
    return value.toString();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-inter text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview of your business performance and analytics</p>
      </div>

      {/* Filters Row */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <Select defaultValue="last7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="thisyear">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="allregions">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allregions">All regions</SelectItem>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button variant="outline" size="sm">
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(data?.metrics.totalRevenue || 0)}
              icon="money"
              change={12.5}
              changeType="increase"
            />
            <MetricCard
              title="New Customers"
              value={formatNumber(data?.metrics.newCustomers || 0)}
              icon="users"
              change={8.2}
              changeType="increase"
            />
            <MetricCard
              title="Churn Rate"
              value={formatPercentage(data?.metrics.churnRate || 0)}
              icon="chart"
              change={0.5}
              changeType="decrease"
            />
            <MetricCard
              title="Avg. Deal Size"
              value={formatCurrency(data?.metrics.avgDealSize || 0)}
              icon="bar-chart"
              change={2.3}
              changeType="decrease"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart isLoading={isLoading} />
        <CustomerChart isLoading={isLoading} />
      </div>

      {/* Sales & Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SalesPipeline 
          className="lg:col-span-2" 
          isLoading={isLoading} 
          data={data?.pipelineSummary}
        />
        <TeamPerformance 
          isLoading={isLoading} 
          data={data?.teamPerformance}
        />
      </div>

      {/* Recent Activities & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity 
          isLoading={isLoading} 
          activities={data?.recentActivities}
        />
        <TasksCard 
          isLoading={isLoading} 
          tasks={data?.todaysTasks}
        />
      </div>
    </div>
  );
};

export default DashboardView;
