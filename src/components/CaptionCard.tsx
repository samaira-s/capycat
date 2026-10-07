import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Laugh, Download, Sparkles } from 'lucide-react';
import { downloadMemePng } from '../utils/memeCanvas';

export interface CaptionData {
  id: string;
  text: string;
  top_text: string;
  bottom_text: string;
}

interface CaptionCardProps {
  index: number;
  caption: CaptionData;
  image: string;
  memeMode: boolean;
  isActiveMeme?: boolean;
  isRegenerating?: boolean;
  onSelectActiveMeme?: () => void;
  onRegenerate: () => void;
}

export const CaptionCard: React.FC<CaptionCardProps> = ({
  index,
  caption,
  image,
  memeMode,
  isActiveMeme = false,
  isRegenerating = false,
  onSelectActiveMeme,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const wordCount = caption.text.trim().split(/\s+/).filter(Boolean).length;

  const handleCopy = async () => {
    try {
      const textToCopy = memeMode
        ? `TOP: ${caption.top_text}\nBOTTOM: ${caption.bottom_text}\n\nCaption: ${caption.text}`
        : caption.text;

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadThisMeme = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloading(true);
      await downloadMemePng(
        {
          imageUrl: image,
          topText: caption.top_text,
          bottomText: caption.bottom_text,
        },
        `zine-meme-${index + 1}-${Date.now()}.png`
      );
    } catch (err) {
      console.error(err);
      alert('Could not export meme image.');
    } finally {
      setDownloading(false);
    }
  };

  // Sticky note scrap colors and rotations
  const cardColors = [
    'bg-[#FFF9C4]', // sticky yellow
    'bg-[#E1BEE7]', // sticky lilac
    'bg-[#C8E6C9]', // mint paper
    'bg-[#B3E5FC]', // light blue
    'bg-[#FFE0B2]', // peach
  ];
  const rotations = ['rotate-[0.5deg]', 'rotate-[-1deg]', 'rotate-[1.2deg]', 'rotate-[-0.8deg]', 'rotate-[0.3deg]'];

  const bgCol = cardColors[index % cardColors.length];
  const rot = rotations[index % rotations.length];

  return (
    <div
      onClick={memeMode ? onSelectActiveMeme : undefined}
      style={{ animationDelay: `${index * 80}ms` }}
      className={`relative sticky-note rounded-xl p-4 sm:p-5 flex flex-col justify-between animate-slap ${bgCol} ${
        isActiveMeme && memeMode
          ? 'ring-4 ring-[#FF4D2E] scale-[1.01]'
          : ''
      } ${memeMode ? 'cursor-pointer' : ''}`}
    >
      {/* Regeneration overlay */}
      {isRegenerating && (
        <div className="absolute inset-0 bg-[#F4EFE6]/90 rounded-xl z-10 flex flex-col items-center justify-center p-4">
          <RefreshCw className="w-6 h-6 text-[#FF4D2E] animate-spin mb-2" />
          <p className="font-heading font-bold text-xs text-[#1A1A1A]">
            Crafting fresh alternative...
          </p>
        </div>
      )}

      {/* Top Header of Note */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-[#1A1A1A] text-white rounded font-heading font-black text-xs flex items-center justify-center shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
            #{index + 1}
          </span>
          <span className="text-[11px] font-mono font-bold text-[#1A1A1A]/60">
            {wordCount} words
          </span>
          {isActiveMeme && memeMode && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.2 bg-[#FF4D2E] text-white rounded border border-[#1A1A1A] shadow-[1px_1px_0_#1A1A1A]">
              Active Canvas
            </span>
          )}
        </div>

        {/* Action Stamp Buttons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleCopy}
            className={`stamp-btn flex items-center gap-1 text-xs px-2.5 py-1 rounded font-bold text-[#1A1A1A] cursor-pointer ${
              copied ? 'bg-[#A7F3D0] border-solid' : ''
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="stamp-btn flex items-center gap-1 text-xs px-2.5 py-1 rounded font-bold text-[#1A1A1A] cursor-pointer disabled:opacity-50"
            title="Regenerate this caption"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-[#FF4D2E]' : ''}`} />
            <span className="hidden sm:inline">Reroll</span>
          </button>
        </div>
      </div>

      {/* Main Caption Text in Caveat handwriting or DM Sans */}
      <div className="space-y-3 my-1">
        <p className="font-handwriting text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-tight">
          &ldquo;{caption.text}&rdquo;
        </p>

        {/* Meme Breakdown */}
        {memeMode && (
          <div className="mt-3 p-3 rounded-lg bg-white/95 border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-heading font-extrabold text-[#FF4D2E]">
              <span className="flex items-center gap-1">
                <Laugh className="w-3 h-3" />
                ZINE MEME TEXT
              </span>
              <button
                type="button"
                onClick={handleDownloadThisMeme}
                disabled={downloading}
                className="text-[#1A1A1A] hover:text-[#FF4D2E] flex items-center gap-1 font-bold transition cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>PNG</span>
              </button>
            </div>
            <div className="text-xs font-mono bg-[#F4EFE6] p-1.5 rounded border border-[#1A1A1A]/30">
              <span className="text-[#FF4D2E] font-bold">TOP: </span>
              <span className="text-[#1A1A1A] font-bold uppercase">{caption.top_text || '(none)'}</span>
            </div>
            <div className="text-xs font-mono bg-[#F4EFE6] p-1.5 rounded border border-[#1A1A1A]/30">
              <span className="text-[#FF4D2E] font-bold">BOTTOM: </span>
              <span className="text-[#1A1A1A] font-bold uppercase">{caption.bottom_text || '(none)'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {memeMode && (
        <div className="mt-3 pt-2 border-t border-[#1A1A1A]/20 flex items-center justify-between text-[11px] font-bold text-[#1A1A1A]/70">
          <span>{isActiveMeme ? '★ On active meme preview' : 'Click to preview on meme canvas'}</span>
          <Sparkles className="w-3 h-3 text-[#FF4D2E]" />
        </div>
      )}
    </div>
  );
};
