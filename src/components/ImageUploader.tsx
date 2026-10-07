import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, Wand2 } from 'lucide-react';
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
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-zinc-200 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          Photo Input
        </span>
        {image && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Change photo
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
          className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px] ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10 scale-[0.99]'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900/80'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Upload className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-sm font-medium text-zinc-200">
            Drag and drop your photo here, or{' '}
            <span className="text-amber-400 underline decoration-amber-400/50 underline-offset-2">
              browse files
            </span>
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Supports JPG, PNG, WEBP, GIF (up to 20MB)
          </p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 shadow-lg group">
          <div className="w-full max-h-[360px] flex items-center justify-center bg-black/40 overflow-hidden">
            <img
              src={image}
              alt="Uploaded preview"
              className="max-h-[360px] w-auto max-w-full object-contain mx-auto"
            />
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onClearImage}
              disabled={disabled}
              className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-zinc-300 hover:text-white backdrop-blur border border-white/10 transition cursor-pointer"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick sample photos selector */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2">
          <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Don't have a photo handy? Try a test subject:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              disabled={disabled}
              className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/40 hover:bg-zinc-800/60 text-left transition text-xs group cursor-pointer"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-8 h-8 rounded-lg object-cover bg-zinc-950 border border-zinc-800 flex-shrink-0"
              />
              <div className="truncate">
                <div className="font-medium text-zinc-200 group-hover:text-amber-300 truncate">
                  {sample.name}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">{sample.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
