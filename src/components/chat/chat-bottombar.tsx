// src/components/chat/chat-bottombar.tsx
'use client';

import { ChatRequestOptions } from 'ai';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';

interface ChatBottombarProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  stop: () => void;
  input: string;
  hasMessages: boolean;
  isToolInProgress: boolean;
  clearChat?: () => void;
}

export default function ChatBottombar({
  input,
  hasMessages,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  isToolInProgress,
  clearChat,
}: ChatBottombarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      !e.nativeEvent.isComposing &&
      !isToolInProgress &&
      (input?.trim() ?? '')
    ) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full pb-2 md:pb-8"
    >
      <form onSubmit={handleSubmit} className="relative w-full md:px-4">
        <div className="mx-auto flex items-center rounded-full border border-border bg-muted/50 py-2 pr-2 pl-6 transition-colors focus-within:bg-muted">
          <input
            ref={inputRef}
            type="text"
            value={input || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={
              isToolInProgress ? 'Tool is in progress...' : 'Ask me anything'
            }
            className="text-md w-full border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            disabled={isToolInProgress || isLoading}
          />

          {clearChat && hasMessages && (
            <button
              type="button"
              onClick={clearChat}
              className="mr-1 flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors active:scale-90"
              title="Clear Chat"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !(input?.trim()) || isToolInProgress}
            className="flex items-center justify-center rounded-full bg-[#0171E3] p-2 text-white disabled:opacity-50"
            onClick={(e) => {
              if (isLoading) {
                e.preventDefault();
                stop();
              }
            }}
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
