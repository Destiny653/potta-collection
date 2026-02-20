import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { IProductPayload } from '@/types';
import { nanoid } from 'nanoid';

export default function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: IProductPayload) => {
            let image_url = '';

            if (payload.image instanceof File) {
                const fileExt = payload.image.name.split('.').pop();
                const fileName = `${nanoid()}.${fileExt}`;
                const filePath = `product-images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, payload.image);

                if (uploadError) {
                    throw new Error(`Failed to upload image: ${uploadError.message}`);
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                image_url = publicUrl;
            }

            const { data, error } = await supabase
                .from('products')
                .insert([
                    {
                        name: payload.name,
                        barcode: payload.barcode,
                        size: payload.size,
                        image_url: image_url,
                    },
                ])
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to create product: ${error.message}`);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}
