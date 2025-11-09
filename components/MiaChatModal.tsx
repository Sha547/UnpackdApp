
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';
import { sendMessageToMia, startMiaChat } from '../services/geminiService';
import MiaBotIcon from './icons/MiaBotIcon';

interface MiaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const renderMarkdown = (text: string, role: 'user' | 'model') => {
  const isModel = role === 'model';
  let html = text
    .replace(/\*\*(.*?)\*\*/g, `<strong class="font-semibold ${isModel ? 'text-slate-900 dark:text-slate-50' : 'text-white'}">$1</strong>`)
    .replace(/```(.*?)```/gs, (match, code) => `<pre class="bg-slate-300 dark:bg-slate-900 p-3 rounded-md my-2 text-cyan-700 dark:text-cyan-400 font-mono text-sm overflow-x-auto"><code>${code.trim()}</code></pre>`)
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br />');

  if (html.includes('<li')) {
    html = html.replace(/(<li.*<\/li>)/gs, '<ul class="space-y-2 mt-2">$1</ul>');
  }
  return { __html: html };
};

const MiaChatModal: React.FC<MiaChatModalProps> = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      startMiaChat();
      setMessages([{
        role: 'model',
        content: `Hi ${user.name}! I'm Mia, your personal AI assistant. How can I help you today?`
      }]);
    }
  }, [isOpen, user.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToMia(currentInput);
      const modelMessage: ChatMessage = { role: 'model', content: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Mia chat error:", error);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I'm having a little trouble connecting right now. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <MiaBotIcon className="w-10 h-10 text-sky-500 dark:text-sky-400" />
          <div>
            <h2 className="text-xl font-semibold font-heading text-sky-500 dark:text-sky-400">Mia</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your Personal AI Assistant</p>
          </div>
        </header>

        <div className="flex-grow p-4 overflow-y-auto space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <MiaBotIcon className="w-8 h-8 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-1" />}
              <div className={`max-w-md p-3 ${msg.role === 'model' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-lg' : 'bg-cyan-600 text-white rounded-2xl rounded-br-lg'}`}>
                <div className="prose max-w-none leading-relaxed font-sans" dangerouslySetInnerHTML={renderMarkdown(msg.content, msg.role)} />
              </div>
              {msg.role === 'user' && <img src={user.avatar} alt="You" className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1" />}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <MiaBotIcon className="w-8 h-8 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-1" />
              <div className="max-w-md p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center gap-2">
                 <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Mia anything..."
              className="w-full p-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-800 dark:text-slate-100"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-sky-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-sky-500 disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-colors">
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default MiaChatModal;