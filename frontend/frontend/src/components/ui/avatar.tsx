import React from 'react';
// Placeholder Avatar components
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}
export const Avatar = (props: AvatarProps) => <div {...props}>{props.children}</div>;
export const AvatarFallback = (props: AvatarProps) => <div {...props}>{props.children}</div>;
export const AvatarImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />; 