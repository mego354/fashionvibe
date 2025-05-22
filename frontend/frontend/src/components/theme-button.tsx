import React from 'react';
import { Button, ButtonProps } from '../components/ui/button';
import { cn } from '../lib/utils';

interface ThemeButtonProps extends ButtonProps {
  color: string;
  active?: boolean;
}

export const ThemeButton = React.forwardRef<HTMLButtonElement, ThemeButtonProps>(
  ({ color, active, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={cn(
          'h-8 w-8 rounded-full border-2',
          {
            'ring-2 ring-offset-2': active,
          },
          className
        )}
        style={{ backgroundColor: color, borderColor: active ? color : 'transparent' }}
        {...props}
      />
    );
  }
);

ThemeButton.displayName = 'ThemeButton';

export default ThemeButton;
