import React, { useState } from "react";
import { 
  Rocket, 
  Trees, 
  Waves, 
  Egg, 
  Sparkles, 
  BookOpen, 
  User, 
  Heart,
  Settings,
  HelpCircle,
  Clock
} from "lucide-react";
import { STORY_THEMES, VOICE_OPTIONS, StoryTheme } from "../data";
import { VoiceName } from "../types";
import { TranslationSet, LanguageCode } from "../translations";

interface StoryCreatorProps {
  onGenerate: (config: {
    theme: string;
    characterName: string;
    ageGroup: string;
    extraDetails: string;
    imageSize: "1K" | "2K" | "4K";
    voiceName: VoiceName;
    customTitle?: string; // Explicitly pass custom story titles
  }) => void;
  isLoading: boolean;
  loadingStatus: string;
  allowedThemeIds: string[]; // Controlled by parents
  maxComplexity: "easy" | "medium" | "hard" | "all"; // Controlled by parents
  onOpenParentControls: () => void;
  language?: LanguageCode;
  t: TranslationSet;
}

export default function StoryCreator({
  onGenerate,
  isLoading,
  loadingStatus,
  allowedThemeIds,
  maxComplexity,
  onOpenParentControls,
  language = "en",
  t,
}: StoryCreatorProps) {
  // Mode toggle: pre-sets vs. design custom canvas
  const [creatorMode, setCreatorMode] = useState<"presets" | "custom">("presets");

  // Preset theme states
  const [selectedThemeId, setSelectedThemeId] = useState<string>("space");
  const [characterName, setCharacterName] = useState<string>("Cosmo the Star Bunny");
  const [ageGroup, setAgeGroup] = useState<string>("5-7 years old");
  const [extraDetails, setExtraDetails] = useState<string>("");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [voiceName, setVoiceName] = useState<VoiceName>("Kore");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Custom user-input story builder state
  const [customTitle, setCustomTitle] = useState<string>("The Secret Cookie Cave");
  const [customCharacter, setCustomCharacter] = useState<string>("Barnaby the Cookie Bear");
  const [customSetting, setCustomSetting] = useState<string>("a bright purple forest filled with cookie trees");
  const [customPlot, setCustomPlot] = useState<string>("finding the long-lost giant chocolate chip cookie");

  // Keep themes in line with parent permissions
  const visibleThemes = STORY_THEMES.filter((t) => allowedThemeIds.includes(t.id));
  const fallbackTheme = visibleThemes[0] || STORY_THEMES[0];

  const selectedTheme = visibleThemes.find((t) => t.id === selectedThemeId) || fallbackTheme;

  const getThemeTitle = (themeId: string, fallback: string) => {
    switch (themeId) {
      case "space": return t.themeSpace;
      case "forest": return t.themeForest;
      case "ocean": return t.themeOcean;
      case "dinosaurs": return t.themeDinosaurs;
      case "bedtime": return t.themeBedtime;
      default: return fallback;
    }
  };

  const handleThemeChange = (theme: StoryTheme) => {
    setSelectedThemeId(theme.id);
    setCharacterName(theme.defaultCharacter);
  };

  const handlePresetDetail = (suggestion: string) => {
    setExtraDetails(suggestion);
  };

  const handleApplyCustomPreset = (title: string, character: string, setting: string, plot: string) => {
    setCustomTitle(title);
    setCustomCharacter(character);
    setCustomSetting(setting);
    setCustomPlot(plot);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creatorMode === "presets") {
      onGenerate({
        theme: `Setting: ${selectedTheme.setting}. Story core: ${selectedTheme.description}`,
        characterName,
        ageGroup,
        extraDetails,
        imageSize,
        voiceName,
      });
    } else {
      onGenerate({
        theme: `Write a customized adventure story book titled exactly "${customTitle}". Location Setting: ${customSetting}. The plot events must revolve around: ${customPlot}.`,
        characterName: customCharacter,
        ageGroup,
        extraDetails: "No additional twists needed. Stick strictly to the child's imaginative prompt details.",
        imageSize,
        voiceName,
        customTitle, // Send title separately to ensure absolute adherence
      });
    }
  };

  // Icon mapper helper
  const renderThemeIcon = (iconName: string, classNameString: string) => {
    switch (iconName) {
      case "Rocket":
        return <Rocket className={classNameString} />;
      case "Trees":
        return <Trees className={classNameString} />;
      case "Waves":
        return <Waves className={classNameString} />;
      case "Egg":
        return <Egg className={classNameString} />;
      default:
        return <Sparkles className={classNameString} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border-4 border-[#2D3436] rounded-[24px] shadow-[8px_8px_0px_0px_#2D3436] overflow-hidden transform transition-all">
      {/* Decorative Top Bar with primary yellow background and dark bottom outline */}
      <div className="bg-[#FFD23F] border-b-4 border-[#2D3436] h-4 w-full" />

      {isLoading ? (
        <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
          {/* Whimsical loading spinner container */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#EE4266] animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-dashed border-[#2D3436] animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-[#FFD23F] animate-bounce" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-[#2D3436] font-display">
              {t.loadingTitle}
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              {t.loadingSubtitle}
            </p>
          </div>

          {/* Real-time Loading Status Line with accent border and flat shadow */}
          <div className="bg-[#FFFBEB] border-2 border-[#2D3436] text-[#2D3436] px-6 py-3 rounded-2xl flex items-center space-x-3 text-sm font-black shadow-[4px_4px_0px_0px_#2D3436] animate-pulse">
            <Clock className="w-4 h-4 text-[#EE4266] shrink-0" />
            <span>{loadingStatus}</span>
          </div>

          <div className="w-full max-w-sm bg-[#FFFBEB] border-2 border-[#2D3436] rounded-full h-4 overflow-hidden p-0.5">
            <div className="bg-[#3BCEAC] h-full rounded-full animate-infinite-loading transition-all duration-500" style={{ width: "80%" }} />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          {/* Heading with parent controls entrance */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#2D3436] pb-5">
            <div className="text-center sm:text-left space-y-1">
              <div className="inline-flex items-center space-x-2 bg-[#FFD23F]/30 text-[#2D3436] border border-[#2D3436] px-3 py-1 rounded-full text-xs font-extrabold select-none">
                <BookOpen className="w-3.5 h-3.5 text-[#EE4266] animate-pulse" />
                <span>{t.headerTitle}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[#2D3436] tracking-tight">
                {t.creatorTitle}
              </h1>
              <p className="text-xs text-slate-500 max-w-lg">
                {t.creatorSubtitle}
              </p>
            </div>            <button
              type="button"
              onClick={onOpenParentControls}
              className="py-2 px-4 bg-[#FFD23F] hover:bg-[#eec02d] text-[#2D3436] border-2 border-[#2D3436] rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-[3px_3px_0px_0px_#2D3436] transition-all cursor-pointer shrink-0"
              title={t.buttonParentControls}
            >
              <span>{t.buttonParentControls}</span>
            </button>
          </div>

          {/* Toggle Mode tab switcher styled as neobrutalist custom pill */}
          <div className="flex bg-white border-2 border-[#2D3436] p-1 rounded-2xl w-full max-w-md mx-auto relative select-none shadow-[3px_3px_0px_0px_#2D3436]">
            <button
              type="button"
              onClick={() => setCreatorMode("presets")}
              className={`flex-1 py-2 rounded-xl text-xs font-black tracking-tight transition-all text-center cursor-pointer uppercase ${
                creatorMode === "presets"
                  ? "bg-[#FFD23F] text-[#2D3436] border border-[#2D3436] shadow-sm"
                  : "text-neutral-500 hover:text-[#2D3436]"
              }`}
            >
              {t.tabPresets}
            </button>
            <button
              type="button"
              onClick={() => setCreatorMode("custom")}
              className={`flex-1 py-2 rounded-xl text-xs font-black tracking-tight transition-all text-center cursor-pointer uppercase ${
                creatorMode === "custom"
                  ? "bg-[#3BCEAC] text-[#2D3436] border border-[#2D3436] shadow-sm"
                  : "text-neutral-500 hover:text-[#2D3436]"
              }`}
            >
              {t.tabBlankCanvas}
            </button>
          </div>

          {creatorMode === "presets" ? (
            /* PRESET ADVENTURE PORTAL */
            <div className="space-y-6">
              {/* Theme Selector */}
              <div className="space-y-4">
                <label className="block text-base font-black text-[#2D3436] flex items-center gap-2 select-none">
                  <span className="flex items-center justify-center bg-[#FFD23F] text-[#2D3436] border border-[#2D3436] w-6 h-6 rounded-lg text-xs font-black">1</span>
                  {t.chooseThemeLabel}
                </label>
                {visibleThemes.length === 0 ? (
                  <div className="p-6 bg-[#FFFBEB] rounded-2xl border-2 border-dashed border-[#2D3436] text-center space-y-3">
                    <p className="text-sm font-bold text-[#2D3436]">Themes are currently filtered by parenting settings.</p>
                    <button
                      type="button"
                      onClick={onOpenParentControls}
                      className="text-xs bg-[#FFD23F] text-[#2D3436] border border-[#2D3436] font-bold py-1 px-3 rounded-xl hover:bg-[#eec02d]"
                    >
                      Adjust Theme Filters In Settings
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    {visibleThemes.map((theme) => {
                      const isSelected = selectedThemeId === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => handleThemeChange(theme)}
                          className={`relative p-3.5 rounded-2xl border-2 border-[#2D3436] text-left flex flex-col justify-between transition-all duration-200 cursor-pointer h-full ${
                            isSelected
                              ? "bg-[#FFD23F]/30 shadow-[4px_4px_0px_0px_#2D3436] transform scale-[1.02]"
                              : "bg-white hover:bg-[#FFFBEB] hover:shadow-[2px_2px_0px_0px_#2D3436]"
                          }`}
                        >
                          <div>
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.color} border-2 border-[#2D3436] text-white flex items-center justify-center shadow-sm mb-2.5`}>
                              {renderThemeIcon(theme.icon, "w-4 h-4")}
                            </div>
                            <h3 className="font-extrabold text-[#2D3436] text-xs leading-tight">{getThemeTitle(theme.id, theme.title)}</h3>
                          </div>
                          <p className="text-[10px] text-zinc-600 mt-1.5 line-clamp-2 leading-relaxed">{theme.description}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2 text-left">
                {/* Character Info */}
                <div className="space-y-3">
                  <label htmlFor="character-input" className="block text-base font-black text-[#2D3436] flex items-center gap-2">
                    <span className="flex items-center justify-center bg-[#FFD23F] border border-[#2D3436] text-[#2D3436] w-6 h-6 rounded-lg text-xs font-black">2</span>
                    {t.characterNameLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-neutral-400" />
                    </div>
                    <input
                      id="character-input"
                      type="text"
                      required
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      placeholder={t.characterNamePlaceholder}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#2D3436] rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#EE4266] text-xs font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Type any funny name, like "Cosmo the Cupcake Kitten" or your child's own name!
                  </p>
                </div>

                {/* Target Age Range Selector */}
                <div className="space-y-3">
                  <label className="block text-base font-black text-[#2D3436] flex items-center gap-2">
                    <span className="flex items-center justify-center bg-[#FFD23F] border border-[#2D3436] text-[#2D3436] w-6 h-6 rounded-lg text-xs font-black">3</span>
                    {t.ageGroupLabel}
                  </label>
                  <div className="flex gap-2">
                    {["3-4 years old", "5-7 years old", "8+ years old"].map((age) => {
                      const isActive = ageGroup === age;
                      return (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setAgeGroup(age)}
                          className={`flex-1 py-3 text-xs font-black rounded-2xl border-2 border-[#2D3436] transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#3BCEAC] text-[#2D3436] shadow-[3px_3px_0px_#2D3436] -translate-y-0.5"
                              : "bg-white text-zinc-600 hover:bg-[#FFFBEB] hover:shadow-[1px_1px_0px_#2D3436]"
                          }`}
                        >
                          {age === "3-4 years old" ? t.ageGroupEasy : age === "5-7 years old" ? t.ageGroupMedium : t.ageGroupHard}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[#2D3436] font-bold">
                    Parent filters vocabulary, prose complexity, and lengths.
                  </p>
                </div>
              </div>

              {/* Quick suggestions / plot add-ons */}
              <div className="space-y-3 text-left">
                <label htmlFor="details-input" className="block text-base font-black text-[#2D3436] flex items-center gap-2">
                  <span className="flex items-center justify-center bg-[#FFD23F] border border-[#2D3436] text-[#2D3436] w-6 h-6 rounded-lg text-xs font-black">4</span>
                  {t.creativeTwistsLabel}
                </label>
                <textarea
                  id="details-input"
                  rows={2}
                  value={extraDetails}
                  onChange={(e) => setExtraDetails(e.target.value)}
                  placeholder={t.creativeTwistsPlaceholder}
                  className="w-full px-4 py-3 bg-white border-2 border-[#2D3436] rounded-2xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#EE4266] text-xs resize-none font-bold"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500 font-bold select-none">Quick ideas:</span>
                  <button
                    type="button"
                    onClick={() => handlePresetDetail(selectedTheme.extraPromptSuggestion)}
                    className="text-[10px] bg-[#FFFBEB] text-[#2D3436] hover:bg-[#FFD23F] border-2 border-[#2D3436] px-2.5 py-1 rounded-full cursor-pointer transition-colors font-bold"
                  >
                    + {selectedTheme.extraPromptSuggestion}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetDetail("has a friendly robot sidekick named Beep")}
                    className="text-[10px] bg-[#FFFBEB] text-[#2D3436] hover:bg-[#FFD23F] border-2 border-[#2D3436] px-2.5 py-1 rounded-full cursor-pointer transition-colors font-bold"
                  >
                    + robot sidekick
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* CUSTOM CANVAS CREATOR MODE */
            <div className="space-y-5">
              {/* Quick pre-set prompt chips for Custom Builder */}
              <div className="p-4 bg-[#FFFBEB] border-2 border-[#2D3436] rounded-2xl shadow-[3px_3px_0px_#2D3436]">
                <span className="block text-[11px] text-[#2D3436] font-black uppercase tracking-wider mb-2 select-none">🌟 {t.needASpark}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyCustomPreset(
                      language === "uz" ? "Sehrli Shakar Kaliti" : language === "kaa" ? "Sehrli Shakar Gilti" : language === "ru" ? "Потерянный конфетный ключ" : "The Lost Candy Key",
                      language === "uz" ? "Bella Quyoncha" : language === "kaa" ? "Bella Qoyan" : language === "ru" ? "Зайка Белла" : "Bella the Bunny",
                      language === "uz" ? "marshmallow daraxtlari va pufakchali ko'llar bo'lgan pushti ertak o'rmoni" : language === "kaa" ? "marshmallow teregi hám kóbikli kól bar qızg'ısh toqay" : language === "ru" ? "розовый лес с зефирными деревьями и лужами из пузырей" : "a pink forest with marshmallow trees and bubble puddles",
                      language === "uz" ? "daraxt ichidagi shirinliklar xonasi eshigini ochish uchun kumush shakarli kalit qidirish" : language === "kaa" ? "terek ishındag'ı gáziynegiltin tabıw" : language === "ru" ? "поиск серебряного ключа для открытия древнего сундука со сладостями" : "finding a silver candy key to unlock the ancient tree trunk full of sparkles"
                    )}
                    className="p-2 text-left bg-white border-2 border-[#2D3436] rounded-xl text-xs flex items-start space-x-2 cursor-pointer hover:bg-[#FFD23F]/20 hover:shadow-[2px_2px_0px_#2D3436] transition-all h-full"
                  >
                    <span className="text-xl shrink-0">🐰</span>
                    <div>
                      <span className="font-extrabold text-[#2D3436] block text-[11px] leading-tight">{t.presetCandyForest}</span>
                      <span className="text-[9px] text-[#2D3436]/60 block line-clamp-2 leading-tight">{t.presetCandyForestDesc}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyCustomPreset(
                      language === "uz" ? "Suv Osti Shirinlik Shousi" : language === "kaa" ? "Suw Astı Shirinlik Shousı" : language === "ru" ? "Праздник русалочьего печенья" : "Mermaid Cookie Festival",
                      language === "uz" ? "Mirabella Suvparisi" : language === "kaa" ? "Mirabella Suwperisi" : language === "ru" ? "Русалочка Мирабель" : "Mirabelle the Mermaid",
                      language === "uz" ? "yorqin shisha uylari bo'lgan neon rangli koral bog'lari" : language === "kaa" ? "reńli marjanlı suw astı sarayı" : language === "ru" ? "замок из цветного стекла в неоновых коралловых кухнях" : "an underwater sea glass castle inside neon coral kitchens",
                      language === "uz" ? "mehribon qo'shiqchi kit uchun asal va shokoladli shirin pechyenilar pishirish" : language === "kaa" ? "shokolad pısiqların pisiriw hám dıqqat barlıq balıqlarǵa taratıw" : language === "ru" ? "выпечка теплого печенья с шоколадной крошкой для дружелюбного поющего кита" : "baking warm honey-kelp chocolate chip cookies for the friendly singing whale"
                    )}
                    className="p-2 text-left bg-white border-2 border-[#3bceac] rounded-xl text-xs flex items-start space-x-2 cursor-pointer hover:bg-[#3bceac]/10 hover:shadow-[2px_2px_0px_#3bceac] transition-all h-full"
                  >
                    <span className="text-xl shrink-0">🧜‍♀️</span>
                    <div>
                      <span className="font-extrabold text-[#2D3436] block text-[11px] leading-tight">{t.presetUnderseaBakery}</span>
                      <span className="text-[9px] text-[#2D3436]/60 block line-clamp-2 leading-tight">{t.presetUnderseaBakeryDesc}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyCustomPreset(
                      language === "uz" ? "Sehrli Kosmik Hippo Planeti" : language === "kaa" ? "Sehrli Kóshkinshe Hippo Planeti" : language === "ru" ? "Космическая зефирная планета" : "The Cosmic Marshmallow Planet",
                      language === "uz" ? "Gamilton Begemot" : language === "kaa" ? "Gamilton Begemot" : language === "ru" ? "Бегемотик Гамильтон" : "Hamilton the Hippo",
                      language === "uz" ? "limonli shirinliklardir yasalgan yulduzlar va kosmik ajoyib trambolinlar" : language === "kaa" ? "limonlı aspan hám aspan bolds dónaları" : language === "ru" ? "космическое пространство с астероидами-батутами и лимонными звездами" : "outer space with trampoline asteroids and stars made of lemon tarts",
                      language === "uz" ? "shirin qulupnayli sut galaktikasi bo'ylab sayohat qilish va neon kometadan tilak tilash" : language === "kaa" ? "reńli kometadan tilek tilew" : language === "ru" ? "путешествие сквозь клубничные галактики, чтобы загадать желание на неоновую комету" : "sailing through strawberry milk galaxies so he can make a wish on a neon comet"
                    )}
                    className="p-2 text-left bg-white border-2 border-[#2D3436] rounded-xl text-xs flex items-start space-x-2 cursor-pointer hover:bg-[#FFD23F]/20 hover:shadow-[2px_2px_0px_#2D3436] transition-all h-full"
                  >
                    <span className="text-xl shrink-0">🚀</span>
                    <div>
                      <span className="font-extrabold text-[#2D3436] block text-[11px] leading-tight">{t.presetSpaceHippo}</span>
                      <span className="text-[9px] text-[#2D3436]/60 block line-clamp-2 leading-tight">{t.presetSpaceHippoDesc}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyCustomPreset(
                      language === "uz" ? "Kulgich Pufak Daraxti" : language === "kaa" ? "Kúlkish Shar Teregi" : language === "ru" ? "Визгливое надувное дерево" : "The Giggling Balloon Tree",
                      language === "uz" ? "Sparki Olmaxon" : language === "kaa" ? "Sparki Tiyın" : language === "ru" ? "Белочка Спарки" : "Sparky the Squirrel",
                      language === "uz" ? "sariq maysazorlar va asalli shirin shabada bo'lgan sakraydigan o'rmon" : language === "kaa" ? "sakraytug'ın reńli shóp bar toqay" : language === "ru" ? "волшебный упругий лес с лужайкой из леденцов и музыкальным ветерком" : "a magical bouncy forest with lollipop grass and music breezes",
                      language === "uz" ? "issiq oltin konusni topish, u sehrli havo pufakchalarini chiqaradi" : language === "kaa" ? "altın terek saptın hawadan sharlar shıg'arıwı" : language === "ru" ? "поиск теплой золотой шишки, которая прорастает волшебными ветвями с надувными шарами" : "finding a warm golden pinecone that sprouts magic branches blooming tiny glowing balloons"
                    )}
                    className="p-2 text-left bg-white border-2 border-[#EE4266] rounded-xl text-xs flex items-start space-x-2 cursor-pointer hover:bg-[#EE4266]/10 hover:shadow-[2px_2px_0px_#EE4266] transition-all h-full"
                  >
                    <span className="text-xl shrink-0">🐿️</span>
                    <div>
                      <span className="font-extrabold text-[#2D3436] block text-[11px] leading-tight">{t.presetBalloonTree}</span>
                      <span className="text-[9px] text-[#2D3436]/60 block line-clamp-2 leading-tight">{t.presetBalloonTreeDesc}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyCustomPreset(
                      language === "uz" ? "Kamalak Poezdning Surnayi" : language === "kaa" ? "Kamalak Poezd Sırnaylıg'ı" : language === "ru" ? "Гудок Радужного поезда" : "The Rainbow Train's Whistle",
                      language === "uz" ? "Chuffi Kichik Poezd" : language === "kaa" ? "Chuffi Kishi Poezd" : language === "ru" ? "Паровозик Чуффи" : "Chuffy the Tiny Train",
                      language === "uz" ? "shirin sirop daryolari o'tgan paxta konfetli ajoyib bulutlar" : language === "kaa" ? "shirin qantlı aspan bulıtları hám dáryalar" : language === "ru" ? "облака из сахарной ваты с реками из теплого сиропа и горками" : "cotton candy clouds with warm syrup rivers and sky-slides",
                      language === "uz" ? "osmondan iliq rang-barang shirin yomg'ir yog'ishi uchun yo'qolgan hushtakni qidirish" : language === "kaa" ? "aspang'a reńli sırnaymen reńli bult suwshılaw" : language === "ru" ? "поиск потерянного музыкального свистка, чтобы небо пролилось разноцветным дождем" : "searching for his lost musical whistle to make the sky drop clean watercolor raindrop sprinkles"
                    )}
                    className="p-2 text-left bg-white border-2 border-[#2D3436] rounded-xl text-xs flex items-start space-x-2 cursor-pointer hover:bg-[#FFD23F]/20 hover:shadow-[2px_2px_0px_#2D3436] transition-all h-full"
                  >
                    <span className="text-xl shrink-0">🚂</span>
                    <div>
                      <span className="font-extrabold text-[#2D3436] block text-[11px] leading-tight">{t.presetRainbowTrain}</span>
                      <span className="text-[9px] text-[#2D3436]/60 block line-clamp-2 leading-tight">{t.presetRainbowTrainDesc}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom Input boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="custom-title" className="text-xs font-black text-[#2D3436] block uppercase tracking-wider">{t.labelCustomTitle}</label>
                  <input
                    id="custom-title"
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={t.placeholderCustomTitle}
                    className="w-full px-3 py-2 bg-white border-2 border-[#2D3436] rounded-xl text-xs font-bold text-[#2D3436] focus:outline-none focus:border-[#EE4266]"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label htmlFor="custom-character" className="text-xs font-black text-[#2D3436] block uppercase tracking-wider">{t.labelCustomCharacter}</label>
                  <input
                    id="custom-character"
                    type="text"
                    required
                    value={customCharacter}
                    onChange={(e) => setCustomCharacter(e.target.value)}
                    placeholder={t.placeholderCustomCharacter}
                    className="w-full px-3 py-2 bg-white border-2 border-[#2D3436] rounded-xl text-xs font-bold text-[#2D3436] focus:outline-none focus:border-[#EE4266]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="custom-setting" className="text-xs font-black text-[#2D3436] block uppercase tracking-wider">{t.labelCustomSetting}</label>
                <input
                  id="custom-setting"
                  type="text"
                  required
                  value={customSetting}
                  onChange={(e) => setCustomSetting(e.target.value)}
                  placeholder={t.placeholderCustomSetting}
                  className="w-full px-3 py-2 bg-white border-2 border-[#2D3436] rounded-xl text-xs font-bold text-[#2D3436] focus:outline-none focus:border-[#EE4266]"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="custom-plot" className="text-xs font-black text-[#2D3436] block uppercase tracking-wider">{t.labelCustomPlot}</label>
                <textarea
                  id="custom-plot"
                  rows={2}
                  required
                  value={customPlot}
                  onChange={(e) => setCustomPlot(e.target.value)}
                  placeholder={t.placeholderCustomPlot}
                  className="w-full px-3 py-2 bg-white border-2 border-[#2D3436] rounded-xl text-xs font-bold text-[#2D3436] focus:outline-none focus:border-[#EE4266] resize-none animate-fade-in"
                />
              </div>

              {/* Target Age Range Selector in Custom mode as well */}
              <div className="text-left space-y-2">
                <label className="text-xs font-black text-[#2D3436] block uppercase tracking-wider">{t.labelCustomWhom}</label>
                <div className="flex gap-2 max-w-sm">
                  {["3-4 years old", "5-7 years old", "8+ years old"].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setAgeGroup(age)}
                      className={`flex-1 py-2 text-[11px] font-black rounded-xl border-2 border-[#2D3436] transition-all cursor-pointer ${
                        ageGroup === age
                          ? "bg-[#3BCEAC] text-[#2D3436] shadow-[3px_3px_0px_#2D3436]"
                          : "bg-white text-zinc-600 hover:bg-[#FFFBEB] hover:shadow-[1px_1px_0px_#2D3436]"
                      }`}
                    >
                      {age === "3-4 years old" ? "Junior (3-4)" : age === "5-7 years old" ? "Middle (5-7)" : "Senior (8+)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
                      {/* Collapsible Parental / Advanced Settings */}
          <div className="border-t-2 border-[#2D3436] pt-4 select-none">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-black text-[#2D3436] hover:text-[#EE4266] flex items-center gap-1.5 focus:outline-none cursor-pointer uppercase tracking-wider"
            >
              <Settings className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvanced ? "rotate-90" : ""}`} />
              <span>{showAdvanced ? "Hide" : "Show"} Voice & Image Quality Settings</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 rounded-2xl bg-[#FFFBEB] border-2 border-[#2D3436] grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in text-left shadow-[4px_4px_0px_0px_#2D3436]">
                {/* Image Size Selection requirement */}
                <div className="space-y-1.5">
                  <label htmlFor="resolution-select" className="text-xs font-black text-[#2D3436] flex items-center justify-between uppercase tracking-wider">
                    <span>AI Illustration Quality</span>
                    <span className="text-[9px] text-slate-500 lowercase">gemini-3-pro-image-preview</span>
                  </label>
                  <select
                    id="resolution-select"
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value as "1K" | "2K" | "4K")}
                    className="w-full px-3 py-2 bg-white border-2 border-[#2D3436] rounded-xl text-xs font-bold text-[#2D3436] focus:outline-none focus:border-[#EE4266]"
                  >
                    <option value="1K">1K High Definition (Standard)</option>
                    <option value="2K">2K Super Detailed (Crisp Sharp)</option>
                    <option value="4K">4K Masterpiece Quality (Best Shadows)</option>
                  </select>
                </div>

                {/* Narrator voice */}
                <div className="space-y-1.5">
                  <label htmlFor="voice-select" className="text-xs font-black text-[#2D3436] flex items-center justify-between uppercase tracking-wider">
                    <span>Narrator Voice Selection</span>
                    <span className="text-[9px] text-slate-500 lowercase">gemini-3.1-flash-tts-preview</span>
                  </label>
                  <select
                    id="voice-select"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value as VoiceName)}
                    className="w-full px-3 py-2 bg-white border-2 border-[#2D3436] rounded-xl text-xs font-bold text-[#2D3436] focus:outline-none focus:border-[#EE4266]"
                  >
                    {VOICE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action CTA with Sparkles */}
          <button
            type="submit"
            className="w-full py-4 text-[#2D3436] font-black rounded-2xl bg-[#FFD23F] hover:bg-[#eec02d] border-4 border-[#2D3436] text-base md:text-lg shadow-[6px_6px_0px_0px_#2D3436] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[10px_10px_0px_0px_#2D3436] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all cursor-pointer select-none flex items-center justify-center space-x-3 uppercase tracking-wider"
          >
            <Sparkles className="w-5 h-5 text-[#EE4266] animate-spin" style={{ animationDuration: "3s" }} />
            <span>{t.buttonCreateBook} ✨</span>
          </button>
        </form>
      )}
    </div>
  );
}
