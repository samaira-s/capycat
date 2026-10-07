/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, AlertCircle, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { StyleSelector } from './components/StyleSelector';
import { MemePreview } from './components/MemePreview';
import { CaptionCard, CaptionData } from './components/CaptionCard';
import { SkeletonList } from './components/SkeletonList';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [filename, setFilename] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Witty');
  const [memeMode, setMemeMode] = useState<boolean>(false);

  const [captions, setCaptions] = useState<CaptionData[]>([]);
  const [activeMemeIndex, setActiveMemeIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle image upload / selection
  const handleImageSelected = (dataUrl: string, detectedMime: string, name?: string) => {
    setImage(dataUrl);
    setMimeType(detectedMime);
    setFilename(name || 'uploaded-photo');
    setError(null);
  };

  const handleClearImage = () => {
    setImage(null);
    setCaptions([]);
    setError(null);
    setActiveMemeIndex(0);
  };

  // Generate 5 captions
  const handleGenerateCaptions = async () => {
    if (!image) {
      setError('Please upload a photo first to generate captions.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          mimeType,
          style: selectedStyle,
          memeMode,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to generate captions (Status: ${response.status})`);
      }

      const data = await response.json();
      if (!data.captions || !Array.isArray(data.captions)) {
        throw new Error('Unexpected response format from server.');
      }

      const formattedCaptions: CaptionData[] = data.captions.map(
        (c: { text: string; top_text: string; bottom_text: string }, index: number) => ({
          id: `caption-${Date.now()}-${index}`,
          text: c.text,
          top_text: c.top_text,
          bottom_text: c.bottom_text,
        })
      );

      setCaptions(formattedCaptions);
      setActiveMemeIndex(0);
    } catch (err: unknown) {
      console.error('Error generating captions:', err);
      const msg = err instanceof Error ? err.message : 'Something went wrong while generating captions.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate single caption
  const handleRegenerateSingle = async (index: number) => {
    if (!image) return;

    setRegeneratingIndex(index);
    setError(null);

    try {
      const existingCaptions = captions.map((c) => c.text);
      const response = await fetch('/api/regenerate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          mimeType,
          style: selectedStyle,
          existingCaptions,
          memeMode,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Regeneration failed (Status: ${response.status})`);
      }

      const data = await response.json();
      if (!data.caption) {
        throw new Error('No new caption received.');
      }

      setCaptions((prev) => {
        const next = [...prev];
        next[index] = {
          id: `caption-${Date.now()}-${index}`,
          text: data.caption.text,
          top_text: data.caption.top_text,
          bottom_text: data.caption.bottom_text,
        };
        return next;
      });
    } catch (err: unknown) {
      console.error('Regenerate error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to regenerate caption.';
      setError(`Failed to regenerate caption #${index + 1}: ${msg}`);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  // Update active meme text from MemePreview inline editor
  const handleUpdateActiveMemeText = (newTop: string, newBottom: string) => {
    setCaptions((prev) => {
      const next = [...prev];
      if (next[activeMemeIndex]) {
        next[activeMemeIndex] = {
          ...next[activeMemeIndex],
          top_text: newTop,
          bottom_text: newBottom,
        };
      }
      return next;
    });
  };

  const activeCaption = captions[activeMemeIndex] || captions[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header memeMode={memeMode} onToggleMemeMode={setMemeMode} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Top Hero Banner */}
        <section className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Give Your Photo The{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              Perfect Caption
            </span>
          </h2>
          <p className="text-sm text-zinc-400">
            Powered by Gemini AI. Deep visual reasoning picks up on expressions, props, and setting
            to craft genuinely hilarious, tailored lines.
          </p>
        </section>

        {/* Global Error Banner */}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-4 flex items-start gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="font-semibold text-red-300">Notice: </span>
              {error}
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs text-red-400 hover:text-red-200 cursor-pointer font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Upload & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-6 shadow-xl backdrop-blur-xs">
              {/* Step 1: Upload */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold border border-amber-500/30">
                    1
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-200">
                    Upload Photo
                  </h3>
                </div>
                <ImageUploader
                  image={image}
                  onImageSelected={handleImageSelected}
                  onClearImage={handleClearImage}
                  disabled={isLoading}
                />
              </div>

              {/* Step 2: Choose Style */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold border border-amber-500/30">
                    2
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-200">
                    Select Caption Style
                  </h3>
                </div>
                <StyleSelector
                  selectedStyle={selectedStyle}
                  onSelectStyle={setSelectedStyle}
                  disabled={isLoading}
                />
              </div>

              {/* Meme Mode Quick Banner */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <span>Meme Mode</span>
                    {memeMode && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Generates bold Impact text overlay & PNG download
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMemeMode(!memeMode)}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                    memeMode ? 'bg-amber-500 justify-end' : 'bg-zinc-800 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Step 3: Generate Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateCaptions}
                  disabled={!image || isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer ${
                    !image || isLoading
                      ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 shadow-amber-500/25 hover:shadow-amber-500/35 hover:scale-[1.01]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>Analyzing & Crafting...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-zinc-950" />
                      <span>
                        {memeMode ? 'Generate 5 Memes' : 'Generate 5 Captions'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-zinc-950 ml-0.5" />
                    </>
                  )}
                </button>
                {!image && (
                  <p className="text-center text-[11px] text-zinc-500 mt-2">
                    Upload or select a photo above to enable generation
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Output / Meme Preview / Caption Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* If Meme Mode is on and we have an image & active caption, show live Impact Meme Canvas */}
            {memeMode && image && captions.length > 0 && activeCaption && (
              <MemePreview
                image={image}
                topText={activeCaption.top_text}
                bottomText={activeCaption.bottom_text}
                captionTitle={`Option #${activeMemeIndex + 1}`}
                onUpdateText={handleUpdateActiveMemeText}
              />
            )}

            {/* Captions Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Generated Options
                  </h3>
                  {captions.length > 0 && (
                    <span className="text-xs text-zinc-400">
                      ({captions.length} crafted for {selectedStyle})
                    </span>
                  )}
                </div>

                {captions.length > 0 && !isLoading && (
                  <button
                    type="button"
                    onClick={handleGenerateCaptions}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate all 5</span>
                  </button>
                )}
              </div>

              {/* Loading Skeleton */}
              {isLoading && <SkeletonList />}

              {/* Ready Caption Cards */}
              {!isLoading && captions.length > 0 && (
                <div className="grid grid-cols-1 gap-3.5">
                  {captions.map((caption, idx) => (
                    <CaptionCard
                      key={caption.id}
                      index={idx}
                      caption={caption}
                      image={image || ''}
                      memeMode={memeMode}
                      isActiveMeme={activeMemeIndex === idx}
                      isRegenerating={regeneratingIndex === idx}
                      onSelectActiveMeme={() => setActiveMemeIndex(idx)}
                      onRegenerate={() => handleRegenerateSingle(idx)}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && captions.length === 0 && (
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-10 text-center flex flex-col items-center justify-center space-y-3 min-h-[300px]">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-500">
                    <Wand2 className="w-6 h-6 text-amber-400/70" />
                  </div>
                  <h4 className="text-base font-semibold text-zinc-200">
                    No captions generated yet
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-sm">
                    Upload any photo and choose your desired tone to watch Gemini generate 5 sharp,
                    context-aware captions and meme lines.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-5 text-center text-xs text-zinc-500 mt-auto">
        <p>CaptionCraft &bull; Intelligent photo captions and meme studio</p>
      </footer>
    </div>
  );
}
