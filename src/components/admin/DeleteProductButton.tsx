'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  Archive, 
  Loader2, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { deleteProductAction, toggleProductStatusAction } from '../../app/actions/admin';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  variant?: 'table' | 'mobile';
  className?: string;
  onDeleted?: () => void;
}

export function DeleteProductButton({
  productId,
  productName,
  variant = 'table',
  className = '',
  onDeleted
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isProcessing = isDeleting || isArchiving;

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isProcessing) return;
    setIsOpen(false);
    setError(null);
  };

  // Keyboard accessibility: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isProcessing]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await deleteProductAction(productId);
      if (res && res.success) {
        setIsOpen(false);
        if (onDeleted) {
          onDeleted();
        }
        router.refresh();
      } else {
        setError(res?.error || 'Failed to delete product. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred while deleting.';
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    setError(null);
    try {
      const res = await toggleProductStatusAction(productId, 'archived');
      if (res && res.success) {
        setIsOpen(false);
        if (onDeleted) {
          onDeleted();
        }
        router.refresh();
      } else {
        setError(res?.error || 'Failed to archive product. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred while archiving.';
      setError(msg);
    } finally {
      setIsArchiving(false);
    }
  };

  const buttonClasses = variant === 'mobile'
    ? `touch-target w-11 h-11 flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${className}`
    : `touch-target p-2 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors min-h-[36px] min-w-[36px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${className}`;

  const modalContent = isOpen ? (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`delete-title-${productId}`}
        aria-describedby={`delete-desc-${productId}`}
        className="relative w-full max-w-md rounded-2xl backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-white/10 shadow-2xl p-6 text-left space-y-5 animate-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isProcessing}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors disabled:opacity-40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div className="flex-1 pr-6">
            <h3
              id={`delete-title-${productId}`}
              className="text-base font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Delete Product
            </h3>
            <p
              id={`delete-desc-${productId}`}
              className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed"
            >
              Are you sure you want to delete{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">&ldquo;{productName}&rdquo;</strong>?
            </p>
          </div>
        </div>

        {/* Information Callout */}
        <div className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Permanent Action Warning</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Deleting permanently removes this product and its associated affiliate tracking links from the store inventory.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
            Prefer not to delete? You can <strong className="text-slate-800 dark:text-slate-200 font-semibold">Archive</strong> it to hide it from shoppers while keeping historical records.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="flex-1 leading-normal">{error}</span>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-white/20 dark:border-white/10">
          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-white dark:hover:bg-slate-700 transition-colors disabled:opacity-50 backdrop-blur-md"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleArchive}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-400/40 bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors disabled:opacity-50 backdrop-blur-md"
          >
            {isArchiving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Archiving...</span>
              </>
            ) : (
              <>
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-xs disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        title="Delete Product"
        aria-label={`Delete ${productName}`}
        onClick={handleOpen}
        className={buttonClasses}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}

export default DeleteProductButton;
