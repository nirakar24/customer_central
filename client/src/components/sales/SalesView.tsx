import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SalesList from "./SalesList";
import SalesDetail from "./SalesDetail";
import { Deal } from "@shared/schema";

const SalesView = () => {
  const { toast } = useToast();
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch pipeline stages
  const { data: stages, isLoading: isStagesLoading } = useQuery({
    queryKey: ['/api/pipeline-stages'],
  });

  // Fetch deals
  const { data: deals, isLoading: isDealsLoading, error } = useQuery({
    queryKey: ['/api/deals'],
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load sales pipeline data",
      variant: "destructive",
    });
  }

  // Filter deals based on search query and active tab
  const filteredDeals = deals?.filter((deal: Deal) => {
    // Filter by search query
    const matchesSearch = 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab (stage)
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "won" && deal.status === "won") ||
      (activeTab === "lost" && deal.status === "lost") ||
      deal.stageId.toString() === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleSelectDeal = (dealId: number) => {
    setSelectedDealId(dealId);
  };

  const handleCloseDeal = () => {
    setSelectedDealId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-inter text-gray-900 dark:text-white">Sales Pipeline</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your deals and sales pipeline</p>
      </div>

      {selectedDealId ? (
        <SalesDetail 
          dealId={selectedDealId} 
          onClose={handleCloseDeal} 
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
                  placeholder="Search deals..."
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
                  Add Deal
                </Button>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Tabs */}
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-t-lg shadow-sm border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
              <TabsList className="inline-flex w-auto">
                <TabsTrigger value="all">All Deals</TabsTrigger>
                {stages?.map((stage) => (
                  <TabsTrigger key={stage.id} value={stage.id.toString()}>
                    {stage.name}
                  </TabsTrigger>
                ))}
                <TabsTrigger value="won">Won</TabsTrigger>
                <TabsTrigger value="lost">Lost</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <SalesList 
                deals={filteredDeals} 
                stages={stages}
                isLoading={isDealsLoading || isStagesLoading} 
                onSelectDeal={handleSelectDeal} 
              />
            </TabsContent>

            {stages?.map((stage) => (
              <TabsContent key={stage.id} value={stage.id.toString()} className="mt-0">
                <SalesList 
                  deals={filteredDeals} 
                  stages={stages}
                  isLoading={isDealsLoading || isStagesLoading} 
                  onSelectDeal={handleSelectDeal} 
                />
              </TabsContent>
            ))}

            <TabsContent value="won" className="mt-0">
              <SalesList 
                deals={filteredDeals} 
                stages={stages}
                isLoading={isDealsLoading || isStagesLoading} 
                onSelectDeal={handleSelectDeal} 
              />
            </TabsContent>

            <TabsContent value="lost" className="mt-0">
              <SalesList 
                deals={filteredDeals} 
                stages={stages}
                isLoading={isDealsLoading || isStagesLoading} 
                onSelectDeal={handleSelectDeal} 
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SalesView;
