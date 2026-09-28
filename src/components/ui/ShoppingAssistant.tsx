'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Send, 
  Bot, 
  User, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { AssistantMessage } from '../../types';
import { generateAssistantResponse } from '../../lib/assistant/receptionist';
import { MerchantBadge } from './MerchantBadge';
import { WishlistButton } from './WishlistButton';
import { EnrichedProduct, getProductById } from '../../lib/search/catalogSearch';

export function ShoppingAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: 'Welcome to EveryAge Digital. I am your catalog concierge. Tell me what you are looking for—such as an ergonomic mouse upgrade, books for learning business strategy, everyday carry power, or digital guides under $50—and I will query our verified catalog for genuine recommendations.',
      suggestedPrompts: [
        'Best home office desk lighting',
        'Books for learning business & focus',
        'Ergonomic mouse under $110',
        'Digital guides for freelancers',
        'Pocket fast charger for travel'
      ],
      timestamp: '2026-03-21T00:00:00.000Z'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState<number | undefined>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPreviewId, setSelectedPreviewId] = useState<string>('prod-benq-screenbar-halo');
  const messageCounter = useRef(1);

  // Active preview product for tablet/desktop 40% column
  const previewItem = getProductById(selectedPreviewId);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const count = messageCounter.current++;
    const userMsg: AssistantMessage = {
      id: `user_${count}`,
      role: 'user',
      content: text,
      timestamp: '2026-03-21T00:00:00.000Z'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Grounded retrieval query execution
    setTimeout(() => {
      const response = generateAssistantResponse({
        userMessage: text,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        maxBudget: selectedBudget
      });
      setMessages(prev => [...prev, response]);
      setIsTyping(false);

      // Auto-preview first recommendation if returned
      if (response.recommendations && response.recommendations.length > 0) {
        setSelectedPreviewId(response.recommendations[0].product.id);
      }
    }, 450);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
      {/* Chat Panel: 100% on phone, 60% on tablet/desktop (col-span-7) */}
      <div className="md:col-span-7 flex flex-col h-[calc(100dvh-13rem)] min-h-[520px] md:h-[750px] glass-strong rounded-xl overflow-hidden shadow-xl">
        {/* Assistant Header */}
        <div className="border-b border-neutral-200/40 dark:border-white/10 p-3 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-xs sm:text-sm font-serif font-medium text-neutral-900 dark:text-white">EveryAge Concierge</h2>
                <span className="text-[10px] font-mono uppercase tracking-wider glass-pill text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded-full font-semibold">
                  Deterministic
                </span>
              </div>
              <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 line-clamp-1">
                Verified specimens only • Direct merchant links
              </p>
            </div>
          </div>

          {/* Quick Filter Modifiers (Tablet & Desktop) */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md px-2.5 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="Home Office">Home Office</option>
              <option value="Electronics">Electronics</option>
              <option value="Productivity">Productivity</option>
              <option value="Everyday Essentials">Everyday Essentials</option>
            </select>

            <select
              value={selectedBudget || ''}
              onChange={e => setSelectedBudget(e.target.value ? Number(e.target.value) : undefined)}
              className="text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md px-2.5 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              aria-label="Filter by budget"
            >
              <option value="">Any Budget</option>
              <option value="30">Under $30</option>
              <option value="60">Under $60</option>
              <option value="150">Under $150</option>
              <option value="300">Under $300</option>
            </select>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4 sm:space-y-6">
          {messages.map(msg => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3 max-w-3xl ${isAssistant ? 'items-start' : 'items-end ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-semibold ${
                    isAssistant ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200' : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                  }`}
                >
                  {isAssistant ? <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>

                <div className={`space-y-2.5 ${isAssistant ? 'w-full min-w-0' : 'max-w-[85%] sm:max-w-lg'}`}>
                  {/* Text Bubble */}
                  <div
                    className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-2xs'
                        : 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>

                  {/* Recommendations Cards - Horizontally Scrollable on Phone, Stacked/Grid on Tablet */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="flex overflow-x-auto gap-3 pb-2 pt-1 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-2">
                      {msg.recommendations.map(rec => (
                        <div
                          key={rec.product.id}
                          onClick={() => setSelectedPreviewId(rec.product.id)}
                          className={`min-w-[240px] max-w-[260px] sm:min-w-0 sm:max-w-none snap-start glass glass-hover rounded-xl p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-150 ${
                            selectedPreviewId === rec.product.id
                              ? 'ring-2 ring-blue-500 border-blue-500'
                              : ''
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                {rec.product.brand}
                              </span>
                              <MerchantBadge merchant={rec.offer.merchantName} />
                            </div>

                            <h4 className="font-serif font-medium text-xs text-neutral-900 dark:text-white line-clamp-1">
                              {rec.product.name}
                            </h4>

                            {/* Fit Reason */}
                            <div className="mt-2 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-md p-2 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-tight line-clamp-2">{rec.fitReason}</span>
                            </div>

                            {/* Limitation notice */}
                            <div className="mt-1.5 text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-md p-2 flex items-start gap-1.5">
                              <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                              <span className="leading-tight line-clamp-2">
                                <strong className="font-semibold">Trade-off:</strong> {rec.limitations}
                              </span>
                            </div>
                          </div>

                          {/* Price & External Link */}
                          <div className="mt-3 pt-2.5 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-2">
                            <div>
                              <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                ${rec.offer.price.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <WishlistButton productId={rec.product.id} />
                              <a
                                href={rec.offer.affiliateUrl}
                                target="_blank"
                                rel="sponsored nofollow noopener"
                                onClick={e => e.stopPropagation()}
                                className="btn-view-deal text-xs py-1 px-2.5"
                              >
                                <span>Offer</span>
                                <ArrowUpRight className="w-3 h-3 ml-0.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Prompt Chips */}
                  {msg.suggestedPrompts && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedPrompts.map(prompt => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSend(prompt)}
                          className="touch-target px-2.5 py-1 text-[11px] font-mono bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800 rounded-md text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer min-h-[32px] flex items-center"
                        >
                          &ldquo;{prompt}&rdquo;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-neutral-500 text-xs italic pl-9 sm:pl-11 font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5 animate-spin text-neutral-600 dark:text-neutral-400" />
              <span>Scanning verified catalog specimens...</span>
            </div>
          )}
        </div>

        {/* Input Form - Pinned at bottom with safe-area padding */}
        <div className="p-3 sm:p-4 border-t border-neutral-200/40 dark:border-white/10 pb-safe shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask anything: 'Ergonomic mouse under $110'..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm font-mono bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-500 min-h-[40px]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              aria-label="Send message"
              className="touch-target w-10 h-10 flex items-center justify-center bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-white transition-colors disabled:opacity-30 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 text-center flex items-center justify-center gap-2 sm:gap-3">
            <span>Catalog-grounded</span>
            <span>•</span>
            <span>Zero sponsored bias</span>
            <span>•</span>
            <span>Direct merchant links</span>
          </div>
        </div>
      </div>

      {/* Product Preview Panel: Hidden on phone, 40% on Tablet/Desktop (col-span-5) */}
      <div className="hidden md:flex md:col-span-5 flex-col h-[750px] glass-strong rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-200/40 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-semibold">
              Specimen Preview
            </span>
          </div>
          {previewItem?.offer && (
            <MerchantBadge merchant={previewItem.offer.merchantName} />
          )}
        </div>

        {previewItem ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Dedicated Studio Display Box */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white dark:bg-white border border-neutral-200 dark:border-neutral-800">
              <Image
                src={previewItem.product.imageUrl}
                alt={previewItem.product.altText}
                fill
                sizes="(max-width: 1023px) 40vw, 30vw"
                className="h-full w-full object-contain"
              />
              {previewItem.product.editorialBadge && (
                <span className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full glass-pill text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs">
                  {previewItem.product.editorialBadge}
                </span>
              )}
            </div>

            {/* Brand & Name */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">
                {previewItem.product.brand}
              </span>
              <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-white mt-0.5 leading-snug">
                {previewItem.product.name}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                {previewItem.product.description}
              </p>
            </div>

            {/* Best For vs Not For */}
            <div className="space-y-2 pt-1">
              <div className="p-3 bg-neutral-100 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-bold block mb-0.5">The Sweet Spot:</span>
                <p className="text-neutral-700 dark:text-neutral-300">{previewItem.product.bestFor}</p>
              </div>

              <div className="p-3 bg-neutral-100 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-800 dark:text-amber-400 font-bold block mb-0.5">The Catch:</span>
                <p className="text-neutral-600 dark:text-neutral-400 italic">{previewItem.product.notFor}</p>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  ${(previewItem.offer?.price ?? previewItem.product.price ?? 0).toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 ml-1">USD</span>
              </div>

              <div className="flex items-center gap-1.5">
                <WishlistButton productId={previewItem.product.id} />
                <a
                  href={previewItem.offer?.affiliateUrl || previewItem.product.affiliate_url || `/product/${previewItem.product.slug}`}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="btn-view-deal text-xs font-mono uppercase"
                >
                  <span>View Deal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-neutral-400 text-xs font-mono">
            Select any specimen in the conversation stream to inspect specs and trade-offs.
          </div>
        )}
      </div>
    </div>
  );
}
