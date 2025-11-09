import React, { useState } from 'react';
import { generateMathExplanation } from '../services/geminiService';

interface MathLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const renderMarkdown = (text: string) => {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-slate-100">$1</strong>')
    .replace(/```(.*?)```/gs, (match, code) => `<pre class="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-md my-2 text-cyan-600 dark:text-cyan-400 font-mono text-sm overflow-x-auto"><code>${code.trim()}</code></pre>`)
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br />');

  if (html.includes('<li')) {
    html = html.replace(/(<li.*<\/li>)/gs, '<ul class="space-y-2">$1</ul>');
  }
  return { __html: html };
};


const MathLabModal: React.FC<MathLabModalProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsLoading(true);
    setError('');
    setExplanation('');
    try {
      const result = await generateMathExplanation(topic);
      setExplanation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get explanation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-semibold font-heading text-sky-500 dark:text-sky-400">Math Lab</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </header>
        <div className="p-6 overflow-y-auto space-y-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., 'Pythagorean Theorem', 'Derivatives'" className="w-full p-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-800 dark:text-slate-100" disabled={isLoading} />
            <button type="submit" disabled={isLoading} className="bg-sky-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-sky-500 disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-colors">Explain</button>
          </form>
          {isLoading && <div className="text-center p-8"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div><p className="mt-2 text-slate-500 dark:text-slate-400">Calculating...</p></div>}
          {error && <div className="text-red-600 dark:text-red-400 text-center">{error}</div>}
          {explanation && (
            <div className="prose max-w-none text-slate-600 dark:text-slate-300 leading-relaxed font-sans" dangerouslySetInnerHTML={renderMarkdown(explanation)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MathLabModal;