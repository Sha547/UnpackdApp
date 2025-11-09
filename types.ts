
export interface CurriculumNode {
  id: string;
  topic: string;
  summary: string;
  isCompleted: boolean;
  notes?: string;
  isBookmarked?: boolean;
  children: CurriculumNode[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
}

export interface HistoryItem {
  id: string;
  topic: string;
  level: string;
  date: string;
  curriculum: CurriculumNode[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface BookmarkedItem {
  node: CurriculumNode;
  parentHistoryItem: HistoryItem;
}
