import { FC, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isRequired?: boolean;
  error?: FieldError;
}

const TextInput: FC<TextInputProps> = ({ label, isRequired, error, className, ...props }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        className={cn(
          'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
          error ? 'border-red-500' : '',
          props.disabled ? 'bg-gray-50 cursor-not-allowed' : '',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default TextInput;