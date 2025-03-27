import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CustomerList from "./CustomerList";
import CustomerDetail from "./CustomerDetail";
import { Customer } from "@shared/schema";

const CustomersView = () => {
  const { toast } = useToast();
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch customers
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['/api/customers'],
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load customers data",
      variant: "destructive",
    });
  }

  // Filter customers based on search query and active tab
  const filteredCustomers = customers?.filter((customer: Customer) => {
    // Filter by search query
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "active" && customer.status === "active") ||
      (activeTab === "leads" && customer.status === "lead") ||
      (activeTab === "churned" && customer.status === "churned");
    
    return matchesSearch && matchesTab;
  });

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomerId(customerId);
  };

  const handleCloseDetail = () => {
    setSelectedCustomerId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-inter text-gray-900 dark:text-white">Customers</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your customers and leads</p>
      </div>

      {selectedCustomerId ? (
        <CustomerDetail 
          customerId={selectedCustomerId} 
          onClose={handleCloseDetail} 
        />
      ) : (
        <>
          {/* Filters and Actions */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Sort
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Customer
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs and Customer List */}
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-t-lg shadow-sm border-b border-gray-200 dark:border-gray-800">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="churned">Churned</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <CustomerList 
                customers={filteredCustomers} 
                isLoading={isLoading} 
                onSelectCustomer={handleSelectCustomer} 
              />
            </TabsContent>
            <TabsContent value="active" className="mt-0">
              <CustomerList 
                customers={filteredCustomers} 
                isLoading={isLoading} 
                onSelectCustomer={handleSelectCustomer} 
              />
            </TabsContent>
            <TabsContent value="leads" className="mt-0">
              <CustomerList 
                customers={filteredCustomers} 
                isLoading={isLoading} 
                onSelectCustomer={handleSelectCustomer} 
              />
            </TabsContent>
            <TabsContent value="churned" className="mt-0">
              <CustomerList 
                customers={filteredCustomers} 
                isLoading={isLoading} 
                onSelectCustomer={handleSelectCustomer} 
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default CustomersView;
