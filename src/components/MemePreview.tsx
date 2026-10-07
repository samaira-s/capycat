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
        `captioncraft-zine-meme-${Date.now()}.png`
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
    <div className="polaroid-frame bg-white p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between border-b-2 border-[#1A1A1A]/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFD84D] border-1.5 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] text-xs font-heading font-extrabold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D2E]" />
            Active Meme Studio
          </span>
          {captionTitle && (
            <span className="text-xs font-bold text-[#1A1A1A]/70">
              {captionTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="stamp-btn flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF4D2E]" />
            <span>{isEditing ? 'Close Edit' : 'Edit Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="neo-btn flex items-center gap-1.5 text-xs font-heading font-extrabold px-3.5 py-1.5 rounded cursor-pointer"
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
        <div className="p-3 bg-[#F4EFE6] border-2 border-[#1A1A1A] rounded-xl space-y-2.5 shadow-[3px_3px_0_#1A1A1A] animate-fadeIn">
          <div>
            <label className="text-xs font-heading font-bold block mb-1">Top Text</label>
            <input
              type="text"
              value={localTop}
              onChange={(e) => setLocalTop(e.target.value)}
              placeholder="TOP TEXT..."
              className="w-full bg-white border-2 border-[#1A1A1A] rounded px-3 py-1.5 text-sm font-bold uppercase placeholder-[#1A1A1A]/30 focus:outline-none focus:ring-2 focus:ring-[#FF4D2E]"
            />
          </div>
          <div>
            <label className="text-xs font-heading font-bold block mb-1">Bottom Text</label>
            <input
              type="text"
              value={localBottom}
              onChange={(e) => setLocalBottom(e.target.value)}
              placeholder="BOTTOM TEXT..."
              className="w-full bg-white border-2 border-[#1A1A1A] rounded px-3 py-1.5 text-sm font-bold uppercase placeholder-[#1A1A1A]/30 focus:outline-none focus:ring-2 focus:ring-[#FF4D2E]"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleApplyEdit}
              className="neo-btn text-xs font-bold px-3 py-1 rounded cursor-pointer"
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}

      {/* Live Impact Meme Display with Outline */}
      <div className="relative rounded-lg overflow-hidden border-3 border-[#1A1A1A] bg-black flex items-center justify-center max-h-[460px] shadow-[4px_4px_0_#1A1A1A]">
        <img
          src={image}
          alt="Meme canvas background"
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

      <div className="flex items-center justify-between text-xs text-[#1A1A1A]/70 px-1 font-bold">
        <span>Rendered with classic bold Impact text and heavy outline</span>
        <button
          type="button"
          onClick={handleDownload}
          className="text-[#FF4D2E] underline cursor-pointer"
        >
          Export PNG &rarr;
        </button>
      </div>
    </div>
  );
};
