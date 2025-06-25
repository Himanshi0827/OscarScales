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

type CategoryGroup = {
  title: string;
  items: {
    name: string;
    href: string;
    // icon: JSX.Element;
  }[];
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
    { name: "Admin", href: "/admin", isActive: location === "/admin" },
  ];

const categories: CategoryGroup[] = [
  {
    title: "Personal & Home",
    items: [
      { name: "Personal Scales", href: "/category/personal-scale"},
      { name: "Baby Scales", href: "/category/baby-scale"},
      { name: "Kitchen Scales", href: "/category/kitchen-scale"},
      { name: "Bowl Scales", href: "/category/bowl-scale"}
    ],
  },
  {
    title: "Industrial & Commercial",
    items: [
      { name: "Platform Scales", href: "/category/platform-scale"},
      { name: "Table Top Scales", href: "/category/table-top-scale"},
      { name: "Bench Scales", href: "/category/bench-scale"},
      { name: "Industrial Weight Scales", href: "/category/industrial-weight-scale"},
      { name: "Weighbridges", href: "/category/weighbridge"},
      { name: "Pallet Weight Scales", href: "/category/pallet-weight-scale"},
      { name: "Drum Scales", href: "/category/drum-scale"},
      { name: "Roller Scales", href: "/category/roller-scale"},
      { name: "Mobile Scales", href: "/category/mobile-scale"}
    ]
  },
  {
    title: "Specialized & Precision",
    items: [
      { name: "Jewellery Scales", href: "/category/jewellery-scale"},
      { name: "Counting Scales", href: "/category/counting-scale"},
      { name: "Digital Crane Scales", href: "/category/digital-crane-scale"},
      { name: "Hanging Scales", href: "/category/hanging-scale"},
      { name: "Laboratory Scales", href: "/category/laboratory-scale"},
      { name: "Analytical Balances", href: "/category/analytical-balance"},
      { name: "RRK Scales", href: "/category/rrk-scale"},
      { name: "Coin Operated Scales", href: "/category/coin-operated-scale"},
      { name: "Printer Scales", href: "/category/printer-scale"}
    ]
  }
];

  const [openGroups, setOpenGroups] = useState<boolean[]>(categories.map(() => false));

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
                    <button className={`font-medium hover:text-primary transition-colors flex items-center ${item.isActive ? 'text-primary' : ''}`}>
                      Products <span className="ml-1 text-xs">▼</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[700px] p-4 grid grid-cols-3 gap-4">
                    {categories.map((group, idx) => (
                      <div key={idx}>
                        <h4 className="text-sm font-semibold mb-2 text-neutral-700">{group.title}</h4>
                        {group.items.map((cat, catIdx) => (
                          <DropdownMenuItem key={catIdx} asChild>
                            <Link href={cat.href} className="flex items-center space-x-2 text-sm hover:text-primary transition-colors">
                              {/* {cat.icon} */}
                              <span>{cat.name}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
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
                {categories.map((group, idx) => (
                  <div key={idx} className="px-4">
                    <button
                      onClick={() => toggleGroup(idx)}
                      className="w-full text-left font-semibold py-2 text-neutral-dark"
                    >
                      {group.title}
                    </button>
                    {openGroups[idx] && (
                      <div className="pl-4 space-y-1">
                        {group.items.map((cat, catIdx) => (
                          <Link
                            key={catIdx}
                            href={cat.href}
                            className="flex items-center text-sm space-x-2 py-1 hover:text-primary"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {/* {cat.icon} */}
                            <span>{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
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
