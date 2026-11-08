'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Heart, Sparkles } from 'lucide-react';
import { RoomShell } from '@/components/sanctuary/RoomShell';
import { useSanctuaryRealtime } from '@/hooks/useSanctuaryRealtime';

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

export default function ConversationRoomPage() {
  const [messages, setMessages] = useState<DirectMsgItem[]>([]);
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Realtime synchronization for new direct messages
  useSanctuaryRealtime({
    table: 'direct_messages',
    onChange: () => {
      fetchMessages();
    },
  });

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
        setInput('');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <RoomShell>
      <div className="px-4 py-8 md:px-12 max-w-4xl mx-auto flex flex-col h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="text-center md:text-left mb-6 pb-4 border-b border-rose-900/20 shrink-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-xs font-serif uppercase tracking-widest text-sanctuary-gold">
              Room 04 &bull; Conversation
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-rose-300">Talk to Emman</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-wide">
            Talk to Emman
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Direct real-time messages between you and Emman.
          </p>
        </div>

        {/* Chat Console Card */}
        <div className="flex-1 flex flex-col min-h-0 rounded-3xl celestial-panel border border-rose-500/30 shadow-2xl overflow-hidden bg-slate-950/70">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#070913]/60">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Heart className="w-10 h-10 text-rose-400/50 mb-3 animate-pulse" />
                <p className="font-serif text-sm text-slate-300">No messages yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Leave a note for Emman anytime. He will see it in his Admin room and reply directly.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isEmman = msg.sender === 'emman';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isEmman ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[11px] font-serif">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-semibold ${
                          isEmman
                            ? 'bg-amber-950/80 border border-sanctuary-gold/50 text-sanctuary-gold'
                            : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                        }`}
                      >
                        {isEmman ? 'Emman' : 'Lei (You)'}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] md:max-w-[70%] p-3.5 sm:p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
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
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
            {QUICK_NOTES.map((note, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isSending}
                onClick={() => sendMessage(note)}
                className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700/70 hover:border-rose-400 hover:text-rose-200 text-slate-400 text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {note}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 border-t border-slate-800 flex items-center gap-2 bg-slate-950/90 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message to Emman..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-sanctuary-gold text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-sanctuary-gold to-yellow-500 text-slate-950 font-serif font-semibold text-xs sm:text-sm hover:brightness-110 transition-all disabled:opacity-40 cursor-pointer shadow-sm flex items-center gap-2"
              title="Send message"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </RoomShell>
  );
}
