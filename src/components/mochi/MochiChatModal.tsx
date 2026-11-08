'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Heart, MessageCircle } from 'lucide-react';
import { useSanctuaryRealtime } from '@/hooks/useSanctuaryRealtime';

interface TalkToEmmanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DirectMsgItem {
  id: string;
  sender: 'emman' | 'lei';
  recipient: 'emman' | 'lei';
  message: string;
  isHuman: boolean;
  createdAt: string;
}

const QUICK_NOTES = [
  'Thinking of you! 💖',
  'I miss you so much ✨',
  'Good morning my love ☀️',
  'Good night, sweet dreams 🌙',
  'Love you always 🌸',
];

export function MochiChatModal({ isOpen, onClose }: TalkToEmmanModalProps) {
  const [directMessages, setDirectMessages] = useState<DirectMsgItem[]>([]);
  const [directInput, setDirectInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchDirectMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.messages) setDirectMessages(data.messages);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDirectMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [directMessages, isOpen]);

  // Realtime subscription for Direct Messages
  useSanctuaryRealtime({
    table: 'direct_messages',
    onChange: () => {
      fetchDirectMessages();
    },
  });

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'lei',
          recipient: 'emman',
          message: text,
          isHuman: true,
        }),
      });

      if (res.ok) {
        setDirectInput('');
        fetchDirectMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(directInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-xl h-[640px] rounded-3xl celestial-panel border border-rose-500/40 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header — Title Tab: Talk to Emman */}
        <div className="p-4 px-6 border-b border-slate-800/80 bg-slate-950/85 flex items-center justify-between">
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

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Close conversation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#070913]/60">
          {directMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Heart className="w-8 h-8 text-rose-400/60 mb-2 animate-pulse" />
              <p className="font-serif text-sm text-slate-300">No messages yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Leave a note for Emman anytime. He will see it in his Admin room and reply directly.
              </p>
            </div>
          ) : (
            directMessages.map((msg) => {
              const isEmman = msg.sender === 'emman';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${isEmman ? 'items-start' : 'items-end'}`}
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
                  </div>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                      isEmman
                        ? 'bg-amber-950/40 text-amber-100 border border-sanctuary-gold/40 rounded-tl-none shadow-sm'
                        : 'bg-rose-950/50 text-rose-100 border border-rose-500/40 rounded-tr-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Note Pills */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 flex gap-1.5 overflow-x-auto scrollbar-none">
          {QUICK_NOTES.map((note, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isSending}
              onClick={() => sendMessage(note)}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/70 hover:border-rose-400 hover:text-rose-200 text-slate-400 text-[10px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {note}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/90"
        >
          <input
            type="text"
            value={directInput}
            onChange={(e) => setDirectInput(e.target.value)}
            placeholder="Type a message to Emman..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-sanctuary-gold text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isSending || !directInput.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-sanctuary-gold to-yellow-500 text-slate-950 hover:brightness-110 transition-all disabled:opacity-40 cursor-pointer shadow-sm"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export const TalkToEmmanModal = MochiChatModal;
