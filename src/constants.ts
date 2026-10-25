import { CategoryInfo, FontSizeOption, LanguageOption, Note } from './types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'الكل',
    label: 'الكل',
    chipBg: '#2196F3',
    chipText: '#ffffff',
    dot: '#2196F3',
    cardAccent: '#2196F3',
  },
  {
    id: 'شخصي',
    label: 'شخصي',
    chipBg: '#3D2E1F',
    chipText: '#FFCC80',
    dot: '#FFA726',
    cardAccent: '#FFA726',
  },
  {
    id: 'العمل',
    label: 'العمل',
    chipBg: '#1C3326',
    chipText: '#A5D6A7',
    dot: '#66BB6A',
    cardAccent: '#66BB6A',
  },
  {
    id: 'أخرى',
    label: 'أخرى',
    chipBg: '#1E2B4D',
    chipText: '#90CAF9',
    dot: '#5C6BC0',
    cardAccent: '#5C6BC0',
  },
];

export const LANGUAGES: LanguageOption[] = [
  {
    id: 'ar',
    label: 'العربية',
    native: 'العربية',
    flag: '🇸🇦',
    sub: 'الافتراضي',
    dir: 'rtl',
  },
  {
    id: 'en',
    label: 'English',
    native: 'English',
    flag: '🇺🇸',
    sub: 'English',
    dir: 'ltr',
  },
  {
    id: 'ru',
    label: 'Русский',
    native: 'Русский',
    flag: '🇷🇺',
    sub: 'Russian',
    dir: 'ltr',
  },
  {
    id: 'es',
    label: 'Español',
    native: 'Español',
    flag: '🇪🇸',
    sub: 'Spanish',
    dir: 'ltr',
  },
];

export const FONT_SIZES: FontSizeOption[] = [
  { id: 'small', label: 'صغير', desc: '14sp - مدمج وسريع' },
  { id: 'medium', label: 'متوسط', desc: '16sp - متوازن ومريح' },
  { id: 'large', label: 'كبير', desc: '18sp - واضح وسهل القراءة' },
];

export const WEEK_DAYS = [
  { id: 'السبت', label: 'السبت' },
  { id: 'الأحد', label: 'الأحد' },
  { id: 'الاثنين', label: 'الاثنين' },
  { id: 'الثلاثاء', label: 'الثلاثاء' },
  { id: 'الأربعاء', label: 'الأربعاء' },
];

export const INITIAL_SAMPLE_NOTES = [];


];
