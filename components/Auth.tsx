import React, { useState } from 'react';
import { User } from '../types';
import { defaultAvatars } from '../utils/avatars';
import GoogleIcon from './icons/GoogleIcon';
import MiaBotIcon from './icons/MiaBotIcon';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatars[0]);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin({
        id: new Date().toISOString(),
        name,
        email: `${name.toLowerCase().replace(/\s/g, '.')}@example.com`,
        avatar: selectedAvatar,
        points: 0,
      });
    }
  };

  const handleGoogleLogin = () => {
    onLogin({
        id: 'google-user-123',
        name: 'Alex Chen',
        email: 'alex.chen@example.com',
        avatar: defaultAvatars[4],
        points: 150,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
            <MiaBotIcon className="w-20 h-20 text-sky-500" />
            <h1 className="text-5xl font-bold font-heading text-slate-800 dark:text-white mt-2">Unpackd</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Your AI-powered guide to mastering any topic.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <img 
                src={selectedAvatar} 
                alt="Selected Avatar" 
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white dark:border-slate-700 shadow-lg cursor-pointer transform hover:scale-105 transition-transform"
                onClick={() => setIsAvatarSelectorOpen(!isAvatarSelectorOpen)}
              />
              {isAvatarSelectorOpen && (
                  <div className="absolute top-28 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-slate-700 p-2 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 grid grid-cols-4 gap-2 z-10">
                      {defaultAvatars.map(av => (
                          <img key={av} src={av} alt="avatar option" className={`w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-sky-500 ${selectedAvatar === av ? 'ring-2 ring-sky-500' : ''}`} onClick={() => {setSelectedAvatar(av); setIsAvatarSelectorOpen(false); }}/>
                      ))}
                  </div>
              )}
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                What should we call you?
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-slate-800 dark:text-slate-100"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Let's Get Started
              </button>
            </div>
             <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-slate-800 px-2 text-sm text-slate-500 dark:text-slate-400">Or continue with</span>
                </div>
            </div>
            <div>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                    <GoogleIcon className="w-5 h-5" />
                    <span>Sign in with Google</span>
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
