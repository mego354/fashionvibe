import React from 'react';
// Placeholder Accordion components
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export const Accordion = (props: AccordionProps) => <div {...props}>{props.children}</div>;
export const AccordionContent = (props: AccordionProps) => <div {...props}>{props.children}</div>;
export const AccordionItem = (props: AccordionProps) => <div {...props}>{props.children}</div>;
export const AccordionTrigger = (props: AccordionProps) => <div {...props}>{props.children}</div>; 