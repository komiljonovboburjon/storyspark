import React, { useState, useEffect } from "react";
import { Shield, Clock, Eye, AlertCircle, Trash2, CheckCircle, BarChart3, Lock } from "lucide-react";
import { ParentSettings, HistoryItem } from "../types";
import { STORY_THEMES } from "../data";
import { TranslationSet, LanguageCode } from "../translations";

interface ParentControlsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ParentSettings;
  onUpdateSettings: (newSettings: ParentSettings) => void;
  readingHistory: HistoryItem[];
  onClearHistory: () => void;
  currentMinutesToday: number;
  language?: LanguageCode;
  t?: TranslationSet;
}

export default function ParentControls({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  readingHistory,
  onClearHistory,
  currentMinutesToday,
  language = "en",
  t,
}: ParentControlsProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [mathProblem, setMathProblem] = useState<{ q: string; a: number }>({ q: "6 x 7", a: 42 });
  const [mathInput, setMathInput] = useState<string>("");
  const [gateError, setGateError] = useState<string | null>(null);

  // Generate a random math question for the lock gate
  useEffect(() => {
    if (isOpen) {
      const num1 = Math.floor(Math.random() * 8) + 4; // 4 to 11
      const num2 = Math.floor(Math.random() * 7) + 3; // 3 to 9
      const operates = ["+", "x"];
      const op = operates[Math.floor(Math.random() * operates.length)];
      
      let answer = 0;
      let question = "";
      if (op === "+") {
        question = `${num1 * 3} + ${num2 * 2}`;
        answer = (num1 * 3) + (num2 * 2);
      } else {
        question = `${num1} x ${num2}`;
        answer = num1 * num2;
      }
      setMathProblem({ q: question, a: answer });
      setIsUnlocked(false);
      setMathInput("");
      setPasscodeInput("");
      setGateError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);

    // Verify passcode or math question
    const matchedPass = passcodeInput.trim() === settings.passcode;
    const matchedMath = parseInt(mathInput.trim(), 10) === mathProblem.a;

    if (matchedPass || matchedMath) {
      setIsUnlocked(true);
    } else {
      setGateError("Incorrect passcode or math answer. Parents only!");
    }
  };

  const handleToggleThemeFilter = (themeId: string) => {
    let updatedThemes = [...settings.filterThemes];
    if (updatedThemes.includes(themeId)) {
      // Prevent disabling everything
      if (updatedThemes.length > 1) {
        updatedThemes = updatedThemes.filter((t) => t !== themeId);
      }
    } else {
      updatedThemes.push(themeId);
    }
    onUpdateSettings({
      ...settings,
      filterThemes: updatedThemes,
    });
  };

  const handleComplexityChange = (complexity: "easy" | "medium" | "hard" | "all") => {
    onUpdateSettings({
      ...settings,
      maxComplexity: complexity,
    });
  };

  const handleLimitChange = (minutes: number) => {
    onUpdateSettings({
      ...settings,
      dailyMinLimit: minutes,
    });
  };

  const handleUpdatePasscode = (newCode: string) => {
    if (newCode.length >= 4) {
      onUpdateSettings({
        ...settings,
        passcode: newCode,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl border border-amber-100 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header decoration */}
        <div className="p-6 bg-gradient-to-r from-teal-500 to-emerald-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-emerald-100 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold font-display">Grown-Ups & Parents Zone</h2>
              <p className="text-xs text-teal-100 font-sans tracking-wide">Adjust screen limits, view reading reports, and choose content paths</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-black/10 hover:bg-black/20 text-white rounded-full text-xs font-bold transition-all cursor-pointer"
          >
            Go Back
          </button>
        </div>

        {!isUnlocked ? (
          /* LOCKED GATE ENTRY */
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 flex-1 overflow-y-auto">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-neutral-800">Please Solve to Enter</h3>
              <p className="text-xs text-neutral-400 max-w-sm">
                To keep this section safe for parents, please ask a grown-up to solve this simple math problem or enter the parent passcode.
              </p>
            </div>

            <form onSubmit={handleVerifyGate} className="w-full max-w-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Math Challenge option */}
                <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex flex-col justify-between text-left">
                  <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">Quick Math Check</span>
                  <span className="text-2xl font-black text-teal-900 my-2 select-none">{mathProblem.q} = ?</span>
                  <input
                    type="number"
                    value={mathInput}
                    onChange={(e) => setMathInput(e.target.value)}
                    placeholder="Answer"
                    className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                  />
                </div>

                {/* Pin code alternative */}
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex flex-col justify-between text-left">
                  <span className="text-[10px] text-orange-700 font-bold uppercase tracking-wider">Parent Passcode</span>
                  <span className="text-[11px] text-orange-600 my-2">Default passcode is <b className="font-bold font-mono">1234</b></span>
                  <input
                    type="password"
                    maxLength={10}
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Passcode"
                    className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-center font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                  />
                </div>
              </div>

              {gateError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{gateError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-all shadow-md text-xs cursor-pointer"
              >
                Let Me In! 🔓
              </button>
            </form>
          </div>
        ) : (
          /* PARENT CONTROLS EDITOR */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
            {/* Quick stats reading meter */}
            <div className="bg-teal-50/60 p-4 border border-teal-100 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-teal-800 font-black uppercase tracking-wider flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                  Reading Progress Today
                </span>
                <div className="text-3xl font-black text-neutral-800 flex items-baseline gap-1.5 pt-1">
                  <span>{currentMinutesToday}</span>
                  <span className="text-sm text-neutral-400 font-normal">mins out of</span>
                  <span>{settings.dailyMinLimit === 0 ? "Unlimited" : `${settings.dailyMinLimit}m`}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="h-2.5 bg-neutral-200 rounded-full w-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full"
                    style={{
                      width: settings.dailyMinLimit === 0
                        ? "100%"
                        : `${Math.min(100, (currentMinutesToday / settings.dailyMinLimit) * 100)}%`
                    }}
                  />
                </div>
                <p className="text-[10px] text-teal-800 mt-2">
                  {settings.dailyMinLimit > 0 && currentMinutesToday >= settings.dailyMinLimit 
                    ? "🎉 Screen time limit reached! Books are locked for today unless changed below." 
                    : "Bright minds keep learning! Kids can read safe bedtime books."}
                </p>
              </div>
            </div>

            {/* Daily limit configuration slider */}
            <div className="space-y-2 border-b border-neutral-100 pb-4">
              <label className="block text-sm font-black text-neutral-800 flex items-center justify-between">
                <span>1. Set Daily Screen Time Limit</span>
                <span className="text-xs text-teal-600 font-bold">{settings.dailyMinLimit === 0 ? "Unlimited Reading" : `${settings.dailyMinLimit} Minutes`}</span>
              </label>
              <input
                type="range"
                min={0}
                max={120}
                step={5}
                value={settings.dailyMinLimit}
                onChange={(e) => handleLimitChange(parseInt(e.target.value, 10))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-semibold px-1">
                <span>0m (No limit)</span>
                <span>15m</span>
                <span>30m</span>
                <span>45m</span>
                <span>60m</span>
                <span>90m</span>
                <span>120m</span>
              </div>
            </div>

            {/* Allowed Themes Filter Checklist */}
            <div className="space-y-2 border-b border-neutral-100 pb-4">
              <label className="block text-sm font-black text-neutral-800">
                2. Filter Allowable Adventure Themes
              </label>
              <p className="text-[11px] text-neutral-400">Deselect themes which you want to temporarily hide from the Story Creator portal.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {STORY_THEMES.map((theme) => {
                  const isChecked = settings.filterThemes.includes(theme.id);
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleToggleThemeFilter(theme.id)}
                      className={`py-2 px-3 border rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-teal-50 border-teal-300 text-teal-900"
                          : "bg-white border-neutral-200 text-neutral-400 line-through decoration-neutral-300"
                      }`}
                    >
                      <span className="truncate">{theme.title}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isChecked ? "bg-teal-600 border-teal-600" : "border-neutral-300"}`}>
                        {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-neutral-100 pb-4">
              {/* Max level complexity */}
              <div className="space-y-2">
                <label className="block text-sm font-black text-neutral-800">
                  3. Vocabulary / Reading Complexity
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { val: "all", desc: "All Ages" },
                    { val: "easy", desc: "Junior (3-4 years)" },
                    { val: "medium", desc: "Middle (5-7 years)" },
                    { val: "hard", desc: "Senior (8+ years)" }
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      onClick={() => handleComplexityChange(lvl.val as "easy" | "medium" | "hard" | "all")}
                      className={`py-2 px-2 border rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        settings.maxComplexity === lvl.val
                          ? "bg-neutral-800 text-white border-neutral-800"
                          : "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200"
                      }`}
                    >
                      {lvl.desc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset passcode */}
              <div className="space-y-2">
                <label htmlFor="passcode-input" className="block text-sm font-black text-neutral-800">
                  4. Secure Parental Entry PIN
                </label>
                <input
                  id="passcode-input"
                  type="text"
                  pattern="\d*"
                  maxLength={6}
                  value={settings.passcode}
                  onChange={(e) => handleUpdatePasscode(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono font-bold"
                />
                <p className="text-[10px] text-neutral-400">At least 4 keys needed to update the security lockout pin.</p>
              </div>
            </div>

            {/* Reading list history and generated artwork */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-black text-neutral-800">
                  5. Logged Reading History & Generated Illustration Tracks
                </label>
                {readingHistory.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="flex items-center space-x-1 py-1 px-2 hover:bg-rose-50 border border-neutral-200 text-rose-600 rounded-lg text-[10px] font-black cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Clear Logs</span>
                  </button>
                )}
              </div>

              {readingHistory.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-neutral-100 rounded-2xl">
                  <p className="text-xs text-neutral-400">No books read today yet. Start writing custom stories to view active logs!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {readingHistory.map((h) => (
                    <div key={h.id} className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between border border-neutral-100">
                      <div>
                        <h5 className="text-xs font-black text-neutral-800 truncate max-w-[200px] sm:max-w-md">📕 {h.title}</h5>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Protagonist: <b>{h.characterName}</b> · theme: <i>{h.themeId}</i> · {h.pagesCount} pages
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0">{h.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info lock indicator */}
        <div className="p-4 bg-neutral-100 flex items-center justify-between text-[10px] text-neutral-500 select-none border-t border-neutral-200/50 shrink-0">
          <span>Parental controls secure block active</span>
          {isUnlocked && (
            <button
              onClick={() => setIsUnlocked(false)}
              className="font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              Lock Panel Again 🔒
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
