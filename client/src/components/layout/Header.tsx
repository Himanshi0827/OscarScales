import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  name: string;
  href: string;
  isActive: boolean;
};

type Category = {
  name: string;
  href: string;
};

const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems: NavItem[] = [
    { name: "Home", href: "/", isActive: location === "/" },
    { name: "Products", href: "/products", isActive: location === "/products" },
    { name: "About Us", href: "/about", isActive: location === "/about" },
    { name: "Contact", href: "/contact", isActive: location === "/contact" },
  ];

  const categories: Category[] = [
    { name: "Personal Scales", href: "/category/personal" },
    { name: "Jewelry Scales", href: "/category/jewelry" },
    { name: "Industrial Scales", href: "/category/industrial" },
    { name: "Dairy Scales", href: "/category/dairy" },
    { name: "Kitchen Scales", href: "/category/kitchen" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log("Searching for:", searchQuery);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
                    <button className={`font-medium hover:text-primary transition-colors flex items-center ${item.isActive ? 'text-primary' : ''}`}>
                      Products <span className="ml-1 text-xs">▼</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {categories.map((category, idx) => (
                      <DropdownMenuItem key={idx} asChild>
                        <Link href={category.href} className="w-full cursor-pointer">
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  key={index}
                  href={item.href} 
                  className={`font-medium hover:text-primary transition-colors ${item.isActive ? 'text-primary' : ''}`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Search & Contact */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <form onSubmit={handleSearchSubmit}>
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="py-1 px-3 pr-8 rounded-full border border-neutral text-sm focus:outline-none focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-dark"
                >
                  <Search size={16} />
                </button>
              </form>
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
              
              <div className="px-4 py-2 space-y-1">
                <div className="font-medium mb-1">Product Categories</div>
                {categories.map((category, idx) => (
                  <Link 
                    key={idx}
                    href={category.href} 
                    className="block pl-4 py-1 text-sm hover:bg-neutral rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              <div className="relative pt-2 px-4">
                <form onSubmit={handleSearchSubmit}>
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="w-full py-2 px-4 pr-10 rounded-md border border-neutral text-sm focus:outline-none focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute right-7 top-1/2 transform -translate-y-1/4 text-neutral-dark"
                  >
                    <Search size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
