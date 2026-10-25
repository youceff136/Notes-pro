import React from 'react';
import { translations } from '../translations';
import { LanguageCode } from '../types';

interface AdBannerProps {
  language: LanguageCode;
  isDarkMode: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ language, isDarkMode }) => {
  const t = translations[language] || translations.ar;
  const isRtl = language === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full shrink-0 px-3 py-1.5 transition-all"
    >
      <div
        className="w-full max-w-md mx-auto rounded-[12px] border px-3 py-2 flex items-center justify-between shadow-sm relative overflow-hidden"
        style={{
          background: isDarkMode ? '#1A222D' : '#F0F6FF',
          borderColor: isDarkMode ? '#2D3A4B' : '#BFDBFE',
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-[8px] bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
            <span className="text-[11px] font-black text-blue-500">Ad</span>
          </div>

          <div className="min-w-0 flex-1 text-start">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                {t.adSponsored}
              </span>
              <p className="text-[11px] font-bold truncate" style={{ color: isDarkMode ? '#E2E8F0' : '#1E293B' }}>
                Google Cloud Platform
              </p>
            </div>
            <p className="text-[10px] truncate opacity-75 leading-tight" style={{ color: isDarkMode ? '#94A3B8' : '#475569' }}>
              بنية تحتية سريعة وسحابية لمطورين التطبيقات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 rtl:mr-2 ltr:ml-2">
          <button
            onClick={() => window.open('https://admob.google.com', '_blank', 'noopener')}
            className="px-3 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-sm cursor-pointer transition active:scale-95"
          >
            تثبيت
          </button>
        </div>
      </div>
    </div>
  );
};
