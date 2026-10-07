import React from 'react';
import { Sparkles } from 'lucide-react';

export const SkeletonList: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#FF4D2E] pb-1">
        <Sparkles className="w-4 h-4 animate-spin text-[#FF4D2E]" />
        <span className="font-handwriting text-xl text-[#1A1A1A]">Gemini is thinking and crafting zine captions...</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4, 5].map((idx) => {
          const cardColors = ['bg-[#FFF9C4]', 'bg-[#E1BEE7]', 'bg-[#C8E6C9]', 'bg-[#B3E5FC]', 'bg-[#FFE0B2]'];
          const bgCol = cardColors[(idx - 1) % cardColors.length];

          return (
            <div
              key={idx}
              className={`rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] p-5 space-y-3 animate-pulse ${bgCol}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#1A1A1A]/20" />
                  <div className="w-16 h-4 rounded bg-[#1A1A1A]/20" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-14 h-6 rounded bg-[#1A1A1A]/20" />
                  <div className="w-16 h-6 rounded bg-[#1A1A1A]/20" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="w-11/12 h-6 rounded bg-[#1A1A1A]/20" />
                <div className="w-4/5 h-6 rounded bg-[#1A1A1A]/15" />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#1A1A1A]/20">
                <div className="w-24 h-3 rounded bg-[#1A1A1A]/15" />
                <div className="w-12 h-3 rounded bg-[#1A1A1A]/15" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
