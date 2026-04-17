export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'women' | 'men' | 'kids';
  subCategory: string;
  images: string[];
  description: string;
  sizes: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
  trending?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}
