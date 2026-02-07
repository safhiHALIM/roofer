export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  emailVerified: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  images: string[];
  price: number;
  isActive: boolean;
  category?: Category;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt?: string;
  contactName?: string;
  contactPhone?: string | null;
  contactAddress?: string | null;
  contactCity?: string | null;
  contactZip?: string | null;
  notes?: string | null;
}
