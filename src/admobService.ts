// هذا الملف يمنع الخروج 100% - بدون إعلانات للاختبار
// إذا اشتغل التطبيق بهذا الملف، معناها المشكل كان من الإعلانات

export const SAMPLE_NATIVE_ADS = [
  { id: 'native-1', title: 'Test', description: 'Test', adId: 'test' }
];

export const admobService = {
  async initialize() {
    console.log('AdMob disabled for crash test');
    return;
  },
  async showBanner() { return; },
  async hideBanner() { return; },
  async showInterstitial() { return; },
  async showNative() { return; }
};
