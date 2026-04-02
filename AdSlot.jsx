'use client';
import { useEffect } from 'react';

// Ad slot configurations
export const AD_SLOTS = {
  LEADERBOARD: { slot: '1234567890', format: 'horizontal', width: 728, height: 90 },
  RECTANGLE: { slot: '0987654321', format: 'rectangle', width: 300, height: 250 },
  IN_FEED: { slot: '1357924680', format: 'fluid', layout: 'in-article' },
};

export default function AdSlot({ type = 'RECTANGLE', className = '' }) {
  const config = AD_SLOTS[type];

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense not loaded yet — fine
    }
  }, []);

  // Don't show ads in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 ${className}`}
        style={{ minHeight: 90 }}
      >
        📢 Ad Slot ({type}) — Google AdSense loads here in production
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={config.slot}
        data-ad-format={config.format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
