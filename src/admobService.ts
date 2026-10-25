import { AdMobConfig } from './types';

export const ADMOB_CONFIG: AdMobConfig = {
  appId: 'ca-app-pub-8040192021722484~9875214847',
  bannerAdUnitId: 'ca-app-pub-8040192021722484/3217685035',
  interstitialAdUnitId: 'ca-app-pub-8040192021722484/5321018477',
  nativeAdUnitId: 'ca-app-pub-8040192021722484/8278440025'
} as any;

export const ANDROID_APP_ID = 'ca-app-pub-8040192021722484~9875214847';

// بيانات وهمية للعرض فقط في الويب
export const SAMPLE_NATIVE_ADS: any[] = [];

class AdMobManager {
  private isInitialized = false;
  private actionCount = 0;
  private readonly SHOW_AFTER_ACTIONS = 2;

  async initialize() {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && (window as any).Capacitor?.isPluginAvailable?.('AdMob')) {
        const { AdMob } = await import('@capacitor-community/admob');
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          testingDevices: [],
          initializeForTesting: false
        });
        console.log('[AdMob Native] Initialized with REAL IDs:', ADMOB_CONFIG);
        this.loadInterstitial();
        this.showBanner();
      } else {
        console.log('[AdMob Web] Using REAL ad units:', ADMOB_CONFIG);
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('[AdMob] Init error', e);
      this.isInitialized = true;
    }
  }

  private async showBanner() {
    try {
      const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
      await AdMob.showBanner({
        adId: ADMOB_CONFIG.bannerAdUnitId,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false
      });
    } catch {}
  }

  private async loadInterstitial() {
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.prepareInterstitial({
        adId: ADMOB_CONFIG.interstitialAdUnitId,
        isTesting: false
      });
    } catch {}
  }

  async showInterstitial() {
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.showInterstitial();
      setTimeout(() => this.loadInterstitial(), 1000);
    } catch {}
  }

  shouldShowInterstitialOnAction(): boolean {
    this.actionCount++;
    if (this.actionCount % this.SHOW_AFTER_ACTIONS === 0) {
      this.actionCount = 0;
      return true;
    }
    return false;
  }

  getAdConfig() { return ADMOB_CONFIG; }
  getSampleNativeAd() { return null; }
}

export const admobService = new AdMobManager();
export default admobService;
