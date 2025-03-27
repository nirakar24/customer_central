import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, PhoneCall, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "@shared/schema";

interface CustomerListProps {
  customers: Customer[] | undefined;
  isLoading: boolean;
  onSelectCustomer: (customerId: number) => void;
}

const CustomerList = ({ customers, isLoading, onSelectCustomer }: CustomerListProps) => {
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

  // Get churn risk level
  const getChurnRiskLevel = (risk: number) => {
    if (risk === 0) return <span className="text-gray-400">N/A</span>;
    if (risk <= 2) return <Badge className="bg-green-500">Low</Badge>;
    if (risk <= 4) return <Badge className="bg-amber-500">Medium</Badge>;
    return <Badge className="bg-red-500">High</Badge>;
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

  if (!customers || customers.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No customers found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try changing your search criteria or add a new customer.
          </p>
          <Button>Add Customer</Button>
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
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Churn Risk</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={customer.avatarUrl || ""} />
                      <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      {customer.company && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{customer.company}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    {customer.email && <span className="text-sm">{customer.email}</span>}
                    {customer.phone && <span className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</span>}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(customer.status || "active")}</TableCell>
                <TableCell>{formatDate(customer.lastContact)}</TableCell>
                <TableCell>{getChurnRiskLevel(customer.churnRisk || 0)}</TableCell>
                <TableCell>{formatCurrency(customer.totalRevenue || 0)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectCustomer(customer.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a href={`mailto:${customer.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                    {customer.phone && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a href={`tel:${customer.phone}`}>
                          <PhoneCall className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectCustomer(customer.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                        <DropdownMenuItem>Add Deal</DropdownMenuItem>
                        <DropdownMenuItem>Create Task</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          Delete Customer
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

export default CustomerList;
