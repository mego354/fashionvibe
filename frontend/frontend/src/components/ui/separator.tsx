// @ts-ignore
import React from 'react';
// Placeholder for Separator component
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: string;
}
// @ts-ignore
export const Separator = React.forwardRef<any, any>((props, ref) => <div ref={ref} {...props}>{props.children}</div>); 