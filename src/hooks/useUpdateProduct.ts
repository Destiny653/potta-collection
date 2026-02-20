import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { IProductPayload, IProduct } from '@/types';
import { nanoid } from 'nanoid';

export default function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload, existingImageUrl }: { id: string; payload: IProductPayload; existingImageUrl?: string }) => {
            let image_url = existingImageUrl || '';

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
                .update({
                    name: payload.name,
                    barcode: payload.barcode,
                    size: payload.size,
                    image_url: image_url,
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to update product: ${error.message}`);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}
