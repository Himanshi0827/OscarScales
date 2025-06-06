import { Link } from "wouter";

type Category = {
  name: string;
  slug: string;
  image: string;
  description: string;
};

const categories: Category[] = [
  {
    name: "Personal",
    slug: "personal",
    image: "https://images.unsplash.com/photo-1560233829-5660466b3277",
    description: "Body weight monitoring"
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab0",
    description: "Precision measurement"
  },
  {
    name: "Industrial",
    slug: "industrial",
    image: "https://images.unsplash.com/photo-1586528116375-742a6d172c4e",
    description: "Heavy-duty solutions"
  },
  {
    name: "Dairy",
    slug: "dairy",
    image: "https://images.unsplash.com/photo-1563735704860-fe6924a46db1",
    description: "Milk measurement"
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    image: "https://images.unsplash.com/photo-1570151443798-40a0fb296dfb",
    description: "Food preparation"
  }
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Scale Categories</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Explore our extensive range of weighing solutions designed for various 
            industries and applications.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={`/category/${category.slug}`}>
              <div className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer h-48">
                <img 
                  src={category.image} 
                  alt={`${category.name} Scales`} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white font-bold">{category.name}</h3>
                  <p className="text-neutral/80 text-sm">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
