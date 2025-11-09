
import React from 'react';

interface QuoteDisplayProps {
  quote: {
    text: string;
    author: string;
  };
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <blockquote className="p-4 border-l-4 border-sky-500/50 bg-slate-100/50 dark:bg-slate-800/50 rounded-r-lg">
        <p className="text-lg italic text-slate-600 dark:text-slate-300">
          "{quote.text}"
        </p>
      </blockquote>
      <p className="mt-2 text-right text-slate-500 dark:text-slate-400 font-medium">
        — {quote.author}
      </p>
    </div>
  );
};

export default QuoteDisplay;
