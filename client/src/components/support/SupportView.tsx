import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TicketList from "./TicketList";
import TicketDetail from "./TicketDetail";
import { Ticket } from "@shared/schema";

const SupportView = () => {
  const { toast } = useToast();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch tickets
  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['/api/tickets'],
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load support tickets",
      variant: "destructive",
    });
  }

  // Filter tickets based on search query and active tab
  const filteredTickets = tickets?.filter((ticket: Ticket) => {
    // Filter by search query
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.description && ticket.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "open" && ticket.status === "open") ||
      (activeTab === "in-progress" && ticket.status === "in-progress") ||
      (activeTab === "closed" && ticket.status === "closed");
    
    return matchesSearch && matchesTab;
  });

  const handleSelectTicket = (ticketId: number) => {
    setSelectedTicketId(ticketId);
  };

  const handleCloseDetail = () => {
    setSelectedTicketId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-inter text-gray-900 dark:text-white">Support Tickets</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage customer support inquiries</p>
      </div>

      {selectedTicketId ? (
        <TicketDetail 
          ticketId={selectedTicketId} 
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
                  placeholder="Search tickets..."
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
                  New Ticket
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs and Ticket List */}
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-t-lg shadow-sm border-b border-gray-200 dark:border-gray-800">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <TicketList 
                tickets={filteredTickets} 
                isLoading={isLoading} 
                onSelectTicket={handleSelectTicket} 
              />
            </TabsContent>
            <TabsContent value="open" className="mt-0">
              <TicketList 
                tickets={filteredTickets} 
                isLoading={isLoading} 
                onSelectTicket={handleSelectTicket} 
              />
            </TabsContent>
            <TabsContent value="in-progress" className="mt-0">
              <TicketList 
                tickets={filteredTickets} 
                isLoading={isLoading} 
                onSelectTicket={handleSelectTicket} 
              />
            </TabsContent>
            <TabsContent value="closed" className="mt-0">
              <TicketList 
                tickets={filteredTickets} 
                isLoading={isLoading} 
                onSelectTicket={handleSelectTicket} 
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SupportView;
