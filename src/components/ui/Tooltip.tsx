import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  title?: React.ReactNode;
  content: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  width?: number;
  className?: string;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  content,
  badge,
  badgeColor = 'text-[#dfb15b] bg-[#221a11] border-[#4a3a22]',
  extra,
  children,
  width = 280,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; isAbove: boolean }>({
    top: 0,
    left: 0,
    isAbove: true,
  });

  const triggerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = width;
    const estimatedHeight = 90; // Average tooltip height for flip calculation

    // Center horizontally over the trigger element, clamped to viewport margins
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    const padding = 14;

    if (left < padding) {
      left = padding;
    } else if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }

    // Determine vertical placement: prefer above, flip below if too close to top
    let top = rect.top - estimatedHeight - 8;
    let isAbove = true;

    if (rect.top < estimatedHeight + 16) {
      top = rect.bottom + 8;
      isAbove = false;
    }

    setCoords({ top, left, isAbove });
  };

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    calculatePosition();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // Close on window scroll or resize to prevent orphaned floating tooltips
  useEffect(() => {
    if (!isOpen) return;
    const handleDismiss = () => setIsOpen(false);
    window.addEventListener('scroll', handleDismiss, true);
    window.addEventListener('resize', handleDismiss);
    return () => {
      window.removeEventListener('scroll', handleDismiss, true);
      window.removeEventListener('resize', handleDismiss);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex items-center ${className}`}
      >
        {children}
      </div>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${width}px`,
              zIndex: 99999,
            }}
            className="p-3 bg-[#17121c]/95 border border-[#3d2e47] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-left pointer-events-none animate-in fade-in zoom-in-95 duration-100 backdrop-blur-md select-none"
          >
            {/* Header: Title & Optional Badge */}
            {(title || badge) && (
              <div className="flex items-center justify-between gap-2 border-b border-[#291f33] pb-1.5 mb-2">
                {title && (
                  <span className="font-rpg font-bold text-[#f0e8db] text-xs truncate">
                    {title}
                  </span>
                )}
                {badge && (
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${badgeColor}`}
                  >
                    {badge}
                  </span>
                )}
              </div>
            )}

            {/* Description Body */}
            <div className="text-[11px] text-[#c9bea9] leading-relaxed">
              {content}
            </div>

            {/* Extra Section (Pillars, formulas, modifiers) */}
            {extra && <div className="mt-2 pt-1.5 border-t border-[#291f33]">{extra}</div>}
          </div>,
          document.body
        )}
    </>
  );
};

