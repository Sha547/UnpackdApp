
import React from 'react';
import { User } from '../types';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onThemeToggle: () => void;
  theme: 'light' | 'dark';
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onThemeToggle, theme }) => {
  return (
    <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
             <StarIcon className="w-5 h-5 text-sky-500" />
             <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{user.points}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" title={user.name}>
            <img src={user.avatar} alt="User Avatar" className="w-10 h-10 object-cover rounded-full" />
             <p className="text-slate-800 dark:text-slate-200 font-semibold hidden sm:block">{user.name}</p>
          </div>
        </div>
         <button onClick={onThemeToggle} className="text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle Theme" title="Toggle Theme">
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
        <button onClick={onLogout} className="text-slate-500 dark:text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Logout" title="Logout">
            <LogoutIcon className="w-6 h-6" />
        </button>
    </div>
  );
};

export default UserProfile;