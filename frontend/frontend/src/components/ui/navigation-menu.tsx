import React from 'react';
// Placeholder NavigationMenu components
export interface NavigationMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  align?: string;
}
export const NavigationMenu = (props: NavigationMenuProps) => <div {...props}>{props.children}</div>;
export const NavigationMenuContent = (props: NavigationMenuProps) => <div {...props}>{props.children}</div>;
export const NavigationMenuItem = (props: NavigationMenuProps) => <div {...props}>{props.children}</div>;
export const NavigationMenuLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{props.children}</a>;
export const NavigationMenuList = (props: NavigationMenuProps) => <div {...props}>{props.children}</div>;
export const NavigationMenuTrigger = (props: NavigationMenuProps) => <div {...props}>{props.children}</div>;
export function navigationMenuTriggerStyle() { return ''; } 