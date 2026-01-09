'use client';

import { motion } from 'framer-motion';
import { Award, Code, Mail, MessageSquare, Briefcase } from 'lucide-react';
import React from 'react';
import { DecryptingText } from '@/components/ui/decrypting-text';
import { presetReplies } from '@/lib/config-loader';

interface ChatLandingProps {
  submitQuery: (query: string) => void;
  handlePresetReply?: (question: string, reply: string, tool: string) => void;
}

const ChatLanding: React.FC<ChatLandingProps> = ({ submitQuery, handlePresetReply }) => {
  const suggestedQuestions = [
    { icon: <MessageSquare className="h-4 w-4" />, text: 'Who are you?' },
    { icon: <Code className="h-4 w-4" />, text: 'What projects are you most proud of?' },
    { icon: <Award className="h-4 w-4" />, text: 'What are your skills?' },
    { icon: <Briefcase className="h-4 w-4" />, text: 'Am I available for opportunities?' },
    { icon: <Mail className="h-4 w-4" />, text: 'How can I reach you?' },
  ];

  const handleQuestionClick = (questionText: string) => {
    const preset = presetReplies[questionText as keyof typeof presetReplies];
    if (preset && handlePresetReply) {
      handlePresetReply(questionText, preset.reply, preset.tool);
    } else {
      submitQuery(questionText);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="flex w-full flex-col items-center px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header section */}
      <motion.div className="text-center mb-6" variants={itemVariants}>
        <h2 className="mb-1 text-2xl md:text-3xl font-bold tracking-tight">
          I'm Keshore's Assistant
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Begin your interview.
        </p>
      </motion.div>

      {/* Quote section */}
      <motion.div className="mb-4 text-center max-w-xs" variants={itemVariants}>
        <p className="font-mono text-[9px] text-muted-foreground/80 uppercase tracking-widest leading-relaxed italic mb-3">
          "A show of disrespect is one of the most powerful weapons a person can use"
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="h-[1px] w-3 bg-muted-foreground/20" />
          <div className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-[0.2em] whitespace-nowrap">
            <DecryptingText targetText="Keshore Venkatachalam Murugesan" speed={3} />
          </div>
          <div className="h-[1px] w-3 bg-muted-foreground/20" />
        </div>
      </motion.div>

      {/* Available for Opportunities pill */}
      <motion.div className="mb-10" variants={itemVariants}>
        <motion.button
          onClick={() => handleQuestionClick('Am I available for opportunities?')}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-white dark:bg-zinc-900 shadow-sm transition-all cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium text-foreground">Available for Opportunities</span>
        </motion.button>
      </motion.div>

      {/* Common Questions Label */}
      <motion.div className="w-full max-w-md mb-2 px-1" variants={itemVariants}>
        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">Common Questions</span>
      </motion.div>

      {/* Suggested questions */}
      <motion.div
        className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-3"
        variants={containerVariants}
      >
        {suggestedQuestions.map((question, index) => (
          <motion.button
            key={index}
            className="flex items-center gap-3 bg-card/40 hover:bg-card border border-border/60 rounded-xl px-4 py-3 transition-all text-left shadow-sm hover:shadow-md"
            onClick={() => handleQuestionClick(question.text)}
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="bg-muted p-2 rounded-lg text-muted-foreground">
              {question.icon}
            </span>
            <span className="text-xs font-semibold text-foreground/80">{question.text}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChatLanding;
