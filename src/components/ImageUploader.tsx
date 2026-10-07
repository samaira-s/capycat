import React, { useRef, useState } from 'react';
import { Upload, ImageIcon, X, RefreshCw, Sparkles } from 'lucide-react';
import { SAMPLE_IMAGES, SampleImage } from '../data/sampleImages';

interface ImageUploaderProps {
  image: string | null;
  onImageSelected: (dataUrl: string, mimeType: string, filename?: string) => void;
  onClearImage: () => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  onImageSelected,
  onClearImage,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.type, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleImage) => {
    if (disabled) return;
    onImageSelected(sample.url, 'image/svg+xml', `${sample.name}.svg`);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-heading font-bold text-base flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#FF4D2E]" />
          Photo Subject
        </span>
        {image && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="text-xs font-bold px-2 py-1 bg-[#FFD84D] border-1.5 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] transition cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Swap Photo
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        disabled={disabled}
      />

      {!image ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-3 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px] bg-white/60 ${
            isDragging
              ? 'border-[#FF4D2E] bg-[#FF4D2E]/10 scale-[0.99]'
              : 'border-[#1A1A1A]/40 hover:border-[#1A1A1A] hover:bg-white'
          }`}
        >
          <div className="w-14 h-14 rounded-xl bg-[#FFD84D] border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-[#1A1A1A]" />
          </div>
          <p className="font-heading font-bold text-base text-[#1A1A1A]">
            Drop your photo here or <span className="underline decoration-2 text-[#FF4D2E]">browse</span>
          </p>
          <p className="text-xs text-[#1A1A1A]/70 mt-1 font-medium">
            JPG, PNG, WEBP (Scrapbook ready)
          </p>
        </div>
      ) : (
        <div className="relative pt-6 pb-2 px-2 flex justify-center">
          {/* Polaroid Photo Frame with Washi Tape */}
          <div className="relative polaroid-frame w-full max-w-sm">
            <div className="washi-tape" />
            <div className="w-full h-[280px] bg-[#1A1A1A]/5 border border-[#1A1A1A]/20 overflow-hidden flex items-center justify-center">
              <img
                src={image}
                alt="Polaroid preview"
                className="max-h-[280px] w-auto max-w-full object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="font-handwriting text-2xl font-bold text-[#1A1A1A] rotate-[-1deg]">
                #CaptionCraft
              </span>
              <button
                type="button"
                onClick={onClearImage}
                disabled={disabled}
                className="p-1 rounded bg-[#FF4D2E] text-white border border-[#1A1A1A] shadow-[1px_1px_0_#1A1A1A] text-xs font-bold hover:bg-[#e03b1d] cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick sample photos */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D2E]" />
          <span>Scrapbook Sample Photos:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_IMAGES.map((sample, idx) => {
            const rotations = ['rotate-1', 'rotate-[-1deg]', 'rotate-[2deg]', 'rotate-[-2deg]'];
            const colors = ['bg-[#FFD84D]', 'bg-[#C9B6FF]', 'bg-[#A7F3D0]', 'bg-[#BAE6FD]'];
            const rot = rotations[idx % rotations.length];
            const col = colors[idx % colors.length];

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                disabled={disabled}
                className={`p-2 bg-white border-2 border-[#1A1A1A] shadow-[2px_2px_0_#1A1A1A] hover:shadow-[3px_4px_0_#1A1A1A] hover:-translate-y-0.5 text-left transition cursor-pointer flex flex-col items-center ${rot}`}
              >
                <div className="w-full h-16 bg-[#1A1A1A]/5 border border-[#1A1A1A]/20 rounded mb-1.5 overflow-hidden flex items-center justify-center">
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-heading font-bold text-[11px] text-[#1A1A1A] truncate w-full text-center">
                  {sample.name}
                </div>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border border-[#1A1A1A] ${col} mt-0.5`}>
                  {sample.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
