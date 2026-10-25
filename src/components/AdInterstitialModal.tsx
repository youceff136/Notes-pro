import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Star } from 'lucide-react';
import { translations } from '../translations';
import { LanguageCode } from '../types';

interface AdInterstitialModalProps {
  language: LanguageCode;
  isDarkMode: boolean;
  onClose: () => void;
}

export const AdInterstitialModal: React.FC<AdInterstitialModalProps> = ({
  language,
  isDarkMode,
  onClose,
}) => {
  const t = translations[language] || translations.ar;
  const isRtl = language === 'ar';
  const [countdown, setCountdown] = useState<number>(4);
  const [canSkip, setCanSkip] = useState<boolean>(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanSkip(true);
    }
  }, [countdown]);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="absolute inset-0 z-[90] flex flex-col justify-between p-6 animate-fade"
      style={{
        background: isDarkMode ? '#0B0F17' : '#FFFFFF',
        color: isDarkMode ? '#F8FAFC' : '#0F172A',
      }}
    >
      {/* Top Bar with Countdown and Close Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-neutral-900">
            {t.adSponsored}
          </span>
        </div>

        {canSkip ? (
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 text-[12px] font-bold shadow-md cursor-pointer transition active:scale-95"
          >
            <span>{t.adSkip}</span>
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/60 text-white text-[12px] font-mono">
            <span>{t.adSkipIn}</span>
            <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[11px]">
              {countdown}
            </span>
          </div>
        )}
      </div>

      {/* Main Interstitial Ad Body */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 text-center max-w-sm mx-auto">
        {/* Cover / Creative Image */}
        <div className="relative w-full h-[200px] rounded-[22px] overflow-hidden shadow-2xl mb-6 border border-white/10 group">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80"
            alt="Ad Banner"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-start">
            <span className="text-[10px] uppercase font-bold text-blue-400">Google Cloud App Suite</span>
            <h3 className="text-white font-extrabold text-[18px] leading-tight mt-0.5">
              حلول التخزين السحابي الآمن للمؤسسات
            </h3>
          </div>
        </div>

        {/* Advertiser info */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-[15px]">Google Workspace</span>
          <div className="flex items-center text-amber-400 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold ml-1">4.9 (1.2M تقييم)</span>
          </div>
        </div>

        <p className="text-[13px] leading-relaxed opacity-75 max-w-xs mb-6">
          وفر وقتك ونظم مستنداتك وسجلاتك في سحابة آمنة مع ذكاء اصطناعي مدمج وسرعة فائقة.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => {
            window.open('https://admob.google.com', '_blank', 'noopener');
            onClose();
          }}
          className="w-full h-[52px] rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[16px] shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <span>تثبيت الآن مجاناً</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Footer disclaimer */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>إعلان معتمد وآمن</span>
      </div>
    </div>
  );
};
