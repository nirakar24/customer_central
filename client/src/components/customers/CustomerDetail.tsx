import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BarChart,
  Edit,
  DollarSign,
  AlertTriangle,
  ClipboardList,
  MessageSquare,
  LifeBuoy,
  Clock,
} from "lucide-react";

interface CustomerDetailProps {
  customerId: number;
  onClose: () => void;
}

const CustomerDetail = ({ customerId, onClose }: CustomerDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch customer details
  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: [`/api/customers/${customerId}`],
  });

  // Fetch customer deals
  const { data: deals, isLoading: isDealsLoading } = useQuery({
    queryKey: [`/api/deals?customerId=${customerId}`],
  });

  // Fetch customer activities
  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: [`/api/activities?relatedTo=customer&relatedId=${customerId}`],
  });

  // Format date to readable string
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Never";
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

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "lead":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Lead</Badge>;
      case "churned":
        return <Badge variant="destructive">Churned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isCustomerLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-20 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-medium">Customer Not Found</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Customer Not Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The customer you're looking for doesn't exist or has been deleted.
              </p>
              <Button onClick={onClose}>Back to Customers</Button>
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
          <h2 className="text-xl font-medium">{customer.name}</h2>
          <div className="ml-3">{getStatusBadge(customer.status || "active")}</div>
        </div>
        <div className="flex gap-2">
          {customer.phone && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${customer.phone}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </a>
            </Button>
          )}
          {customer.email && (
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${customer.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
            </Button>
          )}
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border-b border-gray-200 dark:border-gray-800">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-auto w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="tickets" className="hidden md:block">Support Tickets</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-medium">Customer Profile</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={customer.avatarUrl || ""} />
                    <AvatarFallback className="text-2xl">{getInitials(customer.name)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{customer.name}</h3>
                  {customer.company && (
                    <p className="text-gray-500 dark:text-gray-400">{customer.company}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {customer.email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                    </div>
                  )}

                  {customer.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium">{customer.phone}</p>
                      </div>
                    </div>
                  )}

                  {customer.address && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                        <p className="font-medium">{customer.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer Since</p>
                      <p className="font-medium">{formatDate(customer.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Contact</p>
                      <p className="font-medium">{formatDate(customer.lastContact)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Stats and Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-medium">Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                    </div>
                    <p className="text-2xl font-mono font-semibold">{formatCurrency(customer.totalRevenue || 0)}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <BarChart className="h-5 w-5 text-amber-500 mr-2" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Churn Risk</p>
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">
                          {customer.churnRisk === 0 ? "N/A" : 
                           customer.churnRisk <= 2 ? "Low" : 
                           customer.churnRisk <= 4 ? "Medium" : "High"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{customer.churnRisk}/5</p>
                      </div>
                      <Progress 
                        value={customer.churnRisk ? (customer.churnRisk / 5) * 100 : 0} 
                        className="h-2"
                        // Conditional classes based on risk level
                        color={customer.churnRisk <= 2 ? "bg-green-500" : 
                              customer.churnRisk <= 4 ? "bg-amber-500" : "bg-red-500"}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Open Deals</p>
                    <p className="text-2xl font-semibold">{deals?.filter(d => d.status === 'open').length || 0}</p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Won Deals</p>
                    <p className="text-2xl font-semibold">{deals?.filter(d => d.status === 'won').length || 0}</p>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Support Tickets</p>
                    <p className="text-2xl font-semibold">0</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-base font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    {isActivitiesLoading ? (
                      <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : activities && activities.length > 0 ? (
                      activities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-start">
                          <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-2"></div>
                          <div>
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">No recent activity</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deals" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Customer Deals</CardTitle>
              <Button size="sm">
                <DollarSign className="h-4 w-4 mr-2" />
                Add Deal
              </Button>
            </CardHeader>
            <CardContent>
              {isDealsLoading ? (
                <>
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : deals && deals.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                    <div className="col-span-2">Deal</div>
                    <div>Value</div>
                    <div>Stage</div>
                    <div>Expected Close</div>
                    <div className="text-right">Status</div>
                  </div>
                  {deals.map((deal) => (
                    <div key={deal.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center">
                      <div className="col-span-2 font-medium">{deal.title}</div>
                      <div>{formatCurrency(deal.value)}</div>
                      <div>
                        <Badge variant="outline" className="font-normal">
                          {deal.stageId === 5 ? "Closed Won" :
                           deal.stageId === 4 ? "Negotiation" :
                           deal.stageId === 3 ? "Proposal" :
                           deal.stageId === 2 ? "Contact" : "Lead"}
                        </Badge>
                      </div>
                      <div>{formatDate(deal.expectedCloseDate)}</div>
                      <div className="text-right">
                        {deal.status === "won" ? (
                          <Badge className="bg-green-500">Won</Badge>
                        ) : deal.status === "lost" ? (
                          <Badge variant="destructive">Lost</Badge>
                        ) : (
                          <Badge variant="outline" className="text-blue-500 border-blue-500">Open</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Deals Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    This customer doesn't have any deals yet.
                  </p>
                  <Button>Add Deal</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Customer Activities</CardTitle>
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
                    There are no logged activities for this customer yet.
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
              <CardTitle className="text-lg font-medium">Customer Tasks</CardTitle>
              <Button size="sm">
                <ClipboardList className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Tasks</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  There are no tasks associated with this customer.
                </p>
                <Button>Create Task</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Support Tickets</CardTitle>
              <Button size="sm">
                <LifeBuoy className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <LifeBuoy className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Support Tickets</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This customer doesn't have any support tickets.
                </p>
                <Button>Create Ticket</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetail;
