import React from 'react';
import { MerchantName } from '../../types';

interface MerchantBadgeProps {
  merchant: MerchantName | string;
  className?: string;
}

export function MerchantBadge({ merchant, className = '' }: MerchantBadgeProps) {
  const getStyle = () => {
    switch (merchant) {
      case 'Amazon':
        return 'bg-[#232F3E]/10 text-[#131921] border-[#232F3E]/20';
      case 'Gumroad':
        return 'bg-[#FF90E8]/15 text-[#111111] border-[#FF90E8]/30';
      case 'Direct Brand':
        return 'bg-[#18794E]/10 text-[#18794E] border-[#18794E]/20';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStyle()} ${className}`}
    >
      {merchant}
    </span>
  );
}
