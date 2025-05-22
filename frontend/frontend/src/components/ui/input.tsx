// @ts-ignore
import React from 'react';
// Placeholder for Input component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
}
// @ts-ignore
export const Input = React.forwardRef<any, any>((props, ref) => <input ref={ref} {...props} />); 