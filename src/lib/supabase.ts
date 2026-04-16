import { createClient } from '@supabase/supabase-js';
import { Product, Testimonial, BlogPost } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Maps snake_case Supabase rows to camelCase Product type
function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    price: row.price as number,
    category: row.category as 'women' | 'men' | 'kids',
    subCategory: (row.sub_category ?? row.subCategory) as string,
    images: row.images as string[],
    description: row.description as string,
    sizes: row.sizes as string[],
    inStock: (row.in_stock ?? row.inStock ?? true) as boolean,
    isNew: (row.is_new ?? row.isNew ?? false) as boolean,
    isSale: (row.is_sale ?? row.isSale ?? false) as boolean,
    salePrice: (row.sale_price ?? row.salePrice) as number | undefined,
    trending: (row.trending ?? false) as boolean,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return (data as Record<string, unknown>[]).map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return mapProduct(data as Record<string, unknown>);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data as Testimonial[];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  return data as BlogPost[];
}

// ==========================================
// Admin CRUD Operations
// ==========================================

export async function createProduct(productData: Omit<Product, 'id'>) {
  // Convert camelCase to snake_case for DB
  const dbData = {
    name: productData.name,
    price: productData.price,
    category: productData.category,
    sub_category: productData.subCategory,
    images: productData.images,
    description: productData.description,
    sizes: productData.sizes,
    in_stock: productData.inStock,
    is_new: productData.isNew,
    is_sale: productData.isSale,
    sale_price: productData.salePrice,
    trending: productData.trending,
  };
  return supabase.from('products').insert([dbData]);
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  const dbData: any = {};
  if (productData.name !== undefined) dbData.name = productData.name;
  if (productData.price !== undefined) dbData.price = productData.price;
  if (productData.category !== undefined) dbData.category = productData.category;
  if (productData.subCategory !== undefined) dbData.sub_category = productData.subCategory;
  if (productData.images !== undefined) dbData.images = productData.images;
  if (productData.description !== undefined) dbData.description = productData.description;
  if (productData.sizes !== undefined) dbData.sizes = productData.sizes;
  if (productData.inStock !== undefined) dbData.in_stock = productData.inStock;
  if (productData.isNew !== undefined) dbData.is_new = productData.isNew;
  if (productData.isSale !== undefined) dbData.is_sale = productData.isSale;
  if (productData.salePrice !== undefined) dbData.sale_price = productData.salePrice;
  if (productData.trending !== undefined) dbData.trending = productData.trending;

  return supabase.from('products').update(dbData).eq('id', id);
}

export async function deleteProduct(id: string) {
  return supabase.from('products').delete().eq('id', id);
}

export async function createBlogPost(postData: Omit<BlogPost, 'id'>) {
  return supabase.from('blog_posts').insert([postData]);
}

export async function updateBlogPost(id: string, postData: Partial<BlogPost>) {
  return supabase.from('blog_posts').update(postData).eq('id', id);
}

export async function deleteBlogPost(id: string) {
  return supabase.from('blog_posts').delete().eq('id', id);
}

export async function getContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function updateContactStatus(id: string, read: boolean) {
  return supabase.from('contacts').update({ read }).eq('id', id);
}

export async function deleteContact(id: string) {
  return supabase.from('contacts').delete().eq('id', id);
}

export async function submitContact(contactData: { name: string; contact_info: string; subject: string; message: string; }) {
  return supabase.from('contacts').insert([contactData]);
}

export async function getUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function updateUserRole(id: string, role: 'admin' | 'pending' | 'user') {
  return supabase.from('profiles').update({ role }).eq('id', id);
}

export async function deleteUser(id: string) {
  return supabase.from('profiles').delete().eq('id', id);
}
