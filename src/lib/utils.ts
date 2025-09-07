import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatImageUrl(url: string, options?: { width?: number; height?: number }) {
  if (!url) return '';
  
  // If it's already a DatoCMS URL with parameters, return as is
  if (url.includes('datocms-assets.com') && url.includes('?')) {
    return url;
  }
  
  // Add default optimization parameters for DatoCMS images
  const params = new URLSearchParams({
    'auto': 'format,compress',
    'fit': 'max',
    'h': options?.height?.toString() || '3000',
    'w': options?.width?.toString() || '2000'
  });
  
  return `${url}?${params.toString()}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
