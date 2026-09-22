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
        return 'chip-amazon';
      case 'Gumroad':
        return 'chip-gumroad';
      case 'Direct Brand':
      case 'EveryAge Digital':
      case 'Owned':
        return 'chip-owned';
      default:
        return 'bg-neutral-100 text-neutral-800 border border-neutral-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStyle()} ${className}`}
    >
      {merchant}
    </span>
  );
}
