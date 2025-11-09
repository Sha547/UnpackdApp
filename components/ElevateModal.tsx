
import React from 'react';

interface ElevateModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  // onElevate: (newTopic: string) => void; // Future implementation
}

const ElevateModal: React.FC<ElevateModalProps> = ({ isOpen, onClose, topic }) => {
  if (!isOpen) return null;

  const relatedTopics = [
    `Advanced ${topic}`,
    `Practical applications of ${topic}`,
    `${topic} for experts`,
    `History of ${topic}`,
  ];

  return (
    <div className="fixed inset-0 bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold font-heading text-sky-500 dark:text-sky-400">Elevate Your Learning</h2>
        </header>
        <div className="p-6 space-y-4">
            <p className="text-slate-600 dark:text-slate-300">You're doing great! Ready to dive deeper? Explore these related topics for <span className="font-semibold text-slate-900 dark:text-slate-100">{topic}</span>:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relatedTopics.map(t => (
                    <button 
                        key={t}
                        // onClick={() => onElevate(t)}
                        className="w-full text-left p-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 hover:border-sky-500 dark:hover:border-sky-500 transition-all duration-200 text-slate-700 dark:text-slate-200"
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Maybe Later</button>
        </footer>
      </div>
    </div>
  );
};

export default ElevateModal;