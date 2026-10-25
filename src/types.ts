export type Screen = 'welcome' | 'language' | 'rating' | 'features' | 'main' | 'settings';

export type LanguageCode = 'ar' | 'en' | 'ru' | 'es';

export type FontSize = 'small' | 'medium' | 'large';

export type SortMode = 'title-az' | 'title-za' | 'mod-new' | 'mod-old' | 'create-new' | 'create-old';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
}

export interface CategoryInfo {
  id: string;
  label: string;
  chipBg: string;
  chipText: string;
  dot: string;
  cardAccent: string;
}

export interface LanguageOption {
  id: LanguageCode;
  label: string;
  native: string;
  flag: string;
  sub: string;
  dir: 'rtl' | 'ltr';
}

export interface FontSizeOption {
  id: FontSize;
  label: string;
  desc: string;
}

export interface AppSettings {
  isDarkMode: boolean;
  defaultCategory: string;
  language: LanguageCode;
  fontSize: FontSize;
  weekStart: string;
  showTipBanner: boolean;
  isPinEnabled: boolean;
  pinCode: string | null;
  showAds: boolean;
}

export interface AdMobConfig {
  appId: string;
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  nativeAdUnitId: string;
}

export interface NativeAdData {
  id: string;
  headline: string;
  body: string;
  callToAction: string;
  advertiser: string;
  rating: number;
  iconUrl: string;
  coverUrl?: string;
  price?: string;
}
