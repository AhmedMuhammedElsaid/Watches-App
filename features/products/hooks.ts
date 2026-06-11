import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Category, Product } from '@/lib/types';

const PAGE_SIZE = 10;

export type ProductFilters = {
  search?: string;
  categoryId?: string;
};

export function useProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters.search) {
        const term = `%${filters.search}%`;
        query = query.or(`name.ilike.${term},brand.ilike.${term},model.ilike.${term}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === PAGE_SIZE ? pages.length * PAGE_SIZE : undefined,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Product;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data as Category[];
    },
  });
}
