/**
 * AdMob Management Service for Notein
 * Supports Web fallback/preview and Android Capacitor/Cordova native APK & AAB integration
 */

import { AdMobConfig, NativeAdData } from './types';

export const ADMOB_CONFIG: AdMobConfig = {
  appId: 'ca-app-pub-8040192021722484/4762615273',
  bannerAdUnitId: 'ca-app-pub-8040192021722484/3217685035',
  interstitialAdUnitId: 'ca-app-pub-8040192021722484/5321018477',
  nativeAdUnitId: 'ca-app-pub-8040192021722484/8278440025',
};

// Android Manifest formatted App ID
export const ANDROID_APP_ID = 'ca-app-pub-8040192021722484~4762615273';

// Sample sponsored ad creatives for native ads in feed
export const SAMPLE_NATIVE_ADS: NativeAdData[] = [
  {
    id: 'ad-native-1',
    headline: 'Google Workspace Cloud Tools',
    body: 'احصل على مساحة تخزين سحابية غير محدودة وأدوات إنتاجية متقدمة لفرق العمل.',
    callToAction: 'تثبيت الآن',
    advertiser: 'Google LLC',
    rating: 4.8,
    iconUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=120&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    price: 'مجاني',
  },
  {
    id: 'ad-native-2',
    headline: 'تطبيق تنظيم الوقت والمهام الذكي',
    body: 'ضاعف إنتاجيتك اليومية ونظم أهدافك مع التذكيرات الذكية بدون أي تشتيت.',
    callToAction: 'معرفة المزيد',
    advertiser: 'Productivity Labs',
    rating: 4.9,
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80',
    price: 'مجاني',
  },
];

class AdMobManager {
  private isInitialized = false;
  private actionCounter = 0;
  private readonly ACTIONS_BETWEEN_INTERSTITIALS = 2; // trigger interstitial every 2 note saves

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if running in native Capacitor environment
      const win = window as any;
      if (win?.Capacitor?.isPluginAvailable('AdMob')) {
        await win.Capacitor.Plugins.AdMob.initialize({
          requestTrackingAuthorization: true,
          testingDevices: [],
          initializeForTesting: false,
        });
        console.log('[AdMob Native] Initialized successfully');
      } else {
        console.log('[AdMob Web] Initialized in preview mode with real ad units:', ADMOB_CONFIG);
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('[AdMob] Initialization notice:', e);
      this.isInitialized = true;
    }
  }

  public shouldShowInterstitialOnAction(): boolean {
    this.actionCounter++;
    if (this.actionCounter >= this.ACTIONS_BETWEEN_INTERSTITIALS) {
      this.actionCounter = 0;
      return true;
    }
    return false;
  }

  public getAdConfig(): AdMobConfig {
    return ADMOB_CONFIG;
  }

  public getSampleNativeAd(index = 0): NativeAdData {
    return SAMPLE_NATIVE_ADS[index % SAMPLE_NATIVE_ADS.length];
  }
}

export const admobService = new AdMobManager();
