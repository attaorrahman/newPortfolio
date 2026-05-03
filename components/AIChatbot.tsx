"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiPaperAirplane, HiSparkles } from "react-icons/hi";
import { RiRobot2Fill } from "react-icons/ri";
import {
  chatbotGreeting,
  getBotReply,
  suggestedPrompts,
} from "@/lib/chatbot";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
};

const formatMarkdown = (text: string) => {
  // Minimal markdown: **bold**, [text](url), newlines
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline underline-offset-2">$1</a>'
    )
    .replace(/\n/g, "<br/>");
};

const newId = () => Math.random().toString(36).slice(2, 10);

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AIChatbot({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: newId(), role: "bot", text: chatbotGreeting },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    const value = text.trim();
    if (!value) return;

    const userMsg: Message = { id: newId(), role: "user", text: value };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const reply = getBotReply(value);
    const delay = 500 + Math.min(reply.length * 8, 1100);

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: newId(), role: "bot", text: reply },
      ]);
      setTyping(false);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9991] sm:hidden"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-label="AI assistant chat"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed z-[9992] flex flex-col overflow-hidden bg-white shadow-2xl border border-gray-200
                       inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-24 sm:right-5
                       sm:w-[380px] sm:max-w-[calc(100vw-2rem)] h-[80vh] sm:h-[560px]
                       rounded-2xl"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-navy via-navy-light to-navy-dark text-white px-5 py-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <RiRobot2Fill className="text-xl" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm flex items-center gap-1.5">
                  Atta's AI Assistant
                  <HiSparkles className="text-primary text-base" />
                </div>
                <div className="text-[11px] text-white/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online · Replies instantly
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <HiX className="text-xl" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-gray-50 to-white"
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {typing && <TypingIndicator />}

              {messages.length <= 1 && !typing && (
                <div className="pt-2">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-2 px-1">
                    Suggested
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => sendMessage(s)}
                        className="text-xs bg-white hover:bg-primary hover:text-white border border-gray-200 hover:border-primary text-navy px-3 py-1.5 rounded-full transition-colors shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-100 p-3 bg-white flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about Atta..."
                className="flex-1 bg-gray-50 focus:bg-white border border-gray-200 focus:border-primary rounded-full px-4 py-2.5 text-sm outline-none transition-colors"
                aria-label="Message"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <HiPaperAirplane className="text-base rotate-90" />
              </button>
            </form>

            <div className="text-[10px] text-center text-text-muted bg-white pb-2">
              Powered by AI · Trained on Atta's portfolio
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shrink-0 shadow-md">
          <RiRobot2Fill className="text-sm" />
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-primary to-accent text-white rounded-br-md"
            : "bg-white border border-gray-100 text-navy rounded-bl-md"
        }`}
        dangerouslySetInnerHTML={{ __html: formatMarkdown(message.text) }}
      />
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start gap-2"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shrink-0 shadow-md">
        <RiRobot2Fill className="text-sm" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <Dot delay={0} />
          <Dot delay={0.15} />
          <Dot delay={0.3} />
        </div>
      </div>
    </motion.div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
      className="w-1.5 h-1.5 rounded-full bg-primary"
    />
  );
}
