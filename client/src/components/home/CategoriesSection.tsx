import { useState } from "react";
import { Link } from "wouter";

// Types
type Category = {
  name: string;
  slug: string;
  image: string;
  description: string;
};




// Dummy categories (you can move this to a separate file)
const categories: Category[] = [
  { name: "Personal Scales", slug: "personal-scale", description: "Used for personal body weight tracking", image: "https://i.ibb.co/9HgkXBKk/Personal-Scales.jpg" },
  { name: "Baby Scales", slug: "baby-scale", description: "Designed for measuring infants' weight accurately", image: "https://i.ibb.co/rG45cVtC/Baby-Scales.jpg" },
  { name: "Kitchen Scales", slug: "kitchen-scale", description: "Ideal for cooking and baking precision", image: "https://i.ibb.co/N2JY91bm/Kitchen-Scale.jpg" },
  { name: "Bowl Scales", slug: "bowl-scale", description: "Comes with a bowl for easy ingredient measurement", image: "https://i.ibb.co/JR2H62rs/Bowl-Scales.jpg" },
  { name: "Platform Scales", slug: "platform-scale", description: "Heavy-duty platforms for industrial use", image: "https://i.ibb.co/bgsMDR7Z/Platform-Scales.jpg" },
  { name: "Table Top Scales", slug: "table-top-scale", description: "Compact and convenient for retail and kitchens", image: "https://i.ibb.co/fdXGYdWr/Table-Top-Scales.jpg" },
  { name: "Bench Scales", slug: "bench-scale", description: "Sturdy and versatile for warehouses and labs", image: "https://i.ibb.co/JRbbRGt5/Bench-Scales.jpg" },
  { name: "Industrial Weight Scales", slug: "industrial-weight-scale", description: "High-capacity scales for industrial operations", image: "https://i.ibb.co/TBrbhTbD/Industrial-Weight-Scales.jpg" },
  { name: "Weighbridges", slug: "weighbridge", description: "Large scale systems for trucks and heavy loads", image: "https://i.ibb.co/RTN66X0V/Weighbridges.jpg" },
  { name: "Pallet Weight Scales", slug: "pallet-weight-scale", description: "Designed to weigh palletized goods efficiently", image: "https://i.ibb.co/N231GdbZ/Pallet-Weight-Scales.jpg" },
  { name: "Drum Scales", slug: "drum-scale", description: "Perfect for weighing drums and barrels", image: "https://i.ibb.co/67yQZqVc/Drum-Scales.jpg" },
  { name: "Roller Scales", slug: "roller-scale", description: "Allows easy movement of items for weighing", image: "https://i.ibb.co/ZpY3F0vM/Roller-Scales.jpg" },
  { name: "Mobile Scales", slug: "mobile-scale", description: "Portable and flexible weighing solutions", image: "https://i.ibb.co/Q72CZj6Y/Mobile-Scales.jpg" },
  { name: "Jewellery Scales", slug: "jewellery-scale", description: "Precision scales for gold, gems and small items", image: "https://i.ibb.co/VYs04sr7/Jewellery-Scales.jpg" },
  { name: "Counting Scales", slug: "counting-scale", description: "Used for inventory by counting small parts", image: "https://i.ibb.co/TDzsQyXT/Counting-Scales.jpg" },
  { name: "Digital Crane Scales", slug: "digital-crane-scale", description: "Hangs from cranes to measure suspended loads", image: "https://i.ibb.co/hRkX47Xw/Digital-Crane-Scales.jpg" },
  { name: "Hanging Scales", slug: "hanging-scale", description: "Portable and suspended weighing devices", image: "https://i.ibb.co/vCcvKCrj/Hanging-Scales.jpg" },
  { name: "Laboratory Scales", slug: "laboratory-scale", description: "High-precision for scientific and lab work", image: "https://i.ibb.co/W4rZ8jK6/Laboratory-Scales.jpg" },
  { name: "Analytical Balances", slug: "analytical-balance", description: "Ultrafine measurement for chemistry and analysis", image: "https://i.ibb.co/gMXMySzx/Analytical-Balances.jpg" },
  { name: "RRK Scales", slug: "rrk-scale", description: "Used for RRK-specific industrial applications", image: "" },
  { name: "Coin Operated Scales", slug: "coin-operated-scale", description: "Public scales operated with coins", image: "https://i.ibb.co/q3xKb0fJ/Coin-Operated-Scales.jpg" },
  { name: "Printer Scales", slug: "printer-scale", description: "Scales with integrated label or receipt printers", image: "https://i.ibb.co/99m4jcJF/Printer-Scales.jpg" }
];

// Constants
const ITEMS_PER_LOAD = 4;

const CategoriesSection = () => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {visibleCategories.map((category, index) => (
            <Link key={index} href={`/category/${category.slug}`}>
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
