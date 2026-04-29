'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = ({ className, ...props }: ToastPrimitive.ToastViewportProps) => (
  <ToastPrimitive.Viewport
    className={cn(
      'fixed top-4 right-4 z-50 flex w-80 flex-col gap-2 outline-none',
      className
    )}
    {...props}
  />
);

export const ToastRoot = ({ className, ...props }: ToastPrimitive.ToastProps) => (
  <ToastPrimitive.Root
    className={cn(
      'rounded-2xl border border-bazar-border bg-white p-4 text-sm shadow-card',
      className
    )}
    {...props}
  />
);

export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;
export const ToastAction = ToastPrimitive.Action;
export const ToastClose = ToastPrimitive.Close;
