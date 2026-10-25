import { Capacitor } from '@capacitor/core';

let AdMob: any = null;
let isInitialized = false;

// معرفاتك الحقيقية - إعلاناتك
const BANNER_ID = 'ca-app-pub-8040192021722484/3217685035';
const INTER_ID = 'ca-app-pub-8040192021722484/5321018477';
const NATIVE_ID = 'ca-app-pub-8040192021722484/8278440025';

// هذا اللي كان ناقص ويسبب الخطأ الأحمر - لازم يبقى
export const SAMPLE_NATIVE_ADS = [
  {
    id: 'native-1',
    title: 'Notes Pro - Premium',
    description: 'احصل على ميزات إضافية',
    adId: NATIVE_ID
  }
];

async function getAdMob() {
  if (AdMob) return AdMob;
  try {
    const mod = await import('@capacitor-community/admob');
    AdMob = mod.AdMob;
    return AdMob;
  } catch {
    return null;
  }
}

async function init() {
  if (isInitialized) return;
  if (!Capacitor.isNativePlatform()) return;
  try {
    const admob = await getAdMob();
    if (!admob) return;
    await admob.initialize({
      requestTrackingAuthorization: false,
      initializeForTesting: false
    });
    isInitialized = true;

    // يظهر البانر تلقائيا في الأسفل - لا تحتاج تضع كود
    setTimeout(async () => {
      try {
        await admob.showBanner({
          adId: BANNER_ID,
          adSize: 'BANNER',
          position: 'BOTTOM_CENTER'
        });
      } catch {}
    }, 2000);
  } catch {}
}

// يفعل نفسه تلقائيا
init();

export const admobService = {
  initialize: init,
  async showBanner() {
    try {
      const admob = await getAdMob();
      if (!admob) return;
      await admob.showBanner({
        adId: BANNER_ID,
        adSize: 'BANNER',
        position: 'BOTTOM_CENTER'
      });
    } catch {}
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
      if (!admob) return;
      await admob.prepareInterstitial({ adId: INTER_ID });
      await admob.showInterstitial();
    } catch {}
  },
  async showNative() {
    try {
      const admob = await getAdMob();
      if (!admob) return;
      await admob.showBanner({
        adId: NATIVE_ID,
        adSize: 'MEDIUM_RECTANGLE',
        position: 'CENTER'
      });
    } catch {}
  }
};
