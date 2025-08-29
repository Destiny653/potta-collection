import { useCallback } from 'react';
import toast from 'react-hot-toast';

interface MessageOptions {
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const useMessage = () => {
  return useCallback(({ status, message }: MessageOptions) => {
    switch (status) {
      case 'success':
        toast.success(message, { duration: 4000 });
        break;
      case 'error':
        toast.error(message, { duration: 4000 });
        break;
      case 'warning':
        toast(message, { style: { background: '#fefcbf', color: '#744210' }, duration: 4000 });
        break;
      case 'info':
        toast(message, { style: { background: '#e0f2fe', color: '#075985' }, duration: 4000 });
        break;
    }
  }, []);
};

export default useMessage;