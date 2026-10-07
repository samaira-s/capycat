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

  const chipColors = [
    'bg-[#FFD84D]', // butter yellow
    'bg-[#C9B6FF]', // soft lilac
    'bg-[#A7F3D0]', // mint
    'bg-[#BAE6FD]', // soft blue
    'bg-[#FFB4A2]', // peach
    'bg-[#E0C3FC]', // lavender
    'bg-[#FFF176]', // light yellow
    'bg-[#80DEEA]', // cyan
  ];

  const rotations = ['rotate-1', 'rotate-[-1.5deg]', 'rotate-[0.8deg]', 'rotate-[-0.5deg]', 'rotate-[1.2deg]'];

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-heading font-bold text-base text-[#1A1A1A]">
          Caption Vibe / Style
        </label>
        <span className="text-xs font-bold px-2.5 py-0.5 bg-white border-1.5 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] text-[#FF4D2E]">
          {current.tagline}
        </span>
      </div>

      {/* Torn paper sticker chips */}
      <div className="flex flex-wrap gap-2.5 pt-1">
        {CAPTION_STYLES.map((style, index) => {
          const Icon = ICON_MAP[style.iconName] || Sparkles;
          const isSelected = selectedStyle === style.id;
          const bgCol = chipColors[index % chipColors.length];
          const rot = rotations[index % rotations.length];

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              disabled={disabled}
              className={`flex items-center gap-1.5 px-3.5 py-2 font-heading font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isSelected ? 'zine-chip-selected' : `${bgCol} zine-chip ${rot}`
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`} />
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
