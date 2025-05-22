import React from 'react';
// Placeholder Sheet components
export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: string;
}
export const Sheet = (props: SheetProps) => <div {...props}>{props.children}</div>;
export const SheetContent = (props: SheetProps) => <div {...props}>{props.children}</div>;
export const SheetTrigger = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{props.children}</div>; 