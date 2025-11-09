import React, { useState, useEffect } from 'react';
import { CurriculumNode } from '../types';
import { generateNotesForTopic } from '../services/geminiService';
import BookOpenIcon from './icons/BookOpenIcon';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: CurriculumNode | null;
  mainTopic: string;
  onSaveNotes: (nodeId: string, notes: string) => void;
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

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose, node, mainTopic, onSaveNotes }) => {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && node) {
      if (node.notes) {
          setNotes(node.notes);
          return;
      }
      
      setIsLoading(true);
      setError('');
      setNotes('');

      generateNotesForTopic(mainTopic, node.topic)
        .then(generatedNotes => {
          setNotes(generatedNotes);
          onSaveNotes(node.id, generatedNotes);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : 'Failed to load notes.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, node, mainTopic, onSaveNotes]);

  if (!isOpen || !node) return null;

  return (
    <div className="fixed inset-0 bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <BookOpenIcon className="w-6 h-6 text-sky-500 dark:text-sky-400" />
          <div>
            <h2 className="text-xl font-semibold font-heading text-sky-500 dark:text-sky-400">{node.topic}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Notes from Mia</p>
          </div>
        </header>
        <div className="p-6 overflow-y-auto">
          {isLoading && <div className="text-center p-8"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div><p className="mt-2 text-slate-500 dark:text-slate-400">Generating notes...</p></div>}
          {error && <div className="text-red-600 dark:text-red-400 text-center">{error}</div>}
          {notes && (
            <div className="prose max-w-none text-slate-600 dark:text-slate-300 leading-relaxed font-sans" dangerouslySetInnerHTML={renderMarkdown(notes)} />
          )}
        </div>
        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button onClick={onClose} className="bg-sky-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-sky-500 transition-colors">Close</button>
        </footer>
      </div>
    </div>
  );
};

export default NotesModal;