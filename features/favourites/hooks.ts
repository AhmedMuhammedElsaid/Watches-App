import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';

type FavouriteRow = {
  product_id: string;
  created_at: string;
  products: Product | Product[] | null;
};

function favouritesKey(userId: string | undefined) {
  return ['favourites', userId];
}

/** The current user's saved products, newest first. */
export function useFavourites() {
  const { session } = useAuth();

  return useQuery({
    queryKey: favouritesKey(session?.user.id),
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favourites')
        .select('product_id, created_at, products(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;

      return ((data ?? []) as unknown as FavouriteRow[])
        .map((row) => (Array.isArray(row.products) ? row.products[0] : row.products))
        .filter((p): p is Product => !!p);
    },
  });
}

export function useIsFavourite(productId: string): boolean {
  const { data } = useFavourites();
  return !!data?.some((p) => p.id === productId);
}

/** Toggle a product in the wishlist with an optimistic cache update. */
export function useToggleFavourite() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const key = favouritesKey(session?.user.id);

  return useMutation({
    mutationFn: async ({ product, isFavourite }: { product: Product; isFavourite: boolean }) => {
      if (!session) throw new Error('You must be signed in to save items.');

      if (isFavourite) {
        const { error } = await supabase
          .from('favourites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('product_id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favourites')
          .insert({ user_id: session.user.id, product_id: product.id });
        if (error) throw error;
      }
    },
    onMutate: async ({ product, isFavourite }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Product[]>(key) ?? [];
      const next = isFavourite
        ? previous.filter((p) => p.id !== product.id)
        : [product, ...previous];
      queryClient.setQueryData<Product[]>(key, next);
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
