import React from 'react';
import { Sparkles } from 'lucide-react';

export const SkeletonList: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium text-amber-400/90 animate-pulse pb-1">
        <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
        <span>Gemini is studying image details & writing 5 custom captions...</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3 animate-pulse ${
              idx === 5 ? 'md:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-zinc-800" />
                <div className="w-16 h-3.5 bg-zinc-800 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-14 h-7 bg-zinc-800 rounded-lg" />
                <div className="w-20 h-7 bg-zinc-800 rounded-lg" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="w-11/12 h-4 bg-zinc-800 rounded-md" />
              <div className="w-4/5 h-4 bg-zinc-800 rounded-md" />
              <div className="w-2/3 h-4 bg-zinc-800/80 rounded-md" />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-zinc-800/60">
              <div className="w-24 h-3 bg-zinc-800/60 rounded" />
              <div className="w-12 h-3 bg-zinc-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
