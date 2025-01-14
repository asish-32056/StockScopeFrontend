import React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'fixed flex items-center w-full max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-gray-800 text-white',
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-600 text-white',
      },
      position: {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'top-right',
    },
  }
);

interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  variant, 
  position, 
  onClose 
}) => {
  return (
    <div className={cn(toastVariants({ variant, position }))}>
      <div className="flex-1">{message}</div>
      <button
        onClick={onClose}
        className="ml-4 inline-flex items-center justify-center rounded-md p-1 hover:bg-black/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};