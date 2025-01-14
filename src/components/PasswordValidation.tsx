import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({ met, text }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    )}
    <span className={`text-sm ${met ? 'text-green-500' : 'text-red-500'}`}>
      {text}
    </span>
  </div>
);

interface PasswordValidationProps {
  password: string;
  onValidationChange: (isValid: boolean) => void;
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({
  password,
  onValidationChange
}) => {
  const criteria = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@#$%^&+=!]/.test(password)
  };

  useEffect(() => {
    const isValid = Object.values(criteria).every(Boolean);
    onValidationChange(isValid);
  }, [criteria, onValidationChange]);

  return (
    <div className="space-y-2 mt-2">
      <PasswordRequirement
        met={criteria.minLength}
        text="At least 8 characters"
      />
      <PasswordRequirement
        met={criteria.hasUpperCase}
        text="At least one uppercase letter"
      />
      <PasswordRequirement
        met={criteria.hasLowerCase}
        text="At least one lowercase letter"
      />
      <PasswordRequirement
        met={criteria.hasNumber}
        text="At least one number"
      />
      <PasswordRequirement
        met={criteria.hasSpecialChar}
        text="At least one special character (@#$%^&+=!)"
      />
    </div>
  );
};