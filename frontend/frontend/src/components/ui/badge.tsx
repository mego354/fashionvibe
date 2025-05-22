// @ts-ignore
import React from 'react';
// Placeholder for Badge component
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: string;
}
// @ts-ignore
export const Badge = React.forwardRef<any, any>(({ children, variant, ...props }, ref) => <span ref={ref} {...props}>{children}</span>); 