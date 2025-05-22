import React from 'react';
// Placeholder Pagination components
export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}
export const Pagination = (props: PaginationProps) => <div {...props}>{props.children}</div>;
export const PaginationContent = (props: PaginationProps) => <div {...props}>{props.children}</div>;
export const PaginationItem = (props: PaginationProps) => <div {...props}>{props.children}</div>;
export const PaginationLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean }) => <a {...props}>{props.children}</a>;
export const PaginationNext = (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{props.children}</span>;
export const PaginationPrevious = (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{props.children}</span>; 