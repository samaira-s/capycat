import React from 'react';
import { Sparkles, Laugh } from 'lucide-react';

interface HeaderProps {
  memeMode: boolean;
  onToggleMemeMode: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ memeMode, onToggleMemeMode }) => {
  return (
    <header className="border-b-3 border-[#1A1A1A] bg-[#F4EFE6] sticky top-0 z-40 py-4 shadow-[0_4px_0_#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Title / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#FF4D2E] border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] rotate-[-3deg] flex items-center justify-center font-heading font-black text-white text-xl">
            CC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">
                CAPTION<span className="text-[#FF4D2E] underline decoration-wavy decoration-2">CRAFT</span>
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#FFD84D] border-1.5 border-[#1A1A1A] shadow-[1px_1px_0_#1A1A1A] rotate-[2deg]">
                Zine Edition
              </span>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 font-medium hidden sm:block">
              Scrapbook AI photo captions & punchy zine memes
            </p>
          </div>
        </div>

        {/* Chunky Retro Switch for Meme Mode */}
        <div className="flex items-center gap-3 bg-white border-2 border-[#1A1A1A] rounded-xl px-3.5 py-2 shadow-[3px_3px_0_#1A1A1A]">
          <div className="flex items-center gap-1.5">
            <Laugh className="w-4 h-4 text-[#FF4D2E]" />
            <span className="text-xs font-bold uppercase tracking-wide">Meme Mode</span>
          </div>
          <button
            type="button"
            onClick={() => onToggleMemeMode(!memeMode)}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 border-2 border-[#1A1A1A] cursor-pointer flex items-center ${
              memeMode ? 'bg-[#FF4D2E] justify-end' : 'bg-[#E5E0D8] justify-start'
            }`}
            aria-label="Toggle Meme Mode"
          >
            <div className="w-4 h-4 rounded-full bg-white border border-[#1A1A1A] shadow-inner" />
          </button>
        </div>
      </div>
    </header>
  );
};
