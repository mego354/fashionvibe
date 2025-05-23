import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({ open = false, onOpenChange, children }) => {
  return (
    <>
      {open && createPortal(
        <DialogOverlay open={open} onOpenChange={onOpenChange}>
          {children}
        </DialogOverlay>,
        document.body
      )}
      {!open && children}
    </>
  );
};

const DialogOverlay: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange?.(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onOpenChange]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 40,
        display: open ? 'block' : 'none',
      }}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};

export const DialogContent: React.FC<DialogProps> = ({ children, ...props }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={contentRef}
      tabIndex={-1}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: '2rem',
        minWidth: 320,
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflow: 'auto',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div
    style={{
      marginBottom: '1rem',
      ...props.style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <h2
    style={{
      fontSize: '1.5rem',
      fontWeight: 600,
      margin: 0,
      ...props.style,
    }}
    {...props}
  >
    {children}
  </h2>
);

export const DialogTrigger: React.FC<DialogProps & { asChild?: boolean }> = ({ asChild, children, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: () => props.onOpenChange?.(true),
    });
  }
  return (
    <button
      onClick={() => props.onOpenChange?.(true)}
      style={{
        cursor: 'pointer',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '0.5rem',
        background: '#007bff',
        color: 'white',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};