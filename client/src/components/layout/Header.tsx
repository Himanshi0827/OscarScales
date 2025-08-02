import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Phone, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category, Product } from "@shared/schema";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
  isActive: boolean;
};

type CategoryItem = {
  name: string;
  href: string;
  description?: string;
};

type CategoryGroup = {
  title: string;
  items: CategoryItem[];
};

// Function to organize categories into groups
const organizeCategoriesByParent = (categories: Category[]): CategoryGroup[] => {
  const groups: Record<string, CategoryItem[]> = {};
  
  categories.forEach(category => {
    const parent = category.parent_category || 'root';
    if (!groups[parent]) {
      groups[parent] = [];
    }
    groups[parent].push({
      name: category.name,
      href: category.href,
      description: category.description
    });
  });

  return Object.entries(groups).map(([title, items]) => ({
    title: title === 'root' ? 'General' : title,
    items
  }));
};

const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [], isLoading, error } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categoryGroups = organizeCategoriesByParent(categories);
  
  const navItems: NavItem[] = [
    { name: "Home", href: "/", isActive: location === "/" },
    { name: "Products", href: "/products", isActive: location === "/products" },
    { name: "About Us", href: "/about", isActive: location === "/about" },
    { name: "Contact", href: "/contact", isActive: location === "/contact" },
  ];

  // Search functionality with live search
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [openGroups, setOpenGroups] = useState<boolean[]>(categories.map(() => false));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleGroup = (index: number) => {
    setOpenGroups(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold text-primary">
              <span className="text-secondary">O</span>SCAR
            </div>
            <div className="hidden md:block text-sm text-neutral-dark">Digital System</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              item.name === "Products" ? (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "font-medium transition-all flex items-center gap-1",
                        "hover:text-primary hover:scale-105",
                        item.isActive ? 'text-primary' : ''
                      )}
                    >
                      Products
                      <span className="ml-1 text-xs transition-transform group-hover:rotate-180">▼</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[700px] p-6 grid grid-cols-3 gap-6 bg-white/95 backdrop-blur-sm shadow-lg animate-fadeIn"
                  >
                    {isLoading ? (
                      <div className="col-span-3 flex justify-center items-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : error ? (
                      <div className="col-span-3 text-center text-destructive py-8">
                        Failed to load categories
                      </div>
                    ) : (
                      categoryGroups.map((group, idx) => (
                        <div key={idx} className="space-y-3">
                          <h4 className="text-sm font-semibold text-neutral-700 border-b pb-2">
                            {group.title}
                          </h4>
                          <div className="space-y-1">
                            {group.items.map((cat, catIdx) => (
                              <DropdownMenuItem key={catIdx} asChild>
                                <Link
                                  href={cat.href}
                                  className={cn(
                                    "flex items-center space-x-2 text-sm rounded-md p-2",
                                    "hover:bg-primary/5 hover:text-primary transition-colors",
                                    "focus:bg-primary/5 focus:text-primary"
                                  )}
                                >
                                  <span>{cat.name}</span>
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  key={index}
                  href={item.href} 
                  className={cn(
                    "font-medium transition-colors",
                    "hover:text-primary",
                    item.isActive ? 'text-primary' : ''
                  )}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Search & Contact */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 py-2 px-4 pr-10 rounded-full border border-neutral text-sm focus:outline-none focus:border-primary shadow-sm"
                  value={searchQuery}
                  onChange={handleSearch}
                  onBlur={handleSearchBlur}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-dark">
                  <Search size={18} className="text-primary" />
                </div>
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-neutral-100 max-h-96 overflow-y-auto z-50 animate-fadeIn">
                  {searchResults.map((product, idx) => (
                    <Link
                      key={idx}
                      href={`/products/${product.id}`}
                      className="block px-4 py-3 hover:bg-neutral-50 transition-colors border-b last:border-0"
                    >
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-neutral-500 truncate">{product.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link href="/contact" className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
              <Phone size={16} />
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <Link 
                  key={index}
                  href={item.href} 
                  className="px-4 py-2 hover:bg-neutral rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="px-4 py-2 space-y-2">
                <div className="font-medium mb-2 text-lg">Product Categories</div>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center text-destructive py-4">
                    Failed to load categories
                  </div>
                ) : (
                  categoryGroups.map((group, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleGroup(idx)}
                        className={cn(
                          "w-full text-left font-semibold p-3",
                          "flex justify-between items-center",
                          "hover:bg-neutral-100 transition-colors",
                          openGroups[idx] ? "text-primary" : "text-neutral-dark"
                        )}
                      >
                        {group.title}
                        <span className={cn(
                          "transform transition-transform",
                          openGroups[idx] ? "rotate-180" : ""
                        )}>▼</span>
                      </button>
                      {openGroups[idx] && (
                        <div className="bg-white p-2 space-y-1 animate-fadeIn">
                          {group.items.map((cat, catIdx) => (
                            <Link
                              key={catIdx}
                              href={cat.href}
                              className={cn(
                                "flex items-center text-sm p-2 rounded-md",
                                "hover:bg-primary/5 hover:text-primary transition-colors"
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span>{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              <div className="relative pt-2 px-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="w-full py-2 px-4 pr-10 rounded-md border border-neutral text-sm focus:outline-none focus:border-primary"
                    value={searchQuery}
                    onChange={handleSearch}
                    onBlur={handleSearchBlur}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
                    <Search size={18} />
                  </div>
                </div>
                {/* Mobile Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-neutral-100 max-h-96 overflow-y-auto z-50 animate-fadeIn">
                    {searchResults.map((product, idx) => (
                      <Link
                        key={idx}
                        href={`/products/${product.id}`}
                        className="block px-4 py-3 hover:bg-neutral-50 transition-colors border-b last:border-0"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-neutral-500 truncate">{product.description}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
