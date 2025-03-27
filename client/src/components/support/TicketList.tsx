import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, User, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ticket } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface TicketListProps {
  tickets: Ticket[] | undefined;
  isLoading: boolean;
  onSelectTicket: (ticketId: number) => void;
}

const TicketList = ({ tickets, isLoading, onSelectTicket }: TicketListProps) => {
  // Fetch users data to show assignees
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
  });

  // Fetch customers data to show customer names
  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
  });

  // Format date to readable string
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get time elapsed since creation
  const getTimeElapsed = (dateString?: string | Date) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
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

  // Get customer name by ID
  const getCustomerName = (customerId?: number) => {
    if (!customerId || !customers) return "No Customer";
    const customer = customers.find((c: any) => c.id === customerId);
    return customer ? customer.name : `Customer #${customerId}`;
  };

  // Get assignee name by ID
  const getAssigneeName = (assignedTo?: number) => {
    if (!assignedTo || !users) return "Unassigned";
    const user = users.find((u: any) => u.id === assignedTo);
    return user ? (user.fullName || user.username) : `User #${assignedTo}`;
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

  if (!tickets || tickets.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tickets found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            There are no support tickets matching your criteria.
          </p>
          <Button>Create New Ticket</Button>
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
              <TableHead>Ticket</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">
                  <div className="max-w-xs truncate">
                    {ticket.title}
                  </div>
                </TableCell>
                <TableCell>{getCustomerName(ticket.customerId)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {ticket.category || "General"}
                  </Badge>
                </TableCell>
                <TableCell>{getPriorityBadge(ticket.priority || "medium")}</TableCell>
                <TableCell>{getStatusBadge(ticket.status || "open")}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="bg-gray-200 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span>{getAssigneeName(ticket.assignedTo)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(ticket.createdAt)}</span>
                    <span className="text-xs">{getTimeElapsed(ticket.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectTicket(ticket.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-500"
                      title="Assign to me"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectTicket(ticket.id)}>
                          View Ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem>Change Priority</DropdownMenuItem>
                        <DropdownMenuItem>Reassign</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          Close Ticket
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

export default TicketList;
