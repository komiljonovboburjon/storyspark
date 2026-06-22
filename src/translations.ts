export type LanguageCode = "en" | "uz" | "kaa" | "ru";

export interface TranslationSet {
  headerTitle: string;
  headerSubtitle: string;
  buttonAskSidekick: string;
  buttonParentControls: string;
  timeBreakTitle: string;
  timeBreakMessage: string;
  timeBreakSub: string;
  timeBreakUnlock: string;
  footerStatus: string;
  errorDismiss: string;
  creatorTitle: string;
  creatorSubtitle: string;
  characterNameLabel: string;
  characterNamePlaceholder: string;
  settingThemeLabel: string;
  voiceLabel: string;
  canvasQualityLabel: string;
  creativeTwistsLabel: string;
  creativeTwistsPlaceholder: string;
  buttonGenerate: string;
  presetCandyForest: string;
  presetCandyForestDesc: string;
  presetUnderseaBakery: string;
  presetUnderseaBakeryDesc: string;
  presetSpaceHippo: string;
  presetSpaceHippoDesc: string;
  presetBalloonTree: string;
  presetBalloonTreeDesc: string;
  presetRainbowTrain: string;
  presetRainbowTrainDesc: string;
  needASpark: string;
  ageGroupLabel: string;
  ageGroupEasy: string;
  ageGroupMedium: string;
  ageGroupHard: string;
  themeSpace: string;
  themeForest: string;
  themeOcean: string;
  themeDinosaurs: string;
  themeBedtime: string;
  themeCustom: string;
  turnBackPage: string;
  nextStoryPage: string;
  ttsVoiceLabel: string;
  synthesizerActive: string;
  tapObjectsLabel: string;
  readAloudLabel: string;
  brewingVoice: string;
  backToBuilder: string;
  botTitle: string;
  botSubtitle: string;
  botPlaceholderElf: string;
  botPlaceholderOwl: string;
  botPlaceholderPixie: string;
  botSendButton: string;
  parentAccessPortal: string;
  parentAccessSub: string;
  incorrectPasscode: string;
  enterPasscode: string;
  tabLimits: string;
  tabHistory: string;
  tabFilters: string;
  noHistory: string;
  dailyReadingLimit: string;
  minutesLimitLabel: string;
  unlimitedTime: string;
  vocabComplexityLabel: string;
  storybookBack: string;
  waitingCanvas: string;
  repaintBtn: string;
  loadingTitle: string;
  loadingSubtitle: string;
  tabPresets: string;
  tabBlankCanvas: string;
  chooseThemeLabel: string;
  labelCustomTitle: string;
  placeholderCustomTitle: string;
  labelCustomCharacter: string;
  placeholderCustomCharacter: string;
  labelCustomSetting: string;
  placeholderCustomSetting: string;
  labelCustomPlot: string;
  placeholderCustomPlot: string;
  labelCustomWhom: string;
  buttonCreateBook: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationSet> = {
  en: {
    headerTitle: "StorySpark",
    headerSubtitle: "AI Audiobook & Creative Painter",
    buttonAskSidekick: "Ask AI Sidekick",
    buttonParentControls: "🔒 Parent Controls",
    timeBreakTitle: "⏰ Time for a Playing Break!",
    timeBreakMessage: "You've done amazing reading today! We've read for {minutes} minutes.",
    timeBreakSub: "Let's rest our eyes, stretch, or do some drawing outside. Grown-ups can easily extend or unlock this daily reading timer inside parent settings anytime.",
    timeBreakUnlock: "Parental Access Panel",
    footerStatus: "Interactive sandbox active and ready!",
    errorDismiss: "Dismiss",
    creatorTitle: "Craft Your Magical Storybook",
    creatorSubtitle: "Let's build a custom audiobook with gorgeous illustrations tailored exactly to your childhood dreams.",
    characterNameLabel: "Character Name",
    characterNamePlaceholder: "e.g., a brave puppy named Rex...",
    settingThemeLabel: "Choose a Story Setting / Theme",
    voiceLabel: "Select Audiobook Voice",
    canvasQualityLabel: "Illustration Canvas Quality",
    creativeTwistsLabel: "Creative Twists & Plot Points",
    creativeTwistsPlaceholder: "e.g., finding a silver candy key to unlock the ancient tree trunk full of sparkles...",
    buttonGenerate: "Generate Magical Audiobook 🪄",
    presetCandyForest: "Candy Forest",
    presetCandyForestDesc: "Bella seeks a sparkly key",
    presetUnderseaBakery: "Undersea Bakery",
    presetUnderseaBakeryDesc: "Mirabelle bakes sweet treats",
    presetSpaceHippo: "Space Hippo",
    presetSpaceHippoDesc: "Hamilton sails star slides",
    presetBalloonTree: "Balloon Tree",
    presetBalloonTreeDesc: "Sparky grows balloon branches",
    presetRainbowTrain: "Rainbow Train",
    presetRainbowTrainDesc: "Chuffy toots sweet rainfall",
    needASpark: "🌟 Need a Spark? Pick an Imaginative Quick-Start:",
    ageGroupLabel: "Age Group",
    ageGroupEasy: "Easy (Toddler/Simple)",
    ageGroupMedium: "Medium (Child/Interactive)",
    ageGroupHard: "Detailed (Advanced Vocabulary)",
    themeSpace: "Secret Wish Space",
    themeForest: "Whispering Forest",
    themeOcean: "Neon Ocean Kingdom",
    themeDinosaurs: "Giggling Dinosaurs",
    themeBedtime: "Cozy Bedtime Stars",
    themeCustom: "Custom Wish Theme",
    turnBackPage: "Turn Back Page",
    nextStoryPage: "Next Story Page",
    ttsVoiceLabel: "TTS Reading Voice:",
    synthesizerActive: "Synthesizer active!",
    tapObjectsLabel: "✨ Tap Objects for Sound & Magic:",
    readAloudLabel: "Read Story Book Aloud 🔊",
    brewingVoice: "Brewing Magic Voice...",
    backToBuilder: "Create New Story 🎨",
    botTitle: "StorySpark Assistant",
    botSubtitle: "Have questions about your fairy tale? Warm companions are here to help!",
    botPlaceholderElf: "Ask Barnaby about the story...",
    botPlaceholderOwl: "Ask Teacher Owl a big question...",
    botPlaceholderPixie: "Chat with fast Pip...",
    botSendButton: "Send",
    parentAccessPortal: "Adults-Only Access Portal",
    parentAccessSub: "Enter Passcode to update daily limits, review vocabulary complexity, and see reading stats.",
    incorrectPasscode: "Whoops! That's not the magic sequence.",
    enterPasscode: "Passcode",
    tabLimits: "Daily Time Limits",
    tabHistory: "Story History",
    tabFilters: "Safety Filters",
    noHistory: "No storybooks read yet. Start your first journey!",
    dailyReadingLimit: "Daily Reading Limit",
    minutesLimitLabel: "Minutes per day",
    unlimitedTime: "Unlimited Time",
    vocabComplexityLabel: "Vocabulary Complexity",
    storybookBack: "Write New Storybook",
    waitingCanvas: "Painting the picture...",
    repaintBtn: "Re-Paint Illustration 🎨",
    loadingTitle: "Brewing Magic Ink...",
    loadingSubtitle: "Asking Pixie Painters to draw the initial page...",
    tabPresets: "Preset Sparks",
    tabBlankCanvas: "Blank Adventure Canvas",
    chooseThemeLabel: "Choose a Theme",
    labelCustomTitle: "Storybook Title",
    placeholderCustomTitle: "The Little Hippo Who Loved Star-Cookies",
    labelCustomCharacter: "Main Heroes",
    placeholderCustomCharacter: "Cosmo the space explorer with shiny silver boots & Luna the wise glowing owl",
    labelCustomSetting: "Enchanted Setting",
    placeholderCustomSetting: "A zero-gravity playground made entirely of squishy jelly and bubblegum clouds",
    labelCustomPlot: "Exciting Plot Action",
    placeholderCustomPlot: "Cosmo loses his silver boot during high-speed cookie tag, and they must follow a trail of sparkling stardust to find it",
    labelCustomWhom: "For Whom (Age Group)",
    buttonCreateBook: "Create Magical Storybook 🚀",
  },
  uz: {
    headerTitle: "StorySpark",
    headerSubtitle: "AI Audio-Kitob va Ijodiy Rassom",
    buttonAskSidekick: "AI Yordamchidan So'rash",
    buttonParentControls: "🔒 Kattalar Nazorati",
    timeBreakTitle: "⏰ Biroz Dam Olish Vaqti Keldi!",
    timeBreakMessage: "Siz bugun ajoyib o'qidingiz! Biz {minutes} daqiqa o'qidik.",
    timeBreakSub: "Keling, ko'zlarimizni dam oldirib, biroz cho'zilamiz yoki rasm chizamiz. Kattalar xohlagan vaqtda vaqtni ko'paytirishi mumkin.",
    timeBreakUnlock: "Ota-onalar Nazorat Paneli",
    footerStatus: "Interaktiv maydon faol va tayyor!",
    errorDismiss: "Yopish",
    creatorTitle: "Sehrli Ertak Kitobingizni Yarating",
    creatorSubtitle: "Keling, bolalikdagi barcha orzularingizga mos keladigan sehrli rasm va ovozli ertaklarni birgalikda yaratamiz!",
    characterNameLabel: "Bosh Qahramonning Ismi",
    characterNamePlaceholder: "Masalan, jasur kuchukcha Reks...",
    settingThemeLabel: "Ertak Mavzusi yoki Joyi",
    voiceLabel: "Audioni O'qish Ovozini Tanlang",
    canvasQualityLabel: "Rasm Sifati",
    creativeTwistsLabel: "Qo'shimcha Qiziqarli Tafsilotlar",
    creativeTwistsPlaceholder: "Masalan, uning shokoladli kalit topib olgani yoki uchar gilamda sayohat qilgani haqida...",
    buttonGenerate: "Sehrli Ertak Kitobini Yaratish 🪄",
    presetCandyForest: "Konfet O'rmoni",
    presetCandyForestDesc: "Bella konfet o'rmonidan sehrli kalit qidiradi...",
    presetUnderseaBakery: "Suv Osti Novvoyxonasi",
    presetUnderseaBakeryDesc: "Mirabelle suv ostida shirinliklar tayyorlamoqda...",
    presetSpaceHippo: "Kosmik Begemot",
    presetSpaceHippoDesc: "Hamilton yulduzli yo'lda sayohat qilmoqda...",
    presetBalloonTree: "Sharlar Daraxti",
    presetBalloonTreeDesc: "Sparky sharlar daraxtini o'stirmoqda...",
    presetRainbowTrain: "Kamalak Poezdi",
    presetRainbowTrainDesc: "Chuffy shirin yomg'ir chaqirmoqda...",
    needASpark: "🌟 G'oya kerakmi? Tezkor tayyor mavzulardan birini tanlang:",
    ageGroupLabel: "Yosh Guruhi",
    ageGroupEasy: "Oson (kichkintoylar uchun)",
    ageGroupMedium: "O'rta (bolalar uchun)",
    ageGroupHard: "Tafsilotlarga boy (katta bolalar uchun)",
    themeSpace: "Sirli Kosmos",
    themeForest: "Shivirlayotgan O'rmon",
    themeOcean: "Yorqin Okean Qirolligi",
    themeDinosaurs: "Kulayotgan Dinozavrlar",
    themeBedtime: "Uxlashdan Oldingi Yulduzlar",
    themeCustom: "Maxsus Mavzu",
    turnBackPage: "Orqaga Qaytish",
    nextStoryPage: "Keyingi Sahifa",
    ttsVoiceLabel: "Matnni O'qish Ovozi:",
    synthesizerActive: "Sintezator faol!",
    tapObjectsLabel: "✨ Tovush va Sehr uchun Obyektlarni bosing:",
    readAloudLabel: "Ertakni Ovoz Chiqarib O'qish 🔊",
    brewingVoice: "Sehrli Ovoz Tayyorlanmoqda...",
    backToBuilder: "Yangi Ertak Yaratish 🎨",
    botTitle: "StorySpark AI Yordamchisi",
    botSubtitle: "Ertak bo'yicha savollaringiz bo'lsa muloqot qilishingiz mumkin!",
    botPlaceholderElf: "Ertak elfi Barnabydan so'rang...",
    botPlaceholderOwl: "Oqqush o'qituvchidan dars so'rang...",
    botPlaceholderPixie: "Tezkor Pip bilan suhbat...",
    botSendButton: "Yuborish",
    parentAccessPortal: "Kattalar uchun Ruxsat Paneli",
    parentAccessSub: "Maxfiy parolni kiriting, vaqt cheklovlarini boshqaring.",
    incorrectPasscode: "Xato parol! Sehrli to'plam mos kelmadi.",
    enterPasscode: "Kattalar Paroli",
    tabLimits: "Vaqt Cheklovlari",
    tabHistory: "Ertaklar Tarixi",
    tabFilters: "Xavfsiz Filtrlash",
    noHistory: "Hali o'qilgan kitoblar yo'q.",
    dailyReadingLimit: "Kunlik O'qish Cheklovi",
    minutesLimitLabel: "Kunlik daqiqa cheklovi",
    unlimitedTime: "Cheksiz",
    vocabComplexityLabel: "Lug'at Boyligi va Murakkablik",
    storybookBack: "Yangi Ertak Kitobini Yozish",
    waitingCanvas: "Súret chizilmoqda...",
    repaintBtn: "Rasmni Yangidan Chizish 🎨",
    loadingTitle: "Sehrli Siyohni Damlash...",
    loadingSubtitle: "Rassom Pari-lardan dastlabki sahifani chizishni iltimos qilish...",
    tabPresets: "Sarguzasht Shablonlari",
    tabBlankCanvas: "Yangi Bo'sh Ertak Kanvasi",
    chooseThemeLabel: "Mavzuni Tanlang",
    labelCustomTitle: "Ertak Kitobi Sarlavhasi",
    placeholderCustomTitle: "Yulduz-Pechenyelarni Yaxshi Ko'radigan Kichik Hippo",
    labelCustomCharacter: "Bosh Qahramonlar",
    placeholderCustomCharacter: "Yaltiroq kumush etik kiygan koinot sayyohi Cosmo va donishmand nurli boyqush Luna",
    labelCustomSetting: "Sehrli Makon / Atrof-muhit",
    placeholderCustomSetting: "Butunlay yumshoq jelye va saqichli bulutlardan qurilgan nol-tortishish kuchiga ega o'yin maydonchasi",
    labelCustomPlot: "Hayajonli Ertak Sjeti",
    placeholderCustomPlot: "Cosmo tezkor pechenye o'yini paytida kumush etigini yo'qotib qo'yadi va uni topish uchun porloq yulduz changining izidan borishi kerak",
    labelCustomWhom: "Kim Uchun (Yosh Guruhi)",
    buttonCreateBook: "Sehrli Ertakni Yaratish 🚀",
  },
  kaa: {
    headerTitle: "StorySpark",
    headerSubtitle: "AI Audio-Kitap hám Shıgarmashılıq Súretshi",
    buttonAskSidekick: "AI Kómekshiden Soraw",
    buttonParentControls: "🔒 Ata-analar Baqlawı",
    timeBreakTitle: "⏰ Dem Alıw Waqtı Keldi!",
    timeBreakMessage: "Siz búgin ájayıp oqıdıńız! Biz {minutes} minuta oqıdıq.",
    timeBreakSub: "Kelińiz, kózlerimizdi dem aldırıp, sál sozılıp súret salarmız. Ata-analar qálegen waqıtta waqıttı soza aladı.",
    timeBreakUnlock: "Ata-analar Baqlaw Paneli",
    footerStatus: "Interaktiv maydan belsendi hám tayar!",
    errorDismiss: "Jabılıw",
    creatorTitle: "Sıpatlı Ertek Kitabıńızdı Jaratıń",
    creatorSubtitle: "Kelińiz, balalıqtaǵı barlıq ármanlarıńızǵa sáykes keletuǵın sıpatlı hám dawıslı erteklerdi birge jaratamiz!",
    characterNameLabel: "Bas Qaharman Atı",
    characterNamePlaceholder: "Mısalı, batır kúshik Reks...",
    settingThemeLabel: "Ertek Teması yamasa Ornı",
    voiceLabel: "Audio Sıntezator Dawısın Tańlań",
    canvasQualityLabel: "Súret Sapatı",
    creativeTwistsLabel: "Qosımsha Qızıqlı Detallar",
    creativeTwistsPlaceholder: "Mısalı, onıń shokoladlı kilt tawıp alǵanı yamasa ushar kilemde sayaxat etkeni haqqında...",
    buttonGenerate: "Sıpatlı Ertek Kitabın Jaratıw 🪄",
    presetCandyForest: "Kandeyr Ormanı",
    presetCandyForestDesc: "Bella kilt qıdırıp kandeyr ormanında...",
    presetUnderseaBakery: "Suw Astı Nanbaxanası",
    presetUnderseaBakeryDesc: "Mirabelle suw astında tátli gúshler pisirmekte...",
    presetSpaceHippo: "Kosmik Begemot",
    presetSpaceHippoDesc: "Hamilton juldızlı jol boyı sayaxatta...",
    presetBalloonTree: "Sharlar Teregi",
    presetBalloonTreeDesc: "Sparky sharlar teregin óstirmekte...",
    presetRainbowTrain: "Kamalak Poezdi",
    presetRainbowTrainDesc: "Chuffy tátli jawın shaqırmaqta...",
    needASpark: "🌟 Ideya kerek pe? Tezkor tayar temalardan birin saylańız:",
    ageGroupLabel: "Jas Kórsetkishi",
    ageGroupEasy: "Ańsat (kıshkintaylar ushın)",
    ageGroupMedium: "Ortasha (balalar ushın)",
    ageGroupHard: "Detallı (úmmetli balalar ushın)",
    themeSpace: "Sırlı Kosmos",
    themeForest: "Shıbırlap Turǵan Orman",
    themeOcean: "Jaqlı Okean Patshalıǵı",
    themeDinosaurs: "Kúlip Turǵan Dinozavrlar",
    themeBedtime: "Uyıqlaw Aldındaǵı Juldızlar",
    themeCustom: "Arnawlı Tema",
    turnBackPage: "Artqa Qayıtıw",
    nextStoryPage: "Keyingi Bet",
    ttsVoiceLabel: "Mátindi Oqıw Dawısı:",
    synthesizerActive: "Sintezator belsendi!",
    tapObjectsLabel: "✨ Dawıs hám Sıpatlı Effektler ushın Táp etiń:",
    readAloudLabel: "Ertekti Dawıslı Oqıw 🔊",
    brewingVoice: "Dawıslı Sintez tayarlanbaqta...",
    backToBuilder: "Taza Ertek Jaratıw 🎨",
    botTitle: "StorySpark AI Kómekshisi",
    botSubtitle: "Ertek haqqında sorawlarıńız bolsa múnásiwet jasay alasız!",
    botPlaceholderElf: "Barnabydan ertek haqqında sorań...",
    botPlaceholderOwl: "Oqıtuwshı Owl-dan sorań...",
    botPlaceholderPixie: "Tezkor Pip penen sáwbet...",
    botSendButton: "Jiberiw",
    parentAccessPortal: "Ata-analar Ruxsat Paneli",
    parentAccessSub: "Jasırın paroldı kiritiń, waqıt limitlerin basqarıń.",
    incorrectPasscode: "Qáte parol! Sıpatlı toplam sáykes kelmedi.",
    enterPasscode: "Jasırın Parol",
    tabLimits: "Waqıt Limitleri",
    tabHistory: "Ertekler Tarixi",
    tabFilters: "Qáwipsiz Súzgiler",
    noHistory: "Házirshe oqılǵan kitaplar joq.",
    dailyReadingLimit: "Kúndelik Oqıw Limiti",
    minutesLimitLabel: "Kúndelik minuta limiti",
    unlimitedTime: "Sheksiz",
    vocabComplexityLabel: "Lug'at Baylıǵı hám Quramalıǵı",
    storybookBack: "Taza Ertek Kitabın Jazıw",
    waitingCanvas: "Súret salınbaqta...",
    repaintBtn: "Súretti Taza Baspa Etu 🎨",
    loadingTitle: "Sıpatlı Siyanı Tayarlaw...",
    loadingSubtitle: "Súretshi Perilerden dáslepki betti salıwdı soraw...",
    tabPresets: "Tayın Úlgiler",
    tabBlankCanvas: "Taza Bo's Ertek Kanvası",
    chooseThemeLabel: "Temanı Tańlań",
    labelCustomTitle: "Kitap Ataması",
    placeholderCustomTitle: "Yulduz-Pechenyelardı Jaqsı Kóretuǵın Kishi Begemot",
    labelCustomCharacter: "Bas Qahramonlar",
    placeholderCustomCharacter: "Gúmis etik kiygen koinot sayaxatshısı Cosmo hám aqıllı nuray bayqush Luna",
    labelCustomSetting: "Sıpatlı Makon / Átrap-sheshilisi",
    placeholderCustomSetting: "Yumsaq jelye hám saǵızlı bultlardan islengen nol-tartılıs kúshindegi oyın maydanshası",
    labelCustomPlot: "Qızıqlı Ertek Sújeti",
    placeholderCustomPlot: "Cosmo pechenye oyını waqtında gúmis etigin joǵatıp aladı hám onı tabıw ushın juldızlı shańnıń izin quwıp baradı",
    labelCustomWhom: "Kim ushın (Jas Kórsetkishi)",
    buttonCreateBook: "Sehrli Ertek Yaratıw 🚀",
  },
  ru: {
    headerTitle: "StorySpark",
    headerSubtitle: "ИИ Аудиокниги и Креативный Художник",
    buttonAskSidekick: "Спросить ИИ Помощника",
    buttonParentControls: "🔒 Род. Контроль",
    timeBreakTitle: "⏰ Пора сделать перерыв!",
    timeBreakMessage: "Вы отлично сегодня почитали! Мы читали {minutes} мин.",
    timeBreakSub: "Давайте дадим глазам отдохнуть, разомнемся или порисуем. Взрослые могут изменить лимит времени в настройках.",
    timeBreakUnlock: "Родительская Панель",
    footerStatus: "Интерактивная песочница готова!",
    errorDismiss: "Закрыть",
    creatorTitle: "Создайте Свою Волшебную Книгу",
    creatorSubtitle: "Давайте создадим интерактивную аудиокнигу с красочными иллюстрациями, воплощающую ваши детские мечты!",
    characterNameLabel: "Имя Главного Героя",
    characterNamePlaceholder: "Например, отважный щенок Рекс...",
    settingThemeLabel: "Тема или Окружение Истории",
    voiceLabel: "Выберите Озвучивающий Голос",
    canvasQualityLabel: "Качество Изображений",
    creativeTwistsLabel: "Дополнительные Детали Сюжета",
    creativeTwistsPlaceholder: "Например, как он нашел золотой ключ или полетел на облаке из маршмеллоу...",
    buttonGenerate: "Создать Волшебную Книгу 🪄",
    presetCandyForest: "Конфетный лес",
    presetCandyForestDesc: "Белла ищет блестящий ключ в сладком лесу...",
    presetUnderseaBakery: "Подводная пекарня",
    presetUnderseaBakeryDesc: "Мирабель печет угощения среди кораллов...",
    presetSpaceHippo: "Космический бегемот",
    presetSpaceHippoDesc: "Гамильтон летит сквозь клубничные галактики...",
    presetBalloonTree: "Дерево шаров",
    presetBalloonTreeDesc: "Спарки выращивает светящиеся воздушные шары...",
    presetRainbowTrain: "Радужный поезд",
    presetRainbowTrainDesc: "Чаффи вызывает сиропный дождик...",
    needASpark: "🌟 Нужна идея? Выберите готовый шаблон:",
    ageGroupLabel: "Возрастная Группа",
    ageGroupEasy: "Простой слог (малышам)",
    ageGroupMedium: "Средний (для детей)",
    ageGroupHard: "С подробностями (для старших)",
    themeSpace: "Таинственный Космос",
    themeForest: "Шепчущий Лес",
    themeOcean: "Неоновое Царство Океана",
    themeDinosaurs: "Веселые Динозавры",
    themeBedtime: "Уютные Звезды перед Сном",
    themeCustom: "Своя Тема",
    turnBackPage: "Вернуться Назад",
    nextStoryPage: "Следующая Страница",
    ttsVoiceLabel: "Голос Чтения ИИ:",
    synthesizerActive: "Синтезатор речи активен!",
    tapObjectsLabel: "✨ Нажимайте на предметы для звуков и магии:",
    readAloudLabel: "Прочитать главу вслух 🔊",
    brewingVoice: "Подготовка волшебного озвучивания...",
    backToBuilder: "Создать Другую Историю 🎨",
    botTitle: "Помощник StorySpark",
    botSubtitle: "Общайтесь с помощником по сюжету, задавайте вопросы!",
    botPlaceholderElf: "Спросите эльфа Барнаби о сказке...",
    botPlaceholderOwl: "Задайте сложный вопрос учителю Сове...",
    botPlaceholderPixie: "Быстрый чат с дракончиком Пипом...",
    botSendButton: "Отправить",
    parentAccessPortal: "Портал Родительского Доступа",
    parentAccessSub: "Введите пин-код для изменения времени игры и истории чтения.",
    incorrectPasscode: "Ой! Неверный код последовательности.",
    enterPasscode: "Пароль",
    tabLimits: "Лимиты Времени",
    tabHistory: "История Книг",
    tabFilters: "Фильтры Безопасности",
    noHistory: "Список прочитанных книг пуст.",
    dailyReadingLimit: "Дневной Лимит Чтения",
    minutesLimitLabel: "Дневной лимит (минут)",
    unlimitedTime: "Без лимита",
    vocabComplexityLabel: "Сложность словаря",
    storybookBack: "На canисать Новую Сказку",
    waitingCanvas: "Рисуем картину...",
    repaintBtn: "Перерисовать картину 🎨",
    loadingTitle: "Замешиваем волшебные чернила...",
    loadingSubtitle: "Просим эльфов-рисовальщиков нарисовать первую страницу...",
    tabPresets: "Готовые Шаблоны",
    tabBlankCanvas: "Свой Сюжет (Чистый Холст)",
    chooseThemeLabel: "Выберите Тему",
    labelCustomTitle: "Название Сказки",
    placeholderCustomTitle: "Бегемотик, который очень любил звёздное печенье",
    labelCustomCharacter: "Главные Герои",
    placeholderCustomCharacter: "Космический исследователь Космо в блестящих серебряных сапожках и мудрая светящаяся сова Луна",
    labelCustomSetting: "Волшебное Место действия",
    placeholderCustomSetting: "Игровая площадка в невесомости, сделанная полностью из воздушного мармелада и облаков из сладкой ваты",
    labelCustomPlot: "Сюжетная линия",
    placeholderCustomPlot: "Космо теряет свой серебряный сапожок во время игры, и они должны пойти по следу из мерцающей звездной пыли, чтобы его найти",
    labelCustomWhom: "Для Кого (Возрастная Группа)",
    buttonCreateBook: "Создать Волшебную Сказку 🚀",
  },
};
