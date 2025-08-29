import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// This hook handles the deletion of a location by its ID.
export default function useDeleteLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            // Use the delete() method and filter by the provided ID.
            const { error } = await supabase.from('locations').delete().eq('id', id);

            if (error) {
                throw new Error(`Failed to delete location: ${error.message}`);
            }

            return true; // Return a success indicator
        },

        // Invalidate the 'locations' query to trigger an automatic refetch
        // and update the UI after a successful deletion.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}