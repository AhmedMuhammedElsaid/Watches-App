export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  price_cents: number;
  currency: string;
  image_url: string;
  stock: number;
  specs: Record<string, string>;
  created_at: string;
};

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  user_id: string;
  total_cents: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
};

export type OrderWithItems = Order & {
  order_items: (OrderItem & { products: Pick<Product, 'name' | 'brand' | 'image_url'> })[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export function formatPrice(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('en-NL', { style: 'currency', currency }).format(cents / 100);
}
