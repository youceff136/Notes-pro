import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, PackageCheck, Terminal, ShieldAlert } from 'lucide-react';
import { ADMOB_CONFIG, ANDROID_APP_ID } from '../admobService';

interface ApkExportModalProps {
  onClose: () => void;
  isDarkMode: boolean;
  onToast: (msg: string) => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({
  onClose,
  isDarkMode,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'manifest' | 'commands'>('quick');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(label);
      onToast(`تم نسخ ${label}`);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  const manifestSnippet = `<!-- ضع هذا داخل <application> في ملف AndroidManifest.xml -->
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="${ANDROID_APP_ID}"/>

<!-- أذونات الإنترنت والشبكة -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="com.google.android.gms.permission.AD_ID" />`;

  const buildCommands = `# 1. تثبيت حزم كاباسيتور و AdMob
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor-community/admob

# 2. بناء ملفات الويب
npm run build

# 3. إنشاء مجلد أندرويد ومزامنته
npx cap add android
npx cap sync

# 4. فتح المشروع في Android Studio
npx cap open android

# 5. أمر استخراج ملف APK الجاهز مباشرة عبر Terminal
cd android && ./gradlew assembleRelease

# 6. أمر استخراج ملف AAB لرفعه على متجر Google Play
cd android && ./gradlew bundleRelease`;

  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 animate-fade">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-lg rounded-[26px] border p-5 shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden"
        style={{
          background: isDarkMode ? '#131A22' : '#FFFFFF',
          borderColor: isDarkMode ? '#2D3A4B' : '#E2E8F0',
          color: isDarkMode ? '#F8FAFC' : '#0F172A',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: isDarkMode ? '#233041' : '#E2E8F0' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[16px] leading-tight">تصدير تطبيق أندرويد (APK & AAB)</h3>
              <p className="text-[11px] text-neutral-400">مدمج مع إعلانات AdMob الخاصة بك 100%</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-500/15 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 p-1 rounded-xl mb-3" style={{ background: isDarkMode ? '#1C2633' : '#F1F5F9' }}>
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition cursor-pointer ${
              activeTab === 'quick' ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            ملخص الحزم والـ IDs
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition cursor-pointer ${
              activeTab === 'commands' ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            أوامر البناء (Terminal)
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition cursor-pointer ${
              activeTab === 'manifest' ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            AndroidManifest
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3 text-start text-[13px] pr-1">
          {activeTab === 'quick' && (
            <div className="space-y-3">
              <div
                className="p-3.5 rounded-[16px] border space-y-2"
                style={{ background: isDarkMode ? '#18212D' : '#F8FAFC', borderColor: isDarkMode ? '#273546' : '#E2E8F0' }}
              >
                <div className="text-[11px] font-bold text-amber-500 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>معرفات AdMob المربوطة في الكود:</span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 rounded bg-black/40 flex justify-between items-center">
                    <span className="text-neutral-400">App ID:</span>
                    <span className="text-emerald-400 font-bold">{ANDROID_APP_ID}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 flex justify-between items-center">
                    <span className="text-neutral-400">بانر (Banner):</span>
                    <span className="text-blue-400 font-bold">{ADMOB_CONFIG.bannerAdUnitId}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 flex justify-between items-center">
                    <span className="text-neutral-400">بيني (Interstitial):</span>
                    <span className="text-purple-400 font-bold">{ADMOB_CONFIG.interstitialAdUnitId}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 flex justify-between items-center">
                    <span className="text-neutral-400">مدمج (Native):</span>
                    <span className="text-amber-400 font-bold">{ADMOB_CONFIG.nativeAdUnitId}</span>
                  </div>
                </div>
              </div>

              <div
                className="p-3.5 rounded-[16px] border"
                style={{ background: isDarkMode ? '#18212D' : '#F8FAFC', borderColor: isDarkMode ? '#273546' : '#E2E8F0' }}
              >
                <h4 className="font-bold text-[13px] mb-1.5 flex items-center gap-1 text-blue-400">
                  <Smartphone className="w-4 h-4" />
                  <span>خطوات استخراج ملفات APK و AAB:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[12px] text-neutral-300">
                  <li>تم تجهيز ملف <b>capacitor.config.ts</b> و <b>capacitor.config.json</b> داخل المشروع تلقائياً.</li>
                  <li>عند تشغيل أوامر البناء، يتم إنشاء مجلد أندرويد جاهز مع جميع الحزم.</li>
                  <li>
                    لإنشاء ملف <b>APK</b> للتثبيت والتجربة الفورية: نفذ <code className="text-amber-400">./gradlew assembleRelease</code>.
                  </li>
                  <li>
                    لإنشاء ملف <b>AAB (App Bundle)</b> لنشره على متجر Google Play: نفذ <code className="text-amber-400">./gradlew bundleRelease</code>.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'commands' && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[12px] font-bold text-neutral-400 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  أوامر Terminal للبناء الفوري:
                </span>
                <button
                  onClick={() => copyToClipboard(buildCommands, 'أوامر البناء')}
                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition active:scale-95"
                >
                  {copiedSection === 'أوامر البناء' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  نسخ الكل
                </button>
              </div>
              <pre
                className="p-3 rounded-[14px] bg-black/60 border border-neutral-700/50 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed"
                dir="ltr"
              >
                {buildCommands}
              </pre>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[12px] font-bold text-neutral-400">
                  كود تهيئة AndroidManifest.xml:
                </span>
                <button
                  onClick={() => copyToClipboard(manifestSnippet, 'كود Manifest')}
                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition active:scale-95"
                >
                  {copiedSection === 'كود Manifest' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  نسخ الكود
                </button>
              </div>
              <pre
                className="p-3 rounded-[14px] bg-black/60 border border-neutral-700/50 font-mono text-[11px] text-amber-300 overflow-x-auto whitespace-pre-wrap leading-relaxed"
                dir="ltr"
              >
                {manifestSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t mt-3 flex gap-2" style={{ borderColor: isDarkMode ? '#233041' : '#E2E8F0' }}>
          <button
            onClick={() => copyToClipboard(buildCommands, 'أوامر البناء')}
            className="flex-1 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 shadow-md"
          >
            <Copy className="w-4 h-4" />
            <span>نسخ أوامر بناء APK و AAB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
