import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';

interface SelectOption {
  inputDisplay: string;
  value: string | boolean;
}

interface SelectInputProps {
  label: string;
  value: string | boolean;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: FieldError;
  isRequired?: boolean;
}

const SelectInput: FC<SelectInputProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  error,
  isRequired,
}) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <Select onValueChange={onValueChange} value={value ? String(value) : undefined}>
        <SelectTrigger
          className={cn(
            'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
            error ? 'border-red-500' : ''
          )}
        >
          <SelectValue placeholder={placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {option.inputDisplay}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default SelectInput;