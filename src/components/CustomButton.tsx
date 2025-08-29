import { Button } from '@/components/ui/button';
import { FC, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  className?: string;
}

const CustomButton: FC<CustomButtonProps> = ({ isLoading, className, children, ...props }) => {
  return (
    <Button
      className={cn('bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors', className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;