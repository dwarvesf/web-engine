'use client';

import React, { forwardRef, useEffect, type ReactNode } from 'react';
import { cn } from '../../utils';

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onRequestClose?: () => void;
  contentLabel?: string;
  className?: string;
  children: ReactNode;
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    { isOpen, onRequestClose, contentLabel, className, children, ...rest },
    ref,
  ) => {
    useEffect(() => {
      if (isOpen) {
        document.body.classList.add('overflow-hidden');

        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape' && onRequestClose) {
            onRequestClose();
          }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
          document.body.classList.remove('overflow-hidden');
          document.removeEventListener('keydown', handleEscape);
        };
      }
    }, [isOpen, onRequestClose]);

    if (!isOpen) return null;

    return (
      <div className="dialog-underlay dialog-underlay--open bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div
          ref={ref}
          role="dialog"
          aria-label={contentLabel}
          aria-modal="true"
          className={cn(
            'dialog-content dialog-content--open font-sans leading-normal font-normal text-black focus:outline-none',
            className,
          )}
          onClick={e => e.stopPropagation()}
          {...rest}
        >
          {children}
        </div>
      </div>
    );
  },
);

Dialog.displayName = 'Dialog';

export default Dialog;
