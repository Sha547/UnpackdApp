import React, { useEffect } from 'react';
import MiaBotIcon from './icons/MiaBotIcon';

interface MotivationModalProps {
  message: string | null;
  onClose: () => void;
}

const MotivationModal: React.FC<MotivationModalProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 7000); // Auto-close after 7 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 border-2 border-sky-500/50 dark:border-sky-400/50 rounded-2xl shadow-2xl w-full max-w-md text-center p-8 relative overflow-hidden transform transition-all animate-pop-in"
        onClick={e => e.stopPropagation()}
      >
        <MiaBotIcon className="w-40 h-40 mx-auto -mt-24 mb-2 text-sky-500 dark:text-sky-400" />
        <h2 className="text-3xl font-bold font-heading text-slate-800 dark:text-slate-100">{message}</h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2">You're making incredible progress!</p>
        <button 
          onClick={onClose} 
          className="mt-8 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold py-3 px-8 rounded-lg hover:from-sky-500 hover:to-cyan-400 transition-all transform hover:-translate-y-px shadow-lg hover:shadow-sky-500/30"
        >
          Continue
        </button>
      </div>
       <style>{`
        @keyframes pop-in {
            0% { transform: scale(0.7) translateY(20px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default MotivationModal;