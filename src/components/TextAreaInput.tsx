import { FC, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils'; // Assume Shadcn's utility
import { FieldError } from 'react-hook-form';

interface TextAreaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  isRequired?: boolean;
  error?: FieldError;
}

const TextAreaInput: FC<TextAreaInputProps> = ({ label, isRequired, error, className, ...props }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <textarea
        className={cn(
          'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
          error ? 'border-red-500' : '',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default TextAreaInput;