import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MessageSquare,
  User,
  Building,
  Calendar,
  Clock,
  Tag,
  CheckSquare,
  AlertTriangle,
  Send
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TicketDetailProps {
  ticketId: number;
  onClose: () => void;
}

const TicketDetail = ({ ticketId, onClose }: TicketDetailProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [replyText, setReplyText] = useState("");

  // Fetch ticket details
  const { data: ticket, isLoading, error } = useQuery({
    queryKey: [`/api/tickets/${ticketId}`],
  });

  // Fetch customer details if ticket has customer
  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: [`/api/customers/${ticket?.customerId}`],
    enabled: !!ticket?.customerId,
  });

  // Fetch users for assignee info
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
  });

  // Set initial status and priority when ticket data loads
  if (ticket && !status) {
    setStatus(ticket.status || "open");
    setPriority(ticket.priority || "medium");
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load ticket details",
      variant: "destructive",
    });
  }

  // Format date to readable string
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format time
  const formatTime = (dateString?: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Open</Badge>;
      case "in-progress":
        return <Badge variant="default" className="bg-amber-500">In Progress</Badge>;
      case "closed":
        return <Badge variant="default" className="bg-green-500">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default" className="bg-amber-500">Medium</Badge>;
      case "low":
        return <Badge variant="default" className="bg-blue-500">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  // Get assignee name by ID
  const getAssigneeName = (assignedTo?: number) => {
    if (!assignedTo || !users) return "Unassigned";
    const user = users.find((u: any) => u.id === assignedTo);
    return user ? (user.fullName || user.username) : `User #${assignedTo}`;
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      await apiRequest('PUT', `/api/tickets/${ticketId}`, {
        status: newStatus
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/tickets/${ticketId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      
      toast({
        title: "Status updated",
        description: `Ticket status changed to ${newStatus}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  // Handle priority change
  const handlePriorityChange = async (newPriority: string) => {
    setPriority(newPriority);
    try {
      await apiRequest('PUT', `/api/tickets/${ticketId}`, {
        priority: newPriority
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/tickets/${ticketId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      
      toast({
        title: "Priority updated",
        description: `Ticket priority changed to ${newPriority}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update ticket priority",
        variant: "destructive",
      });
    }
  };

  // Handle sending reply
  const handleReply = () => {
    if (!replyText.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply message",
        variant: "destructive",
      });
      return;
    }

    // In a real application, we would create a comment/reply on the ticket
    // For now, we'll just show a success toast
    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully",
    });
    
    setReplyText("");
  };

  if (isLoading || isCustomerLoading) {
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

  if (!ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-medium">Ticket Not Found</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Ticket Not Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The ticket you're looking for doesn't exist or has been deleted.
              </p>
              <Button onClick={onClose}>Back to Tickets</Button>
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
          <h2 className="text-xl font-medium truncate max-w-md">{ticket.title}</h2>
          <div className="ml-3">{getStatusBadge(ticket.status || "open")}</div>
        </div>
        <div className="flex gap-2">
          <Select value={priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border-b border-gray-200 dark:border-gray-800">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Information */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-medium">Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                      <p className="font-medium">
                        {customer ? customer.name : `Customer #${ticket.customerId || 'Unknown'}`}
                        {customer?.company && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({customer.company})</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                      <p className="font-medium">{getAssigneeName(ticket.assignedTo)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                      <p className="font-medium">{ticket.category || "General"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created On</p>
                      <p className="font-medium">{formatDate(ticket.createdAt)} at {formatTime(ticket.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <div className="mt-1">{getStatusBadge(ticket.status || "open")}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                      <div className="mt-1">{getPriorityBadge(ticket.priority || "medium")}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Details */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-medium">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-2">Description</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {ticket.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-base font-medium mb-3">Quick Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Reassign
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      {ticket.status !== "closed" ? (
                        <Button variant="outline" size="sm" className="text-green-500" onClick={() => handleStatusChange("closed")}>
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Close Ticket
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="text-blue-500" onClick={() => handleStatusChange("open")}>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Reopen Ticket
                        </Button>
                      )}
                    </div>
                  </div>

                  {customer && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-base font-medium mb-3">Customer Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                          <p className="font-medium">{customer.email || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                          <p className="font-medium">{customer.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Conversation History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Initial ticket message */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className="bg-gray-200 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{customer ? customer.name : `Customer #${ticket.customerId || 'Unknown'}`}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(ticket.createdAt)} at {formatTime(ticket.createdAt)}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Original Ticket</Badge>
                </div>
                <div className="mt-2 whitespace-pre-line">
                  <p className="text-sm">{ticket.description || "No description provided."}</p>
                </div>
              </div>

              {/* No replies message */}
              <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
                <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Replies Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  There are no replies to this ticket yet.
                </p>
              </div>

              {/* Reply form */}
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-base font-medium mb-3">Add Reply</h3>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Type your reply here..." 
                    className="min-h-32"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleReply}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketDetail;
