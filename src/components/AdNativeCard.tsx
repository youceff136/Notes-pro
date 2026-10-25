import React from 'react';
import { Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { SAMPLE_NATIVE_ADS } from '../admobService';
import { translations } from '../translations';
import { LanguageCode } from '../types';

interface AdNativeCardProps {
  language: LanguageCode;
  isDarkMode: boolean;
  adIndex?: number;
}

export const AdNativeCard: React.FC<AdNativeCardProps> = ({
  language,
  isDarkMode,
  adIndex = 0,
}) => {
  const t = translations[language] || translations.ar;
  const isRtl = language === 'ar';
  const ad = SAMPLE_NATIVE_ADS[adIndex % SAMPLE_NATIVE_ADS.length];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="rounded-[18px] border p-4 transition-all duration-200 shadow-sm relative overflow-hidden"
      style={{
        background: isDarkMode ? '#18202A' : '#F8FAFC',
        borderColor: isDarkMode ? '#2D3A4B' : '#E2E8F0',
        borderRight: isRtl ? '4px solid #F59E0B' : undefined,
        borderLeft: !isRtl ? '4px solid #F59E0B' : undefined,
      }}
    >
      {/* Native Ad Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
            {t.adSponsored}
          </span>
          <span className="text-[11px] font-medium opacity-70">
            {ad.advertiser}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span className="font-bold">{ad.rating}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-3 items-start mb-3">
        <img
          src={ad.iconUrl}
          alt={ad.headline}
          className="w-12 h-12 rounded-[12px] object-cover shadow-sm shrink-0 border border-neutral-500/20"
        />
        <div className="flex-1 min-w-0 text-start">
          <h4
            className="font-bold text-[14px] leading-tight line-clamp-1 mb-1"
            style={{ color: isDarkMode ? '#F8FAFC' : '#0F172A' }}
          >
            {ad.headline}
          </h4>
          <p
            className="text-[12px] leading-relaxed line-clamp-2"
            style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}
          >
            {ad.body}
          </p>
        </div>
      </div>

      {/* Action footer */}
      <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: isDarkMode ? '#233041' : '#E2E8F0' }}>
        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>إعلان موثق</span>
        </div>

        <button
          onClick={() => window.open('https://admob.google.com', '_blank', 'noopener')}
          className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-900 font-extrabold text-[12px] flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
        >
          <span>{ad.callToAction}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
