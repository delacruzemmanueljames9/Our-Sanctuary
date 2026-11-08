'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Heart, Compass, UserCheck, MessageSquare, Trash2, Bot } from 'lucide-react';
import { MochiMessage } from '@/lib/mochi/provider';
import { MochiCatAvatar, CatMood } from './MochiCatAvatar';
import { useSanctuaryRealtime } from '@/hooks/useSanctuaryRealtime';

interface MochiChatModalProps {
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

export function MochiChatModal({ isOpen, onClose }: MochiChatModalProps) {
  const [activeChannel, setActiveChannel] = useState<'mochi' | 'human'>('mochi');
  const [catMood, setCatMood] = useState<CatMood>('idle');

  // Mochi AI Chat State
  const [messages, setMessages] = useState<MochiMessage[]>([
    {
      role: 'assistant',
      content:
        'Kumusta, Emman at Lei! ✨ *purrs softly and blinks with celestial light* Ako si Mochi, ang inyong cat spirit familiar dito sa Our Sanctuary. How is your heart feeling today?',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedActivities, setSuggestedActivities] = useState<string[]>([]);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);

  // Human Direct Message Channel State (Emman Live Reply)
  const [directMessages, setDirectMessages] = useState<DirectMsgItem[]>([]);
  const [directInput, setDirectInput] = useState<string>('');
  const [directAuthor, setDirectAuthor] = useState<'emman' | 'lei'>('lei');
  const [isSendingDirect, setIsSendingDirect] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, directMessages, activeChannel]);

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
    if (isOpen && activeChannel === 'human') {
      fetchDirectMessages();
    }
  }, [isOpen, activeChannel]);

  // Realtime subscription for Human Direct Channel
  useSanctuaryRealtime({
    table: 'direct_messages',
    onChange: () => {
      if (activeChannel === 'human') fetchDirectMessages();
    },
  });

  if (!isOpen) return null;

  // Send Mochi AI message
  const sendMochiMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const newMessages: MochiMessage[] = [
      ...messages,
      { role: 'user', content: textToSend.trim() },
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setCatMood('thinking');

    try {
      const res = await fetch('/api/mochi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
        setCatMood('speaking');
        setTimeout(() => setCatMood('happy'), 1200);
        setTimeout(() => setCatMood('idle'), 3500);
      } else {
        setCatMood('idle');
      }

      if (data.suggestedActivities) setSuggestedActivities(data.suggestedActivities);
      if (data.suggestedPrompts) setSuggestedPrompts(data.suggestedPrompts);
    } catch {
      setCatMood('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Send Human Direct Message
  const sendHumanMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directInput.trim() || isSendingDirect) return;

    setIsSendingDirect(true);
    try {
      const recipient = directAuthor === 'emman' ? 'lei' : 'emman';
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: directAuthor,
          recipient,
          message: directInput.trim(),
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
      setIsSendingDirect(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear current Mochi conversation history?')) {
      setMessages([
        {
          role: 'assistant',
          content: 'Kumusta ulit! ✨ Fresh start under the stars. How may I guide you today?',
        },
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-xl h-[660px] rounded-3xl celestial-panel border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header with Mochi Cat Avatar & Channel Switcher */}
        <div className="p-4 px-6 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <MochiCatAvatar mood={catMood} size={54} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base text-cyan-300 font-semibold">Mochi</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-200 font-sans">
                  Celestial Familiar
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Taglish Companion &bull; Heartfelt Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeChannel === 'mochi' && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channel Switcher Tabs */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/50 px-4 py-2 gap-2 text-xs font-serif">
          <button
            type="button"
            onClick={() => setActiveChannel('mochi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeChannel === 'mochi'
                ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-200 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Mochi AI Companion</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveChannel('human')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeChannel === 'human'
                ? 'bg-amber-950 border border-sanctuary-gold/60 text-sanctuary-gold font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Chat with Emman (Direct)</span>
          </button>
        </div>

        {/* CHANNEL 1: MOCHI AI CHAT BODY */}
        {activeChannel === 'mochi' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-sanctuary-gold/20 text-sanctuary-gold-light border border-sanctuary-gold/40 rounded-tr-none'
                          : 'bg-slate-900/85 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-xs text-cyan-300 p-2">
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="font-serif italic">Mochi is reflecting under the starlight...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Pills */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Compass className="w-3.5 h-3.5 text-sanctuary-gold" />
                <span className="text-[10px] tracking-wider uppercase text-sanctuary-gold font-serif">
                  Ask Mochi:
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {(suggestedPrompts.length > 0
                  ? suggestedPrompts
                  : [
                      'What is a cozy date idea for us?',
                      'Help me write a sweet letter to Lei',
                      'Mag-suggest ka ng cozy date night',
                      'Paano pasayahin ang isa’t isa today?',
                    ]
                ).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isLoading}
                    onClick={() => sendMochiMessage(prompt)}
                    className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-cyan-400 hover:text-cyan-200 text-slate-300 text-[11px] whitespace-nowrap transition-colors cursor-pointer"
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
                sendMochiMessage(input);
              }}
              className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/90"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Talk with Mochi in English or Taglish..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-40 cursor-pointer"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* CHANNEL 2: HUMAN DIRECT CHANNEL (MESSAGE EMMAN DIRECTLY) */}
        {activeChannel === 'human' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 bg-amber-950/30 border-b border-amber-900/30 text-center">
              <span className="text-[11px] font-serif text-sanctuary-gold">
                ✨ Direct Message Channel with Emman &bull; Messages reach Emman&apos;s Console live
              </span>
            </div>

            {/* Direct Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {directMessages.length === 0 ? (
                <div className="text-center py-16 text-slate-500 font-serif text-xs">
                  No direct messages yet. Leave a note for Emman anytime!
                </div>
              ) : (
                directMessages.map((msg) => {
                  const isEmman = msg.sender === 'emman';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isEmman ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] font-serif">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold ${
                            isEmman
                              ? 'bg-amber-950 border border-sanctuary-gold/50 text-sanctuary-gold'
                              : 'bg-rose-950 border border-rose-500/50 text-rose-300'
                          }`}
                        >
                          {isEmman ? 'Emman' : 'Lei (You)'}
                        </span>
                        <span className="text-slate-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                          isEmman
                            ? 'bg-amber-950/40 text-amber-100 border border-sanctuary-gold/40 rounded-tl-none shadow-sm'
                            : 'bg-rose-950/40 text-rose-100 border border-rose-500/40 rounded-tr-none shadow-sm'
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

            {/* Direct Message Input Bar */}
            <form onSubmit={sendHumanMessage} className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/90">
              <input
                type="text"
                value={directInput}
                onChange={(e) => setDirectInput(e.target.value)}
                placeholder="Type a direct message to Emman..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-sanctuary-gold text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="submit"
                disabled={isSendingDirect || !directInput.trim()}
                className="p-2.5 rounded-xl bg-sanctuary-gold text-slate-950 hover:bg-yellow-400 transition-colors disabled:opacity-40 cursor-pointer"
                title="Send direct message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
