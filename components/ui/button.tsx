import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-0.5 active:shadow-sm',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-3d hover:shadow-3d-sm hover:-translate-y-0.5 active:shadow-sm active:translate-y-0',
        destructive:
          'bg-destructive text-destructive-foreground shadow-3d-sm hover:shadow-xs hover:-translate-y-0.5 active:shadow-xs active:translate-y-0',
        outline:
          'border-2 border-input bg-background shadow-sm hover:shadow-3d-sm hover:-translate-y-0.5 active:shadow-sm active:translate-y-0',
        secondary:
          'bg-secondary text-secondary-foreground shadow-3d-sm hover:shadow-sm hover:-translate-y-0.5 active:shadow-sm active:translate-y-0',
        ghost:
          'hover:bg-accent hover:text-accent-foreground hover:shadow-sm rounded-md',
        link: 'text-primary underline-offset-4 hover:underline shadow-none',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs shadow-3d-sm hover:shadow-xs',
        lg: 'h-12 px-8 text-base shadow-3d-lg hover:shadow-3d',
        icon: 'h-10 w-10 shadow-3d-sm hover:shadow-3d hover:-translate-y-0.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
