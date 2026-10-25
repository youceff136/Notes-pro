/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Crown,
  Sparkles,
  ArrowRight,
  ArrowUpDown,
  Search,
  EllipsisVertical,
  Pencil,
  Check,
  X,
  ChevronLeft,
  Lock,
  Layers,
  ShieldCheck,
  Star,
  Globe,
  Type,
  Calendar,
  Bell,
  Share2,
  Moon,
  Sun,
  Trash2,
  Pin,
  Download,
  Upload,
  RotateCcw,
  Copy,
  Clock,
  ExternalLink,
} from 'lucide-react';

import { Note, Screen, SortMode, FontSize, LanguageCode } from './types';
import { CATEGORIES, LANGUAGES, FONT_SIZES, WEEK_DAYS, INITIAL_SAMPLE_NOTES } from './constants';
import { translations } from './translations';
import { admobService } from './admobService';
import { AdBanner } from './components/AdBanner';
import { AdNativeCard } from './components/AdNativeCard';
import { AdInterstitialModal } from './components/AdInterstitialModal';

export default function App() {
  // Local storage keys
  const STORAGE_NOTES = 'notein_notes_v1';
  const STORAGE_SETTINGS = 'notein_settings_v1';
  const STORAGE_ONBOARDED = 'notein_onboarded_v1';

  // Persistence loader
  const [hasLoaded, setHasLoaded] = useState(false);
  const [screen, setScreen] = useState<Screen>('welcome');
  const [language, setLanguage] = useState<LanguageCode>('ar');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [defaultCategory, setDefaultCategory] = useState<string>('شخصي');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [weekStartsOn, setWeekStartsOn] = useState<string>('الأحد');
  const [showTipBanner, setShowTipBanner] = useState<boolean>(true);
  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string | null>(null);

  // AdMob State (Active)
  const showAds = true;
  const [showInterstitial, setShowInterstitial] = useState<boolean>(false);

  // App lock state
  const [isAppLocked, setIsAppLocked] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortModalOpen, setSortModalOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortMode>('mod-new');
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  // Note editor modal
  const [noteModalOpen, setNoteModalOpen] = useState<boolean>(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteCategory, setNoteCategory] = useState<string>('شخصي');

  // Settings sub-modal
  const [settingsModal, setSettingsModal] = useState<
    null | 'defaultCategory' | 'language' | 'fontSize' | 'weekStart' | 'setPin' | 'changePin' | 'about' | 'backup'
  >(null);

  // PIN modal forms
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [pinModalError, setPinModalError] = useState<string>('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Load from local storage on mount
  useEffect(() => {
    try {
      admobService.initialize();

      const savedNotes = localStorage.getItem(STORAGE_NOTES);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes(INITIAL_SAMPLE_NOTES);
      }

      const savedSettings = localStorage.getItem(STORAGE_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.language) setLanguage(parsed.language);
        if (typeof parsed.isDarkMode === 'boolean') setIsDarkMode(parsed.isDarkMode);
        if (parsed.defaultCategory) setDefaultCategory(parsed.defaultCategory);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.weekStartsOn) setWeekStartsOn(parsed.weekStartsOn);
        if (typeof parsed.showTipBanner === 'boolean') setShowTipBanner(parsed.showTipBanner);
        if (typeof parsed.isPinEnabled === 'boolean') setIsPinEnabled(parsed.isPinEnabled);
        if (parsed.pinCode) {
          setPinCode(parsed.pinCode);
          if (parsed.isPinEnabled) setIsAppLocked(true);
        }
      }

      const onboarded = localStorage.getItem(STORAGE_ONBOARDED);
      if (onboarded === 'true') {
        setScreen('main');
      }
    } catch (e) {
      console.error('Storage loading error', e);
      setNotes(INITIAL_SAMPLE_NOTES);
    }
    setHasLoaded(true);
  }, []);

  // Save notes whenever changed
  useEffect(() => {
    if (!hasLoaded) return;
    try {
      localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving notes', e);
    }
  }, [notes, hasLoaded]);

  // Save settings whenever changed
  useEffect(() => {
    if (!hasLoaded) return;
    try {
      const settingsPayload = {
        language,
        isDarkMode,
        defaultCategory,
        fontSize,
        weekStartsOn,
        showTipBanner,
        isPinEnabled,
        pinCode,
        showAds,
      };
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settingsPayload));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }, [language, isDarkMode, defaultCategory, fontSize, weekStartsOn, showTipBanner, isPinEnabled, pinCode, showAds, hasLoaded]);

  const t = translations[language] || translations.ar;
  const isRtl = language === 'ar';

  // Filtered and sorted notes
  const displayedNotes = useMemo(() => {
    let result = [...notes];

    // Filter by category
    if (selectedCategory !== 'الكل') {
      result = result.filter((n) => n.category === selectedCategory);
    }

    // Filter by query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }

    // Sort: pinned always first, then by chosen mode
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'title-az':
          return a.title.localeCompare(b.title, language);
        case 'title-za':
          return b.title.localeCompare(a.title, language);
        case 'mod-new':
          return b.updatedAt - a.updatedAt;
        case 'mod-old':
          return a.updatedAt - b.updatedAt;
        case 'create-new':
          return b.createdAt - a.createdAt;
        case 'create-old':
          return a.createdAt - b.createdAt;
        default:
          return 0;
      }
    });

    return result;
  }, [notes, selectedCategory, searchQuery, sortBy, language]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'الكل': notes.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'الكل') {
        counts[cat.id] = notes.filter((n) => n.category === cat.id).length;
      }
    });
    return counts;
  }, [notes]);

  // Open note editor
  const handleOpenNote = (note?: Note) => {
    if (note) {
      setEditingNoteId(note.id);
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setNoteCategory(note.category === 'الكل' ? defaultCategory : note.category);
    } else {
      setEditingNoteId(null);
      setNoteTitle('');
      setNoteContent('');
      setNoteCategory(selectedCategory === 'الكل' ? defaultCategory : selectedCategory);
    }
    setNoteModalOpen(true);
  };

  // Save note
  const handleSaveNote = () => {
    if (!noteTitle.trim() && !noteContent.trim()) {
      setNoteModalOpen(false);
      return;
    }

    const now = Date.now();
    if (editingNoteId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNoteId
            ? {
                ...n,
                title: noteTitle.trim() || t.titlePlaceholder,
                content: noteContent,
                category: noteCategory,
                updatedAt: now,
              }
            : n
        )
      );
      showToast(t.noteSaved);
    } else {
      const newNoteItem: Note = {
        id: 'note_' + Math.random().toString(36).slice(2, 10),
        title: noteTitle.trim() || t.titlePlaceholder,
        content: noteContent,
        category: noteCategory,
        createdAt: now,
        updatedAt: now,
        isPinned: false,
      };
      setNotes((prev) => [newNoteItem, ...prev]);
      showToast(t.noteSaved);
    }
    setNoteModalOpen(false);

    // Trigger Interstitial Ad based on frequency capping
    if (showAds && admobService.shouldShowInterstitialOnAction()) {
      setTimeout(() => {
        setShowInterstitial(true);
      }, 500);
    }
  };

  // Delete note
  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast(t.noteDeleted);
    if (editingNoteId === id) {
      setNoteModalOpen(false);
    }
  };

  // Toggle pin note
  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
    showToast('تم تحديث تثبيت الملاحظة');
  };

  // Unlock pin verification
  const handleUnlockPin = () => {
    if (enteredPin === pinCode) {
      setIsAppLocked(false);
      setEnteredPin('');
      setPinError('');
      showToast('تم فتح قفل التطبيق');
    } else {
      setPinError(t.wrongPin);
      setEnteredPin('');
    }
  };

  // Keypad press
  const handleKeypadPress = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setPinError('');
      if (nextPin.length === 4) {
        if (nextPin === pinCode) {
          setTimeout(() => {
            setIsAppLocked(false);
            setEnteredPin('');
            setPinError('');
            showToast('تم فتح القفل');
          }, 150);
        } else {
          setTimeout(() => {
            setPinError(t.wrongPin);
            setEnteredPin('');
          }, 200);
        }
      }
    }
  };

  // Save new PIN
  const handleSaveNewPin = () => {
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setPinModalError(t.pinMustBe4Digits);
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinModalError(t.pinsDoNotMatch);
      return;
    }
    setPinCode(newPinInput);
    setIsPinEnabled(true);
    setSettingsModal(null);
    setNewPinInput('');
    setConfirmPinInput('');
    setPinModalError('');
    showToast(t.pinSaved);
  };

  // Change existing PIN
  const handleChangeExistingPin = () => {
    if (currentPinInput !== pinCode) {
      setPinModalError(t.currentPinIncorrect);
      return;
    }
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setPinModalError(t.pinMustBe4Digits);
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinModalError(t.pinsDoNotMatch);
      return;
    }
    setPinCode(newPinInput);
    setSettingsModal(null);
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setPinModalError('');
    showToast('تم تغيير رمز PIN بنجاح');
  };

  // Toggle PIN feature
  const handleTogglePinFeature = () => {
    if (!isPinEnabled) {
      setNewPinInput('');
      setConfirmPinInput('');
      setPinModalError('');
      setSettingsModal('setPin');
    } else {
      setIsPinEnabled(false);
      setPinCode(null);
      setIsAppLocked(false);
      showToast(t.pinDisabled);
    }
  };

  // Complete onboarding
  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem(STORAGE_ONBOARDED, 'true');
    } catch (e) {
      console.error(e);
    }
    setScreen('main');
  };

  // Share application
  const handleShareApp = () => {
    const shareText = 'جرب تطبيق Notein لتنظيم ملاحظاتك وأفكارك بسهولة وأمان: https://notein.app';
    if (navigator.share) {
      navigator.share({ title: 'Notein', text: shareText }).catch(() => {});
      showToast('تم فتح نافذة المشاركة');
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast(t.copiedLink);
      }).catch(() => {
        showToast(shareText);
      });
    }
  };

  // Open privacy policy link
  const handlePrivacyPolicy = () => {
    window.open('https://youcef48app.blogspot.com/p/blog-page.html', '_blank', 'noopener,noreferrer');
    showToast(t.privacyPolicy);
  };

  // Export notes JSON
  const handleExportNotes = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `notein-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('تم تصدير نسخة احتياطية من ملاحظاتك');
  };

  // Import notes JSON
  const handleImportNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            setNotes(parsed);
            showToast(`تم استيراد ${parsed.length} ملاحظة بنجاح`);
            setSettingsModal(null);
          } else {
            showToast('ملف النسخ الاحتياطي غير صالح');
          }
        } catch {
          showToast('حدث خطأ أثناء قراءة الملف');
        }
      };
    }
  };

  // Formatting helpers inside note editor
  const insertTextAtCursor = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('note-textarea') as HTMLTextAreaElement | null;
    if (!textarea) {
      setNoteContent((prev) => prev + prefix + suffix);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = noteContent.substring(start, end);
    const replacement = prefix + (selected || '') + suffix;
    const nextContent = noteContent.substring(0, start) + replacement + noteContent.substring(end);
    setNoteContent(nextContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  // Color tokens based on dark/light mode
  const bgOuter = isDarkMode ? '#0A0A0A' : '#E8E9EE';
  const bgSurface = isDarkMode ? '#121212' : '#FFFFFF';
  const bgCard = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const bgMuted = isDarkMode ? '#252525' : '#F3F4F6';
  const borderColor = isDarkMode ? '#2A2A2A' : '#EDEDF0';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#111827';
  const textSecondary = isDarkMode ? '#9E9E9E' : '#6B7280';
  const brandBlue = '#2196F3';

  // Dynamic font sizing
  const fontClasses = useMemo(() => {
    if (fontSize === 'small') {
      return {
        cardTitle: 'text-[14px]',
        cardSnippet: 'text-[12px]',
        editorTitle: 'text-[18px]',
        editorContent: 'text-[14px]',
      };
    }
    if (fontSize === 'large') {
      return {
        cardTitle: 'text-[17px]',
        cardSnippet: 'text-[14px]',
        editorTitle: 'text-[22px]',
        editorContent: 'text-[16px]',
      };
    }
    return {
      cardTitle: 'text-[15px]',
      cardSnippet: 'text-[13px]',
      editorTitle: 'text-[20px]',
      editorContent: 'text-[15px]',
    };
  }, [fontSize]);

  // Format date helper
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full h-screen h-[100dvh] flex flex-col overflow-hidden font-sans select-none"
      style={{
        background: bgSurface,
        color: textPrimary,
        fontFamily: isRtl ? "'Tajawal', system-ui, sans-serif" : "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Responsive viewport matching all phone and tablet screens */}
      <div className="flex-1 flex flex-col relative overflow-hidden w-full max-w-2xl mx-auto">
          {/* ============================================================ */}
          {/* APP LOCK SCREEN (When active) */}
          {/* ============================================================ */}
          {isAppLocked && isPinEnabled && pinCode && (
            <div
              className="absolute inset-0 z-[70] flex flex-col items-center justify-center px-8 backdrop-blur-md animate-fade"
              style={{ background: bgSurface }}
            >
              <div
                className="w-20 h-20 rounded-[22px] flex items-center justify-center mb-6 shadow-md border"
                style={{ background: bgCard, borderColor }}
              >
                <Lock className="w-9 h-9" style={{ color: brandBlue }} />
              </div>
              <h2 className="text-[22px] font-extrabold">{t.appLocked}</h2>
              <p className="text-[13px] mt-2 text-center" style={{ color: textSecondary }}>
                {t.enterPin}
              </p>

              {/* Pin dots */}
              <div className="mt-8 flex gap-3 justify-center">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="w-14 h-14 rounded-[14px] border-2 flex items-center justify-center text-[24px] font-bold transition-all shadow-sm"
                    style={{
                      background: enteredPin.length > idx ? brandBlue : bgCard,
                      borderColor: enteredPin.length > idx ? brandBlue : borderColor,
                      color: enteredPin.length > idx ? '#fff' : textSecondary,
                    }}
                  >
                    {enteredPin[idx] ? '●' : ''}
                  </div>
                ))}
              </div>

              {pinError && <p className="mt-4 text-[13px] text-red-500 font-bold">{pinError}</p>}

              {/* Numeric Keypad */}
              <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-[260px]">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeypadPress(digit)}
                    className="h-[56px] rounded-full font-bold text-[20px] active:scale-95 transition flex items-center justify-center cursor-pointer shadow-sm hover:opacity-90"
                    style={{ background: bgCard, border: `1px solid ${borderColor}`, color: textPrimary }}
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={() => setEnteredPin((p) => p.slice(0, -1))}
                  className="h-[56px] rounded-full flex items-center justify-center active:scale-95 transition cursor-pointer"
                  style={{ background: bgCard, border: `1px solid ${borderColor}` }}
                  title="مسح"
                >
                  <X className="w-5 h-5" style={{ color: textSecondary }} />
                </button>
                <button
                  onClick={() => handleKeypadPress('0')}
                  className="h-[56px] rounded-full font-bold text-[20px] active:scale-95 transition flex items-center justify-center cursor-pointer shadow-sm"
                  style={{ background: bgCard, border: `1px solid ${borderColor}`, color: textPrimary }}
                >
                  0
                </button>
                <button
                  onClick={handleUnlockPin}
                  className="h-[56px] rounded-full text-white flex items-center justify-center active:scale-95 transition cursor-pointer shadow-md"
                  style={{ background: brandBlue }}
                  title="تأكيد"
                >
                  <Check className="w-6 h-6" />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsAppLocked(false);
                  setEnteredPin('');
                  showToast('تم تخطي القفل (وضع التجربة)');
                }}
                className="mt-8 text-[12px] underline cursor-pointer hover:opacity-80"
                style={{ color: textSecondary }}
              >
                {t.skipTest}
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 1: WELCOME */}
          {/* ============================================================ */}
          {screen === 'welcome' && (
            <div className="flex-1 flex flex-col items-center justify-between px-7 py-10 overflow-y-auto">
              <div className="flex-1 w-full flex flex-col items-center justify-center">
                {/* Notein Iconic Logo Card */}
                <div
                  className="w-[96px] h-[96px] rounded-[24px] flex items-center justify-center shadow-xl border mb-6 relative transition-transform hover:scale-105"
                  style={{ background: bgCard, borderColor }}
                >
                  <FileText className="w-12 h-12" style={{ color: textPrimary }} />
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                    <Crown className="w-3.5 h-3.5 text-neutral-900 fill-neutral-900" />
                  </div>
                </div>

                <h1 className="text-[34px] font-extrabold tracking-tight flex items-center gap-2">
                  <span>Notein</span>
                  <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
                </h1>

                <p className="text-[15px] mt-3 text-center leading-6 max-w-xs" style={{ color: textSecondary }}>
                  {t.tagline}
                </p>

                {/* Feature highlight badge card */}
                <div
                  className="mt-8 w-full rounded-[20px] border p-4 flex gap-3 shadow-sm"
                  style={{ background: bgCard, borderColor }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: bgMuted }}>
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-start">
                    <p className="text-[14px] font-bold">{t.smartFolders}</p>
                    <p className="text-[12px] mt-1 leading-5" style={{ color: textSecondary }}>
                      {t.smartFoldersDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full pt-4">
                <button
                  onClick={() => setScreen('language')}
                  className="w-full h-[52px] rounded-full text-white font-bold text-[16px] shadow-[0_8px_20px_rgba(33,150,243,0.35)] active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: brandBlue }}
                >
                  <span>{t.startNow}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 2: LANGUAGE SELECTION */}
          {/* ============================================================ */}
          {screen === 'language' && (
            <div className="flex-1 flex flex-col">
              <header className="h-[56px] flex items-center px-4 gap-3 border-b shrink-0" style={{ borderColor }}>
                <button
                  onClick={() => setScreen('welcome')}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition active:scale-95"
                  style={{ background: bgMuted }}
                  title="رجوع"
                >
                  <ChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} style={{ color: textPrimary }} />
                </button>
                <p className="font-bold text-[17px]">{t.selectLanguage}</p>
              </header>

              <div className="p-5 flex-1 overflow-y-auto">
                <p className="text-[13px] mb-5" style={{ color: textSecondary }}>
                  {t.selectLanguageSub}
                </p>

                <div className="space-y-3">
                  {LANGUAGES.map((lang) => {
                    const isSelected = language === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setLanguage(lang.id);
                          showToast(`تم اختيار ${lang.label}`);
                        }}
                        className="w-full h-[68px] rounded-[18px] border flex items-center justify-between px-5 transition active:scale-[0.99] cursor-pointer"
                        style={{
                          background: bgCard,
                          borderColor: isSelected ? brandBlue : borderColor,
                          borderWidth: isSelected ? 2 : 1,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full flex items-center justify-center text-[18px]" style={{ background: bgMuted }}>
                            {lang.flag}
                          </div>
                          <div className="text-start">
                            <p className="font-bold text-[15px]">{lang.native}</p>
                            <p className="text-[12px]" style={{ color: textSecondary }}>
                              {lang.sub}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-5">
                <button
                  onClick={() => setScreen('rating')}
                  className="w-full h-[52px] rounded-full text-white font-bold text-[16px] active:scale-[0.98] transition cursor-pointer shadow-md"
                  style={{ background: brandBlue }}
                >
                  {t.continueBtn}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 3: RATING & SOCIAL PROOF */}
          {/* ============================================================ */}
          {screen === 'rating' && (
            <div className="flex-1 flex flex-col items-center justify-between px-6 py-8">
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div
                  className="w-full rounded-[26px] border p-6 flex flex-col items-center shadow-lg"
                  style={{ background: bgCard, borderColor }}
                >
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((starIdx) => (
                      <Star key={starIdx} className="w-7 h-7 fill-amber-400 text-amber-400 drop-shadow-sm" />
                    ))}
                  </div>

                  <p className="text-[46px] font-extrabold leading-none tracking-tight">{t.ratingTitle}</p>
                  <p className="text-[13px] mt-2 font-medium" style={{ color: textSecondary }}>
                    {t.ratingSub}
                  </p>

                  <div className="my-6 w-full h-[1px]" style={{ background: borderColor }} />

                  {/* Social Proof Avatars */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      <div className="w-9 h-9 rounded-full bg-amber-400/20 border-2 border-white/20 flex items-center justify-center text-[15px]">
                        😊
                      </div>
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-white/20 flex items-center justify-center text-[15px]">
                        👩‍💼
                      </div>
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 border-2 border-white/20 flex items-center justify-center text-[15px]">
                        👨‍💻
                      </div>
                      <div className="w-9 h-9 rounded-full bg-purple-500/20 border-2 border-white/20 flex items-center justify-center text-[15px]">
                        ✍️
                      </div>
                    </div>
                    <div className="text-start">
                      <p className="font-bold text-[16px]">25,000,000+</p>
                      <p className="text-[12px]" style={{ color: textSecondary }}>
                        {t.downloadsText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full pt-4">
                <button
                  onClick={() => setScreen('features')}
                  className="w-full h-[52px] rounded-full text-white font-bold text-[16px] active:scale-[0.98] transition cursor-pointer shadow-md"
                  style={{ background: brandBlue }}
                >
                  {t.continueBtn}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 4: FEATURES SHOWCASE */}
          {/* ============================================================ */}
          {screen === 'features' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="px-6 pt-10 flex-1 overflow-y-auto">
                <h2 className="text-[26px] font-extrabold leading-9">
                  {t.featuresTitle1}
                  <br />
                  <span className="text-blue-500">{t.featuresTitle2}</span>
                </h2>

                <div className="mt-7 space-y-3.5">
                  {[
                    {
                      icon: Layers,
                      title: t.smartFolders,
                      desc: t.smartFoldersDesc,
                      color: '#90CAF9',
                      bg: '#1E2B4D',
                    },
                    {
                      icon: ShieldCheck,
                      title: t.safeProtected,
                      desc: t.safeProtectedDesc,
                      color: '#A5D6A7',
                      bg: '#1C3326',
                    },
                    {
                      icon: Sparkles,
                      title: t.fastSearch,
                      desc: t.fastSearchDesc,
                      color: '#FFCC80',
                      bg: '#3D2E1F',
                    },
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 border rounded-[20px] p-4 items-center shadow-sm transition hover:translate-x-1"
                      style={{ background: bgCard, borderColor }}
                    >
                      <div
                        className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 shadow-sm"
                        style={{ background: isDarkMode ? feat.bg : '#F3F4F6' }}
                      >
                        <feat.icon className="w-6 h-6" style={{ color: feat.color }} />
                      </div>
                      <div className="text-start">
                        <p className="font-bold text-[15px]">{feat.title}</p>
                        <p className="text-[12px] mt-1 leading-5" style={{ color: textSecondary }}>
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <button
                  onClick={handleCompleteOnboarding}
                  className="w-full h-[52px] rounded-full text-white font-bold flex items-center justify-center gap-2 text-[16px] active:scale-[0.98] transition cursor-pointer shadow-lg"
                  style={{ background: brandBlue }}
                >
                  <span>{t.startUsingApp}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 5: MAIN NOTES VIEW */}
          {/* ============================================================ */}
          {screen === 'main' && (
            <div className="flex-1 flex flex-col h-full relative">
              {/* App Bar */}
              <header className="h-[56px] shrink-0 flex items-center justify-between px-4 border-b sticky top-0 z-10" style={{ background: bgSurface, borderColor }}>
                {!searchOpen ? (
                  <>
                    <div className="flex items-center gap-2">
                      <h1 className="text-[22px] font-extrabold flex items-center gap-1.5 tracking-tight">
                        <span>Notein</span>
                        <Crown className="w-[18px] h-[18px] text-amber-400 fill-amber-400 drop-shadow" />
                      </h1>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSearchOpen(true)}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer hover:bg-neutral-500/10"
                        title="بحث"
                      >
                        <Search className="w-[20px] h-[20px]" style={{ color: textPrimary }} />
                      </button>

                      <button
                        onClick={() => setSortModalOpen(true)}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer hover:bg-neutral-500/10"
                        title="ترتيب"
                      >
                        <ArrowUpDown className="w-[20px] h-[20px]" style={{ color: textPrimary }} />
                      </button>

                      <button
                        onClick={() => setScreen('settings')}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer hover:bg-neutral-500/10"
                        title="الإعدادات"
                      >
                        <EllipsisVertical className="w-[20px] h-[20px]" style={{ color: textPrimary }} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-500/10"
                      title="إغلاق البحث"
                    >
                      <ChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} style={{ color: textPrimary }} />
                    </button>

                    <div
                      className="flex-1 h-[40px] rounded-full flex items-center px-4 gap-2 border"
                      style={{ background: bgMuted, borderColor }}
                    >
                      <Search className="w-4 h-4 shrink-0" style={{ color: textSecondary }} />
                      <input
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-neutral-500"
                        style={{ color: textPrimary }}
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="cursor-pointer">
                          <X className="w-4 h-4" style={{ color: textSecondary }} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </header>

              {/* Category Pills Bar */}
              <nav aria-label="Note categories" className="px-4 py-3 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`h-[34px] px-3.5 rounded-full text-[13px] font-bold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 border cursor-pointer ${
                        isSelected ? 'shadow-md border-transparent' : 'opacity-85 hover:opacity-100'
                      }`}
                      style={
                        isSelected
                          ? { background: cat.chipBg, color: cat.chipText }
                          : { background: bgCard, borderColor, color: textSecondary }
                      }
                    >
                      <span
                        className="w-[7px] h-[7px] rounded-full"
                        style={{ background: isSelected ? cat.chipText : cat.dot }}
                      />
                      <span>{cat.label}</span>
                      <span className="text-[11px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </nav>

              {/* Tip / Notification Banner */}
              {showTipBanner && !bannerDismissed && (
                <div
                  className="mx-4 mb-3 rounded-[14px] px-4 py-2.5 flex items-center justify-between shadow-sm border border-blue-500/20"
                  style={{ background: isDarkMode ? '#17283c' : '#EBF5FF' }}
                >
                  <p className="text-[12px] font-medium flex items-center gap-1" style={{ color: isDarkMode ? '#90CAF9' : '#1A3C5E' }}>
                    <Bell className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.tipBanner}</span>
                    <span className="font-bold cursor-pointer underline" onClick={() => handleOpenNote()}>
                      {t.tipBannerAction}
                    </span>
                  </p>
                  <button
                    onClick={() => setBannerDismissed(true)}
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:opacity-70 transition ml-2 rtl:mr-2 rtl:ml-0"
                    style={{ background: isDarkMode ? '#243b55' : '#D0E6FC' }}
                    title="إغلاق التلميح"
                  >
                    <X className="w-3.5 h-3.5" style={{ color: isDarkMode ? '#90CAF9' : '#1A3C5E' }} />
                  </button>
                </div>
              )}

              {/* Notes List or Empty State */}
              <main className="flex-1 overflow-y-auto px-4 pb-[110px]">
                {displayedNotes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center pt-8 pb-12">
                    {/* Empty State Realistic Stack Graphic */}
                    <div className="relative w-[180px] h-[130px] mb-5">
                      <div
                        className="absolute top-2 left-6 w-[120px] h-[90px] rounded-[14px] border rotate-[-8deg] opacity-60"
                        style={{ background: bgMuted, borderColor }}
                      />
                      <div
                        className="absolute top-0 left-10 w-[120px] h-[90px] rounded-[14px] border rotate-[-2deg] shadow-lg flex flex-col p-3 gap-2"
                        style={{ background: bgCard, borderColor }}
                      >
                        <div className="h-2 w-3/4 rounded-full bg-blue-500/30" />
                        <div className="h-2 w-full rounded-full bg-neutral-500/20" />
                        <div className="h-2 w-2/3 rounded-full bg-neutral-500/20" />
                      </div>
                      <div
                        className="absolute bottom-1 right-6 w-11 h-11 rounded-full text-white flex items-center justify-center rotate-12 shadow-lg"
                        style={{ background: brandBlue }}
                      >
                        <Pencil className="w-5 h-5 -rotate-12" />
                      </div>
                    </div>

                    <p className="text-[16px] font-bold">{t.emptyStateTitle}</p>
                    <p className="text-[13px] mt-2 text-center leading-6 max-w-xs" style={{ color: textSecondary }}>
                      {t.emptyStateDesc}
                    </p>

                    {searchQuery && (
                      <p className="text-[13px] mt-3 font-semibold text-amber-500">
                        {t.noSearchResults}
                      </p>
                    )}

                    <button
                      onClick={() => handleOpenNote()}
                      className="mt-6 px-5 py-2.5 rounded-full text-white text-[13px] font-bold shadow-md cursor-pointer transition active:scale-95"
                      style={{ background: brandBlue }}
                    >
                      + {t.newNote}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {displayedNotes.map((note, idx) => {
                      const categoryObj = CATEGORIES.find((c) => c.id === note.category);
                      const accentColor = categoryObj ? categoryObj.dot : brandBlue;

                      return (
                        <React.Fragment key={note.id}>
                          <div
                            onClick={() => handleOpenNote(note)}
                            className="rounded-[18px] border p-4 transition-all duration-200 hover:shadow-md cursor-pointer relative group flex flex-col justify-between"
                            style={{
                              background: bgCard,
                              borderColor,
                              borderRight: isRtl ? `4px solid ${accentColor}` : undefined,
                              borderLeft: !isRtl ? `4px solid ${accentColor}` : undefined,
                            }}
                          >
                            {/* Note Header */}
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h3 className={`font-bold ${fontClasses.cardTitle} line-clamp-1 flex-1 leading-snug`}>
                                {note.title}
                              </h3>

                              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                {note.isPinned && (
                                  <span className="p-1 rounded-md bg-amber-400/15 text-amber-500" title="مثبت">
                                    <Pin className="w-3.5 h-3.5 fill-amber-500" />
                                  </span>
                                )}
                                <button
                                  onClick={(e) => handleTogglePin(note.id, e)}
                                  className="p-1 rounded-md hover:bg-neutral-500/15 text-neutral-400 hover:text-amber-500 transition"
                                  title={note.isPinned ? 'إلغاء التثبيت' : 'تثبيت الملاحظة'}
                                >
                                  <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteNote(note.id, e)}
                                  className="p-1 rounded-md hover:bg-red-500/15 text-neutral-400 hover:text-red-500 transition"
                                  title="حذف"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Snippet preview */}
                            <p
                              className={`${fontClasses.cardSnippet} line-clamp-2 leading-relaxed whitespace-pre-line mb-3`}
                              style={{ color: textSecondary }}
                            >
                              {note.content || '...'}
                            </p>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t" style={{ borderColor }}>
                              <div className="flex items-center gap-2">
                                <span
                                  className="px-2 py-0.5 rounded-full font-medium"
                                  style={{
                                    background: isDarkMode ? '#222' : '#F0F0F3',
                                    color: accentColor,
                                  }}
                                >
                                  {note.category}
                                </span>
                                <span className="flex items-center gap-1" style={{ color: textSecondary }}>
                                  <Clock className="w-3 h-3" />
                                  {formatDate(note.updatedAt)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-neutral-400">
                                <span className="text-[10px]">
                                  {note.content.split(/\s+/).filter(Boolean).length} {t.wordsCount}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Native AdMob in-feed ad seamlessly inserted after 1st or 3rd note */}
                          {showAds && (idx === 0 || (idx > 0 && idx % 3 === 0)) && (
                            <AdNativeCard
                              language={language}
                              isDarkMode={isDarkMode}
                              adIndex={idx}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </main>

              {/* Bottom Sticky AdMob Banner */}
              <div className="absolute bottom-0 left-0 right-0 z-15 bg-transparent pb-1">
                <AdBanner
                  language={language}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Floating Action Button (FAB) for Creating Note */}
              <button
                onClick={() => handleOpenNote()}
                className="absolute bottom-16 rtl:left-5 ltr:right-5 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-[0_10px_25px_rgba(33,150,243,0.45)] active:scale-95 transition-transform cursor-pointer z-20 group"
                style={{ background: brandBlue }}
                title="إنشاء ملاحظة جديدة"
              >
                <Pencil className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* SCREEN 6: SETTINGS VIEW */}
          {/* ============================================================ */}
          {screen === 'settings' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <header className="h-[56px] flex items-center px-4 gap-3 border-b shrink-0" style={{ borderColor }}>
                <button
                  onClick={() => setScreen('main')}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition active:scale-95"
                  style={{ background: bgMuted }}
                  title="رجوع"
                >
                  <ChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} style={{ color: textPrimary }} />
                </button>
                <p className="font-bold text-[17px]">{t.settingsTitle}</p>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-14">
                {/* Section 1: Appearance & Category */}
                <div className="rounded-[20px] border p-2" style={{ background: bgCard, borderColor }}>
                  <div className="px-3 py-2 text-[12px] font-extrabold uppercase tracking-wider text-blue-500">
                    المظهر والمجلد
                  </div>

                  {/* Dark mode switch */}
                  <div className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{isDarkMode ? t.themeDark : t.themeLight}</p>
                        <p className="text-[12px]" style={{ color: textSecondary }}>
                          تبديل المظهر الليلي والفاتح
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsDarkMode((p) => !p);
                        showToast(!isDarkMode ? t.darkModeActivated : t.lightModeActivated);
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isDarkMode ? 'bg-blue-600' : 'bg-neutral-400'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          isDarkMode ? 'rtl:right-6 ltr:left-6' : 'rtl:right-0.5 ltr:left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Default Folder */}
                  <div
                    onClick={() => setSettingsModal('defaultCategory')}
                    className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Layers className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{t.defaultFolder}</p>
                        <p className="text-[12px]" style={{ color: textSecondary }}>
                          المجلد التلقائي للملاحظات الجديدة
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-bold text-blue-400">{defaultCategory}</span>
                      <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} style={{ color: textSecondary }} />
                    </div>
                  </div>

                  {/* Font Size */}
                  <div
                    onClick={() => setSettingsModal('fontSize')}
                    className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Type className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{t.fontSizeLabel}</p>
                        <p className="text-[12px]" style={{ color: textSecondary }}>
                          التحكم في حجم خط القراءة
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-bold text-blue-400">
                        {FONT_SIZES.find((f) => f.id === fontSize)?.label}
                      </span>
                      <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} style={{ color: textSecondary }} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Security & Privacy */}
                <div className="rounded-[20px] border p-2" style={{ background: bgCard, borderColor }}>
                  <div className="px-3 py-2 text-[12px] font-extrabold uppercase tracking-wider text-blue-500">
                    الأمان والخصوصية
                  </div>

                  {/* Pin Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Lock className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{t.pinLock}</p>
                        <p className="text-[12px]" style={{ color: textSecondary }}>
                          حماية التطبيق برمز PIN مكون من 4 أرقام
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleTogglePinFeature}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isPinEnabled ? 'bg-blue-600' : 'bg-neutral-400'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          isPinEnabled ? 'rtl:right-6 ltr:left-6' : 'rtl:right-0.5 ltr:left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Change PIN option if enabled */}
                  {isPinEnabled && (
                    <div
                      onClick={() => {
                        setCurrentPinInput('');
                        setNewPinInput('');
                        setConfirmPinInput('');
                        setPinModalError('');
                        setSettingsModal('changePin');
                      }}
                      className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                          <ShieldCheck className="w-5 h-5 text-cyan-400" />
                        </div>
                        <p className="font-bold text-[14px]">{t.changePin}</p>
                      </div>
                      <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} style={{ color: textSecondary }} />
                    </div>
                  )}

                  {/* Lock Now Button */}
                  {isPinEnabled && (
                    <div
                      onClick={() => {
                        setIsAppLocked(true);
                        setScreen('main');
                        showToast('تم قفل التطبيق');
                      }}
                      className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer text-amber-500"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-amber-500/15">
                          <Lock className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="font-bold text-[14px]">قفل التطبيق الآن فوراً</p>
                      </div>
                      <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
                    </div>
                  )}
                </div>

                {/* Section 3: System & Language */}
                <div className="rounded-[20px] border p-2" style={{ background: bgCard, borderColor }}>
                  <div className="px-3 py-2 text-[12px] font-extrabold uppercase tracking-wider text-blue-500">
                    النظام والتخصيص
                  </div>

                  {/* Language */}
                  <div
                    onClick={() => setSettingsModal('language')}
                    className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Globe className="w-5 h-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{t.selectLanguage}</p>
                        <p className="text-[12px]" style={{ color: textSecondary }}>
                          تغيير لغة العرض
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-bold text-blue-400">
                        {LANGUAGES.find((l) => l.id === language)?.native}
                      </span>
                      <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} style={{ color: textSecondary }} />
                    </div>
                  </div>

                  {/* Start of week */}
                  <div
                    onClick={() => setSettingsModal('weekStart')}
                    className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Calendar className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{t.weekStartLabel}</p>
                        <p className="text-[12px]" style={{ color: textSecondary }}>
                          بداية تقويم الملاحظات
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-bold text-blue-400">{weekStartsOn}</span>
                      <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} style={{ color: textSecondary }} />
                    </div>
                  </div>

                  {/* Tip banner toggle */}
                  <div className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Bell className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{t.notificationBanner}</p>
                        <p className="text-[12px]" style={{ color: textSecondary }}>
                          إظهار شريط التلميحات بأعلى الملاحظات
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowTipBanner((p) => !p);
                        setBannerDismissed(false);
                        showToast(!showTipBanner ? t.bannerEnabled : t.bannerDisabled);
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        showTipBanner ? 'bg-blue-600' : 'bg-neutral-400'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          showTipBanner ? 'rtl:right-6 ltr:left-6' : 'rtl:right-0.5 ltr:left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Section 4: Data & Backup */}
                <div className="rounded-[20px] border p-2" style={{ background: bgCard, borderColor }}>
                  <div className="px-3 py-2 text-[12px] font-extrabold uppercase tracking-wider text-blue-500">
                    البيانات والنسخ الاحتياطي
                  </div>

                  <div
                    onClick={handleExportNotes}
                    className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Download className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{t.exportNotes}</p>
                        <p className="text-[12px]" style={{ color: textSecondary }}>
                          حفظ جميع ملاحظاتك كملف JSON
                        </p>
                      </div>
                    </div>
                    <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} style={{ color: textSecondary }} />
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Upload className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-[14px]">{t.importNotes}</p>
                        <p className="text-[12px]" style={{ color: textSecondary }}>
                          استرجاع الملاحظات من ملف نسخة احتياطية
                        </p>
                      </div>
                    </div>
                    <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} style={{ color: textSecondary }} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImportNotes}
                      accept=".json"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Section 5: About & Links */}
                <div className="rounded-[20px] border p-2" style={{ background: bgCard, borderColor }}>
                  <div className="px-3 py-2 text-[12px] font-extrabold uppercase tracking-wider text-blue-500">
                    عن التطبيق
                  </div>

                  <div
                    onClick={handleShareApp}
                    className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Share2 className="w-5 h-5 text-sky-400" />
                      </div>
                      <p className="font-bold text-[14px]">{t.shareApp}</p>
                    </div>
                    <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} style={{ color: textSecondary }} />
                  </div>

                  <div
                    onClick={handlePrivacyPolicy}
                    className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <p className="font-bold text-[14px]">{t.privacyPolicy}</p>
                    </div>
                    <ExternalLink className="w-4 h-4" style={{ color: textSecondary }} />
                  </div>

                  <div
                    onClick={() => {
                      showToast('شكراً لدعمك وتجربتك Notein ⭐⭐⭐⭐⭐');
                    }}
                    className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/5 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bgMuted }}>
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      </div>
                      <p className="font-bold text-[14px]">{t.rateApp}</p>
                    </div>
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                  </div>

                  <div className="flex items-center justify-between p-3 text-[13px]" style={{ color: textSecondary }}>
                    <span>{t.appVersion}</span>
                    <span className="font-bold text-neutral-400">v2.4.0 (Notein Pro - AdMob Ready)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* NOTE EDITOR MODAL / SHEET */}
          {/* ============================================================ */}
          {noteModalOpen && (
            <div className="absolute inset-0 z-[50] flex flex-col" style={{ background: bgSurface }}>
              {/* Header */}
              <div className="h-[56px] flex items-center justify-between px-4 border-b shrink-0" style={{ borderColor }}>
                <button
                  onClick={() => setNoteModalOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-500/10 active:scale-95 transition"
                  title="إلغاء"
                >
                  <X className="w-5 h-5" style={{ color: textPrimary }} />
                </button>

                <div className="flex items-center gap-2">
                  {/* Category Pill in Editor */}
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="px-3 py-1 rounded-full text-[12px] font-bold border outline-none cursor-pointer"
                    style={{ background: bgCard, borderColor, color: textPrimary }}
                  >
                    {CATEGORIES.filter((c) => c.id !== 'الكل').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  {editingNoteId && (
                    <button
                      onClick={() => handleDeleteNote(editingNoteId)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500/10 cursor-pointer"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={handleSaveNote}
                    className="h-9 px-4 rounded-full text-white font-bold text-[13px] flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
                    style={{ background: brandBlue }}
                  >
                    <Check className="w-4 h-4" />
                    <span>{t.save}</span>
                  </button>
                </div>
              </div>

              {/* Editor Formatting Helper Bar */}
              <div className="px-4 py-2 flex items-center gap-2 border-b overflow-x-auto no-scrollbar shrink-0" style={{ borderColor, background: bgMuted }}>
                <button
                  onClick={() => insertTextAtCursor('• ')}
                  className="px-2.5 py-1 rounded-lg text-[12px] font-bold border hover:bg-neutral-500/10 active:scale-95 cursor-pointer"
                  style={{ background: bgCard, borderColor }}
                  title="قائمة نقطية"
                >
                  • نقطة
                </button>
                <button
                  onClick={() => insertTextAtCursor('- [ ] ')}
                  className="px-2.5 py-1 rounded-lg text-[12px] font-bold border hover:bg-neutral-500/10 active:scale-95 cursor-pointer"
                  style={{ background: bgCard, borderColor }}
                  title="مربع اختيار"
                >
                  ☑ مهمة
                </button>
                <button
                  onClick={() => insertTextAtCursor('**', '**')}
                  className="px-2.5 py-1 rounded-lg text-[12px] font-bold border hover:bg-neutral-500/10 active:scale-95 cursor-pointer"
                  style={{ background: bgCard, borderColor }}
                  title="نص عريض"
                >
                  B عريض
                </button>
                <button
                  onClick={() => {
                    const timeStr = ` [${new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}] `;
                    insertTextAtCursor(timeStr);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[12px] font-bold border hover:bg-neutral-500/10 active:scale-95 cursor-pointer"
                  style={{ background: bgCard, borderColor }}
                  title="إدراج الوقت الحالي"
                >
                  🕒 توقيت
                </button>
                <button
                  onClick={() => {
                    if (noteTitle || noteContent) {
                      navigator.clipboard.writeText(`${noteTitle}\n\n${noteContent}`).then(() => {
                        showToast('تم نسخ الملاحظة إلى الحافظة');
                      });
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg text-[12px] font-bold border hover:bg-neutral-500/10 active:scale-95 cursor-pointer ml-auto rtl:mr-auto rtl:ml-0"
                  style={{ background: bgCard, borderColor }}
                  title="نسخ الملاحظة"
                >
                  <Copy className="w-3.5 h-3.5 inline mr-1" />
                  نسخ
                </button>
              </div>

              {/* Title & Body Inputs */}
              <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder={t.titlePlaceholder}
                  className={`w-full font-bold bg-transparent outline-none mb-3 placeholder:text-neutral-500 ${fontClasses.editorTitle}`}
                  style={{ color: textPrimary }}
                />

                <div className="w-full h-px mb-4" style={{ background: borderColor }} />

                <textarea
                  id="note-textarea"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={t.contentPlaceholder}
                  className={`flex-1 w-full bg-transparent outline-none resize-none leading-relaxed placeholder:text-neutral-500 ${fontClasses.editorContent}`}
                  style={{ color: textPrimary }}
                />

                {/* Footer Word/Character Counter */}
                <div className="pt-3 border-t flex items-center justify-between text-[11px]" style={{ borderColor, color: textSecondary }}>
                  <span>
                    {noteContent.length} {t.charsCount} • {noteContent.split(/\s+/).filter(Boolean).length} {t.wordsCount}
                  </span>
                  <span>{new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SORT BOTTOM SHEET MODAL */}
          {/* ============================================================ */}
          {sortModalOpen && (
            <div className="absolute inset-0 z-[60] flex flex-col justify-end">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
                onClick={() => setSortModalOpen(false)}
              />
              <div
                className="relative rounded-t-[28px] border-t p-5 shadow-2xl z-10 animate-slide-up max-h-[80%] overflow-y-auto"
                style={{ background: bgCard, borderColor }}
              >
                <div className="w-12 h-1.5 rounded-full bg-neutral-500/30 mx-auto mb-4" />

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-[17px]">{t.sortTitle}</h3>
                  <button
                    onClick={() => setSortModalOpen(false)}
                    className="p-1 rounded-full hover:bg-neutral-500/15 cursor-pointer"
                  >
                    <X className="w-5 h-5" style={{ color: textSecondary }} />
                  </button>
                </div>

                {/* General Options */}
                <p className="text-[12px] font-bold text-blue-400 mb-2">{t.generalSection}</p>
                <div className="space-y-1 mb-4">
                  {[
                    { id: 'title-az' as SortMode, label: t.sortTitleAZ },
                    { id: 'title-za' as SortMode, label: t.sortTitleZA },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSortBy(item.id);
                        setSortModalOpen(false);
                        showToast(`ترتيب: ${item.label}`);
                      }}
                      className="flex items-center justify-between p-3 rounded-[12px] hover:bg-neutral-500/10 cursor-pointer transition"
                    >
                      <span className="text-[14px] font-medium">{item.label}</span>
                      {sortBy === item.id && <Check className="w-4 h-4 text-blue-500" />}
                    </div>
                  ))}
                </div>

                {/* Time Options */}
                <p className="text-[12px] font-bold text-blue-400 mb-2">{t.timeSection}</p>
                <div className="space-y-1">
                  {[
                    { id: 'mod-new' as SortMode, label: t.sortModNew },
                    { id: 'mod-old' as SortMode, label: t.sortModOld },
                    { id: 'create-new' as SortMode, label: t.sortCreateNew },
                    { id: 'create-old' as SortMode, label: t.sortCreateOld },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSortBy(item.id);
                        setSortModalOpen(false);
                        showToast(`ترتيب: ${item.label}`);
                      }}
                      className="flex items-center justify-between p-3 rounded-[12px] hover:bg-neutral-500/10 cursor-pointer transition"
                    >
                      <span className="text-[14px] font-medium">{item.label}</span>
                      {sortBy === item.id && <Check className="w-4 h-4 text-blue-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SETTINGS SUB-MODALS */}
          {/* ============================================================ */}
          {settingsModal && (
            <div className="absolute inset-0 z-[65] flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={() => setSettingsModal(null)}
              />

              <div
                className="relative w-full max-w-sm rounded-[24px] border p-5 shadow-2xl z-10"
                style={{ background: bgCard, borderColor }}
              >
                {/* 1. Default Category Picker */}
                {settingsModal === 'defaultCategory' && (
                  <div>
                    <h3 className="font-extrabold text-[17px] mb-4">{t.defaultFolder}</h3>
                    <div className="space-y-2">
                      {CATEGORIES.filter((c) => c.id !== 'الكل').map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setDefaultCategory(c.id);
                            setSettingsModal(null);
                            showToast(`المجلد الافتراضي: ${c.label}`);
                          }}
                          className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/10 cursor-pointer border"
                          style={{ borderColor }}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-3 h-3 rounded-full" style={{ background: c.dot }} />
                            <span className="font-bold text-[14px]">{c.label}</span>
                          </div>
                          {defaultCategory === c.id && <Check className="w-4 h-4 text-blue-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Language Picker */}
                {settingsModal === 'language' && (
                  <div>
                    <h3 className="font-extrabold text-[17px] mb-4">{t.selectLanguage}</h3>
                    <div className="space-y-2">
                      {LANGUAGES.map((lang) => (
                        <div
                          key={lang.id}
                          onClick={() => {
                            setLanguage(lang.id);
                            setSettingsModal(null);
                            showToast(`تم تعيين اللغة: ${lang.native}`);
                          }}
                          className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/10 cursor-pointer border"
                          style={{ borderColor }}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{lang.flag}</span>
                            <div>
                              <p className="font-bold text-[14px]">{lang.native}</p>
                              <p className="text-[11px]" style={{ color: textSecondary }}>
                                {lang.label}
                              </p>
                            </div>
                          </div>
                          {language === lang.id && <Check className="w-4 h-4 text-blue-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Font Size Picker */}
                {settingsModal === 'fontSize' && (
                  <div>
                    <h3 className="font-extrabold text-[17px] mb-4">{t.fontSizeLabel}</h3>
                    <div className="space-y-2">
                      {FONT_SIZES.map((f) => (
                        <div
                          key={f.id}
                          onClick={() => {
                            setFontSize(f.id);
                            setSettingsModal(null);
                            showToast(`حجم الخط: ${f.label}`);
                          }}
                          className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/10 cursor-pointer border"
                          style={{ borderColor }}
                        >
                          <div>
                            <p className="font-bold text-[14px]">{f.label}</p>
                            <p className="text-[11px]" style={{ color: textSecondary }}>
                              {f.desc}
                            </p>
                          </div>
                          {fontSize === f.id && <Check className="w-4 h-4 text-blue-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Week Start Day */}
                {settingsModal === 'weekStart' && (
                  <div>
                    <h3 className="font-extrabold text-[17px] mb-4">{t.weekStartLabel}</h3>
                    <div className="space-y-2">
                      {WEEK_DAYS.map((day) => (
                        <div
                          key={day.id}
                          onClick={() => {
                            setWeekStartsOn(day.id);
                            setSettingsModal(null);
                            showToast(`بداية الأسبوع: ${day.label}`);
                          }}
                          className="flex items-center justify-between p-3 rounded-[14px] hover:bg-neutral-500/10 cursor-pointer border"
                          style={{ borderColor }}
                        >
                          <span className="font-bold text-[14px]">{day.label}</span>
                          {weekStartsOn === day.id && <Check className="w-4 h-4 text-blue-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Set New PIN */}
                {settingsModal === 'setPin' && (
                  <div>
                    <h3 className="font-extrabold text-[17px] mb-2">{t.setPinTitle}</h3>
                    <p className="text-[12px] mb-4" style={{ color: textSecondary }}>
                      {t.enterPin}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[12px] block mb-1 font-bold">{t.enterNewPin}</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={newPinInput}
                          onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••"
                          className="w-full h-11 rounded-[12px] border px-4 text-center tracking-[0.5em] text-[18px] font-bold outline-none"
                          style={{ background: bgMuted, borderColor, color: textPrimary }}
                        />
                      </div>

                      <div>
                        <label className="text-[12px] block mb-1 font-bold">{t.confirmNewPin}</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={confirmPinInput}
                          onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••"
                          className="w-full h-11 rounded-[12px] border px-4 text-center tracking-[0.5em] text-[18px] font-bold outline-none"
                          style={{ background: bgMuted, borderColor, color: textPrimary }}
                        />
                      </div>

                      {pinModalError && <p className="text-[12px] text-red-500 font-bold">{pinModalError}</p>}

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setSettingsModal(null)}
                          className="flex-1 h-10 rounded-full border text-[13px] font-bold cursor-pointer"
                          style={{ borderColor }}
                        >
                          {t.cancel}
                        </button>
                        <button
                          onClick={handleSaveNewPin}
                          className="flex-1 h-10 rounded-full text-white text-[13px] font-bold shadow-md cursor-pointer"
                          style={{ background: brandBlue }}
                        >
                          {t.save}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Change PIN */}
                {settingsModal === 'changePin' && (
                  <div>
                    <h3 className="font-extrabold text-[17px] mb-2">{t.changePin}</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[12px] block mb-1 font-bold">الرمز الحالي</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={currentPinInput}
                          onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••"
                          className="w-full h-11 rounded-[12px] border px-4 text-center tracking-[0.5em] text-[18px] font-bold outline-none"
                          style={{ background: bgMuted, borderColor, color: textPrimary }}
                        />
                      </div>

                      <div>
                        <label className="text-[12px] block mb-1 font-bold">{t.enterNewPin}</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={newPinInput}
                          onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••"
                          className="w-full h-11 rounded-[12px] border px-4 text-center tracking-[0.5em] text-[18px] font-bold outline-none"
                          style={{ background: bgMuted, borderColor, color: textPrimary }}
                        />
                      </div>

                      <div>
                        <label className="text-[12px] block mb-1 font-bold">{t.confirmNewPin}</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={confirmPinInput}
                          onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••"
                          className="w-full h-11 rounded-[12px] border px-4 text-center tracking-[0.5em] text-[18px] font-bold outline-none"
                          style={{ background: bgMuted, borderColor, color: textPrimary }}
                        />
                      </div>

                      {pinModalError && <p className="text-[12px] text-red-500 font-bold">{pinModalError}</p>}

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setSettingsModal(null)}
                          className="flex-1 h-10 rounded-full border text-[13px] font-bold cursor-pointer"
                          style={{ borderColor }}
                        >
                          {t.cancel}
                        </button>
                        <button
                          onClick={handleChangeExistingPin}
                          className="flex-1 h-10 rounded-full text-white text-[13px] font-bold shadow-md cursor-pointer"
                          style={{ background: brandBlue }}
                        >
                          {t.save}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ADMOB INTERSTITIAL AD MODAL */}
          {/* ============================================================ */}
          {showInterstitial && (
            <AdInterstitialModal
              language={language}
              isDarkMode={isDarkMode}
              onClose={() => setShowInterstitial(false)}
            />
          )}

          {/* ============================================================ */}
          {/* TOAST NOTIFICATION */}
          {/* ============================================================ */}
          {toastMessage && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[80] pointer-events-none animate-slide-up">
              <div className="px-5 py-2.5 rounded-full bg-neutral-900/90 text-white border border-white/10 text-[13px] font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{toastMessage}</span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
