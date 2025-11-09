import React from 'react';
import { CurriculumNode as CurriculumNodeType } from '../types';
import CurriculumNode from './CurriculumNode';
import ProgressBar from './ProgressBar';

interface CurriculumDisplayProps {
  curriculum: CurriculumNodeType[];
  onToggleComplete: (nodeId: string) => void;
  onViewNotes: (node: CurriculumNodeType) => void;
  onToggleBookmark: (nodeId: string) => void;
  completedCount: number;
  totalCount: number;
}

const CurriculumDisplay: React.FC<CurriculumDisplayProps> = ({ curriculum, onToggleComplete, onViewNotes, onToggleBookmark, completedCount, totalCount }) => {
  return (
    <div className="p-4 md:p-6 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg backdrop-blur-sm">
        <header className="mb-4">
            <h2 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100">Your Learning Path</h2>
            <div className="flex items-center gap-4 mt-2">
                <ProgressBar completed={completedCount} total={totalCount} />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex-shrink-0">{completedCount} / {totalCount} Completed</span>
            </div>
        </header>
        <div className="space-y-4">
            {curriculum.map((node, index) => (
                <CurriculumNode
                    key={node.id}
                    node={node}
                    onToggleComplete={onToggleComplete}
                    onViewNotes={onViewNotes}
                    onToggleBookmark={onToggleBookmark}
                    nodePath={(index + 1).toString()}
                />
            ))}
        </div>
    </div>
  );
};

export default CurriculumDisplay;