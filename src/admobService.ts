import { Capacitor } from '@capacitor/core';

let AdMob: any = null;
let isInitialized = false;

// معرفاتك الحقيقية
const BANNER_ID = 'ca-app-pub-8040192021722484/3217685035';
const INTER_ID = 'ca-app-pub-8040192021722484/5321018477';

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
    console.log('AdMob OK');

    // يظهر البانر تلقائيا بعد ثانيتين - لا تحتاج تفعل شيء
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

// يفعل نفسه تلقائيا عند استيراده - لا تحتاج تضع كود في مكان آخر
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
  async showInterstitial() {
    try {
      const admob = await getAdMob();
      if (!admob) return;
      await admob.prepareInterstitial({ adId: INTER_ID });
      await admob.showInterstitial();
    } catch {}
  }
};
