'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { en: 'Ganga Aarti Timings?', hi: 'गंगा आरती का समय?' },
  { en: 'Fair Boat Rates?', hi: 'नाव का उचित किराया?' },
  { en: 'Kashi Vishwanath Dress Code?', hi: 'काशी विश्वनाथ मंदिर के नियम?' },
  { en: 'Best Chaat & Lassi spots?', hi: 'प्रसिद्ध चाट व लस्सी कहाँ मिलेगी?' },
];

export function KashiMitraChat() {
  const { isHindi } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const counterRef = useRef(1);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-init',
      sender: 'bot',
      text: isHindi
        ? '🙏 नमस्ते! मैं **काशी मित्र** हूँ, आपका वाराणसी AI साथी। गंगा आरती, मंदिर दर्शन, नौका किराया या प्रसिद्ध खान-पान के बारे में मुझसे कुछ भी पूछें!'
        : '🙏 Namaste! I am **Kashi Mitra**, your AI Varanasi companion. Ask me anything about Ganga Aarti timings, temple darshan, fair boat rates, or authentic food!',
      timestamp: 'Today',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    const userCount = counterRef.current++;
    const userMsg: Message = {
      id: `user-${userCount}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      const botReply = data.reply || (isHindi ? 'क्षमा करें, प्रतिक्रिया प्राप्त नहीं हो सकी।' : 'Sorry, could not fetch response.');

      const botCount = counterRef.current++;
      const botMsg: Message = {
        id: `bot-${botCount}`,
        sender: 'bot',
        text: botReply,
        timestamp: 'Just now',
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errCount = counterRef.current++;
      const errorMsg: Message = {
        id: `bot-err-${errCount}`,
        sender: 'bot',
        text: isHindi
          ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।'
          : 'Network error. Please check connection and try again.',
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    const resetCount = counterRef.current++;
    setMessages([
      {
        id: `welcome-reset-${resetCount}`,
        sender: 'bot',
        text: isHindi
          ? '🙏 बातचीत रीसेट हो गई है। आप क्या जानना चाहते हैं?'
          : '🙏 Chat reset. How may I assist your Varanasi journey today?',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#172554] via-[#0E7490] to-[#F59E0B] p-[2px] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            aria-label="Open Kashi Mitra AI Assistant"
          >
            <div className="flex items-center gap-2 rounded-full bg-[#172554] px-4 py-2.5 text-xs font-bold text-white">
              <Bot className="w-4 h-4 text-[#F59E0B] animate-bounce" />
              <span>{isHindi ? 'काशी मित्र AI' : 'Kashi Mitra AI'}</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] max-h-[85vh] flex flex-col rounded-3xl border border-[#E8D9C0] dark:border-slate-800 bg-[#FAF9F6] dark:bg-slate-950 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#172554] text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0E7490] text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <span>{isHindi ? 'काशी मित्र' : 'Kashi Mitra'}</span>
                  <span className="rounded-md bg-emerald-500/20 px-1 py-0.2 text-[9px] font-mono text-emerald-300 border border-emerald-400/30">
                    AI Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-300">
                  {isHindi ? 'वाराणसी नगर गाइड' : 'Varanasi City Guide'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-2 border-b border-[#E8D9C0] dark:border-slate-800 bg-[#FAF6EF] dark:bg-slate-900/60 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendMessage(isHindi ? prompt.hi : prompt.en)}
                className="shrink-0 rounded-full border border-[#E8D9C0] dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0E7490] hover:text-[#0E7490] dark:hover:text-[#38BDF8] transition-colors"
              >
                {isHindi ? prompt.hi : prompt.en}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#172554] dark:bg-cyan-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-[#E8D9C0] dark:border-slate-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-2xl w-fit border border-[#E8D9C0] dark:border-slate-800">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0E7490] dark:text-[#38BDF8]" />
                <span>{isHindi ? 'काशी मित्र सोच रहा है...' : 'Kashi Mitra is thinking...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-[#E8D9C0] dark:border-slate-800 bg-[#FAF6EF] dark:bg-slate-900">
            <div className="flex items-center gap-2 rounded-full border border-[#E8D9C0] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 shadow-xs focus-within:border-[#0E7490] focus-within:ring-1 focus-within:ring-[#0E7490]">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isHindi ? 'काशी के बारे में पूछें...' : 'Ask Kashi Mitra anything...'}
                className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#172554] dark:bg-cyan-600 text-white hover:bg-[#1E3A8A] disabled:opacity-40 disabled:hover:bg-[#172554] transition-colors"
                title="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
