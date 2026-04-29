import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'secondary';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition',
        variant === 'primary' && 'bg-bazar-primary text-white hover:bg-bazar-primary/90',
        variant === 'secondary' && 'bg-bazar-accent text-white hover:bg-bazar-accent/90',
        variant === 'ghost' && 'bg-transparent text-bazar-primary hover:bg-bazar-primary/10',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export default Button;
