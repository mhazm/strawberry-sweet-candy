import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'emerald' | 'amber' | 'purple' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  icon,
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    // In-Game CONTINUE button style (warm radiant gold)
    primary:
      'bg-[#dfb15b] hover:bg-[#ecd083] text-[#151218] font-bold shadow-[0_0_14px_rgba(223,177,91,0.35)] border border-[#eed07a]',
    gold:
      'bg-[#dfb15b] hover:bg-[#ecd083] text-[#151218] font-bold shadow-[0_0_14px_rgba(223,177,91,0.35)] border border-[#eed07a]',
    amber:
      'bg-[#2d2214] hover:bg-[#3d2e1b] text-[#e5be6b] border border-[#594426] hover:border-[#7a5e35]',
    purple:
      'bg-[#2e1d38] hover:bg-[#3c2549] text-[#c78ade] border border-[#552e69] hover:border-[#703b8c]',
    secondary:
      'bg-[#201a14] hover:bg-[#2c241c] text-[#c9bea9] border border-[#443828] hover:border-[#5a4b37] shadow-sm',
    danger:
      'bg-[#38161f] hover:bg-[#4a1c29] text-[#e67e8c] border border-[#632330] hover:border-[#852f40]',
    emerald:
      'bg-[#143023] hover:bg-[#1a3d2c] text-[#6bc79d] border border-[#21573d] hover:border-[#2f7850] shadow-[0_0_10px_rgba(33,87,61,0.2)]',
    ghost: 'hover:bg-[#201a14] text-[#8e8273] hover:text-[#e8decb]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-3.5 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
