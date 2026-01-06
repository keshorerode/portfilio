'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, X, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';

// Import the same components that AI responses use
import { Presentation } from '@/components/presentation';
import AllProjects from '@/components/projects/AllProjects';
import Skills from '@/components/skills';
import { Contact } from '@/components/contact';
import Resume from '@/components/resume';
import AvailabilityCard from '@/components/AvailabilityCard';

interface PresetReplyProps {
  question: string;
  reply: string;
  tool: string;
  onGetAIResponse: (question: string, tool: string) => void;
  onClose?: () => void;
}

export function PresetReply({ question, reply, tool, onGetAIResponse, onClose }: PresetReplyProps) {
  const [showAIOption, setShowAIOption] = useState(true);

  const handleGetAIResponse = () => {
    setShowAIOption(false);
    onGetAIResponse(question, tool);
  };

  // Render the same components as AI responses for better consistency
  const renderPresetComponent = () => {
    switch (tool) {
      case 'getPresentation':
        return (
          <div className="w-full overflow-hidden rounded-lg mb-4">
            <Presentation />
          </div>
        );

      case 'getProjects':
        return (
          <div className="w-full overflow-hidden rounded-lg mb-4">
            <AllProjects />
          </div>
        );

      case 'getSkills':
        return (
          <div className="w-full rounded-lg mb-4">
            <Skills />
          </div>
        );

      case 'getContact':
        return (
          <div className="w-full rounded-lg mb-4">
            <Contact />
          </div>
        );

      case 'getResume':
        return (
          <div className="w-full rounded-lg mb-4">
            <Resume />
          </div>
        );

      case 'getInternship':
        return (
          <div className="w-full rounded-lg mb-4">
            <AvailabilityCard />
          </div>
        );

      default:
        return null;
    }
  };

  const presetComponent = renderPresetComponent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto mb-4"
    >
      {/* If we have a component to render, show it like AI responses */}
      {presetComponent ? (
        <div className="w-full space-y-4">
          {/* Render the component */}
          {presetComponent}

          {/* Only show AI option when there's a major component - no text needed */}
          {showAIOption && (
            <ChatBubble variant="received">
              <ChatBubbleMessage className="bg-muted/80 backdrop-blur-sm w-full border-border">
                <div className="space-y-3 p-6 w-full">
                  {onClose && (
                    <div className="flex justify-end">
                      <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-accent rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 px-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                          <Zap className="w-3 h-3 flex-shrink-0" />
                          <span>Preset Response</span>
                        </div>
                        <span className="text-xs text-muted-foreground">• I implemented this to save API quota</span>
                      </div>
                      <Button
                        onClick={handleGetAIResponse}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600 hover:text-white shadow-sm transition-all duration-200 hover:shadow-md self-start sm:self-auto"
                      >
                        <Sparkles className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        Get AI Response
                      </Button>
                    </div>
                  </div>
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          )}
        </div>
      ) : (        // Fallback to text-based preset for tools without components
        <ChatBubble variant="received">
          <ChatBubbleMessage className="bg-muted w-full border-border">
            <div className="space-y-4 p-6 w-full">
              {/* Close button */}
              {onClose && (
                <div className="flex justify-end">
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-accent rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Reply content with enhanced formatting */}
              <div className="prose prose-sm max-w-none text-foreground px-2">
                {reply.split('\n').map((line, index) => {
                  if (line.trim() === '') return <br key={index} />;

                  // Handle download link specially
                  if (line.includes('Download Resume Here') && line.includes('http')) {
                    const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
                    if (urlMatch) {
                      return (
                        <div key={index} className="mb-4 p-4 bg-accent/50 rounded-xl border border-border shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <Download className="w-4 h-4 text-primary-foreground" />
                              </div>
                              <div>
                                <span className="font-semibold text-foreground block">Resume Available</span>
                                <span className="text-xs text-muted-foreground">Click to download PDF</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => window.open(urlMatch[1], '_blank')}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
                              size="sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      );
                    }
                  }

                  // Handle regular links
                  if (line.includes('http')) {
                    const parts = line.split(/(https?:\/\/[^\s]+)/);
                    return (
                      <p key={index} className="mb-3 last:mb-0 leading-relaxed">
                        {parts.map((part, partIndex) => {
                          if (part.match(/^https?:\/\//)) {
                            return (
                              <a
                                key={partIndex}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline decoration-2 underline-offset-2 font-medium"
                              >
                                {part}
                              </a>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  }

                  // Handle bold markdown
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={index} className="mb-3 last:mb-0 leading-relaxed">
                        {parts.map((part, partIndex) =>
                          partIndex % 2 === 1 ?
                            <strong key={partIndex} className="font-semibold text-gray-800 dark:text-gray-200">{part}</strong> :
                            part
                        )}
                      </p>
                    );
                  }

                  // Handle emoji lines (headers)
                  if (/^[🎯🚀💼🏆📊🔧🌟💡🎓📍🌍⚡🤝]/u.test(line)) {
                    return (
                      <p key={index} className="mb-2 last:mb-0 font-medium text-gray-800 dark:text-gray-200 text-base">
                        {line}
                      </p>
                    );
                  }

                  // Handle bullet points
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return (
                      <p key={index} className="mb-1 last:mb-0 ml-4 text-muted-foreground">
                        {line}
                      </p>
                    );
                  }

                  return (
                    <p key={index} className="mb-2 last:mb-0 leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>

              {/* Enhanced AI option */}
              {showAIOption && (
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                          <Zap className="w-3 h-3 flex-shrink-0" />
                          <span>Optimized Response</span>
                        </div>
                        <span className="text-xs text-muted-foreground">• I implemented this to save API quota</span>
                      </div>
                      <Button
                        onClick={handleGetAIResponse}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600 hover:text-white shadow-sm transition-all duration-200 hover:shadow-md self-start sm:self-auto"
                      >
                        <Sparkles className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        Get AI Response
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ChatBubbleMessage>
        </ChatBubble>
      )}
    </motion.div>
  );
}
