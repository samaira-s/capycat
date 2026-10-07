import React from 'react';
import { Sparkles, Laugh } from 'lucide-react';

interface HeaderProps {
  memeMode: boolean;
  onToggleMemeMode: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ memeMode, onToggleMemeMode }) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Caption<span className="text-amber-400">Craft</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Sharp, detail-aware captions & viral memes in 8 distinct styles
            </p>
          </div>
        </div>

        {/* Meme Mode quick toggle */}
        <div className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => onToggleMemeMode(!memeMode)}
            className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
              memeMode
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Laugh className="w-4 h-4" />
            <span>Meme Mode</span>
            <span
              className={`w-2 h-2 rounded-full ${
                memeMode ? 'bg-zinc-950 animate-pulse' : 'bg-zinc-600'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
