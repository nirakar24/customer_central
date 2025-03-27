import { 
  BanknoteIcon, 
  UsersIcon, 
  BarChart3Icon, 
  TrendingUpIcon,
  TrendingDownIcon,
  BarChartHorizontalIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  icon: "money" | "users" | "chart" | "bar-chart";
  change: number;
  changeType: "increase" | "decrease";
}

const MetricCard = ({ title, value, icon, change, changeType }: MetricCardProps) => {
  const renderIcon = () => {
    switch (icon) {
      case "money":
        return <BanknoteIcon className="w-6 h-6 text-blue-500" />;
      case "users":
        return <UsersIcon className="w-6 h-6 text-green-500" />;
      case "chart":
        return <BarChart3Icon className="w-6 h-6 text-red-500" />;
      case "bar-chart":
        return <BarChartHorizontalIcon className="w-6 h-6 text-amber-500" />;
      default:
        return <BanknoteIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  const getIconBgColor = () => {
    switch (icon) {
      case "money":
        return "bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20";
      case "users":
        return "bg-green-50 dark:bg-green-900 dark:bg-opacity-20";
      case "chart":
        return "bg-red-50 dark:bg-red-900 dark:bg-opacity-20";
      case "bar-chart":
        return "bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20";
      default:
        return "bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="mt-2 text-3xl font-semibold font-mono text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className={`p-2 rounded-md ${getIconBgColor()}`}>
            {renderIcon()}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium flex items-center ${
            changeType === "increase" ? "text-green-500" : "text-red-500"
          }`}>
            {changeType === "increase" ? (
              <TrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            {change}%
          </span>
          <span className="text-gray-500 text-xs ml-2 dark:text-gray-400">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
