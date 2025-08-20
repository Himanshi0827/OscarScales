import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category, CategoryImage as CategoryImageType } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CategoriesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth;
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      let targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;

      // Enable looping
      if (direction === 'right' && targetScroll >= maxScroll) {
        targetScroll = 0;
      } else if (direction === 'left' && targetScroll <= 0) {
        targetScroll = maxScroll;
      }

      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Check initial scroll buttons visibility
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section id="categories" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Scale Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our extensive range of weighing solutions designed for various industries and applications.
          </p>
        </div>

        <div className="relative">
          {/* Scroll Buttons */}
          {showLeftButton && (
            <button
              onClick={() => scroll('left')}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 rounded-full bg-white shadow-lg",
                "flex items-center justify-center",
                "text-primary hover:text-primary/80 transition-colors",
                "transform hover:scale-105 active:scale-95"
              )}
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {showRightButton && (
            <button
              onClick={() => scroll('right')}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 rounded-full bg-white shadow-lg",
                "flex items-center justify-center",
                "text-primary hover:text-primary/80 transition-colors",
                "transform hover:scale-105 active:scale-95"
              )}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Categories Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto hide-scrollbar"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex gap-8 px-4 min-w-max">
                {categories.map((category, index) => (
                  <Link key={index} href={category.href}>
                    <div 
                      className={cn(
                        "group relative w-72 bg-white rounded-2xl overflow-hidden shadow-md",
                        "hover:shadow-xl transition duration-300 cursor-pointer",
                        "scroll-snap-align-start"
                      )}
                    >
                      <CategoryImage categoryId={category.id} name={category.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                      <div className="absolute bottom-0 left-0 z-20 p-4 text-white">
                        <h3 className="text-xl font-semibold">{category.name}</h3>
                        <p className="text-sm opacity-80">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Component to handle category image display
const CategoryImage = ({ categoryId, name }: { categoryId: number; name: string }) => {
  const { data: images = [] } = useQuery<CategoryImageType[]>({
    queryKey: [`/api/categories/${categoryId}/images`],
  });

  const primaryImage = images.find(img => img.is_primary) || images[0];
  
  return (
    <img
      src={primaryImage?.display_url || `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(name)}`}
      alt={name}
      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />
  );
};

export default CategoriesSection;
