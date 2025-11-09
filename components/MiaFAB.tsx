import React from 'react';
import MiaBotIcon from './icons/MiaBotIcon';

interface MiaFABProps {
  onClick: () => void;
}

const MiaFAB: React.FC<MiaFABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-white dark:bg-slate-700 rounded-full shadow-2xl shadow-sky-500/20 border-2 border-sky-500/50 flex items-center justify-center group transform transition-all duration-300 hover:scale-110 hover:shadow-sky-400/40 hover:border-sky-400"
      aria-label="Ask Mia"
    >
      <MiaBotIcon className="w-12 h-12 text-sky-500 transition-all duration-300 group-hover:text-sky-600 dark:text-sky-400 dark:group-hover:text-sky-300" />
      <div className="absolute -left-28 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg border border-slate-200 dark:border-slate-700">
        Ask Mia
      </div>
    </button>
  );
};

export default MiaFAB;