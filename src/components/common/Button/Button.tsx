import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.pcss';

const buttonVariants = cva(styles.root, {
  variants: {
    variant: {
      default: styles.default,
      secondary: styles.secondary,
      danger: styles.danger,
    },
    size: {
      icon: styles.icon,
      xs: styles.xs,
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { ref?: React.Ref<HTMLButtonElement> };

export const Button = ({
  variant,
  ref,
  size,
  className,
  type = 'button',
  ...props
}: Props) => (
  <button
    className={clsx(buttonVariants({ variant, size }), className)}
    ref={ref}
    type={type}
    {...props}
  />
);
