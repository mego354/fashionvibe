// @ts-ignore
import React from 'react';
// Placeholder for Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
}
// @ts-ignore
export const Textarea = React.forwardRef<any, any>((props, ref) => <textarea ref={ref} {...props}>{props.children}</textarea>); 