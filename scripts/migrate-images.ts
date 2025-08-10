import { config } from "dotenv";
// Load environment variables before other imports
config();

import { initImgBBService, getImgBBService } from "../server/imgbb.js";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

// Initialize ImgBB service
initImgBBService();

interface CategoryData {
  name: string;
  slug: string;
  description: string;
  image: string;
  href: string;
  title: string;
  parent_category: string;
}

interface ProductImage {
  image_url: string;
  is_primary: boolean;
  alt_text: string;
  sort_order: number;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  category_id: number;
  featured: boolean;
  bestseller: boolean;
  new_arrival: boolean;
  accuracy: string;
  power_supply: string;
  display: string;
  material: string;
  warranty: string;
  certification: string;
  images: ProductImage[];
}

interface ImgBBImage {
  image_url: string;
  display_url: string;
  thumb_url: string;
  delete_url: string;
}

async function uploadToImgBB(imagePath: string, name: string): Promise<ImgBBImage> {
  try {
    // Read image file as base64
    const imageBuffer = await fs.readFile(path.join(projectRoot, 'public', imagePath));
    const base64Image = imageBuffer.toString('base64');

    // Upload to ImgBB
    const imgbb = getImgBBService();
    const response = await imgbb.uploadImage(base64Image, name);

    return {
      image_url: response.data.image.url,
      display_url: response.data.display_url,
      thumb_url: response.data.thumb.url,
      delete_url: response.data.delete_url,
    };
  } catch (error) {
    console.error(`Failed to upload image ${imagePath}:`, error);
    throw error;
  }
}

async function migrateCategories() {
  // Read categories.json
  const categoriesFile = await fs.readFile(path.join(projectRoot, 'data', 'categories.json'), 'utf8');
  const categoriesData = JSON.parse(categoriesFile);

  // Upload each category image and update the data
  for (const category of categoriesData.categories) {
    try {
      const imgbbData = await uploadToImgBB(
        category.image,
        `category-${category.slug}`
      );

      // Update category data
      category.image = imgbbData.image_url;
      category.display_url = imgbbData.display_url;
      category.thumb_url = imgbbData.thumb_url;
      category.delete_url = imgbbData.delete_url;

      console.log(`Successfully migrated images for category: ${category.name}`);
    } catch (error) {
      console.error(`Failed to migrate category ${category.name}:`, error);
    }
  }

  // Write updated data back to file
  await fs.writeFile(
    path.join(projectRoot, 'data', 'categories.json'),
    JSON.stringify(categoriesData, null, 2)
  );
}

async function migrateProducts() {
  // Read products.json
  const productsFile = await fs.readFile(path.join(projectRoot, 'data', 'products.json'), 'utf8');
  const productsData = JSON.parse(productsFile);

  // Upload each product image and update the data
  for (const product of productsData.products) {
    try {
      const updatedImages = await Promise.all(
        product.images.map(async (image: ProductImage, index: number) => {
          const imgbbData = await uploadToImgBB(
            image.image_url,
            `product-${product.name.toLowerCase().replace(/\s+/g, '-')}-${index}`
          );

          return {
            ...image,
            image_url: imgbbData.image_url,
            display_url: imgbbData.display_url,
            thumb_url: imgbbData.thumb_url,
            delete_url: imgbbData.delete_url,
          };
        })
      );

      product.images = updatedImages;
      console.log(`Successfully migrated images for product: ${product.name}`);
    } catch (error) {
      console.error(`Failed to migrate product ${product.name}:`, error);
    }
  }

  // Write updated data back to file
  await fs.writeFile(
    path.join(projectRoot, 'data', 'products.json'),
    JSON.stringify(productsData, null, 2)
  );
}

async function main() {
  try {
    console.log('Starting image migration...');
    
    console.log('\nMigrating category images...');
    await migrateCategories();
    
    console.log('\nMigrating product images...');
    await migrateProducts();
    
    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();