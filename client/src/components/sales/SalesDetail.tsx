import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Progress 
} from "@/components/ui/progress";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Building,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  CircleCheck,
  ClipboardList,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalesDetailProps {
  dealId: number;
  onClose: () => void;
}

const SalesDetail = ({ dealId, onClose }: SalesDetailProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("overview");

  // Fetch deal details
  const { data: deal, isLoading: isDealLoading, error } = useQuery({
    queryKey: [`/api/deals/${dealId}`],
  });

  // Fetch customer details
  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: [`/api/customers/${deal?.customerId}`],
    enabled: !!deal?.customerId,
  });

  // Fetch owner details
  const { data: owner, isLoading: isOwnerLoading } = useQuery({
    queryKey: [`/api/users/${deal?.ownerId}`],
    enabled: !!deal?.ownerId,
  });

  // Fetch pipeline stages
  const { data: stages, isLoading: isStagesLoading } = useQuery({
    queryKey: [`/api/pipeline-stages`],
  });

  // Fetch deal activities
  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: [`/api/activities?relatedTo=deal&relatedId=${dealId}`],
    enabled: !!dealId,
  });

  // Fetch tasks related to this deal
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: [`/api/tasks?relatedTo=deal&relatedId=${dealId}`],
    enabled: !!dealId,
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load deal details",
      variant: "destructive",
    });
  }

  // Format date to readable string
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format currency to ₹
  const formatCurrency = (value: number) => {
    if (!value) return "₹0";
    const inLakhs = value / 100000;
    if (inLakhs >= 1) {
      return `₹${inLakhs.toFixed(1)}L`;
    } else {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
  };

  // Get stage name by ID
  const getStageName = (stageId?: number) => {
    if (!stageId || !stages) return "Unknown";
    const stage = stages.find(s => s.id === stageId);
    return stage?.name || "Unknown";
  };

  // Get stage color
  const getStageColor = (stageId?: number) => {
    if (!stageId || !stages) return "#3B82F6";
    const stage = stages.find(s => s.id === stageId);
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

  const isLoading = isDealLoading || isCustomerLoading || isOwnerLoading || isStagesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-medium">Deal Not Found</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Deal Not Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The deal you're looking for doesn't exist or has been deleted.
              </p>
              <Button onClick={onClose}>Back to Sales Pipeline</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-medium">{deal.title}</h2>
          <div className="ml-3">{getStatusBadge(deal.status || "open")}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {deal.status === "open" && (
            <>
              <Button variant="default" size="sm" className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Won
              </Button>
              <Button variant="destructive" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                Mark as Lost
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border-b border-gray-200 dark:border-gray-800">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deal Details */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-medium">Deal Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Value</p>
                      <p className="text-xl font-bold font-mono text-blue-500">{formatCurrency(deal.value)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                      <p className="font-medium">
                        {customer ? customer.name : `Customer #${deal.customerId}`}
                        {customer?.company && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({customer.company})</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <BarChart3 className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Stage</p>
                      <div className="flex items-center mt-1">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: getStageColor(deal.stageId) }}
                        />
                        <span className="font-medium">{getStageName(deal.stageId)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                      <p className="font-medium">{owner ? (owner.fullName || owner.username) : "Unassigned"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expected Close Date</p>
                      <p className="font-medium">{formatDate(deal.expectedCloseDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created On</p>
                      <p className="font-medium">{formatDate(deal.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deal Status and Probability */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-medium">Deal Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-2">Win Probability</h3>
                    <div className="w-full">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{deal.probability}%</span>
                        <span className="text-gray-500 dark:text-gray-400">{deal.status === "won" ? "Won" : deal.status === "lost" ? "Lost" : "In Progress"}</span>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <div className="mb-2">
                        <CircleCheck className="h-6 w-6 mx-auto text-green-500" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                      <p className="text-lg font-medium">
                        {deal.status === "won" ? "Won" : 
                         deal.status === "lost" ? "Lost" : "Open"}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <div className="mb-2">
                        <ClipboardList className="h-6 w-6 mx-auto text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tasks</p>
                      <p className="text-lg font-medium">{isTasksLoading ? "..." : tasks?.length || 0}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <div className="mb-2">
                        <MessageSquare className="h-6 w-6 mx-auto text-amber-500" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Activities</p>
                      <p className="text-lg font-medium">{isActivitiesLoading ? "..." : activities?.length || 0}</p>
                    </div>
                  </div>

                  {deal.notes && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-base font-medium mb-2">Notes</h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {deal.notes}
                      </p>
                    </div>
                  )}

                  {/* Pipeline Progress Visualization */}
                  {stages && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-base font-medium mb-4">Pipeline Progress</h3>
                      <div className="flex items-center justify-between relative mb-2">
                        {stages.map((stage, index) => (
                          <div key={stage.id} className="flex flex-col items-center text-center">
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                stage.id === deal.stageId 
                                  ? 'bg-blue-500 text-white' 
                                  : stage.id < deal.stageId 
                                    ? 'bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300' 
                                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                              }`}
                            >
                              {stage.id <= deal.stageId ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <span className="text-xs">{index + 1}</span>
                              )}
                            </div>
                            <p className="text-xs mt-1 max-w-[80px] truncate">{stage.name}</p>
                            {index < stages.length - 1 && (
                              <div className="absolute h-[2px] top-3 left-0 right-0 -z-10 bg-gray-200 dark:bg-gray-700" style={{
                                left: `${(100 / stages.length) * (index + 0.5)}%`,
                                right: `${100 - ((100 / stages.length) * (index + 1.5))}%`
                              }}></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Deal Activities</CardTitle>
              <Button size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Log Activity
              </Button>
            </CardHeader>
            <CardContent>
              {isActivitiesLoading ? (
                <>
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : activities && activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="mb-1">{activity.description}</p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(activity.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(activity.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Activities Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    There are no logged activities for this deal yet.
                  </p>
                  <Button>Log Activity</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Deal Tasks</CardTitle>
              <Button size="sm">
                <ClipboardList className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              {isTasksLoading ? (
                <>
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : tasks && tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className={`h-2 w-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                        task.status === 'completed' 
                          ? 'bg-green-500' 
                          : task.priority === 'high' 
                            ? 'bg-red-500' 
                            : task.priority === 'medium' 
                              ? 'bg-amber-500' 
                              : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className={`mb-1 ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'font-medium'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(task.dueDate)}</span>
                          <span className="mx-2">•</span>
                          <span>{task.status === 'completed' ? 'Completed' : `${task.priority} priority`}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Tasks Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    There are no tasks associated with this deal yet.
                  </p>
                  <Button>Create Task</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesDetail;
