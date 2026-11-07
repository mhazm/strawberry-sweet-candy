import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'role' | 'class' | 'rarity' | 'amber' | 'emerald' | 'purple' | 'rose' | 'sky';
  className?: string;
  roleType?: string;
  classType?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
  roleType,
  classType,
}) => {
  let roleStyle = 'bg-[#231b14] text-[#c9bea9] border-[#443828]';
  if (roleType === 'tank') {
    roleStyle = 'bg-[#182638] text-[#86afdf] border-[#294269]';
  } else if (roleType === 'dps') {
    roleStyle = 'bg-[#3d1c1c] text-[#e88888] border-[#6b2b2b]';
  } else if (roleType === 'healer') {
    roleStyle = 'bg-[#163326] text-[#71caa2] border-[#255e42]';
  } else if (roleType === 'support') {
    roleStyle = 'bg-[#2e1d38] text-[#c78ade] border-[#552e69]';
  }

  let classStyle = roleStyle;
  if (classType) {
    const c = classType.toLowerCase();
    if (c === 'arcanist') {
      classStyle = 'bg-[#3d1822] text-[#e67e8c] border-[#6e2533]';
    } else if (c === 'blademaster') {
      classStyle = 'bg-[#3b1c16] text-[#e38776] border-[#6b2c20]';
    } else if (c === 'guardian') {
      classStyle = 'bg-[#182638] text-[#81aade] border-[#284166]';
    } else if (c === 'warden') {
      classStyle = 'bg-[#142833] text-[#67bad6] border-[#20495e]';
    } else if (c === 'cleric') {
      classStyle = 'bg-[#143023] text-[#6bc79d] border-[#21573d]';
    } else if (c === 'bard') {
      classStyle = 'bg-[#1d301c] text-[#88c484] border-[#31522f]';
    } else if (c === 'ranger') {
      classStyle = 'bg-[#382012] text-[#d68a5c] border-[#61341a]';
    }
  }

  const variants = {
    default: 'bg-[#1e1926] text-[#c8beaf] border-[#34283b]',
    role: roleStyle,
    class: classStyle,
    rarity: 'bg-[#241e17] text-[#e5be6b] border-[#594426]',
    amber: 'bg-[#332410] text-[#e5be6b] border-[#594426]',
    emerald: 'bg-[#143023] text-[#6bc79d] border-[#21573d]',
    purple: 'bg-[#2e1d38] text-[#c78ade] border-[#552e69]',
    rose: 'bg-[#3d1822] text-[#e67e8c] border-[#6e2533]',
    sky: 'bg-[#182638] text-[#81aade] border-[#284166]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-md border tracking-wider uppercase',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
