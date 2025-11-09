import React, { useState } from 'react';
import { CurriculumNode as CurriculumNodeType } from '../types';
import CheckIcon from './icons/CheckIcon';
import NotesIcon from './icons/NotesIcon';
import BookmarkIcon from './icons/BookmarkIcon';

interface CurriculumNodeProps {
  node: CurriculumNodeType;
  onToggleComplete: (nodeId: string) => void;
  onViewNotes: (node: CurriculumNodeType) => void;
  onToggleBookmark: (nodeId: string) => void;
  nodePath: string;
}

const CurriculumNode: React.FC<CurriculumNodeProps> = ({ node, onToggleComplete, onViewNotes, onToggleBookmark, nodePath }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={`ml-4 pl-4 border-l-2 ${node.isCompleted ? 'border-sky-500' : 'border-slate-200 dark:border-slate-700'}`}>
      <div className="relative flex items-center group my-2">
        <div className="flex-shrink-0 flex items-center">
          <button
            onClick={() => onToggleComplete(node.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${node.isCompleted ? 'bg-sky-500 border-sky-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-transparent group-hover:border-sky-400'}`}
          >
            {node.isCompleted && <CheckIcon className="w-4 h-4" />}
          </button>
          <span className="ml-4 font-mono text-sm text-slate-400 dark:text-slate-500 w-10">{nodePath}</span>
        </div>
        <div className="ml-4 flex-grow">
          <h3 className={`font-semibold text-lg ${node.isCompleted ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
            {node.topic}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{node.summary}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onToggleBookmark(node.id)}
            className={`p-2 rounded-full transition-colors ${
              node.isBookmarked
                ? 'text-sky-500 bg-sky-100 dark:bg-sky-500/20'
                : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-sky-500 dark:hover:text-sky-400'
            }`}
            title={node.isBookmarked ? 'Remove bookmark' : 'Bookmark topic'}
          >
            <BookmarkIcon className={`w-5 h-5 ${node.isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onViewNotes(node)}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            title="View Notes"
          >
            <NotesIcon className="w-5 h-5" />
          </button>
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-transform duration-300"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
          )}
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-2">
          {node.children.map((child, index) => (
            <CurriculumNode
              key={child.id}
              node={child}
              onToggleComplete={onToggleComplete}
              onViewNotes={onViewNotes}
              onToggleBookmark={onToggleBookmark}
              nodePath={`${nodePath}.${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CurriculumNode;