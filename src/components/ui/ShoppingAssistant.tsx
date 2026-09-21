'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { AssistantMessage } from '../../types';
import { generateAssistantResponse } from '../../lib/assistant/receptionist';
import { MerchantBadge } from './MerchantBadge';
import { WishlistButton } from './WishlistButton';

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
  const messageCounter = React.useRef(1);

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
    }, 450);
  };

  return (
    <div className="bg-white border border-[#E2E5EB] rounded-2xl overflow-hidden shadow-xs flex flex-col h-[750px] max-w-4xl mx-auto">
      {/* Assistant Header */}
      <div className="bg-[#F7F7F4] border-b border-[#E2E5EB] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1D438A] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-900">EveryAge Assistant</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                Catalog-Grounded
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Retrieves only verified items. Never invents prices or accepts sponsored bias.
            </p>
          </div>
        </div>

        {/* Quick Filter Modifiers */}
        <div className="hidden sm:flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs bg-white border border-neutral-300 rounded-md px-2 py-1 text-neutral-700 focus:outline-hidden"
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
            className="text-xs bg-white border border-neutral-300 rounded-md px-2 py-1 text-neutral-700 focus:outline-hidden"
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
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-[#FAF9F6]/40">
        {messages.map(msg => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAssistant ? 'items-start' : 'items-end ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isAssistant ? 'bg-[#1D438A] text-white' : 'bg-neutral-800 text-white'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`space-y-3 ${isAssistant ? 'w-full' : 'max-w-lg'}`}>
                {/* Text Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-white border border-[#E2E5EB] text-neutral-800 shadow-xs'
                      : 'bg-[#1D438A] text-white'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>

                {/* Recommendations Grid */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {msg.recommendations.map(rec => (
                      <div
                        key={rec.product.id}
                        className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between hover:border-[#1D438A]/40 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                              {rec.product.brand}
                            </span>
                            <MerchantBadge merchant={rec.offer.merchantName} />
                          </div>

                          <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">
                            <Link href={`/product/${rec.product.slug}`} className="hover:underline">
                              {rec.product.name}
                            </Link>
                          </h4>

                          {/* Fit Reason */}
                          <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded p-1.5 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{rec.fitReason}</span>
                          </div>

                          {/* Limitation notice */}
                          <div className="mt-1.5 text-[11px] text-neutral-600 bg-neutral-50 border border-neutral-200/60 rounded p-1.5 flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                            <span className="leading-tight"><strong className="text-neutral-700">Trade-off:</strong> {rec.limitations}</span>
                          </div>
                        </div>

                        {/* Price & External Link */}
                        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-neutral-900">
                              ${rec.offer.price.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-neutral-400 block">
                              Verified {new Date(rec.offer.lastCheckedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <WishlistButton productId={rec.product.id} />
                            <a
                              href={rec.offer.affiliateUrl}
                              target="_blank"
                              rel="sponsored nofollow noopener"
                              className="inline-flex items-center gap-1 py-1.5 px-2.5 rounded text-xs font-semibold bg-[#1D438A] text-white hover:bg-[#153266] transition-colors"
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
                        className="px-2.5 py-1 text-[11px] bg-white border border-neutral-300 rounded-full text-neutral-700 hover:border-[#1D438A] hover:text-[#1D438A] transition-colors cursor-pointer"
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
          <div className="flex items-center gap-2 text-neutral-400 text-xs italic pl-11">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#1D438A]" />
            <span>Scanning verified catalog tools...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-[#E2E5EB] bg-white">
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
            placeholder="Ask anything: 'Recommend an ergonomic mouse', 'Best books on habits'..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#F7F7F4] border border-[#E2E5EB] rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-[#1D438A] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-2.5 bg-[#1D438A] text-white rounded-xl hover:bg-[#153266] transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 text-[10px] text-neutral-400 text-center flex items-center justify-center gap-3">
          <span>Catalog-grounded retrieval</span>
          <span>•</span>
          <span>Zero sponsored placement distortion</span>
          <span>•</span>
          <span>Direct merchant links</span>
        </div>
      </div>
    </div>
  );
}
