'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, Heart, Compass, AlertCircle, RefreshCw } from 'lucide-react';
import { MochiMessage } from '@/lib/mochi/provider';

interface MochiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MochiChatModal({ isOpen, onClose }: MochiChatModalProps) {
  const [messages, setMessages] = useState<MochiMessage[]>([
    {
      role: 'assistant',
      content:
        'Kumusta, Emman and Lei! ✨ Ako si Mochi, your celestial spirit companion dito sa Our Sanctuary. How is your heart feeling today?',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [suggestedActivities, setSuggestedActivities] = useState<string[]>([]);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const newMessages: MochiMessage[] = [
      ...messages,
      { role: 'user', content: textToSend.trim() },
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setStatusNotice(null);

    try {
      const res = await fetch('/api/mochi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.isConfigured && data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setStatusNotice(data.statusNotice);
      }

      if (data.suggestedActivities) {
        setSuggestedActivities(data.suggestedActivities);
      }
      if (data.suggestedPrompts) {
        setSuggestedPrompts(data.suggestedPrompts);
      }
    } catch {
      setStatusNotice('Mochi had a celestial disconnection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg h-[620px] rounded-3xl celestial-panel border border-sanctuary-ether/40 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header with Mochi Spirit Avatar */}
        <div className="p-4 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-sanctuary-ether/60 flex items-center justify-center shadow-ether-glow">
                <Sparkles className="w-6 h-6 text-sanctuary-ether animate-spin-slow" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base text-sanctuary-ether">Mochi</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-sans">
                  Celestial Familiar
                </span>
              </div>
              <p className="text-xs text-slate-400">Thoughtful Sanctuary Guide • Taglish Capable</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notice if API Key is not yet configured (Phase 1) */}
        {statusNotice && (
          <div className="p-3 mx-4 mt-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-sanctuary-ether mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-semibold text-sanctuary-ether">Sanctuary AI Consciousness Status:</p>
              <p className="text-slate-300 mt-0.5">{statusNotice}</p>
            </div>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-cyan-950 border border-sanctuary-ether/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-sanctuary-ether" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-sanctuary-gold/20 text-sanctuary-gold-light border border-sanctuary-gold/30 rounded-tr-none'
                      : 'bg-slate-900/80 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-sanctuary-ether">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Mochi is reflecting under the starlight...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts & Activities Pills */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-1.5 mb-2">
            <Compass className="w-3.5 h-3.5 text-sanctuary-gold" />
            <span className="text-[10px] tracking-wider uppercase text-sanctuary-gold font-serif">
              Suggested Sanctuary Prompts:
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(suggestedPrompts.length > 0 ? suggestedPrompts : [
              'What date idea fits a quiet night?',
              'Help me write a sweet letter to Lei',
              'Suggest a flower for our garden',
              'Remind me of our favorite memories',
            ]).map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/70 hover:border-sanctuary-ether/60 hover:text-cyan-200 text-slate-300 text-[11px] whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/80"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk with Mochi in English or Taglish..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-sanctuary-ether text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-sanctuary-ether text-slate-950 hover:bg-cyan-300 transition-colors disabled:opacity-40"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
