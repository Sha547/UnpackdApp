
import React, { useState, useEffect, useMemo } from 'react';
import TopicForm from './components/TopicForm';
import CurriculumDisplay from './components/CurriculumDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { generateCurriculum } from './services/geminiService';
import { CurriculumNode, HistoryItem, User, BookmarkedItem } from './types';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import HistorySidebar from './components/HistorySidebar';
import HistoryIcon from './components/icons/HistoryIcon';
import NotesModal from './components/NotesModal';
import { compliments } from './utils/compliments';
import { quotes } from './utils/quotes';
import MotivationModal from './components/MotivationModal';
import ElevateModal from './components/ElevateModal';
import { defaultAvatars } from './utils/avatars';
import MiaFAB from './components/MiaFAB';
import MiaChatModal from './components/MiaChatModal';
import MathLabModal from './components/MathLabModal';
import MathIcon from './components/icons/MathIcon';
import UploadModal from './components/UploadModal';
import WelcomeToast from './components/WelcomeToast';
import BookmarksSidebar from './components/BookmarksSidebar';
import BookmarkListIcon from './components/icons/BookmarkListIcon';
import QuoteDisplay from './components/QuoteDisplay';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [viewingNotesFor, setViewingNotesFor] = useState<CurriculumNode | null>(null);
  const [motivationMessage, setMotivationMessage] = useState<string | null>(null);
  const [isElevateModalOpen, setIsElevateModalOpen] = useState(false);
  const [isMiaChatOpen, setIsMiaChatOpen] = useState(false);
  const [isMathLabOpen, setIsMathLabOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('unpackd_theme', theme);
  }, [theme]);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    const savedTheme = localStorage.getItem('unpackd_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
    }

    try {
      const savedUser = localStorage.getItem('unpackd_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
      const savedHistory = localStorage.getItem('unpackd_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedCurriculum = localStorage.getItem('unpackd_curriculum');
      if (savedCurriculum) {
          const parsed = JSON.parse(savedCurriculum);
          setCurriculum(parsed.curriculum);
          setCurrentTopic(parsed.topic);
          setCurrentLevel(parsed.level);
          setActiveHistoryId(parsed.historyId ?? null);
      }
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('unpackd_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('unpackd_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (curriculum.length > 0) {
        const dataToSave = {
            topic: currentTopic,
            level: currentLevel,
            curriculum: curriculum,
            historyId: activeHistoryId
        };
        localStorage.setItem('unpackd_curriculum', JSON.stringify(dataToSave));
    }
  }, [curriculum, currentTopic, currentLevel, activeHistoryId]);
  
  // This effect ensures that changes to the currently active curriculum (e.g., completing a node, bookmarking)
  // are persisted back into the history list in state, which then gets saved to localStorage.
  useEffect(() => {
    if (activeHistoryId && curriculum.length > 0) {
        setHistory(prevHistory => {
            const isPresent = prevHistory.some(item => item.id === activeHistoryId);
            if (!isPresent) return prevHistory;

            return prevHistory.map(item =>
                item.id === activeHistoryId ? { ...item, curriculum: curriculum } : item
            );
        });
    }
  }, [curriculum, activeHistoryId]);

  const handleLogin = (newUser: User) => {
    const userToSet = {
        ...newUser,
        avatar: newUser.avatar || defaultAvatars[0]
    };
    setUser(userToSet);
    setWelcomeMessage(`Welcome, ${userToSet.name}!`);
    setShowWelcomeToast(true);
    setTimeout(() => setShowWelcomeToast(false), 3000);
  };

  const handleLogout = () => {
    setUser(null);
    setCurriculum([]);
    setCurrentTopic('');
    setActiveHistoryId(null);
    localStorage.removeItem('unpackd_user');
    localStorage.removeItem('unpackd_curriculum');
  };

  const handleGenerate = async (topic: string, level: string, image?: { data: string, mimeType: string }) => {
    setIsLoading(true);
    setError(null);
    setCurriculum([]);
    setIsUploadModalOpen(false);

    try {
      const newCurriculum = await generateCurriculum(topic, level, image);
      setCurriculum(newCurriculum);
      setCurrentTopic(topic);
      setCurrentLevel(level);

      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        topic,
        level,
        date: new Date().toLocaleDateString(),
        curriculum: newCurriculum,
      };
      setHistory(prev => [newHistoryItem, ...prev]);
      setActiveHistoryId(newHistoryItem.id);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const countNodes = (nodes: CurriculumNode[]): number => {
      return nodes.reduce((acc, node) => 1 + acc + countNodes(node.children), 0);
  };

  const countCompletedNodes = (nodes: CurriculumNode[]): number => {
    return nodes.reduce((acc, node) => (node.isCompleted ? 1 : 0) + acc + countCompletedNodes(node.children), 0);
  };

  const updateNodeRecursively = (nodes: CurriculumNode[], id: string, updateFn: (node: CurriculumNode) => CurriculumNode): CurriculumNode[] => {
    return nodes.map(node => {
        if (node.id === id) {
            return updateFn(node);
        }
        if (node.children) {
            return { ...node, children: updateNodeRecursively(node.children, id, updateFn) };
        }
        return node;
    });
  };

  const handleToggleComplete = (nodeId: string) => {
    const wasCompleted = !!findNode(curriculum, nodeId)?.isCompleted;
    const newCurriculum = updateNodeRecursively(curriculum, nodeId, node => ({ ...node, isCompleted: !node.isCompleted }));
    setCurriculum(newCurriculum);
    
    if (!wasCompleted && user) {
        setUser(u => u ? ({ ...u, points: u.points + 10 }) : null);
        const newCompletedCount = countCompletedNodes(newCurriculum);
        const totalCount = countNodes(newCurriculum);
        if (newCompletedCount > 0 && newCompletedCount % 5 === 0) {
            setMotivationMessage(compliments[Math.floor(Math.random() * compliments.length)]);
        }
        if (newCompletedCount > 0 && newCompletedCount === Math.floor(totalCount / 2)) {
            setIsElevateModalOpen(true);
        }
    }
  };
  
  const findNode = (nodes: CurriculumNode[], id: string): CurriculumNode | null => {
      for (const node of nodes) {
          if (node.id === id) return node;
          const found = findNode(node.children, id);
          if (found) return found;
      }
      return null;
  };

  const handleToggleBookmark = (nodeId: string) => {
    const newCurriculum = updateNodeRecursively(curriculum, nodeId, node => ({ ...node, isBookmarked: !node.isBookmarked }));
    setCurriculum(newCurriculum);
  };

  const handleSaveNotes = (nodeId: string, notes: string) => {
    const newCurriculum = updateNodeRecursively(curriculum, nodeId, node => ({ ...node, notes }));
    setCurriculum(newCurriculum);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setCurriculum(item.curriculum);
    setCurrentTopic(item.topic);
    setCurrentLevel(item.level);
    setActiveHistoryId(item.id);
    setIsHistoryOpen(false);
  };

  const handleLoadBookmark = (item: HistoryItem) => {
    handleLoadHistory(item);
    setIsBookmarksOpen(false);
  };

  const allBookmarks = useMemo<BookmarkedItem[]>(() => {
      const bookmarks: BookmarkedItem[] = [];
      const findBookmarks = (nodes: CurriculumNode[], historyItem: HistoryItem) => {
        for (const node of nodes) {
          if (node.isBookmarked) {
            bookmarks.push({ node, parentHistoryItem: historyItem });
          }
          if (node.children) {
            findBookmarks(node.children, historyItem);
          }
        }
      };
      history.forEach(item => findBookmarks(item.curriculum, item));
      return bookmarks;
  }, [history]);

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }
  
  const totalCount = countNodes(curriculum);
  const completedCount = countCompletedNodes(curriculum);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <WelcomeToast message={welcomeMessage} show={showWelcomeToast} />

      <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-heading text-slate-800 dark:text-white">Unpackd</h1>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setIsMathLabOpen(true)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Math Lab">
                   <MathIcon className="w-6 h-6" />
                </button>
                <button onClick={() => setIsBookmarksOpen(true)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="View Bookmarks">
                   <BookmarkListIcon className="w-6 h-6" />
                </button>
                <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="View History">
                   <HistoryIcon className="w-6 h-6" />
                </button>
                <UserProfile user={user} onLogout={handleLogout} onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} theme={theme} />
            </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
            <TopicForm onGenerate={handleGenerate} onOpenUpload={() => setIsUploadModalOpen(true)} isLoading={isLoading} />
        </div>
        
        {isLoading && <LoadingSpinner />}
        {error && <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
        
        {curriculum.length > 0 && (
          <CurriculumDisplay
            curriculum={curriculum}
            onToggleComplete={handleToggleComplete}
            onViewNotes={(node) => setViewingNotesFor(node)}
            onToggleBookmark={handleToggleBookmark}
            completedCount={completedCount}
            totalCount={totalCount}
          />
        )}
        
        {curriculum.length === 0 && !isLoading && !error && (
            <div className="text-center py-16">
                <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-300">Unlock Your Learning Potential</h2>
                <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Enter a topic above, or upload content, to generate a personalized learning path and start your journey.</p>
                {quote && <QuoteDisplay quote={quote} />}
            </div>
        )}
      </main>

      <div>
        <MiaFAB onClick={() => setIsMiaChatOpen(true)} />
      </div>

      <HistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} onLoadHistory={handleLoadHistory} />
      
      <BookmarksSidebar isOpen={isBookmarksOpen} onClose={() => setIsBookmarksOpen(false)} bookmarks={allBookmarks} onLoadBookmark={handleLoadBookmark} />

      <NotesModal isOpen={!!viewingNotesFor} onClose={() => setViewingNotesFor(null)} node={viewingNotesFor} mainTopic={currentTopic} onSaveNotes={handleSaveNotes} />

      <MotivationModal message={motivationMessage} onClose={() => setMotivationMessage(null)} />

      <ElevateModal isOpen={isElevateModalOpen} onClose={() => setIsElevateModalOpen(false)} topic={currentTopic} />

      <MiaChatModal isOpen={isMiaChatOpen} onClose={() => setIsMiaChatOpen(false)} user={user} />
      
      <MathLabModal isOpen={isMathLabOpen} onClose={() => setIsMathLabOpen(false)} />

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onGenerate={handleGenerate} isLoading={isLoading} />

    </div>
  );
};

export default App;
