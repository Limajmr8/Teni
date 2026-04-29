import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-2xl border border-bazar-border bg-white px-4 py-2 text-sm outline-none focus:border-bazar-primary',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export default Input;
