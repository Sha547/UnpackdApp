
import React, { useState } from 'react';
import UploadIcon from './icons/UploadIcon';

interface TopicFormProps {
  onGenerate: (topic: string, level: string) => void;
  onOpenUpload: () => void;
  isLoading: boolean;
}

const TopicForm: React.FC<TopicFormProps> = ({ onGenerate, onOpenUpload, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, level);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to learn today? (e.g., 'React Hooks')"
          className="flex-grow p-4 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          disabled={isLoading}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="p-4 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-900 dark:text-slate-100 md:w-48"
          disabled={isLoading}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <button
          type="submit"
          className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold py-4 px-6 rounded-lg hover:from-sky-500 hover:to-cyan-400 transition-all transform hover:-translate-y-px shadow-lg hover:shadow-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? 'Generating...' : 'Create Path'}
        </button>
         <button
          type="button"
          onClick={onOpenUpload}
          className="bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300 font-bold py-4 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-100 hover:border-sky-500 dark:hover:border-sky-500 transition-all transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <UploadIcon className="w-6 h-6 mx-auto" />
        </button>
      </div>
    </form>
  );
};

export default TopicForm;