import React from 'react';
// Placeholder for Checkbox component
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}
export const Checkbox = ({ onCheckedChange, ...props }: CheckboxProps) => <input type="checkbox" {...props} />; 