import React, { useState, useEffect } from 'react';

interface WelcomeToastProps {
  message: string;
  show: boolean;
}

const WelcomeToast: React.FC<WelcomeToastProps> = ({ message, show }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Mount with visibility
      setIsVisible(true);
    } else {
      // Unmount with fade-out
      setIsVisible(false);
    }
  }, [show]);

  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
      }`}
    >
      <div className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-md border border-sky-500/50 rounded-lg shadow-2xl shadow-sky-500/20 px-6 py-3">
        <p className="text-white font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default WelcomeToast;