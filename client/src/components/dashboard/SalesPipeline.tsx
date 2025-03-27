import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  InfoIcon, 
  MessageCircleIcon, 
  ClipboardIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PipelineStage {
  id: number;
  name: string;
  order: number;
  count: number;
  value: number;
  color: string;
}

interface SalesPipelineProps {
  className?: string;
  isLoading: boolean;
  data?: PipelineStage[];
}

const SalesPipeline = ({ className, isLoading, data }: SalesPipelineProps) => {
  const getStageIcon = (stageName: string) => {
    switch (stageName) {
      case "Lead":
        return <InfoIcon className="w-5 h-5 text-blue-500" />;
      case "Contact":
        return <MessageCircleIcon className="w-5 h-5 text-blue-500" />;
      case "Proposal":
        return <ClipboardIcon className="w-5 h-5 text-blue-500" />;
      case "Negotiation":
        return <ShieldCheckIcon className="w-5 h-5 text-blue-500" />;
      case "Closed Won":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <InfoIcon className="w-5 h-5 text-blue-500" />;
    }
  };
  
  // Format currency value to lakhs (L)
  const formatValue = (value: number) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };
  
  // Mocked data when real data is not available
  const mockPipelineStages: PipelineStage[] = [
    { id: 1, name: "Lead", order: 1, count: 42, value: 2150000, color: "#3B82F6" },
    { id: 2, name: "Contact", order: 2, count: 36, value: 1820000, color: "#3B82F6" },
    { id: 3, name: "Proposal", order: 3, count: 28, value: 1480000, color: "#3B82F6" },
    { id: 4, name: "Negotiation", order: 4, count: 15, value: 950000, color: "#3B82F6" },
    { id: 5, name: "Closed Won", order: 5, count: 8, value: 520000, color: "#22C55E" }
  ];
  
  // Use mock data or real data
  const pipelineStages = data || mockPipelineStages;
  
  // Calculate conversion rate
  const leadsCount = pipelineStages.find(stage => stage.name === "Lead")?.count || 42;
  const closedCount = pipelineStages.find(stage => stage.name === "Closed Won")?.count || 8;
  const conversionRate = Math.round((closedCount / leadsCount) * 100);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Sales Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[140px] rounded-md mb-4" />
          <Skeleton className="h-8 w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Sales Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          {pipelineStages.map((stage, index) => (
            <div key={stage.id} className="relative text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 dark:bg-opacity-40 rounded-full mb-3">
                  {getStageIcon(stage.name)}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stage.name}</span>
                <span className="mt-1 text-2xl font-semibold font-mono text-blue-500">{stage.count}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatValue(stage.value)}</span>
              </div>
              {index < pipelineStages.length - 1 && (
                <div className="absolute top-1/4 -right-2 w-4 h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-blue-500">
                  Conversion Rate: {conversionRate}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-500">
                  {closedCount}/{leadsCount} closed
                </span>
              </div>
            </div>
            <Progress value={conversionRate} className="h-2 bg-blue-100 dark:bg-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesPipeline;
