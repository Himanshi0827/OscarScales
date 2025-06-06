import { Product } from "@shared/schema";

export const getCategoryName = (slug: string): string => {
  const categories: Record<string, string> = {
    personal: "Personal Scales",
    jewelry: "Jewelry Scales",
    industrial: "Industrial Scales",
    dairy: "Dairy Scales",
    kitchen: "Kitchen Scales",
  };
  
  return categories[slug] || slug;
};

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString()}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const getProductImage = (product: Product): string => {
  // In a real app, this might include fallback logic or image processing
  return product.image;
};

export const getRandomRating = (): number => {
  const ratings = [4, 4.5, 5];
  return ratings[Math.floor(Math.random() * ratings.length)];
};

export const getRandomReviewCount = (): number => {
  return Math.floor(Math.random() * 150) + 20;
};

export const categoryDescriptions: Record<string, string> = {
  personal: "Accurate and stylish scales for monitoring body weight and composition.",
  jewelry: "High-precision scales for measuring precious metals and gemstones.",
  industrial: "Heavy-duty weighing solutions for warehouses, factories, and logistics operations.",
  dairy: "Specialized scales for milk collection and dairy product measurement.",
  kitchen: "Compact and precise scales for cooking, baking, and food preparation.",
};
