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
      // Fallback
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
        `meme-option-${index + 1}-${Date.now()}.png`
      );
    } catch (err) {
      console.error(err);
      alert('Could not export meme image.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      onClick={memeMode ? onSelectActiveMeme : undefined}
      className={`relative rounded-2xl border transition-all p-4 sm:p-5 flex flex-col justify-between ${
        isActiveMeme && memeMode
          ? 'border-amber-400 bg-zinc-900/95 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
          : 'border-zinc-800 bg-zinc-900/80 hover:border-zinc-700/80 hover:bg-zinc-900'
      } ${memeMode ? 'cursor-pointer' : ''}`}
    >
      {/* Regeneration overlay loader */}
      {isRegenerating && (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs rounded-2xl z-10 flex flex-col items-center justify-center p-4">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mb-2" />
          <p className="text-xs font-semibold text-amber-300">
            Crafting fresh alternative...
          </p>
        </div>
      )}

      {/* Top Bar of Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-amber-400 border border-zinc-700/60">
            {index + 1}
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">
            {wordCount} words
          </span>
          {isActiveMeme && memeMode && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Active Preview
            </span>
          )}
        </div>

        {/* Action buttons: Copy & Regenerate */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
              copied
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700/60 text-zinc-300 hover:text-white'
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-amber-300 transition font-medium disabled:opacity-50 cursor-pointer"
            title="Regenerate this specific caption"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isRegenerating ? 'animate-spin text-amber-400' : 'text-zinc-400'
              }`}
            />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
        </div>
      </div>

      {/* Main Caption Content */}
      <div className="space-y-3 my-1">
        <p className="text-zinc-100 font-normal text-sm sm:text-base leading-relaxed">
          &ldquo;{caption.text}&rdquo;
        </p>

        {/* Meme Breakdown (when Meme Mode is toggled or for quick inspection) */}
        {memeMode && (
          <div className="mt-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 mb-1">
              <span className="flex items-center gap-1">
                <Laugh className="w-3 h-3" />
                MEME BREAKDOWN
              </span>
              <button
                type="button"
                onClick={handleDownloadThisMeme}
                disabled={downloading}
                className="text-zinc-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>PNG</span>
              </button>
            </div>
            <div className="text-xs font-mono">
              <span className="text-zinc-500 font-semibold">TOP: </span>
              <span className="text-zinc-200 font-bold uppercase">{caption.top_text || '(none)'}</span>
            </div>
            <div className="text-xs font-mono">
              <span className="text-zinc-500 font-semibold">BOTTOM: </span>
              <span className="text-zinc-200 font-bold uppercase">{caption.bottom_text || '(none)'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info / Selection Hint */}
      {memeMode && (
        <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
          <span>{isActiveMeme ? 'Showing on main canvas' : 'Click to display on meme canvas'}</span>
          <Sparkles className={`w-3 h-3 ${isActiveMeme ? 'text-amber-400' : 'text-zinc-600'}`} />
        </div>
      )}
    </div>
  );
};
