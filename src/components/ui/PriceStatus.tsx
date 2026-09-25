import React from 'react';
import { MerchantOffer } from '../../types';
import { FreshnessResult } from '../../lib/affiliate/adapters';

interface PriceStatusProps {
  offer?: MerchantOffer;
  freshness?: FreshnessResult;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceStatus({ offer, freshness, size = 'md', className = '' }: PriceStatusProps) {
  if (!offer) {
    return <span className={`text-slate-400 text-sm italic ${className}`}>Price on request</span>;
  }

  // If price data is stale, strictly hide old price and show "Check current price"
  if (freshness?.isStale) {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className="inline-flex items-center text-xs font-medium text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 backdrop-blur-md">
          Check current price
        </span>
        <span className="text-[10px] text-slate-400 mt-0.5">Price check overdue</span>
      </div>
    );
  }

  const formatPrice = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const textSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-2xl font-bold tracking-tight'
  };

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className={`${textSizes[size]} text-slate-100`}>
        {formatPrice(offer.price, offer.currency)}
      </span>
      {offer.originalPrice && offer.originalPrice > offer.price && (
        <span className="text-xs text-slate-400 line-through">
          {formatPrice(offer.originalPrice, offer.currency)}
        </span>
      )}
    </div>
  );
}
