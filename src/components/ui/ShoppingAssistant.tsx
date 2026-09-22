'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
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
      content: 'Welcome to EveryAge Digital. I am your shopping receptionist. Tell me what you are looking for—such as a desk upgrade, books for learning business, everyday carry power, or digital guides under $50—and I will check our verified catalog for genuine recommendations.',
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
      <div className="md:col-span-7 flex flex-col h-[calc(100dvh-13rem)] min-h-[520px] md:h-[750px] bg-white border border-[#E2E5EB] rounded-2xl overflow-hidden shadow-xs">
        {/* Assistant Header */}
        <div className="bg-[#F7F7F4] border-b border-[#E2E5EB] p-3 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1D438A] text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-neutral-900">EveryAge Assistant</h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  Catalog-Grounded
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 line-clamp-1">
                Verified items only • Zero sponsored bias
              </p>
            </div>
          </div>

          {/* Quick Filter Modifiers (Tablet & Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs bg-white border border-neutral-300 rounded-lg px-2 py-1 text-neutral-700 focus:outline-hidden"
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
              className="text-xs bg-white border border-neutral-300 rounded-lg px-2 py-1 text-neutral-700 focus:outline-hidden"
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
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4 sm:space-y-6 bg-[#FAF9F6]/40">
          {messages.map(msg => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3 max-w-3xl ${isAssistant ? 'items-start' : 'items-end ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isAssistant ? 'bg-[#1D438A] text-white' : 'bg-neutral-800 text-white'
                  }`}
                >
                  {isAssistant ? <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>

                <div className={`space-y-2.5 ${isAssistant ? 'w-full min-w-0' : 'max-w-[85%] sm:max-w-lg'}`}>
                  {/* Text Bubble */}
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-white border border-[#E2E5EB] text-neutral-800 shadow-xs'
                        : 'bg-[#1D438A] text-white'
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
                          className={`min-w-[240px] max-w-[260px] sm:min-w-0 sm:max-w-none snap-start bg-white border rounded-xl p-3 shadow-xs flex flex-col justify-between cursor-pointer transition-all duration-150 ${
                            selectedPreviewId === rec.product.id
                              ? 'border-[#234F9E] ring-2 ring-[#234F9E]/10'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                {rec.product.brand}
                              </span>
                              <MerchantBadge merchant={rec.offer.merchantName} />
                            </div>

                            <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">
                              {rec.product.name}
                            </h4>

                            {/* Fit Reason */}
                            <div className="mt-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded p-1.5 flex items-start gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-tight line-clamp-2">{rec.fitReason}</span>
                            </div>

                            {/* Limitation notice */}
                            <div className="mt-1.5 text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-200/60 rounded p-1.5 flex items-start gap-1">
                              <AlertCircle className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
                              <span className="leading-tight line-clamp-2">
                                <strong className="text-neutral-700">Trade-off:</strong> {rec.limitations}
                              </span>
                            </div>
                          </div>

                          {/* Price & External Link */}
                          <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-neutral-900">
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
                                className="touch-target inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-[#1D438A] text-white hover:bg-[#153266] transition-colors min-h-[36px]"
                              >
                                <span>Offer</span>
                                <ExternalLink className="w-3 h-3 opacity-80" />
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
                          className="touch-target px-3 py-1.5 text-[11px] bg-white border border-neutral-300 rounded-full text-neutral-700 hover:border-[#1D438A] hover:text-[#1D438A] transition-colors cursor-pointer min-h-[36px] flex items-center"
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
            <div className="flex items-center gap-2 text-neutral-400 text-xs italic pl-9 sm:pl-11">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#1D438A]" />
              <span>Scanning verified catalog tools...</span>
            </div>
          )}
        </div>

        {/* Input Form - Pinned at bottom with safe-area padding */}
        <div className="p-3 sm:p-4 border-t border-[#E2E5EB] bg-white pb-safe shrink-0">
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
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7F7F4] border border-[#E2E5EB] rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-[#1D438A] focus:outline-hidden min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              aria-label="Send message"
              className="touch-target w-11 h-11 flex items-center justify-center bg-[#1D438A] text-white rounded-xl hover:bg-[#153266] transition-colors disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 text-[10px] text-neutral-400 text-center flex items-center justify-center gap-2 sm:gap-3">
            <span>Catalog-grounded</span>
            <span>•</span>
            <span>Zero sponsored bias</span>
            <span>•</span>
            <span>Direct merchant links</span>
          </div>
        </div>
      </div>

      {/* Product Preview Panel: Hidden on phone, 40% on Tablet/Desktop (col-span-5) */}
      <div className="hidden md:flex md:col-span-5 flex-col h-[750px] bg-white border border-[#E2E5EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#F7F7F4] border-b border-[#E2E5EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1D438A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Verified Product Preview
            </span>
          </div>
          {previewItem?.offer && (
            <MerchantBadge merchant={previewItem.offer.merchantName} />
          )}
        </div>

        {previewItem ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Product Image */}
            <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <Image
                src={previewItem.product.imageUrl}
                alt={previewItem.product.altText}
                fill
                sizes="(max-width: 1023px) 40vw, 30vw"
                className="object-cover"
              />
              {previewItem.product.editorialBadge && (
                <span className="absolute top-2.5 left-2.5 bg-[#F2EBDD] text-[#4A3B22] text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-[#E0D3BC]">
                  {previewItem.product.editorialBadge}
                </span>
              )}
            </div>

            {/* Brand & Name */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                {previewItem.product.brand}
              </span>
              <h3 className="font-serif text-lg font-bold text-neutral-900 mt-0.5">
                {previewItem.product.name}
              </h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                {previewItem.product.description}
              </p>
            </div>

            {/* Best For vs Not For */}
            <div className="space-y-2 pt-1">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900">
                <span className="font-bold block mb-0.5 text-emerald-800">Best Suited For:</span>
                <p>{previewItem.product.bestFor}</p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                <span className="font-bold block mb-0.5 text-amber-800">Key Trade-off:</span>
                <p>{previewItem.product.notFor}</p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="p-4 bg-[#F7F7F4] rounded-xl border border-[#E2E5EB] space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">
                    Verified Merchant Price
                  </span>
                  {previewItem.offer ? (
                    <span className="text-xl font-bold text-neutral-900">
                      ${previewItem.offer.price.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400 italic">No price available</span>
                  )}
                </div>
                <Link
                  href={`/product/${previewItem.product.slug}`}
                  className="text-xs text-[#1D438A] font-semibold hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Full Review</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {previewItem.offer && (
                <a
                  href={`/api/go/${previewItem.product.id}`}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="touch-target w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-[#1D438A] text-white hover:bg-[#153266] transition-colors shadow-xs min-h-[44px]"
                >
                  <span>
                    {previewItem.offer.merchantName === 'Amazon'
                      ? 'View Offer on Amazon'
                      : `View on ${previewItem.offer.merchantName}`}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
            <Sparkles className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">Ask the assistant a question to preview verified products here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

