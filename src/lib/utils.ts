import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Robustly formats image URLs for quality and performance.
 * Appends optimization parameters for Unsplash URLs and returns original for others.
 */
export function getImageUrl(url: string, width: number = 800, quality: number = 80) {
  if (!url) return '';
  
  try {
    const isUnsplash = url.includes('unsplash.com');
    
    if (isUnsplash) {
      const baseUrl = url.split('?')[0];
      // Force quality and width for Unsplash to ensure premium look
      return `${baseUrl}?q=${quality}&w=${width}&auto=format&fit=crop`;
    }
    
    // For Supabase Storage or other direct URLs, just return the URL
    // (Could add Supabase-specific transformation logic here if needed)
    return url;
  } catch (e) {
    console.error('Error formatting image URL:', e);
    return url;
  }
}

