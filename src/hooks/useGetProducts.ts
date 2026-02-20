import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { IProduct } from '@/types';

export default function useGetProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw new Error(`Failed to fetch products: ${error.message}`);
            }

            return data as IProduct[];
        },
    });
}
