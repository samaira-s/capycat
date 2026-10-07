import React, { useState } from 'react';
import { Download, Sparkles, Check, Edit3 } from 'lucide-react';
import { downloadMemePng } from '../utils/memeCanvas';

interface MemePreviewProps {
  image: string;
  topText: string;
  bottomText: string;
  captionTitle?: string;
  onUpdateText?: (newTop: string, newBottom: string) => void;
}

export const MemePreview: React.FC<MemePreviewProps> = ({
  image,
  topText,
  bottomText,
  captionTitle,
  onUpdateText,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localTop, setLocalTop] = useState(topText);
  const [localBottom, setLocalBottom] = useState(bottomText);

  // Sync if props change
  React.useEffect(() => {
    setLocalTop(topText);
    setLocalBottom(bottomText);
  }, [topText, bottomText]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadMemePng(
        {
          imageUrl: image,
          topText: localTop,
          bottomText: localBottom,
        },
        `captioncraft-${Date.now()}.png`
      );
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to download meme:', err);
      alert('Failed to generate PNG download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApplyEdit = () => {
    if (onUpdateText) {
      onUpdateText(localTop, localBottom);
    }
    setIsEditing(false);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Meme Generator
          </span>
          {captionTitle && (
            <span className="text-xs text-zinc-400 truncate max-w-[200px]">
              {captionTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Close Edit' : 'Edit Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-md shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Rendering...' : 'Download PNG'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional inline text editing inputs */}
      {isEditing && (
        <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-2.5 animate-fadeIn">
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
              Top Text
            </label>
            <input
              type="text"
              value={localTop}
              onChange={(e) => setLocalTop(e.target.value)}
              placeholder="TOP TEXT..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
              Bottom Text
            </label>
            <input
              type="text"
              value={localBottom}
              onChange={(e) => setLocalBottom(e.target.value)}
              placeholder="BOTTOM TEXT..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleApplyEdit}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded-lg font-medium transition cursor-pointer"
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}

      {/* Live Impact Meme Display with Outline */}
      <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center max-h-[460px] shadow-2xl">
        <img
          src={image}
          alt="Meme background"
          className="w-full max-h-[460px] object-contain block mx-auto select-none"
        />

        {/* Top Meme Text */}
        {localTop && (
          <div className="absolute top-4 left-4 right-4 pointer-events-none text-center">
            <p className="font-impact uppercase font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-wider leading-tight meme-text-shadow break-words">
              {localTop}
            </p>
          </div>
        )}

        {/* Bottom Meme Text */}
        {localBottom && (
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none text-center">
            <p className="font-impact uppercase font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-wider leading-tight meme-text-shadow break-words">
              {localBottom}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <span>Rendered in classic bold Impact typography with high-contrast outline</span>
        <button
          type="button"
          onClick={handleDownload}
          className="text-amber-400 hover:underline cursor-pointer font-medium"
        >
          Direct Download &rarr;
        </button>
      </div>
    </div>
  );
};
