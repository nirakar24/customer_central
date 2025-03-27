import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  MoreHorizontal, 
  ArrowUp, 
  ArrowDown, 
  User 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Deal, PipelineStage } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface SalesListProps {
  deals: Deal[] | undefined;
  stages: PipelineStage[] | undefined;
  isLoading: boolean;
  onSelectDeal: (dealId: number) => void;
}

const SalesList = ({ deals, stages, isLoading, onSelectDeal }: SalesListProps) => {
  // Fetch users data to show owners
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
  });

  // Format date to readable string
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format currency to ₹
  const formatCurrency = (value: number) => {
    if (value === 0) return "₹0";
    const inLakhs = value / 100000;
    if (inLakhs >= 1) {
      return `₹${inLakhs.toFixed(1)}L`;
    } else {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
  };

  // Get stage name by ID
  const getStageName = (stageId: number) => {
    const stage = stages?.find(s => s.id === stageId);
    return stage?.name || "Unknown";
  };

  // Get stage color
  const getStageColor = (stageId: number) => {
    const stage = stages?.find(s => s.id === stageId);
    return stage?.color || "#3B82F6";
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "won":
        return <Badge variant="default" className="bg-green-500">Won</Badge>;
      case "lost":
        return <Badge variant="destructive">Lost</Badge>;
      default:
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Open</Badge>;
    }
  };

  // Get owner name
  const getOwnerName = (ownerId?: number) => {
    if (!ownerId || !users) return "Unassigned";
    const owner = users.find((user: any) => user.id === ownerId);
    return owner ? (owner.fullName || owner.username) : "Unknown";
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-4">
          <Skeleton className="h-8 w-full mb-6" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-4" />
          ))}
        </div>
      </Card>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No deals found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try changing your search criteria or add a new deal.
          </p>
          <Button>Add Deal</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="rounded-b-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Expected Close</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>
                  <div className="font-medium">{deal.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {getStatusBadge(deal.status || "open")}
                  </div>
                </TableCell>
                <TableCell>
                  {/* We would normally fetch customer details here, but for simplicity just show ID */}
                  Customer #{deal.customerId}
                </TableCell>
                <TableCell>{formatCurrency(deal.value)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: getStageColor(deal.stageId) }}
                    />
                    {getStageName(deal.stageId)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{deal.probability}%</span>
                    </div>
                    <Progress 
                      value={deal.probability} 
                      className="h-2"
                      // Color based on probability
                      color={deal.probability >= 70 ? "bg-green-500" : 
                             deal.probability >= 40 ? "bg-blue-500" : 
                             "bg-amber-500"}
                    />
                  </div>
                </TableCell>
                <TableCell>{formatDate(deal.expectedCloseDate)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="bg-gray-200 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span>{getOwnerName(deal.ownerId)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectDeal(deal.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-500"
                      title="Move to next stage"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-amber-500"
                      title="Move to previous stage"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectDeal(deal.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Won</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Lost</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          Delete Deal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default SalesList;
