
import React, { useState, useRef, useEffect } from 'react';
import { Message, Client } from '../types';
import { openAIService } from '../services/openAIService';

interface AssistantViewProps {
  onOpenMenu: () => void;
  clients: Client[];
}

const AssistantView: React.FC<AssistantViewProps> = ({ onOpenMenu, clients }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `I'm your CRM AI Assistant. I have access to ${clients.length} client records. Ask me to find leads, analyze your pipeline, or help with follow-ups!`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update welcome message when clients change
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `I'm your CRM AI Assistant. I have access to ${clients.length} client records. Ask me to find leads, analyze your pipeline, or help with follow-ups!`,
        timestamp: Date.now()
      }]);
    }
  }, [clients.length]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const responseContent = await openAIService.sendMessage(currentInput, clients);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: Date.now()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden w-full">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 shrink-0 w-full">
        <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
          <button onClick={onOpenMenu} className="lg:hidden text-slate-900 dark:text-white p-1 shrink-0">
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
          <div className="flex flex-col items-center flex-1 min-w-0 px-2">
            <h2 className="text-xl font-bold truncate">AI Assistant</h2>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0"></span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold truncate">OpenAI GPT • {clients.length} Clients</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <span className="material-symbols-outlined text-sm text-primary">psychology</span>
            <span className="text-xs font-bold text-slate-500">Live Context</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-32 w-full">
        <div className="max-w-3xl mx-auto w-full overflow-x-hidden">
          <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center gap-3">
            <div className="size-16 md:size-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-2 shadow-inner">
              <span className="material-symbols-outlined text-primary text-4xl md:text-5xl">auto_awesome</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold px-4">Ready to help you scale, Agent</h3>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md px-4">I have analyzed your CRM data. Ask me to find leads, draft emails, or summarize your week.</p>
          </div>

          <div className="space-y-4 md:space-y-6 w-full">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2 md:gap-4 w-full ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="bg-primary text-white rounded-2xl size-8 md:size-10 shrink-0 flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-xl md:text-2xl">smart_toy</span>
                  </div>
                )}
                <div className={`flex flex-col gap-1.5 min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[80%]`}>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{msg.role === 'assistant' ? 'CRM ASSISTANT' : 'YOU'}</p>
                  <div className={`text-sm md:text-base px-4 py-3 md:px-5 md:py-4 rounded-2xl md:rounded-3xl shadow-sm leading-relaxed break-words overflow-hidden ${msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-gray-100 dark:border-gray-700'
                    }`}>
                    {msg.content}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="size-8 md:size-10 rounded-2xl overflow-hidden border-2 border-primary/20 shrink-0">
                    <img src="https://picsum.photos/seed/user/100" className="w-full h-full object-cover" alt="User" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 ml-10 md:ml-14">
                <span className="text-sm font-bold animate-pulse">Assistant is thinking...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-3 md:p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-3xl mx-auto w-full">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-400 rounded-2xl md:rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition-opacity" />
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 p-2 shadow-xl">
              <button className="p-2 md:p-3 text-slate-400 hover:text-primary transition-colors hidden md:block">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base py-2 md:py-3 px-2 md:px-3 outline-none dark:text-white min-w-0"
                placeholder="Ask AI Assistant..."
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg md:rounded-xl py-2 md:py-3 px-4 md:px-6 shadow-lg active:scale-95 transition-all flex items-center gap-1 md:gap-2 font-bold shrink-0"
              >
                <span className="hidden md:inline">Send</span>
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantView;
