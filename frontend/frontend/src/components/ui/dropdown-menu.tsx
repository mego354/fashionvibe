import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}
const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  align?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger: React.FC<DropdownMenuProps> = ({ asChild, children, ...props }) => {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) return null;
  const { open, setOpen, triggerRef } = ctx;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setOpen(!open);
    if (props.onClick) props.onClick(e);
  };
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      ref: triggerRef,
      onClick: handleClick,
      ...props,
    });
  }
  return (
    <div ref={triggerRef} onClick={handleClick} {...props}>
      {children}
    </div>
  );
};

export const DropdownMenuContent: React.FC<DropdownMenuProps> = ({ children, align, ...props }) => {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx || !ctx.open) return null;
  // Position absolutely below the trigger
  return (
    <div
      className="absolute z-50 mt-2 min-w-[180px] rounded-md border bg-popover p-2 shadow-lg focus:outline-none"
      style={{ right: align === 'end' ? 0 : undefined }}
      tabIndex={-1}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuProps> = ({ children, ...props }) => (
  <div
    className="cursor-pointer select-none rounded px-2 py-2 text-sm hover:bg-accent focus:bg-accent outline-none"
    tabIndex={0}
    {...props}
  >
    {children}
  </div>
);
export const DropdownMenuLabel: React.FC<DropdownMenuProps> = ({ children, ...props }) => (
  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground" {...props}>{children}</div>
);
export const DropdownMenuSeparator: React.FC<DropdownMenuProps> = (props) => (
  <div className="my-2 h-px bg-border" {...props} />
); 