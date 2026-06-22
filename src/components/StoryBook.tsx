import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Smile, 
  ArrowLeft,
  Loader2,
  RefreshCw,
  MessageCircle,
  HelpCircle,
  BookOpen,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { Page, Story, VoiceName, InteractiveElement } from "../types";
import { VOICE_OPTIONS } from "../data";
import { decodePCMToAudioBuffer, playDecodedAudioBuffer, playSynthSFX } from "../utils/audio";
import { TranslationSet, LanguageCode } from "../translations";

interface StoryBookProps {
  story: Story;
  characterName: string;
  imageSize: "1K" | "2K" | "4K";
  voiceName: VoiceName;
  onBackToCreator: () => void;
  onOpenChat: () => void;
  language?: LanguageCode;
  t: TranslationSet;
}

export default function StoryBook({
  story,
  characterName,
  imageSize,
  voiceName,
  onBackToCreator,
  onOpenChat,
  language = "en",
  t,
}: StoryBookProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pages, setPages] = useState<Page[]>(story.pages);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  const [activeVoice, setActiveVoice] = useState<VoiceName>(voiceName);

  // Lazy loading state for illustration
  const [imageGeneratingMap, setImageGeneratingMap] = useState<Record<number, boolean>>({});
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, string | null>>({});

  // TTS playback state
  const [ttsLoading, setTtsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Audio state references
  const audioContextRef = useRef<AudioContext | null>(null);
  const activePlaybackRef = useRef<{ stop: () => void } | null>(null);

  const currentPage = pages[currentPageIndex];
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  // Parse or dynamically construct exactly 3 custom interactive elements for the child
  const getPageInteractiveElements = (): InteractiveElement[] => {
    if (currentPage && currentPage.interactiveElements && currentPage.interactiveElements.length > 0) {
      return currentPage.interactiveElements;
    }
    
    // Whimsical regex search fallback so that older stories as well as custom user prompts get dynamic triggers
    const text = (currentPage?.text || "").toLowerCase();
    const elements: InteractiveElement[] = [];
    
    if (text.includes("frog") || text.includes("toad") || text.includes("pond") || text.includes("green")) {
      elements.push({ label: "Croaking Toad", emoji: "🐸", soundType: "croak", animation: "bounce" });
    }
    if (text.includes("car") || text.includes("truck") || text.includes("honk") || text.includes("beep") || text.includes("van")) {
      elements.push({ label: "Honking Car", emoji: "🚗", soundType: "honk", animation: "wiggle" });
    }
    if (text.includes("star") || text.includes("sky") || text.includes("night") || text.includes("moon") || text.includes("glow")) {
      elements.push({ label: "Twinkly Star", emoji: "⭐", soundType: "twinkle", animation: "pulse" });
    }
    if (text.includes("robot") || text.includes("space") || text.includes("gear") || text.includes("machin") || text.includes("beep")) {
      elements.push({ label: "Robot Gizmo", emoji: "🤖", soundType: "robot", animation: "spin" });
    }
    if (text.includes("rabbit") || text.includes("bunny") || text.includes("hop") || text.includes("jump") || text.includes("bounc")) {
      elements.push({ label: "Bouncy Bunny", emoji: "🐰", soundType: "boing", animation: "bounce" });
    }
    if (text.includes("bird") || text.includes("nest") || text.includes("chirp") || text.includes("wing")) {
      elements.push({ label: "Chirpy Birdie", emoji: "🐦", soundType: "squeak", animation: "tilt" });
    }

    // Ensure we always have exactly 3 awesome items
    const fallbacks: InteractiveElement[] = [
      { label: "Sparkly Wand", emoji: "✨", soundType: "twinkle", animation: "spin" },
      { label: "Bouncy Spring", emoji: "🌀", soundType: "boing", animation: "bounce" },
      { label: "Whimsical Bell", emoji: "🔔", soundType: "chime", animation: "tilt" },
      { label: "Plushy Squeaker", emoji: "🧸", soundType: "squeak", animation: "wiggle" },
      { label: "Mini Rocket", emoji: "🚀", soundType: "robot", animation: "pulse" }
    ];

    for (const fb of fallbacks) {
      if (elements.length >= 3) break;
      if (!elements.some((e) => e.label === fb.label)) {
        elements.push(fb);
      }
    }

    return elements.slice(0, 3);
  };

  const handleTapElement = (element: InteractiveElement, idx: number) => {
    const id = `${currentPageIndex}-${idx}`;
    setAnimatingId(id);
    
    // Play our Web Audio API synthesized sound
    playSynthSFX(element.soundType);

    // Cancel animation state after duration
    setTimeout(() => {
      setAnimatingId((curr) => (curr === id ? null : curr));
    }, 600);
  };

  // Stop any playing audio on page transit or unmount
  useEffect(() => {
    stopCurrentAudio();
  }, [currentPageIndex]);

  useEffect(() => {
    return () => {
      stopCurrentAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const stopCurrentAudio = () => {
    if (activePlaybackRef.current) {
      activePlaybackRef.current.stop();
      activePlaybackRef.current = null;
    }
    setIsPlaying(false);
  };

  // Trigger lazy image generation on visiting a page
  useEffect(() => {
    if (currentPage && !currentPage.imageUrl) {
      generateIllustration(currentPageIndex, currentPage.illustrationPrompt);
    }
  }, [currentPageIndex]);

  // Lazy illustration generator
  const generateIllustration = async (pageIdx: number, prompt: string, forceRedraw = false) => {
    if (imageGeneratingMap[pageIdx]) return;

    setImageGeneratingMap((prev) => ({ ...prev, [pageIdx]: true }));
    setImageErrorMap((prev) => ({ ...prev, [pageIdx]: null }));

    try {
      const response = await fetch("/api/story/illustration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          size: imageSize,
        }),
      });

      if (!response.ok) {
        throw new Error("Whimsical elves couldn't paint right now!");
      }

      const data = await response.json();

      setPages((prevPages) => {
        const updated = [...prevPages];
        updated[pageIdx] = {
          ...updated[pageIdx],
          imageUrl: data.imageUrl,
        };
        return updated;
      });
    } catch (err: any) {
      console.error(err);
      setImageErrorMap((prev) => ({ ...prev, [pageIdx]: err.message || "Failed to construct canvas" }));
    } finally {
      setImageGeneratingMap((prev) => ({ ...prev, [pageIdx]: false }));
    }
  };

  // Read Aloud Handler
  const handleReadAloud = async () => {
    if (isPlaying) {
      stopCurrentAudio();
      return;
    }

    // Check cached Audio URL
    if (currentPage.audioUrl) {
      playCachedAudio(currentPage.audioUrl);
      return;
    }

    setTtsLoading(true);
    try {
      const response = await fetch("/api/story/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentPage.text,
          voiceName: activeVoice,
        }),
      });

      if (!response.ok) {
        throw new Error("Voice companion is playing tag and couldn't be reached.");
      }

      const data = await response.json();
      const base64Audio = data.audio;

      // Initialize audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }

      // Decode Base64 Raw PCM
      const decodedBuffer = decodePCMToAudioBuffer(audioContextRef.current, base64Audio, 24000);

      // Play the decoded buffer
      const playback = playDecodedAudioBuffer(audioContextRef.current, decodedBuffer, () => {
        setIsPlaying(false);
      });

      activePlaybackRef.current = playback;
      setIsPlaying(true);

      // Cache audio local blob to avoid repeating hits
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const rawBlob = new Blob([bytes], { type: "audio/pcm" });
      const localUrl = URL.createObjectURL(rawBlob);

      setPages((prevPages) => {
        const updated = [...prevPages];
        updated[currentPageIndex] = {
          ...updated[currentPageIndex],
          audioUrl: localUrl,
        };
        return updated;
      });

    } catch (err) {
      console.error(err);
      alert("Uh-oh! The reading helper stubbed their toe. Please try again!");
    } finally {
      setTtsLoading(false);
    }
  };

  const playCachedAudio = async (cachedBlobUrl: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }

    try {
      const res = await fetch(cachedBlobUrl);
      const bufferBytes = await res.arrayBuffer();
      const decodedBuffer = decodePCMToAudioBuffer(
        audioContextRef.current,
        // Convert arrayBuffer to base64
        btoa(
          new Uint8Array(bufferBytes).reduce((data, byte) => data + String.fromCharCode(byte), "")
        ),
        24000
      );

      const playback = playDecodedAudioBuffer(audioContextRef.current, decodedBuffer, () => {
        setIsPlaying(false);
      });

      activePlaybackRef.current = playback;
      setIsPlaying(true);
    } catch (e) {
      console.error("Failed to play cached audio:", e);
    }
  };

  // Helper font class
  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm":
        return "text-sm leading-relaxed";
      case "md":
        return "text-base leading-relaxed md:text-lg";
      case "xl":
        return "text-2xl leading-loose font-normal";
      default:
        return "text-lg leading-loose md:text-xl";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top action header bar styled as geometric balance neobrutalist tier */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-white rounded-2xl border-4 border-[#2D3436] shadow-[4px_4px_0px_0px_#2D3436] select-none">
        <button
          onClick={onBackToCreator}
          className="flex items-center space-x-1.5 py-2 px-4 bg-[#FFD23F] hover:bg-[#eec02d] text-[#2D3436] text-xs font-black rounded-xl border-2 border-[#2D3436] shadow-[2px_2px_0px_0px_#2D3436] cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#EE4266]" />
          <span>{t.storybookBack}</span>
        </button>

        <h2 className="text-sm font-black text-[#2D3436] uppercase tracking-wider truncate max-w-[200px] md:max-w-md font-sans">
          📕 {story.title}
        </h2>

        <div className="flex items-center space-x-2">
          {/* Chat with helpers trigger */}
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-2 py-2 px-4 bg-[#3BCEAC] hover:bg-[#2db997] text-[#2D3436] text-xs font-black rounded-xl border-2 border-[#2D3436] shadow-[2px_2px_0px_0px_#2D3436] cursor-pointer transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#2D3436]" />
            <span>{t.buttonAskSidekick} 💬</span>
          </button>
        </div>
      </div>

      {/* Main double-page book layout framed beautifully */}
      <div className="bg-[#FCFAF2] relative rounded-[2rem] border-4 border-[#2D3436] shadow-[8px_8px_0px_0px_#2D3436] p-4 md:p-8 min-h-[450px] md:min-h-[550px] overflow-hidden flex flex-col justify-between">
        {/* Whimsical Binder strip */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-200/50 via-neutral-100/10 to-neutral-200/50 -translate-x-1/2 border-l-2 border-r-2 border-[#2D3436]/40 z-10 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 md:items-center">
          {/* LEFT COLUMN: Whimsical Picture painting Canvas */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full aspect-square max-w-[400px] bg-white rounded-3xl border-4 border-[#2D3436] shadow-[5px_5px_0px_0px_#2D3436] flex items-center justify-center overflow-hidden group">
              {imageGeneratingMap[currentPageIndex] ? (
                <div className="p-6 flex flex-col items-center text-center space-y-4 animate-pulse select-none bg-[#FFFBEB]">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-transparent border-t-[#EE4266] animate-spin" />
                    <Sparkles className="w-6 h-6 text-[#FFD23F] absolute inset-0 m-auto animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#2D3436]">{t.waitingCanvas}</h4>
                    <p className="text-[10px] text-[#2D3436]/60 max-w-[200px] mt-1 font-bold">
                      Mixing bright starry colors and sketching magical scenes with Gemini!
                    </p>
                  </div>
                </div>
              ) : imageErrorMap[currentPageIndex] ? (
                <div className="p-6 text-center space-y-3 bg-[#FFFBEB]">
                  <Smile className="w-10 h-10 text-[#EE4266] mx-auto animate-bounce" />
                  <p className="text-xs text-[#2D3436]/80 font-bold">{imageErrorMap[currentPageIndex]}</p>
                  <button
                    onClick={() => generateIllustration(currentPageIndex, currentPage.illustrationPrompt, true)}
                    className="flex items-center gap-1.5 mx-auto py-1 px-3 bg-[#FFD23F] border-2 border-[#2D3436] hover:bg-[#eec02d] text-[#2D3436] text-[10px] font-black rounded-full shadow-[2px_2px_0px_#2D3436] transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry Painting
                  </button>
                </div>
              ) : currentPage.imageUrl ? (
                <>
                  <img
                    src={currentPage.imageUrl}
                    alt={`Illustration for Page ${currentPage.pageNumber}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-opacity duration-300 select-none pointer-events-none"
                  />
                  {/* Subtle caption overlay on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-xs p-3 text-white text-[10px] transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 max-h-[80px] overflow-y-auto scroller-hidden select-none">
                    <span className="font-bold block">Magic Paint instructions:</span>
                    <span className="opacity-90 leading-tight italic">{currentPage.illustrationPrompt}</span>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center space-y-2 select-none">
                  <Loader2 className="w-8 h-8 text-[#EE4266] animate-spin mx-auto" />
                  <p className="text-xs text-[#2D3436] font-bold">Waiting for canvas...</p>
                </div>
              )}
            </div>

            {/* Illustration redraw helper button */}
            {currentPage.imageUrl && !imageGeneratingMap[currentPageIndex] && (
              <button
                onClick={() => generateIllustration(currentPageIndex, currentPage.illustrationPrompt, true)}
                className="flex items-center space-x-1.5 py-1.5 px-3.5 bg-white hover:bg-[#FFFBEB] text-[#2D3436] text-[10px] font-black rounded-full border-2 border-[#2D3436] cursor-pointer shadow-[2px_2px_0px_#2D3436] transition-all animate-fade-in"
              >
                <RefreshCw className="w-3 h-3 text-[#3BCEAC]" />
                <span>{t.repaintBtn}</span>
              </button>
            )}
          </div>

          {/* RIGHT COLUMN: Story Text & Controls */}
          <div className="flex flex-col justify-between h-full space-y-6 md:px-4">
            {/* Top row widget tools */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#2D3436]/40 pb-3 shrink-0">
              <span className="text-xs font-black text-[#2D3436] tracking-wider uppercase">
                PAGE {currentPage.pageNumber} OF {pages.length}
              </span>

              {/* Adjust fonts size */}
              <div className="flex items-center space-x-1 select-none">
                <button
                  onClick={() => setFontSize(fontSize === "sm" ? "md" : fontSize === "md" ? "lg" : "xl")}
                  aria-label="Make Font Larger"
                  className="p-1.5 hover:bg-[#FFD23F]/35 rounded-lg border border-transparent hover:border-[#2D3436] transition-all cursor-pointer text-[#2D3436]"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFontSize(fontSize === "xl" ? "lg" : fontSize === "lg" ? "md" : "sm")}
                  aria-label="Make Font Smaller"
                  className="p-1.5 hover:bg-[#FFD23F]/35 rounded-lg border border-transparent hover:border-[#2D3436] transition-all cursor-pointer text-[#2D3436]"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Core narrating block with tapping tokens */}
            <div className="flex-1 flex flex-col justify-between py-5 bg-white border-2 border-[#2D3436] rounded-2xl px-5 shadow-[4px_4px_0px_0px_#2D3436] relative select-text">
              <p className={`font-sans ${getFontSizeClass()} text-[#2D3436] font-bold select-text tracking-wide mb-4 text-left leading-relaxed`}>
                {currentPage.text}
              </p>

              {/* Whimsical Interactive Touch Objects */}
              <div className="pt-2.5 border-t-2 border-dashed border-[#2D3436]/40">
                <p className="text-[10px] text-[#2D3436] font-black uppercase tracking-widest mb-2 select-none flex justify-between items-center font-sans">
                  <span>{t.tapObjectsLabel}</span>
                  <span className="text-[9px] text-[#2D3436] capitalize font-bold bg-[#3BCEAC]/40 px-1.5 py-0.5 rounded border border-[#2D3436]">{t.synthesizerActive}</span>
                </p>
                <div className="grid grid-cols-3 gap-2 select-none">
                  {getPageInteractiveElements().map((element, idx) => {
                    const isAnimating = animatingId === `${currentPageIndex}-${idx}`;
                    
                    let animationClass = "";
                    if (isAnimating) {
                      if (element.animation === "bounce") animationClass = "animate-toy-bounce";
                      else if (element.animation === "spin") animationClass = "animate-toy-spin";
                      else if (element.animation === "pulse") animationClass = "animate-toy-pulse";
                      else if (element.animation === "tilt") animationClass = "animate-toy-tilt";
                      else if (element.animation === "wiggle") animationClass = "animate-toy-wiggle";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleTapElement(element, idx)}
                        className={`flex flex-col items-center justify-center p-2.5 bg-[#FFFBEB] hover:bg-[#FFD23F]/40 border-2 border-[#2D3436] rounded-2xl cursor-pointer shadow-[2px_2px_0px_0px_#2D3436] active:shadow-none active:translate-y-0.5 transition-all relative overflow-hidden h-16 group ${
                          isAnimating ? "bg-[#FFD23F] shadow-inner" : ""
                        }`}
                        title={`Tap to hear ${element.label}`}
                      >
                        <span className={`text-2xl inline-block ${animationClass}`}>
                          {element.emoji}
                        </span>
                        <span className="text-[9px] font-black text-[#2D3436] truncate w-full mt-0.5 text-center block sm:hidden md:block lg:block">
                          {element.label}
                        </span>

                        {isAnimating && (
                          <span className="absolute inset-0 bg-[#EE4266]/10 pointer-events-none rounded-xl animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reading and Voice Settings Controls footer */}
            <div className="space-y-4 pt-3 border-t-2 border-dashed border-[#2D3436]/30 shrink-0">
              {/* Voice changer on page */}
              <div className="flex items-center justify-between gap-3 flex-wrap text-[#2D3436]">
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider">
                  <Volume2 className="w-4 h-4 text-[#EE4266]" />
                  <span>{t.ttsVoiceLabel}</span>
                </div>
                <select
                  value={activeVoice}
                  onChange={(e) => {
                    setActiveVoice(e.target.value as VoiceName);
                    stopCurrentAudio();
                    // Clear cached audio of current page to trigger redraw with new voice
                    setPages((prev) => {
                      const updated = [...prev];
                      updated[currentPageIndex] = { ...updated[currentPageIndex], audioUrl: undefined };
                      return updated;
                    });
                  }}
                  className="text-xs bg-white text-[#2D3436] font-bold px-2 py-1 rounded-lg border-2 border-[#2D3436] focus:outline-none"
                >
                  {VOICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label.split(" ")[0]} Voice
                    </option>
                  ))}
                </select>
              </div>

              {/* Interactive Read aloud triggers */}
              <div className="flex items-center space-x-3 select-none">
                <button
                  onClick={handleReadAloud}
                  disabled={ttsLoading}
                  className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center space-x-2 border-2 border-[#2D3436] cursor-pointer transition-all shadow-[3px_3px_0px_#2D3436] active:translate-y-0.5 active:shadow-none ${
                    isPlaying
                      ? "bg-[#EE4266] text-white"
                      : "bg-[#FFD23F] text-[#2D3436]"
                  }`}
                >
                  {ttsLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{t.brewingVoice}</span>
                    </>
                  ) : isPlaying ? (
                    <>
                      <Square className="w-4 h-4 fill-white text-white" />
                      <span>
                        {language === "uz" ? "O'qishdan To'xtatish" : language === "kaa" ? "Oqıwdı Toqtatıw" : language === "ru" ? "Остановить чтение" : "Stop Reading Aloud"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-[#2D3436] text-[#2D3436]" />
                      <span>{t.readAloudLabel}</span>
                    </>
                  )}
                </button>

                {/* Playing animated wave when audio actively playing */}
                {isPlaying && (
                  <div className="flex items-center space-x-1.5 px-3 py-2 bg-white border-2 border-[#2D3436] rounded-xl overflow-hidden shrink-0 shadow-[2px_2px_0px_#2D3436]">
                    <div className="w-1.5 h-3.5 bg-[#EE4266] rounded-full animate-wave-tall-1" />
                    <div className="w-1.5 h-2 bg-[#FFD23F] rounded-full animate-wave-short-1" />
                    <div className="w-1.5 h-4 bg-[#2D3436] rounded-full animate-wave-tall-2" />
                    <div className="w-1.5 h-1.5 bg-[#3BCEAC] rounded-full animate-wave-short-2" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Arrow Navigation control footer row */}
        <div className="flex items-center justify-between border-t-2 border-dashed border-[#2D3436]/40 pt-4 mt-6 shrink-0 select-none">
          <button
            onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentPageIndex === 0}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all border-2 cursor-pointer border-[#2D3436] ${
              currentPageIndex === 0 ? "opacity-30 pointer-events-none" : "bg-white hover:bg-[#FFD23F]/30 text-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.turnBackPage}</span>
          </button>

          {/* Staggered progress dot tracker */}
          <div className="flex items-center space-x-2">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIndex(idx)}
                aria-label={`Go to story page ${idx + 1}`}
                className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all ${
                  currentPageIndex === idx ? "bg-[#EE4266] border-2 border-[#2D3436] scale-125 shadow-[1px_1px_0px_#2D3436]" : "bg-white border-2 border-[#2D3436]/40 hover:bg-[#FFD23F]/30"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
            disabled={currentPageIndex === pages.length - 1}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all border-2 cursor-pointer border-[#2D3436] ${
              currentPageIndex === pages.length - 1 ? "opacity-30 pointer-events-none" : "bg-[#3BCEAC] hover:bg-[#2fb595] text-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <span>{t.nextStoryPage}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
