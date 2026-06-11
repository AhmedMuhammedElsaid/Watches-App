import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import type { CartItem, OrderWithItems } from '@/lib/types';

export function useOrders() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['orders', session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, brand, image_url))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as OrderWithItems[];
    },
  });
}

export function useCreateOrder() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: CartItem[]) => {
      if (!session) throw new Error('You must be signed in to place an order.');
      if (items.length === 0) throw new Error('Your cart is empty.');

      const totalCents = items.reduce(
        (sum, item) => sum + item.product.price_cents * item.quantity,
        0
      );

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ user_id: session.user.id, total_cents: totalCents })
        .select()
        .single();
      if (orderError) throw orderError;

      const { error: itemsError } = await supabase.from('order_items').insert(
        items.map((item) => ({
          order_id: order.id as string,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price_cents: item.product.price_cents,
        }))
      );
      if (itemsError) throw itemsError;

      return order.id as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
