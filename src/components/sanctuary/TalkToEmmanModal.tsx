'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart, MessageCircle, Trash2, Loader2 } from 'lucide-react';
import { useConversationChat } from '@/hooks/useConversationChat';

interface TalkToEmmanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_NOTES = [
  'Thinking of you! 💖',
  'I miss you so much ✨',
  'Good morning my love ☀️',
  'Good night, sweet dreams 🌙',
  'Love you always 🌸',
];

export function TalkToEmmanModal({ isOpen, onClose }: TalkToEmmanModalProps) {
  const {
    messages,
    isSending,
    isClearing,
    sendError,
    sendMessage,
    retryFailed,
    clearConversation,
    fetchMessages,
  } = useConversationChat({ userRole: 'lei' });

  const [directInput, setDirectInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, fetchMessages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directInput.trim() || isSending) return;
    sendMessage(directInput);
    setDirectInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-xl h-[640px] max-h-[92vh] rounded-3xl celestial-panel border border-rose-500/40 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800/80 bg-slate-950/85 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-950 to-amber-950 border border-sanctuary-gold/40 flex items-center justify-center text-sanctuary-gold shadow-sm">
              <MessageCircle className="w-5 h-5 text-sanctuary-gold" />
            </div>
            <div>
              <h3 className="font-serif text-base text-sanctuary-gold-light font-semibold tracking-wide">
                Talk to Emman
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Direct conversation with Emman
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isClearing}
              onClick={clearConversation}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
              title="Delete conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Close conversation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#070913]/60">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Heart className="w-8 h-8 text-rose-400/60 mb-2 animate-pulse" />
              <p className="font-serif text-sm text-slate-300">No messages yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Leave a note for Emman anytime. He will see it in his Admin room and reply directly.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isEmman = msg.sender === 'emman';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: msg._failed ? 0.6 : 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex flex-col ${isEmman ? 'items-start' : 'items-end'}`}
                    onClick={msg._failed ? () => retryFailed(msg) : undefined}
                    style={{ cursor: msg._failed ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-serif">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          isEmman
                            ? 'bg-amber-950/80 border border-sanctuary-gold/50 text-sanctuary-gold'
                            : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                        }`}
                      >
                        {isEmman ? 'Emman' : 'Lei (You)'}
                      </span>
                      <span className="text-slate-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {msg._optimistic && (
                        <span className="text-slate-600 italic text-[9px]">sending…</span>
                      )}
                      {msg._failed && (
                        <span className="text-rose-500 italic text-[9px]">⚠ Tap to retry</span>
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                        isEmman
                          ? 'bg-amber-950/40 text-amber-100 border border-sanctuary-gold/40 rounded-tl-none shadow-sm'
                          : msg._failed
                          ? 'bg-rose-950/60 text-rose-200 border border-rose-500/60 rounded-tr-none opacity-70'
                          : msg._optimistic
                          ? 'bg-rose-950/30 text-rose-100 border border-rose-500/20 rounded-tr-none'
                          : 'bg-rose-950/50 text-rose-100 border border-rose-500/40 rounded-tr-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Note Pills */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {QUICK_NOTES.map((note, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isSending}
              onClick={() => sendMessage(note)}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/70 hover:border-rose-400 hover:text-rose-200 text-slate-400 text-[10px] whitespace-nowrap transition-colors cursor-pointer shrink-0 touch-manipulation"
            >
              {note}
            </button>
          ))}
        </div>

        {/* Error Notification */}
        {sendError && (
          <div className="px-4 py-1.5 bg-rose-950/60 border-t border-rose-700/40 text-rose-300 text-xs text-center shrink-0">
            {sendError}
          </div>
        )}

        {/* Message Input Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="chat-input-safe p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/95 shrink-0"
        >
          <input
            type="text"
            value={directInput}
            onChange={(e) => setDirectInput(e.target.value)}
            placeholder="Type a message to Emman..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-sanctuary-gold text-xs text-white placeholder-slate-500 outline-none transition-colors touch-manipulation"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isSending || !directInput.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-sanctuary-gold to-yellow-500 text-slate-950 hover:brightness-110 transition-all disabled:opacity-40 cursor-pointer shadow-sm flex items-center justify-center shrink-0 touch-manipulation"
            title="Send message"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export const MochiChatModal = TalkToEmmanModal;
