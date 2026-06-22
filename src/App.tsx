import { useState, useEffect } from "react";
import { Sparkles, HelpingHand, MessageCircle, Moon, Sun, Info, Lock, Clock } from "lucide-react";
import StoryCreator from "./components/StoryCreator";
import StoryBook from "./components/StoryBook";
import CompanionBot from "./components/CompanionBot";
import ParentControls from "./components/ParentControls";
import { Story, VoiceName, ParentSettings, HistoryItem } from "./types";
import { TRANSLATIONS, LanguageCode } from "./translations";

export default function App() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [characterNameState, setCharacterNameState] = useState<string>("");
  const [themeTitleState, setThemeTitleState] = useState<string>("");
  const [imageSizeState, setImageSizeState] = useState<"1K" | "2K" | "4K">("1K");
  const [voiceNameState, setVoiceNameState] = useState<VoiceName>("Kore");

  const [languageState, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem("story_lang");
      if (saved === "uz" || saved === "kaa" || saved === "ru" || saved === "en") {
        return saved;
      }
    } catch {}
    return "en";
  });

  const t = TRANSLATIONS[languageState];

  useEffect(() => {
    try {
      localStorage.setItem("story_lang", languageState);
    } catch {}
  }, [languageState]);

  // Parental settings and history
  const [parentSettings, setParentSettings] = useState<ParentSettings>(() => {
    try {
      const saved = localStorage.getItem("story_parent_settings");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      dailyMinLimit: 15, // Default 15 minute limit per day
      filterThemes: ["space", "forest", "ocean", "dinosaurs", "bedtime"],
      maxComplexity: "all",
      statsDailyMinutes: {},
      passcode: "1234",
    };
  });

  const [readingHistory, setReadingHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("story_reading_history");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [currentMinutesToday, setCurrentMinutesToday] = useState<number>(0);
  const [isParentControlsOpen, setIsParentControlsOpen] = useState<boolean>(false);

  // Sync today's minutes from the saved parentSettings stats object
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString();
    const minCalculated = parentSettings.statsDailyMinutes[todayStr] || 0;
    setCurrentMinutesToday(minCalculated);
  }, [parentSettings.statsDailyMinutes]);

  // Keep countdown minutes incrementing while activeStory is open
  useEffect(() => {
    if (!activeStory) return;

    const interval = setInterval(() => {
      setCurrentMinutesToday((prev) => {
        const nextVal = prev + 1;
        
        // Write back into the stats list
        const todayStr = new Date().toLocaleDateString();
        const updatedStats = { ...parentSettings.statsDailyMinutes };
        updatedStats[todayStr] = nextVal;

        const updatedSettings: ParentSettings = {
          ...parentSettings,
          statsDailyMinutes: updatedStats,
        };
        setParentSettings(updatedSettings);
        localStorage.setItem("story_parent_settings", JSON.stringify(updatedSettings));

        return nextVal;
      });
    }, 60 * 1000); // Trigger every 1 minute

    return () => clearInterval(interval);
  }, [activeStory, parentSettings]);

  const handleUpdateSettings = (newSettings: ParentSettings) => {
    setParentSettings(newSettings);
    localStorage.setItem("story_parent_settings", JSON.stringify(newSettings));
  };

  const handleClearHistory = () => {
    setReadingHistory([]);
    localStorage.removeItem("story_reading_history");
  };

  // Loading indicator states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [errorText, setErrorText] = useState<string | null>(null);

  // Chat window state
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Core handler to generate story pages (text only initially, illustrations loaded lazily inside StoryBook)
  const handleGenerateStory = async (config: {
    theme: string;
    characterName: string;
    ageGroup: string;
    extraDetails: string;
    imageSize: "1K" | "2K" | "4K";
    voiceName: VoiceName;
    customTitle?: string;
  }) => {
    setIsLoading(true);
    setErrorText(null);
    setLoadingStatus("Sending magical request to Gemini...");
    setCharacterNameState(config.characterName);
    setThemeTitleState(config.customTitle || config.theme.split(".")[0]); // Simplified theme title
    setImageSizeState(config.imageSize);
    setVoiceNameState(config.voiceName);

    try {
       // Step 1: generate story structure
       setLoadingStatus("Spinning storybook pages & designing illustration prompts...");
       const response = await fetch("/api/story/generate", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           theme: config.theme,
           characterName: config.characterName,
           ageGroup: config.ageGroup,
           extraDetails: config.extraDetails,
           customTitle: config.customTitle, // Send explicit user-written title
           language: languageState === "uz" ? "Uzbek" : languageState === "kaa" ? "Karakalpak" : languageState === "ru" ? "Russian" : "English",
         }),
       });

      if (!response.ok) {
        throw new Error("Failed to weave the storybook structure. Let's try once more!");
      }

      const generatedStory = (await response.json()) as Story;

      // Ensure pages list is sound
      if (!generatedStory.pages || generatedStory.pages.length === 0) {
        throw new Error("Gemini story text returned empty! Let's cast another spell.");
      }

      setLoadingStatus("Magic complete! Opening your personalized book...");
      setActiveStory(generatedStory);

      // Append entry to parent-logged history securely
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        title: generatedStory.title || config.characterName + "'s story",
        characterName: config.characterName,
        themeId: config.theme.toLowerCase().includes("space")
          ? "space"
          : config.theme.toLowerCase().includes("forest")
          ? "forest"
          : config.theme.toLowerCase().includes("ocean")
          ? "ocean"
          : config.theme.toLowerCase().includes("dinosaur")
          ? "dinosaurs"
          : config.theme.toLowerCase().includes("sleepy")
          ? "bedtime"
          : "custom",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        pagesCount: generatedStory.pages.length,
      };

      setReadingHistory((prev) => {
        const nextHist = [newHistoryItem, ...prev].slice(0, 50);
        localStorage.setItem("story_reading_history", JSON.stringify(nextHist));
        return nextHist;
      });
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "We ran into an astronomical bump! Pls retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#2D3436] flex flex-col items-center justify-between pb-10 transition-colors relative overflow-x-hidden">
      {/* Whimsical Background Elements for Kids */}
      <div className="absolute top-12 left-10 w-12 h-12 bg-[#EE4266]/10 border-2 border-dashed border-[#2D3436]/40 rounded-full animate-pulse pointer-events-none select-none" />
      <div className="absolute top-32 right-12 w-14 h-14 bg-[#3BCEAC]/15 border-2 border-[#2D3436]/25 rotate-12 pointer-events-none select-none" />
      <div className="absolute bottom-40 left-16 w-16 h-16 bg-[#FFD23F]/20 border-2 border-[#2D3436]/20 rounded-lg -rotate-12 pointer-events-none select-none animate-spin" style={{ animationDuration: "20s" }} />
      <div className="absolute bottom-24 right-20 w-8 h-8 bg-[#EE4266]/15 border-2 border-[#2D3436]/30 rounded-full pointer-events-none select-none" />

      {/* Primary header branding */}
      <header className="w-full bg-white border-b-4 border-[#2D3436] py-3 px-6 select-none relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-7 h-7 bg-[#EE4266] border-2 border-[#2D3436] transform rotate-45 shrink-0 shadow-sm" />
            <div className="text-left">
              <span className="text-2xl font-black text-[#2D3436] uppercase tracking-wider font-display">
                {t.headerTitle}
              </span>
              <p className="text-[10px] text-[#2D3436] font-extrabold uppercase tracking-widest leading-none">
                {t.headerSubtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Custom Neobrutalism Language Dropdown Select */}
            <div className="relative select-none">
              <select
                id="language-select"
                value={languageState}
                onChange={(e) => setLanguageState(e.target.value as LanguageCode)}
                className="appearance-none font-black text-xs bg-white text-[#2D3436] pl-3 pr-8 py-2 rounded-xl border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] hover:shadow-[1px_1px_0px_#2D3436] hover:translate-y-[1px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer focus:outline-none"
              >
                <option value="en">🇺🇸 English</option>
                <option value="uz">🇺🇿 O'zbekcha</option>
                <option value="kaa">🇰🇦 Qoraqalpoqcha</option>
                <option value="ru">🇷🇺 Русский</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#2D3436] text-[8px]">
                ▼
              </div>
            </div>

            {/* Ask AI Sidekick */}
            {activeStory && (
              <button
                id="ask-ai-sidekick-btn"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="py-2 px-3.5 bg-[#3BCEAC] hover:bg-[#2fc4a2] border-2 border-[#2D3436] rounded-xl text-xs font-black text-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <HelpingHand className="w-3.5 h-3.5 text-[#2D3436]" />
                <span>{t.buttonAskSidekick}</span>
              </button>
            )}

            {/* Always visible parent controls portal widget */}
            <button
              id="parent-controls-btn"
              onClick={() => setIsParentControlsOpen(true)}
              className="py-2 px-3.5 bg-[#FFD23F] hover:bg-[#eec02d] text-[#2D3436] border-2 border-[#2D3436] rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-[2px_2px_0px_#2D3436] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              title={t.buttonParentControls}
            >
              <span>{t.buttonParentControls}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {errorText && (
        <div className="w-full max-w-4xl px-4 mt-2">
          <div className="bg-[#EE4266]/10 border-2 border-[#2D3436] text-[#2D3436] p-4 rounded-2xl text-sm font-semibold shadow-[3px_3px_0px_0px_#2D3436] flex items-center space-x-3 select-text">
            <span>⚠️</span>
            <span className="flex-1">{errorText}</span>
            <button onClick={() => setErrorText(null)} className="text-[#EE4266] hover:text-[#2D3436] font-bold text-xs hover:underline cursor-pointer">
              {t.errorDismiss}
            </button>
          </div>
        </div>
      )}

      {/* Main Container Stage */}
      <main className="w-full px-4 flex-1 flex items-center justify-center">
        {parentSettings.dailyMinLimit > 0 && currentMinutesToday >= parentSettings.dailyMinLimit ? (
          /* POLITE TIME LOCK SCREEN FOR EYE RECOVERY */
          <div className="w-full max-w-xl mx-auto p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl text-center space-y-6 border border-amber-100 select-none animate-fade-in relative z-20">
            <div className="w-20 h-20 rounded-full bg-amber-50 mx-auto flex items-center justify-center text-amber-500 animate-bounce">
              <Clock className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800">{t.timeBreakTitle}</h2>
              <div className="text-sm font-semibold text-[#8C7A5C] bg-amber-50/60 p-4 rounded-2xl border border-dashed border-[#EADCC1] space-y-1">
                <p>{t.timeBreakMessage.replace("{minutes}", String(currentMinutesToday))}</p>
                <p className="text-xs text-neutral-500 font-normal">{t.timeBreakSub}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsParentControlsOpen(true)}
                className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer animate-pulse"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.timeBreakUnlock}</span>
              </button>
            </div>
          </div>
        ) : activeStory ? (
          <StoryBook
            story={activeStory}
            characterName={characterNameState}
            imageSize={imageSizeState}
            voiceName={voiceNameState}
            onBackToCreator={() => setActiveStory(null)}
            onOpenChat={() => setIsChatOpen(true)}
            language={languageState}
            t={t}
          />
        ) : (
          <StoryCreator
            onGenerate={handleGenerateStory}
            isLoading={isLoading}
            loadingStatus={loadingStatus}
            allowedThemeIds={parentSettings.filterThemes}
            maxComplexity={parentSettings.maxComplexity}
            onOpenParentControls={() => setIsParentControlsOpen(true)}
            language={languageState}
            t={t}
          />
        )}
      </main>

      {/* Parental Settings Zone modal */}
      <ParentControls
        isOpen={isParentControlsOpen}
        onClose={() => setIsParentControlsOpen(false)}
        settings={parentSettings}
        onUpdateSettings={handleUpdateSettings}
        readingHistory={readingHistory}
        onClearHistory={handleClearHistory}
        currentMinutesToday={currentMinutesToday}
        language={languageState}
        t={t}
      />

      {/* Floating Chatbot Assistant panel (multimodal sidekick) */}
      <CompanionBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        characterName={characterNameState}
        themeTitle={themeTitleState}
        language={languageState}
        t={t}
      />

      {/* Cozy, quiet humanistic footer */}
      <footer className="w-full text-center py-6 text-xs text-neutral-400 select-none border-t border-[#DECDB3]/30 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive sandbox active and ready!</span>
          </div>
          <p className="opacity-85 text-[10px] md:text-xs">
            Utilizes <strong className="text-zinc-500 font-bold">gemini-3.1-flash-tts-preview</strong>, <strong className="text-zinc-500 font-bold">gemini-3-pro-image-preview</strong>, and specific multi-tier chatbots.
          </p>
        </div>
      </footer>
    </div>
  );
}
