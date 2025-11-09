import React from 'react';
import { HistoryItem } from '../types';
import HistoryIcon from './icons/HistoryIcon';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onLoadHistory }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-100/60 dark:bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3">
                <HistoryIcon className="w-6 h-6 text-sky-500 dark:text-sky-400" />
                <h2 className="text-xl font-semibold font-heading text-slate-800 dark:text-slate-100">Your History</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          <div className="overflow-y-auto flex-grow p-4">
            {history.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 h-full flex flex-col items-center justify-center">
                 <p className="text-lg">No history yet.</p>
                 <p className="text-sm">Create a new learning path to get started!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {history.map((item) => (
                  <li key={item.id}>
                    <button 
                        onClick={() => onLoadHistory(item)}
                        className="w-full text-left p-4 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-sky-500 dark:hover:border-sky-500 transition-all duration-200"
                    >
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{item.topic}</p>
                      <div className="flex items-center justify-between mt-1 text-sm text-slate-500 dark:text-slate-400">
                          <span>{item.date}</span>
                          <span className="capitalize px-2 py-0.5 bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 rounded-full text-xs font-medium">{item.level}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default HistorySidebar;