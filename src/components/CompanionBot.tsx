import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Loader2, Sparkles, AlertCircle, HelpCircle } from "lucide-react";
import { BUDDIES } from "../data";
import { Message, Buddy } from "../types";
import { TranslationSet, LanguageCode } from "../translations";

interface CompanionBotProps {
  isOpen: boolean;
  onClose: () => void;
  characterName: string;
  themeTitle: string;
  language?: LanguageCode;
  t: TranslationSet;
}

export default function CompanionBot({ isOpen, onClose, characterName, themeTitle, language = "en", t }: CompanionBotProps) {
  const [activeBuddyId, setActiveBuddyId] = useState<"elf" | "owl" | "pixie">("elf");
  const [chats, setChats] = useState<Record<"elf" | "owl" | "pixie", Message[]>>({
    elf: [],
    owl: [],
    pixie: [],
  });
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const activeBuddy = BUDDIES.find((b) => b.id === activeBuddyId) || BUDDIES[0];
  const activeMessages = chats[activeBuddyId];

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages, isOpen]);

  // Initial greeting if empty or when language changes
  useEffect(() => {
    BUDDIES.forEach((b) => {
      let placeholderText = b.placeholder;
      if (b.id === "elf" && t.botPlaceholderElf) placeholderText = t.botPlaceholderElf;
      if (b.id === "owl" && t.botPlaceholderOwl) placeholderText = t.botPlaceholderOwl;
      if (b.id === "pixie" && t.botPlaceholderPixie) placeholderText = t.botPlaceholderPixie;

      setChats((prev) => {
        const current = prev[b.id];
        if (current.length === 0 || (current.length === 1 && current[0].id.startsWith("greet-"))) {
          return {
            ...prev,
            [b.id]: [
              {
                id: `greet-${b.id}`,
                role: "model",
                text: placeholderText,
                timestamp: current[0]?.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ],
          };
        }
        return prev;
      });
    });
  }, [t]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage("");
    setErrorStatus(null);
    setIsSending(true);

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update messages with user message
    const updatedHistory = [...activeMessages, userMessage];
    setChats((prev) => ({
      ...prev,
      [activeBuddyId]: updatedHistory,
    }));

    try {
      // Map history to server compatible history schema
      // Exclude greeting text to keep context pure
      const serverHistory = updatedHistory
        .filter((m) => !m.id.startsWith("greet-"))
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      // Extra metadata context for prompt integration
      const contextualMessage = `For your information, we are currently reading a story called "${themeTitle || "Adventures"}" featuring "${characterName || "our hero"}". ${userText}`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: contextualMessage,
          buddyId: activeBuddyId,
          history: serverHistory,
          language: language === "uz" ? "Uzbek" : language === "kaa" ? "Karakalpak" : language === "ru" ? "Russian" : "English",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI friend.");
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: `msg-model-${Date.now()}`,
        role: "model",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChats((prev) => ({
        ...prev,
        [activeBuddyId]: [...prev[activeBuddyId], botMessage],
      }));
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Network snag! Try again in a second.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInputMessage(question);
  };

  const handleClearChat = () => {
    let placeholderText = activeBuddy.placeholder;
    if (activeBuddy.id === "elf" && t.botPlaceholderElf) placeholderText = t.botPlaceholderElf;
    if (activeBuddy.id === "owl" && t.botPlaceholderOwl) placeholderText = t.botPlaceholderOwl;
    if (activeBuddy.id === "pixie" && t.botPlaceholderPixie) placeholderText = t.botPlaceholderPixie;

    setChats((prev) => ({
      ...prev,
      [activeBuddyId]: [
        {
          id: `greet-${activeBuddy.id}`,
          role: "model",
          text: placeholderText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }));
  };

  const getSuggestions = () => {
    if (activeBuddyId === "owl") {
      return [
        {
          label: language === "uz" ? "Ertakdan qanday saboq olamiz?" : language === "kaa" ? "Ertekten qanday sabaq alamız?" : language === "ru" ? "В чем мораль?" : "What's the story moral?",
          prompt: language === "uz" ? "Ushbu ertak bizga qanday tarbiyaviy saboq beradi?" : language === "kaa" ? "Bul ertek bizge qanday tárbiyalıq sabaq beredi?" : language === "ru" ? "Какую мораль несет эта история?" : "What lesson or learning moral does this story tell us?"
        },
        {
          label: language === "uz" ? "Ilmiy faktni tushuntiring" : language === "kaa" ? "Ilimiy fakt túsindir" : language === "ru" ? "Научный факт" : "Explain a science rule",
          prompt: language === "uz" ? "Ertak muhitidan ilhomlangan qiziqarli tabiat hodisasi yoki ilmiy faktni tushuntiring!" : language === "kaa" ? "Ertek átrapınan qızıqlı tábiyat qubılısı yamasa ilimiy fakt túsindirip ber!" : language === "ru" ? "Объясни какой-нибудь интересный научный факт, связанный с миром этой сказки." : "Explain a fun science rule inspired by this story's environment!"
        }
      ];
    } else if (activeBuddyId === "pixie") {
      return [
        {
          label: language === "uz" ? "Shirin latifa" : language === "kaa" ? "Tátli laqap" : language === "ru" ? "Анекдот" : "Tell me a joke!",
          prompt: language === "uz" ? "Menga bolalar uchun juda kulgili bir latifa aytib bering!" : language === "kaa" ? "Magan balalar ushın qızıqlı bir dáslik aytıp ber!" : language === "ru" ? "Расскажи короткую детскую шутку!" : "Tell me a quick kid joke!"
        },
        {
          label: language === "uz" ? "Emoji sehrli afsun!" : language === "kaa" ? "Emoji sıpatlı kilt!" : language === "ru" ? "Магия эмодзи!" : "Emoji bubble spell!",
          prompt: language === "uz" ? "Menga ko'p chiroyli emojilar bilan sehrli afsun yozing!" : language === "kaa" ? "Magan kóp ájayıp emojiler menen sıpatlı kilt jazıp ber!" : language === "ru" ? "Сделай заклинание из эмодзи!" : "Cast a fast dragon emoji fireball spell!"
        }
      ];
    } else {
      return [
        {
          label: language === "uz" ? "Kulgi bosh qahramon ismi" : language === "kaa" ? "Qara qalpaqша at" : language === "ru" ? "Смешное имя" : "Funny character middle name?",
          prompt: language === "uz" ? "Cosmo qahramoni uchun juda ham kulgili va g'alati ikkinchi ism taklif qiling!" : language === "kaa" ? "Cosmo ushın qızıqlı ekinshi at aytıp ber!" : language === "ru" ? "Придумай смешное второе имя для Космо!" : "Can you suggest a funny funny middle name for Cosmo?"
        },
        {
          label: language === "uz" ? "Dadam uchun she'r" : language === "kaa" ? "Balalar ushın qosıq" : language === "ru" ? "Стих" : "Write a fast rhyme!",
          prompt: language === "uz" ? "Pechenye sayyoralari haqida juda qisqa va qiziqarli bolalar she'rini yozing." : language === "kaa" ? "Pechenye planetaları haqqında qısqa hám ájayıp qosıq jazıp ber!" : language === "ru" ? "Напиши быстрое смешное двустишие про планеты из печенья." : "Write a speedy 2-line rhyme about cookie planets."
        }
      ];
    }
  };

  if (!isOpen) return null;

  const suggestions = getSuggestions();

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-100 animate-slide-in">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <h2 className="text-base font-bold">{t.botTitle || "Magical Toybox Companions"}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close Chat Sidebar"
          className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Select active companion buddy */}
      <div className="p-3 bg-neutral-50/80 border-b border-neutral-100 flex gap-2 shrink-0 overflow-x-auto scroller-hidden">
        {BUDDIES.map((buddy) => {
          const isSelected = activeBuddyId === buddy.id;
          return (
            <button
              key={buddy.id}
              onClick={() => {
                setActiveBuddyId(buddy.id);
                setErrorStatus(null);
              }}
              className={`flex-1 min-w-[75px] py-1 px-2 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-white border-neutral-300 ring-2 ring-amber-300 shadow-sm font-bold scale-[1.02]"
                  : "bg-white/40 border-neutral-100 hover:bg-white"
              }`}
            >
              <div className="text-xl mb-0.5">{buddy.avatar}</div>
              <div className="text-[10px] text-neutral-800 leading-tight truncate">{buddy.name.split(" ")[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Companion Details Sub-header */}
      <div className="p-3 bg-gradient-to-r from-neutral-50 to-orange-50/20 border-b border-neutral-100 shrink-0 text-left">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{activeBuddy.avatar}</span>
          <div>
            <h4 className="text-xs font-black text-neutral-800 leading-tight">{activeBuddy.name}</h4>
            <p className="text-[10px] text-amber-700 font-medium leading-none mt-0.5">{activeBuddy.role}</p>
          </div>
        </div>
        <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed italic">{activeBuddy.description}</p>
      </div>

      {/* Message Thread container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/30">
        {activeMessages.map((msg) => {
          const isBot = msg.role === "model";
          return (
            <div key={msg.id} className={`flex flex-col ${isBot ? "items-start text-left" : "items-end text-right"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isBot
                    ? `${activeBuddy.color} border border-neutral-200 rounded-tl-sm`
                    : "bg-neutral-800 text-white rounded-tr-sm"
                }`}
              >
                {/* Clean inline sound effects and italics */}
                <p className="whitespace-pre-line select-text">
                  {msg.text.replace(/(\*[^*]+\*)/g, (match) => `_${match.replace(/\*/g, "")}_`)}
                </p>
                <div className="text-[9px] text-neutral-400 mt-1 select-none">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center space-x-2 text-neutral-400">
            <span className="text-xl animate-bounce">{activeBuddy.avatar}</span>
            <div className={`p-3 rounded-2xl ${activeBuddy.color} flex items-center space-x-2 border border-neutral-100 text-xs`}>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>
                {language === "uz" ? "O'ylamoqda..." : language === "kaa" ? "Oylamaqta..." : language === "ru" ? "Ищу ответ..." : "Thinking fast..."}
              </span>
            </div>
          </div>
        )}

        {errorStatus && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center space-x-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorStatus}</span>
          </div>
        )}

        <div ref={threadEndRef} />
      </div>

      {/* Suggested Questions footer */}
      <div className="p-2 border-t border-neutral-100 bg-white flex flex-col gap-1.5 shrink-0 select-none">
        <label className="text-[9px] text-neutral-400 font-bold px-1.5 lowercase flex items-center gap-1">
          <HelpCircle className="w-2.5 h-2.5" />
          {language === "uz" ? "Tavsiya etilgan savollar:" : language === "kaa" ? "Kórsetilgen sorawlar:" : language === "ru" ? "Рекомендуемые вопросы:" : "Suggested kid questions:"}
        </label>
        <div className="flex flex-wrap gap-1 px-1">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSuggestionClick(sug.prompt)}
              className="text-[9px] bg-neutral-100 text-neutral-600 hover:bg-neutral-200 px-2 py-1 rounded-md cursor-pointer transition-colors"
            >
              {sug.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="p-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center space-x-2 shrink-0">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            language === "uz"
              ? `${activeBuddy.name.split(" ")[0]} bilan suhbat...`
              : language === "kaa"
              ? `${activeBuddy.name.split(" ")[0]} menen sáwbet...`
              : language === "ru"
              ? `Чат с ${activeBuddy.name.split(" ")[0]}...`
              : `Chat with ${activeBuddy.name.split(" ")[0]}...`
          }
          className="flex-1 px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-300"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          aria-label="Send message"
          className="p-2.5 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:scale-100 hover:scale-105 transition-transform duration-150 cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>

      {/* Reset footer tool */}
      <div className="bg-neutral-100/60 p-2 text-center text-[10px] text-neutral-400 border-t border-neutral-100 select-none flex justify-between px-4">
        <span>Powered by {activeBuddy.model}</span>
        <button type="button" onClick={handleClearChat} className="text-zinc-500 hover:text-zinc-800 font-bold hover:underline cursor-pointer">
          {language === "uz" ? "Tarixni Tozalash" : language === "kaa" ? "Tarixtı Tazalaw" : language === "ru" ? "Сбросить историю" : "Reset History"}
        </button>
      </div>
    </div>
  );
}
