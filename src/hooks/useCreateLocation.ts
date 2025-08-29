import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ILocationPayload } from '@/utils/validation';

export default function useCreateLocation() {
  return useMutation({
    mutationFn: async (data: ILocationPayload) => {
      const insertData = { ...data };
      const { data: res, error } = await supabase.from('locations').insert(insertData).select();
      if (error) throw error;
      return res[0];
    },
  });
}