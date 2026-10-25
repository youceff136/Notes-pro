
import { Capacitor } from '@capacitor/core';

let AdMob: any = null;
let isInitialized = false;

// معرفاتك الحقيقية
const AD_IDS = {
  BANNER: 'ca-app-pub-8040192021722484/3217685035',
  INTERSTITIAL: 'ca-app-pub-8040192021722484/5321018477',
  NATIVE: 'ca-app-pub-8040192021722484/8278440025'
};

async function getAdMob() {
  if (AdMob) return AdMob;
  try {
    const mod = await import('@capacitor-community/admob');
    AdMob = mod.AdMob;
    return AdMob;
  } catch (e) {
    console.log('AdMob not available', e);
    return null;
  }
}

export const admobService = {
  async initialize() {
    if (isInitialized) return;
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: web platform, skip');
      return;
    }
    try {
      const admob = await getAdMob();
      if (!admob) return;
      
      await admob.initialize({
        requestTrackingAuthorization: false,
        testingDevices: [],
        initializeForTesting: false // false = إعلانات حقيقية
      });
      isInitialized = true;
      console.log('AdMob initialized with REAL IDs');
    } catch (e) {
      console.log('AdMob init failed, continue without ads', e);
    }
  },

  async showBanner() {
    try {
      const admob = await getAdMob();
      if (!admob || !isInitialized) return;
      if (!Capacitor.isNativePlatform()) return;
      
      await admob.showBanner({
        adId: AD_IDS.BANNER,
        adSize: 'BANNER',
        position: 'BOTTOM_CENTER',
        margin: 0
      });
      console.log('Banner shown: ', AD_IDS.BANNER);
    } catch (e) {
      console.log('Banner failed', e);
    }
  },

  async hideBanner() {
    try {
      const admob = await getAdMob();
      if (admob) await admob.hideBanner();
    } catch {}
  },

  async showInterstitial() {
    try {
      const admob = await getAdMob();
      if (!admob || !isInitialized) return;
      if (!Capacitor.isNativePlatform()) return;
      
      await admob.prepareInterstitial({
        adId: AD_IDS.INTERSTITIAL
      });
      await admob.showInterstitial();
      console.log('Interstitial shown: ', AD_IDS.INTERSTITIAL);
    } catch (e) {
      console.log('Interstitial failed', e);
    }
  },

  async showNative() {
    try {
      const admob = await getAdMob();
      if (!admob || !isInitialized) return;
      if (!Capacitor.isNativePlatform()) return;
      // Native / MREC
      await admob.showBanner({
        adId: AD_IDS.NATIVE,
        adSize: 'MEDIUM_RECTANGLE',
        position: 'CENTER',
        margin: 100
      });
    } catch (e) {
      console.log('Native failed', e);
    }
  }
};
