import { LanguageCode } from './types';

export interface Translations {
  appName: string;
  tagline: string;
  startNow: string;
  selectLanguage: string;
  selectLanguageSub: string;
  continueBtn: string;
  ratingTitle: string;
  ratingSub: string;
  downloadsText: string;
  featuresTitle1: string;
  featuresTitle2: string;
  smartFolders: string;
  smartFoldersDesc: string;
  safeProtected: string;
  safeProtectedDesc: string;
  fastSearch: string;
  fastSearchDesc: string;
  startUsingApp: string;
  searchPlaceholder: string;
  allCategory: string;
  personalCategory: string;
  workCategory: string;
  otherCategory: string;
  tipBanner: string;
  tipBannerAction: string;
  emptyStateTitle: string;
  emptyStateDesc: string;
  noSearchResults: string;
  newNote: string;
  editNote: string;
  save: string;
  cancel: string;
  delete: string;
  titlePlaceholder: string;
  contentPlaceholder: string;
  selectFolder: string;
  noteSaved: string;
  noteDeleted: string;
  appLocked: string;
  enterPin: string;
  wrongPin: string;
  skipTest: string;
  settingsTitle: string;
  themeDark: string;
  themeLight: string;
  darkModeActivated: string;
  lightModeActivated: string;
  defaultFolder: string;
  fontSizeLabel: string;
  weekStartLabel: string;
  notificationBanner: string;
  bannerEnabled: string;
  bannerDisabled: string;
  pinLock: string;
  changePin: string;
  setPinTitle: string;
  enterNewPin: string;
  confirmNewPin: string;
  pinMustBe4Digits: string;
  pinsDoNotMatch: string;
  pinSaved: string;
  pinDisabled: string;
  currentPinIncorrect: string;
  shareApp: string;
  privacyPolicy: string;
  rateApp: string;
  appVersion: string;
  sortTitle: string;
  generalSection: string;
  timeSection: string;
  sortTitleAZ: string;
  sortTitleZA: string;
  sortModNew: string;
  sortModOld: string;
  sortCreateNew: string;
  sortCreateOld: string;
  copiedLink: string;
  backupNotes: string;
  exportNotes: string;
  importNotes: string;
  deviceFrame: string;
  fullScreen: string;
  charsCount: string;
  wordsCount: string;
  adSponsored: string;
  adBanner: string;
  adInterstitial: string;
  adNative: string;
  adSkip: string;
  adSkipIn: string;
  adInfo: string;
  apkAabCenter: string;
  apkAabDesc: string;
  admobUnitsTitle: string;
}

export const translations: Record<LanguageCode, Translations> = {
  ar: {
    appName: 'Notein',
    tagline: 'حافظ على تنظيم حياتك، أفكارك، ومهامك في مكان واحد آمن وجميل.',
    startNow: 'البدء الآن',
    selectLanguage: 'اختر اللغة',
    selectLanguageSub: 'اختر لغتك المفضلة لاستخدام التطبيق',
    continueBtn: 'متابعة',
    ratingTitle: '4.9',
    ratingSub: 'من أصل 5 نجوم',
    downloadsText: '25,000,000+ تحميل حول العالم',
    featuresTitle1: 'كل ما تحتاجه',
    featuresTitle2: 'لتنظيم أفكارك',
    smartFolders: 'مجلدات ذكية',
    smartFoldersDesc: 'صنف ملاحظاتك إلى شخصي، عمل، وأخرى بألوان مميزة',
    safeProtected: 'آمن ومحمي',
    safeProtectedDesc: 'قفل بكلمة مرور وحماية خصوصيتك بشكل كامل',
    fastSearch: 'تذكير وبحث سريع',
    fastSearchDesc: 'ابحث وصنف حسب الوقت والعنوان بلمسة واحدة',
    startUsingApp: 'ابدأ استخدام Notein',
    searchPlaceholder: 'بحث في الملاحظات...',
    allCategory: 'الكل',
    personalCategory: 'شخصي',
    workCategory: 'العمل',
    otherCategory: 'أخرى',
    tipBanner: 'تعلم كيفية إنشاء وتنظيم ملاحظاتك. انقر للعرض',
    tipBannerAction: '›',
    emptyStateTitle: 'حافظ على تنظيم حياتك.',
    emptyStateDesc: 'ابدأ بإضافة أول ملاحظة لك. اضغط على زر القلم لإنشاء ملاحظة جديدة.',
    noSearchResults: 'لا توجد نتائج تطابق بحثك',
    newNote: 'ملاحظة جديدة',
    editNote: 'تعديل الملاحظة',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    titlePlaceholder: 'العنوان',
    contentPlaceholder: 'اكتب ملاحظتك هنا...',
    selectFolder: 'المجلد',
    noteSaved: 'تم حفظ الملاحظة بنجاح',
    noteDeleted: 'تم حذف الملاحظة',
    appLocked: 'التطبيق مقفل',
    enterPin: 'أدخل رمز الـ PIN المكون من 4 أرقام',
    wrongPin: 'رمز خاطئ، حاول مرة أخرى',
    skipTest: 'تخطي (للتجربة السريعة)',
    settingsTitle: 'الإعدادات',
    themeDark: 'الوضع الداكن',
    themeLight: 'الوضع الفاتح',
    darkModeActivated: 'تم تفعيل الوضع الداكن',
    lightModeActivated: 'تم تفعيل الوضع الفاتح',
    defaultFolder: 'المجلد الافتراضي',
    fontSizeLabel: 'حجم الخط',
    weekStartLabel: 'بداية الأسبوع',
    notificationBanner: 'شريط الإشعارات والتلميحات',
    bannerEnabled: 'تم تفعيل شريط التلميحات',
    bannerDisabled: 'تم تعطيل شريط التلميحات',
    pinLock: 'قفل التطبيق بـ PIN',
    changePin: 'تغيير رمز PIN',
    setPinTitle: 'تعيين رمز PIN جديد',
    enterNewPin: 'أدخل الرمز المكون من 4 أرقام',
    confirmNewPin: 'تأكيد الرمز',
    pinMustBe4Digits: 'الرمز يجب أن يتكون من 4 أرقام فقط',
    pinsDoNotMatch: 'الرمزان غير متطابقين',
    pinSaved: 'تم تفعيل وقفل التطبيق بنجاح',
    pinDisabled: 'تم تعطيل قفل التطبيق',
    currentPinIncorrect: 'الرمز الحالي غير صحيح',
    shareApp: 'مشاركة التطبيق',
    privacyPolicy: 'سياسة الخصوصية',
    rateApp: 'تقييم التطبيق (5 نجوم)',
    appVersion: 'إصدار التطبيق',
    sortTitle: 'ترتيب حسب',
    generalSection: 'عام',
    timeSection: 'الوقت',
    sortTitleAZ: 'العنوان (أ - ي)',
    sortTitleZA: 'العنوان (ي - أ)',
    sortModNew: 'آخر تعديل (من الأحدث للأقدم)',
    sortModOld: 'آخر تعديل (من الأقدم للأحدث)',
    sortCreateNew: 'تاريخ الإنشاء (من الأحدث للأقدم)',
    sortCreateOld: 'تاريخ الإنشاء (من الأقدم للأحدث)',
    copiedLink: 'تم نسخ رابط التطبيق للحافظة',
    backupNotes: 'النسخ الاحتياطي',
    exportNotes: 'تصدير الملاحظات (JSON)',
    importNotes: 'استيراد ملاحظات',
    deviceFrame: 'إطار الهاتف',
    fullScreen: 'ملء الشاشة',
    charsCount: 'حرف',
    wordsCount: 'كلمة',
    adSponsored: 'إعلان ممول',
    adBanner: 'بانر AdMob',
    adInterstitial: 'إعلان بيني',
    adNative: 'إعلان مدمج (Native)',
    adSkip: 'إغلاق الإعلان',
    adSkipIn: 'تخطي بعد',
    adInfo: 'إعلانات Google AdMob',
    apkAabCenter: 'بناء وتصدير APK & AAB',
    apkAabDesc: 'أوامر وتهيئة حزم الأندرويد لنشر تطبيقك على Google Play',
    admobUnitsTitle: 'معرفات إعلانات AdMob المدمجة',
  },
  en: {
    appName: 'Notein',
    tagline: 'Keep your life, ideas, and tasks organized in a secure, elegant space.',
    startNow: 'Get Started',
    selectLanguage: 'Choose Language',
    selectLanguageSub: 'Select your preferred language for the application',
    continueBtn: 'Continue',
    ratingTitle: '4.9',
    ratingSub: 'out of 5 stars',
    downloadsText: '25,000,000+ downloads worldwide',
    featuresTitle1: 'Everything you need',
    featuresTitle2: 'to organize ideas',
    smartFolders: 'Smart Folders',
    smartFoldersDesc: 'Color code notes into Personal, Work, and Others',
    safeProtected: 'Safe & Protected',
    safeProtectedDesc: 'PIN lock protection to keep your notes fully private',
    fastSearch: 'Instant Search & Sort',
    fastSearchDesc: 'Find and sort by modification date, creation, or title',
    startUsingApp: 'Start using Notein',
    searchPlaceholder: 'Search in notes...',
    allCategory: 'All',
    personalCategory: 'Personal',
    workCategory: 'Work',
    otherCategory: 'Others',
    tipBanner: 'Learn how to create and organize your notes smoothly',
    tipBannerAction: '›',
    emptyStateTitle: 'Keep your thoughts structured.',
    emptyStateDesc: 'Start by creating your first note. Tap the pencil button below.',
    noSearchResults: 'No notes match your search query',
    newNote: 'New Note',
    editNote: 'Edit Note',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    titlePlaceholder: 'Title',
    contentPlaceholder: 'Write your thoughts here...',
    selectFolder: 'Folder',
    noteSaved: 'Note saved successfully',
    noteDeleted: 'Note deleted',
    appLocked: 'App Locked',
    enterPin: 'Enter your 4-digit PIN code',
    wrongPin: 'Incorrect PIN, try again',
    skipTest: 'Skip (for testing)',
    settingsTitle: 'Settings',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    darkModeActivated: 'Dark theme activated',
    lightModeActivated: 'Light theme activated',
    defaultFolder: 'Default Folder',
    fontSizeLabel: 'Font Size',
    weekStartLabel: 'First Day of Week',
    notificationBanner: 'Tips & Reminder Banner',
    bannerEnabled: 'Banner enabled',
    bannerDisabled: 'Banner disabled',
    pinLock: 'App PIN Protection',
    changePin: 'Change PIN Code',
    setPinTitle: 'Set New PIN Code',
    enterNewPin: 'Enter 4-digit PIN',
    confirmNewPin: 'Confirm PIN',
    pinMustBe4Digits: 'PIN must be exactly 4 digits',
    pinsDoNotMatch: 'PINs do not match',
    pinSaved: 'PIN saved and app locked',
    pinDisabled: 'PIN lock disabled',
    currentPinIncorrect: 'Current PIN is incorrect',
    shareApp: 'Share Notein App',
    privacyPolicy: 'Privacy Policy',
    rateApp: 'Rate Notein (5 Stars)',
    appVersion: 'App Version',
    sortTitle: 'Sort Notes By',
    generalSection: 'General',
    timeSection: 'Time',
    sortTitleAZ: 'Title (A - Z)',
    sortTitleZA: 'Title (Z - A)',
    sortModNew: 'Last Modified (Newest first)',
    sortModOld: 'Last Modified (Oldest first)',
    sortCreateNew: 'Created Date (Newest first)',
    sortCreateOld: 'Created Date (Oldest first)',
    copiedLink: 'App link copied to clipboard',
    backupNotes: 'Backup & Restore',
    exportNotes: 'Export Notes (JSON)',
    importNotes: 'Import Notes',
    deviceFrame: 'Device Frame',
    fullScreen: 'Full Screen',
    charsCount: 'chars',
    wordsCount: 'words',
    adSponsored: 'Sponsored Ad',
    adBanner: 'AdMob Banner',
    adInterstitial: 'Interstitial Ad',
    adNative: 'Native Ad',
    adSkip: 'Close Ad',
    adSkipIn: 'Skip in',
    adInfo: 'Google AdMob Ads',
    apkAabCenter: 'Build APK & AAB',
    apkAabDesc: 'Android build configs & commands for Google Play Store',
    admobUnitsTitle: 'Integrated AdMob Ad Units',
  },
  ru: {
    appName: 'Notein',
    tagline: 'Держите мысли, идеи и задачи в одном красивом и защищенном месте.',
    startNow: 'Начать',
    selectLanguage: 'Выберите язык',
    selectLanguageSub: 'Выберите язык интерфейса приложения',
    continueBtn: 'Продолжить',
    ratingTitle: '4.9',
    ratingSub: 'из 5 звезд',
    downloadsText: '25,000,000+ загрузок по всему миру',
    featuresTitle1: 'Все необходимое',
    featuresTitle2: 'для ваших заметок',
    smartFolders: 'Умные папки',
    smartFoldersDesc: 'Разделяйте на Личное, Работу и Другое',
    safeProtected: 'Безопасность',
    safeProtectedDesc: 'PIN-код для защиты конфиденциальности',
    fastSearch: 'Быстрый поиск',
    fastSearchDesc: 'Мгновенный поиск и сортировка по времени и названию',
    startUsingApp: 'Открыть Notein',
    searchPlaceholder: 'Поиск в заметках...',
    allCategory: 'Все',
    personalCategory: 'Личное',
    workCategory: 'Работа',
    otherCategory: 'Другое',
    tipBanner: 'Узнайте, как организовать заметки быстро и удобно',
    tipBannerAction: '›',
    emptyStateTitle: 'Организуйте свои мысли.',
    emptyStateDesc: 'Нажмите на карандаш, чтобы создать первую заметку.',
    noSearchResults: 'Ничего не найдено',
    newNote: 'Новая заметка',
    editNote: 'Редактировать',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    titlePlaceholder: 'Заголовок',
    contentPlaceholder: 'Напишите здесь...',
    selectFolder: 'Папка',
    noteSaved: 'Заметка сохранена',
    noteDeleted: 'Заметка удалена',
    appLocked: 'Приложение заблокировано',
    enterPin: 'Введите 4-значный PIN-код',
    wrongPin: 'Неверный код, повторите',
    skipTest: 'Пропустить (тест)',
    settingsTitle: 'Настройки',
    themeDark: 'Темная тема',
    themeLight: 'Светлая тема',
    darkModeActivated: 'Темная тема включена',
    lightModeActivated: 'Светлая тема включена',
    defaultFolder: 'Папка по умолчанию',
    fontSizeLabel: 'Размер шрифта',
    weekStartLabel: 'Первый день недели',
    notificationBanner: 'Подсказки и баннер',
    bannerEnabled: 'Баннер включен',
    bannerDisabled: 'Баннер выключен',
    pinLock: 'Блокировка PIN-кодом',
    changePin: 'Изменить PIN-код',
    setPinTitle: 'Установить PIN-код',
    enterNewPin: 'Введите 4 цифры',
    confirmNewPin: 'Подтвердите код',
    pinMustBe4Digits: 'Код должен быть из 4 цифр',
    pinsDoNotMatch: 'Коды не совпадают',
    pinSaved: 'PIN установлен',
    pinDisabled: 'Защита отключена',
    currentPinIncorrect: 'Текущий PIN неверен',
    shareApp: 'Поделиться приложением',
    privacyPolicy: 'Политика конфиденциальности',
    rateApp: 'Оценить на 5 звезд',
    appVersion: 'Версия приложения',
    sortTitle: 'Сортировка',
    generalSection: 'Основное',
    timeSection: 'Время',
    sortTitleAZ: 'Название (А - Я)',
    sortTitleZA: 'Название (Я - А)',
    sortModNew: 'По изменению (новые)',
    sortModOld: 'По изменению (старые)',
    sortCreateNew: 'По созданию (новые)',
    sortCreateOld: 'По созданию (старые)',
    copiedLink: 'Ссылка скопирована',
    backupNotes: 'Резервная копия',
    exportNotes: 'Экспорт (JSON)',
    importNotes: 'Импорт',
    deviceFrame: 'Рамка телефона',
    fullScreen: 'На весь экран',
    charsCount: 'симв.',
    wordsCount: 'слов',
    adSponsored: 'Реклама',
    adBanner: 'Баннер AdMob',
    adInterstitial: 'Межстраничная реклама',
    adNative: 'Нативная реклама',
    adSkip: 'Закрыть рекламу',
    adSkipIn: 'Пропуск через',
    adInfo: 'Google AdMob',
    apkAabCenter: 'Сборка APK и AAB',
    apkAabDesc: 'Конфигурация и команды сборки для Google Play',
    admobUnitsTitle: 'Идентификаторы блоков AdMob',
  },
  es: {
    appName: 'Notein',
    tagline: 'Mantén tus ideas, tareas y proyectos organizados en un lugar seguro.',
    startNow: 'Comenzar',
    selectLanguage: 'Seleccionar idioma',
    selectLanguageSub: 'Elige tu idioma preferido para la aplicación',
    continueBtn: 'Continuar',
    ratingTitle: '4.9',
    ratingSub: 'de 5 estrellas',
    downloadsText: 'Más de 25.000.000 de descargas',
    featuresTitle1: 'Todo lo que necesitas',
    featuresTitle2: 'para tus ideas',
    smartFolders: 'Carpetas inteligentes',
    smartFoldersDesc: 'Organiza en Personal, Trabajo y Otras',
    safeProtected: 'Seguro y privado',
    safeProtectedDesc: 'Protege con código PIN tus notas confidenciales',
    fastSearch: 'Búsqueda rápida',
    fastSearchDesc: 'Busca y ordena por fecha o título en un instante',
    startUsingApp: 'Empezar con Notein',
    searchPlaceholder: 'Buscar notas...',
    allCategory: 'Todo',
    personalCategory: 'Personal',
    workCategory: 'Trabajo',
    otherCategory: 'Otros',
    tipBanner: 'Aprende a crear y organizar notas con fluidez',
    tipBannerAction: '›',
    emptyStateTitle: 'Mantén tu vida organizada.',
    emptyStateDesc: 'Comienza creando tu primera nota presionando el botón del lápiz.',
    noSearchResults: 'No hay notas que coincidan',
    newNote: 'Nueva nota',
    editNote: 'Editar nota',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    titlePlaceholder: 'Título',
    contentPlaceholder: 'Escribe tu nota aquí...',
    selectFolder: 'Carpeta',
    noteSaved: 'Nota guardada con éxito',
    noteDeleted: 'Nota eliminada',
    appLocked: 'App bloqueada',
    enterPin: 'Ingresa tu PIN de 4 dígitos',
    wrongPin: 'PIN incorrecto, intenta de nuevo',
    skipTest: 'Omitir (modo prueba)',
    settingsTitle: 'Ajustes',
    themeDark: 'Modo oscuro',
    themeLight: 'Modo claro',
    darkModeActivated: 'Modo oscuro activado',
    lightModeActivated: 'Modo claro activado',
    defaultFolder: 'Carpeta predeterminada',
    fontSizeLabel: 'Tamaño de fuente',
    weekStartLabel: 'Inicio de la semana',
    notificationBanner: 'Banner de sugerencias',
    bannerEnabled: 'Banner activado',
    bannerDisabled: 'Banner desactivado',
    pinLock: 'Bloqueo con PIN',
    changePin: 'Cambiar PIN',
    setPinTitle: 'Configurar nuevo PIN',
    enterNewPin: 'Ingresa 4 dígitos',
    confirmNewPin: 'Confirma el PIN',
    pinMustBe4Digits: 'El PIN debe tener 4 dígitos',
    pinsDoNotMatch: 'Los PINs no coinciden',
    pinSaved: 'PIN configurado',
    pinDisabled: 'Bloqueo desactivado',
    currentPinIncorrect: 'PIN actual incorrecto',
    shareApp: 'Compartir Notein',
    privacyPolicy: 'Política de privacidad',
    rateApp: 'Calificar (5 estrellas)',
    appVersion: 'Versión',
    sortTitle: 'Ordenar notas',
    generalSection: 'General',
    timeSection: 'Tiempo',
    sortTitleAZ: 'Título (A - Z)',
    sortTitleZA: 'Título (Z - A)',
    sortModNew: 'Última modificación (recientes)',
    sortModOld: 'Última modificación (antiguas)',
    sortCreateNew: 'Fecha de creación (nuevas)',
    sortCreateOld: 'Fecha de creación (antiguas)',
    copiedLink: 'Enlace copiado al portapapeles',
    backupNotes: 'Copia de seguridad',
    exportNotes: 'Exportar notas (JSON)',
    importNotes: 'Importar notas',
    deviceFrame: 'Marco móvil',
    fullScreen: 'Pantalla completa',
    charsCount: 'caracteres',
    wordsCount: 'palabras',
    adSponsored: 'Anuncio patrocinado',
    adBanner: 'Banner AdMob',
    adInterstitial: 'Anuncio intersticial',
    adNative: 'Anuncio nativo',
    adSkip: 'Cerrar anuncio',
    adSkipIn: 'Omitir en',
    adInfo: 'Google AdMob',
    apkAabCenter: 'Generar APK y AAB',
    apkAabDesc: 'Configuraciones y comandos para Google Play',
    admobUnitsTitle: 'Identificadores de anuncios AdMob',
  },
};
