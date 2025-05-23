import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}

const Sheet: React.FC<SheetProps> = ({ open = false, onOpenChange, side = 'right', children, className, ...props }) => {
  return (
    <>
      {open && createPortal(
        <>
          <SheetOverlay open={open} onOpenChange={onOpenChange} />
          <SheetContent open={open} onOpenChange={onOpenChange} side={side} className={className} {...props}>
            {children}
          </SheetContent>
        </>,
        document.body
      )}
      {!open && <>{children}</>}
    </>
  );
};

const SheetOverlay: React.FC<Pick<SheetProps, 'open' | 'onOpenChange'>> = ({ open, onOpenChange }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange?.(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleOverlayClick}
    />
  );
};

const SheetContent: React.FC<SheetProps> = ({ open, onOpenChange, side = 'right', children, className, ...props }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.focus();
    }
  }, [open]);

  const getSideStyles = () => {
    switch (side) {
      case 'left':
        return 'left-0 translate-x-0';
      case 'right':
        return 'right-0 translate-x-0';
      case 'top':
        return 'top-0 translate-y-0';
      case 'bottom':
        return 'bottom-0 translate-y-0';
      default:
        return 'right-0 translate-x-0';
    }
  };

  return (
    <div
      ref={contentRef}
      tabIndex={-1}
      className={`fixed z-50 bg-white dark:bg-gray-800 shadow-lg w-[250px] sm:w-[300px] h-full flex flex-col transition-transform duration-300 ${getSideStyles()} ${open ? '' : 'translate-x-full translate-y-full'} ${className}`}
      style={{
        transform: open ? 'none' : (side === 'left' || side === 'right' ? 'translate-x-full' : 'translate-y-full'),
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const SheetTrigger: React.FC<React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }> = ({ asChild, children, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: (e: React.MouseEvent) => {
        props.onClick?.(e);
      },
      ...props,
    });
  }
  return (
    <div
      {...props}
      onClick={(e: React.MouseEvent) => {
        props.onClick?.(e);
      }}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
};
// Single export statement to avoid duplicates
export { Sheet, SheetOverlay, SheetContent, SheetTrigger };