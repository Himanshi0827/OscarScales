import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";



// Constants
const ITEMS_PER_LOAD = 4;

const CategoriesSection = () => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const visibleCategories = categories.slice(0, visibleCount);
  const hasMore = visibleCount < categories.length;

  const handleLoadMore = () => setVisibleCount((prev) => prev + ITEMS_PER_LOAD);

  return (
    <section id="categories" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Scale Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our extensive range of weighing solutions designed for various industries and applications.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {visibleCategories.map((category, index) => (
            <Link key={index} href={category.href}>
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer">
                <img
                  src={
                    category.image ||
                    `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(category.name)}`
                  }
                  alt={category.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
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

        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
