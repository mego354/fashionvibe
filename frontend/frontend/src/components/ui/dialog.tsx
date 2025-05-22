import React from 'react';
// Placeholder Dialog components
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
}
export const Dialog = (props: DialogProps) => <div {...props}>{props.children}</div>;
export const DialogContent = (props: DialogProps) => <div {...props}>{props.children}</div>;
export const DialogHeader = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{props.children}</div>;
export const DialogTitle = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{props.children}</div>;
export const DialogTrigger = (props: DialogProps) => <div {...props}>{props.children}</div>; 