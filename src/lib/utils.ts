import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Password validation with detailed criteria
export const validatePassword = (password: string) => {
  const criteria = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@#$%^&+=!]/.test(password)
  };

  return {
    isValid: Object.values(criteria).every(Boolean),
    criteria
  };
};

// Email validation
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// JWT token handling
export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const tokenData = parseJwt(token);
  if (!tokenData) return true;
  return tokenData.exp * 1000 < Date.now();
};

// Error handling
export const formatError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// String manipulation
export const truncateString = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

// Form validation helpers
export const getFieldError = (field: string, value: string): string => {
  switch (field) {
    case 'email':
      return !value ? 'Email is required' : 
             !validateEmail(value) ? 'Invalid email format' : '';
    case 'password':
      const { isValid, criteria } = validatePassword(value);
      if (!value) return 'Password is required';
      if (!isValid) {
        const missing = Object.entries(criteria)
          .filter(([_, valid]) => !valid)
          .map(([rule]) => rule)
          .join(', ');
        return `Password must include: ${missing}`;
      }
      return '';
    default:
      return !value ? `${field} is required` : '';
  }
};

// Local storage helpers
export const storage = {
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// URL query params helper
export const getQueryParams = (search: string): Record<string, string> => {
  return Object.fromEntries(new URLSearchParams(search));
};