import React from 'react';
import {
  Sparkles,
  Flame,
  Heart,
  Feather,
  Skull,
  Film,
  Camera,
  Briefcase,
  LucideIcon,
} from 'lucide-react';
import { CAPTION_STYLES } from '../data/styles';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Flame,
  Heart,
  Feather,
  Skull,
  Film,
  Camera,
  Briefcase,
};

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
  disabled?: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  disabled = false,
}) => {
  const current = CAPTION_STYLES.find((s) => s.id === selectedStyle) || CAPTION_STYLES[0];

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-zinc-200">
          Caption Style
        </label>
        <span className="text-xs text-amber-400 font-medium">
          {current.tagline}
        </span>
      </div>

      {/* Row of selectable chips */}
      <div className="flex flex-wrap gap-2">
        {CAPTION_STYLES.map((style) => {
          const Icon = ICON_MAP[style.iconName] || Sparkles;
          const isSelected = selectedStyle === style.id;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              disabled={disabled}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20 scale-[1.02]'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isSelected ? 'text-amber-400' : 'text-zinc-500'
                }`}
              />
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
