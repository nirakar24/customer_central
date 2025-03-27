import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";

const ProductsView = () => {
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch products
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products'],
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load products data",
      variant: "destructive",
    });
  }

  // Filter products based on search query and active category
  const filteredProducts = products?.filter((product) => {
    // Filter by search query
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = 
      !activeCategory || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = products 
    ? Array.from(new Set(products.map(product => product.category)))
    : [];

  const handleSelectProduct = (productId: number) => {
    setSelectedProductId(productId);
  };

  const handleCloseDetail = () => {
    setSelectedProductId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-inter text-gray-900 dark:text-white">Products</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your product catalog</p>
      </div>

      {selectedProductId ? (
        <ProductDetail 
          productId={selectedProductId} 
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
                  placeholder="Search products..."
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
                  Add Product
                </Button>
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-t-lg shadow-sm border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={!activeCategory ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button 
                  key={category}
                  variant={activeCategory === category ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Product List */}
          <ProductList 
            products={filteredProducts} 
            isLoading={isLoading} 
            onSelectProduct={handleSelectProduct} 
          />
        </>
      )}
    </div>
  );
};

export default ProductsView;
