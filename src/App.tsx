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
    <div className="min-h-screen bg-[#F4EFE6] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#FF4D2E] selection:text-white">
      <Header memeMode={memeMode} onToggleMemeMode={setMemeMode} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Top Hero Banner */}
        <section className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A]">
            Give Your Photo The{' '}
            <span className="bg-[#FFD84D] px-2 py-0.5 border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] inline-block rotate-[-1deg]">
              Perfect Vibe
            </span>
          </h2>
          <p className="text-sm font-medium text-[#1A1A1A]/80">
            Powered by Gemini AI visual reasoning. Extracts details, objects, and expressions to craft sharp, tailored zine captions.
          </p>
        </section>

        {/* Global Error Banner */}
        {error && (
          <div className="rounded-xl border-2 border-[#1A1A1A] bg-[#FF4D2E]/20 p-4 flex items-start gap-3 text-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]">
            <AlertCircle className="w-5 h-5 text-[#FF4D2E] flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-bold">
              <span>Notice: </span>
              {error}
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-bold underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Upload & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border-3 border-[#1A1A1A] bg-white p-5 space-y-6 shadow-[5px_6px_0_#1A1A1A]">
              {/* Step 1: Upload */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF4D2E] text-white flex items-center justify-center text-xs font-heading font-black border-2 border-[#1A1A1A] shadow-[1px_1px_0_#1A1A1A]">
                    1
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-[#1A1A1A]">
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
              <div className="space-y-2 pt-4 border-t-2 border-dashed border-[#1A1A1A]/30">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFD84D] text-[#1A1A1A] flex items-center justify-center text-xs font-heading font-black border-2 border-[#1A1A1A] shadow-[1px_1px_0_#1A1A1A]">
                    2
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-[#1A1A1A]">
                    Select Caption Style
                  </h3>
                </div>
                <StyleSelector
                  selectedStyle={selectedStyle}
                  onSelectStyle={setSelectedStyle}
                  disabled={isLoading}
                />
              </div>

              {/* Step 3: Generate Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateCaptions}
                  disabled={!image || isLoading}
                  className={`w-full neo-btn py-4 px-6 rounded-full font-heading font-extrabold text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer ${
                    !image || isLoading ? 'opacity-50 cursor-not-allowed shadow-none transform-none' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Analyzing & Crafting...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>
                        {memeMode ? 'Generate 5 Memes' : 'Generate 5 Captions'}
                      </span>
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </button>
                {!image && (
                  <p className="text-center text-xs font-bold text-[#1A1A1A]/60 mt-2">
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
                  <h3 className="font-heading font-extrabold text-lg text-[#1A1A1A] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF4D2E]" />
                    Generated Zine Options
                  </h3>
                  {captions.length > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 bg-[#C9B6FF] border border-[#1A1A1A] rounded shadow-[1px_1px_0_#1A1A1A]">
                      {selectedStyle}
                    </span>
                  )}
                </div>

                {captions.length > 0 && !isLoading && (
                  <button
                    type="button"
                    onClick={handleGenerateCaptions}
                    className="stamp-btn text-xs font-bold px-3 py-1.5 rounded cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#FF4D2E]" />
                    <span>Reroll All 5</span>
                  </button>
                )}
              </div>

              {/* Loading Skeleton */}
              {isLoading && <SkeletonList />}

              {/* Ready Caption Cards */}
              {!isLoading && captions.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
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
                <div className="rounded-2xl border-3 border-[#1A1A1A] bg-white p-12 text-center flex flex-col items-center justify-center space-y-3 min-h-[320px] shadow-[4px_4px_0_#1A1A1A]">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFD84D] border-2 border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] flex items-center justify-center text-[#1A1A1A]">
                    <Wand2 className="w-7 h-7 text-[#FF4D2E]" />
                  </div>
                  <h4 className="font-heading font-bold text-xl text-[#1A1A1A]">
                    Your Scrapbook is Waiting
                  </h4>
                  <p className="text-sm font-medium text-[#1A1A1A]/70 max-w-sm">
                    Upload a photo and select a style to generate 5 distinctive, context-aware zine captions and meme lines.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-3 border-[#1A1A1A] py-6 text-center text-xs font-bold text-[#1A1A1A]/70 mt-auto bg-white">
        <p>CaptionCraft Zine Edition &bull; Scrapbook Photo Captions & Memes</p>
      </footer>
    </div>
  );
}
