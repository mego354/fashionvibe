import React from 'react';
// Placeholder Select components
export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
}
// @ts-ignore
export const Select = React.forwardRef<any, any>((props, ref) => <div ref={ref} {...props}>{props.children}</div>);
// @ts-ignore
export const SelectContent = React.forwardRef<any, any>((props, ref) => <div ref={ref} {...props}>{props.children}</div>);
// @ts-ignore
export const SelectItem = React.forwardRef<any, any>((props, ref) => <div ref={ref} {...props}>{props.children}</div>);
// @ts-ignore
export const SelectTrigger = React.forwardRef<any, any>((props, ref) => <div ref={ref} {...props}>{props.children}</div>);
// @ts-ignore
export const SelectValue = React.forwardRef<any, any>((props, ref) => <div ref={ref} {...props}>{props.children}</div>); 