'use client';
import { useChat } from 'ai/react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PresetReply } from '@/components/chat/preset-reply';
import { presetReplies } from '@/lib/config-loader';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import HelperBoost from './HelperBoost';

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool }: AvatarProps) => {
      // Conditional rendering based on detection
      return (
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          <div
            className="relative cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            <img
              src="/avater.png"
              alt="Avatar"
              className="h-full w-full object-cover object-[center] scale-100 rounded-full"
            />
          </div>
        </div>
      );
    }),
  { ssr: false }
);

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    // ease: 'easeOut',
  },
};

const Chat = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [presetReply, setPresetReply] = useState<{
    question: string;
    reply: string;
    tool: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(true);

  // Track if scroll is at bottom
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      isAtBottom.current = scrollHeight - scrollTop - clientHeight < 100;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const chatHelpers = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: () => {
      setLoadingSubmit(false);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      stop();
      console.warn('Chat error:', error);
      const errorMessage = error.message?.toLowerCase() || '';

      if (
        errorMessage.includes('quota') ||
        errorMessage.includes('exceeded') ||
        errorMessage.includes('429') ||
        errorMessage.includes('too many requests') ||
        errorMessage.includes('rate_limit') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('error occurred')
      ) {
        toast.error('⚠️ API Quota Exhausted! Free API limit reached.', {
          duration: 6000,
          style: {
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            color: '#92400e',
            fontSize: '14px',
            fontWeight: '500',
          },
        });
        setErrorMessage('quota_exhausted');
        setMessages((prev) =>
          prev.filter(m => !m.content.toLowerCase().includes('quota exhausted'))
        );
      } else if (errorMessage.includes('network')) {
        toast.error('Network error. Please check your connection.');
        setErrorMessage('Network error. Please check your connection.');
      } else {
        setErrorMessage('quota_exhausted');
        toast.error('AI service temporarily unavailable. Please try again or use presets.');
      }
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = chatHelpers;

  // Haptic feedback helper
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  // Clear chat helper
  const clearChat = () => {
    setMessages([]);
    setInput('');
    setPresetReply(null);
    setErrorMessage(null);
    setAutoSubmitted(false);
    stop();
    toast.success("Chat cleared");
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';

      if (e.key === '?' && !isInputFocused) {
        e.preventDefault();
        toast.info("Keyboard Shortcuts", {
          description: "Enter: Send Message | Esc: Clear Chat | ?: Show Help",
          duration: 4000,
        });
      }

      if (e.key === 'Escape') {
        clearChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setInput, setMessages, setPresetReply, setErrorMessage, setAutoSubmitted, stop]);

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex((m) => m.role === 'assistant');
    const latestUserMessageIndex = messages.findLastIndex((m) => m.role === 'user');

    const result = {
      currentAIMessage: latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage: latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool = result.currentAIMessage.parts?.some(
        (part) => part.type === 'tool-invocation' && part.toolInvocation?.state === 'result'
      ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isEmptyState = !currentAIMessage && !latestUserMessage && !loadingSubmit && !presetReply && !errorMessage;

  useEffect(() => {
    if (scrollRef.current && !isEmptyState) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loadingSubmit, isEmptyState]);

  const isToolInProgress = messages.some(
    (m) => m.role === 'assistant' && m.parts?.some(
      (part) => part.type === 'tool-invocation' && part.toolInvocation?.state !== 'result'
    )
  );

  const submitQuery = (query: string) => {
    if (!query?.trim() || isToolInProgress) return;
    triggerHaptic();
    setErrorMessage(null);

    if (presetReplies[query]) {
      const preset = presetReplies[query];
      setPresetReply({ question: query, reply: preset.reply, tool: preset.tool });
      setLoadingSubmit(false);
      return;
    }

    setLoadingSubmit(true);
    setPresetReply(null);
    append({ role: 'user', content: query });
  };

  const submitQueryToAI = (query: string) => {
    if (!query?.trim() || isToolInProgress) return;
    triggerHaptic();
    setErrorMessage(null);
    setLoadingSubmit(true);
    setPresetReply(null);
    append({ role: 'user', content: query });
  };

  const handlePresetReply = (question: string, reply: string, tool: string) => {
    setPresetReply({ question, reply, tool });
    setLoadingSubmit(false);
  };

  const handleGetAIResponse = (question: string) => {
    setPresetReply(null);
    submitQueryToAI(question);
  };

  useEffect(() => {
    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input?.trim() || isToolInProgress) return;
    submitQuery(input);
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
  };


  // Calculate header height based on hasActiveTool
  const headerHeight = hasActiveTool ? 100 : 200;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Fixed Avatar Header with Gradient */}
      <div
        className="fixed top-0 right-0 left-0 z-50 bg-background backdrop-blur-md h-auto min-h-[160px]"
      >
        <div className="absolute top-6 right-6">
          <ClientOnly>
            <ThemeToggle />
          </ClientOnly>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar
                hasActiveTool={hasActiveTool}
              />
            </ClientOnly>
          </div>


        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-2 pb-4 no-scrollbar"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="popLayout">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-start justify-center pt-12 md:pt-16"
                {...MOTION_CONFIG}
              >
                <ChatLanding
                  submitQuery={submitQuery}
                  handlePresetReply={handlePresetReply}
                />
              </motion.div>
            ) : (
              <div className="flex flex-col gap-6 py-4">
                {messages.map((m, index) => (
                  <motion.div
                    key={m.id || index}
                    {...MOTION_CONFIG}
                    className="flex flex-col gap-2"
                  >
                    {m.role === 'user' ? (
                      <div className="flex justify-end px-4">
                        <ChatBubble variant="sent">
                          <ChatBubbleMessage>
                            <ChatMessageContent
                              message={m}
                              isLast={index === messages.length - 1}
                              isLoading={false}
                            />
                          </ChatBubbleMessage>
                        </ChatBubble>
                      </div>
                    ) : (
                      <div className="w-full">
                        <SimplifiedChatView
                          message={m}
                          isLoading={isLoading && index === messages.length - 1}
                          reload={reload}
                          addToolResult={addToolResult}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Floating States (Preset Reply / Error / Loading) */}
                {presetReply && (
                  <div className="pb-4">
                    <PresetReply
                      question={presetReply.question}
                      reply={presetReply.reply}
                      tool={presetReply.tool}
                      onGetAIResponse={handleGetAIResponse}
                      onClose={() => setPresetReply(null)}
                    />
                  </div>
                )}

                {errorMessage && (
                  <motion.div
                    key="error"
                    {...MOTION_CONFIG}
                    className="px-4"
                  >
                    <ChatBubble variant="received">
                      <div className="flex flex-col gap-1 w-full relative">
                        <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 ml-3 mb-1 uppercase tracking-wider flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                          System Alert
                        </span>

                        <ChatBubbleMessage className="bg-amber-50/80 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 backdrop-blur-sm shadow-sm">
                          <button
                            onClick={() => setErrorMessage(null)}
                            className="absolute top-2 right-2 p-1 text-amber-400 hover:text-amber-600 transition-colors"
                            aria-label="Dismiss error"
                          >
                            <X className="h-4 w-4" />
                          </button>

                          <div className="space-y-4 p-2">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
                                  <span className="text-white text-lg">!</span>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm md:text-md">
                                  {errorMessage === 'quota_exhausted' ? 'API Quota Limit Reached' : 'Connection Interrupted'}
                                </h3>
                                <p className="text-xs text-amber-700/70 dark:text-amber-400/70">
                                  {errorMessage === 'quota_exhausted' ? 'The daily free limit for the AI model has been exceeded.' : 'We encountered a problem reaching the AI server.'}
                                </p>
                              </div>
                            </div>

                            <div className="text-xs md:text-sm text-amber-800 dark:text-amber-200 font-medium bg-white/40 dark:bg-black/20 p-3 rounded-xl border border-amber-200/30 dark:border-amber-800/20 shadow-inner">
                              {errorMessage === 'quota_exhausted' ? (
                                "I'm currently running on a limited free tier. Don't worry! You can still explore my background, projects, and contact info using the button below."
                              ) : (
                                "Please check your internet connection and try again. You can also use my preset quick questions."
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                              <button
                                onClick={() => {
                                  setErrorMessage(null);
                                  const preset = presetReplies["How can I reach you?"];
                                  if (preset) handlePresetReply("How can I reach you?", preset.reply, preset.tool);
                                }}
                                className="px-4 py-2 bg-amber-500 text-white text-xs md:text-sm rounded-xl hover:bg-amber-600 transition-all font-semibold shadow-md active:scale-95 flex items-center gap-2"
                              >
                                Get Contact Info
                              </button>
                              <button
                                onClick={() => {
                                  setErrorMessage(null);
                                  window.location.href = '/';
                                }}
                                className="px-4 py-2 bg-white/60 dark:bg-white/10 text-amber-900 dark:text-amber-100 text-xs md:text-sm rounded-xl hover:bg-white/80 dark:hover:bg-white/20 transition-all border border-amber-200 dark:border-amber-800 flex items-center gap-2 active:scale-95"
                              >
                                Return Home
                              </button>
                            </div>
                          </div>
                        </ChatBubbleMessage>
                      </div>
                    </ChatBubble>
                  </motion.div>
                )}

                {loadingSubmit && (
                  <motion.div
                    key="loading"
                    {...MOTION_CONFIG}
                    className="px-4"
                  >
                    <ChatBubble variant="received">
                      <div className="flex flex-col gap-1 w-full">
                        <span className="text-[10px] font-medium text-muted-foreground ml-3 mb-1 uppercase tracking-wider">Assistant</span>
                        <div className="flex items-center gap-3">
                          <ChatBubbleMessage isLoading />
                          <span className="text-xs text-muted-foreground animate-pulse italic">Thinking...</span>
                        </div>
                      </div>
                    </ChatBubble>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 bg-background px-2 pt-2 md:px-0">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost
              submitQuery={submitQuery}
              setInput={setInput}
              handlePresetReply={handlePresetReply}
            />
            <ChatBottombar
              input={input}
              hasMessages={messages.length > 0 || !!presetReply}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
              clearChat={clearChat}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
