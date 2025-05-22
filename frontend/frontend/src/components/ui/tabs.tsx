import React from 'react';
// Placeholder Tabs components
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}
export const Tabs = (props: TabsProps) => <div {...props}>{props.children}</div>;
export const TabsContent = (props: TabsProps) => <div {...props}>{props.children}</div>;
export const TabsList = (props: TabsProps) => <div {...props}>{props.children}</div>;
export const TabsTrigger = (props: TabsProps) => <div {...props}>{props.children}</div>; 