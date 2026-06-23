import React from 'react';

export default function HotelList({ hotels = [] }) {
  if (!hotels.length) return null;

  return (
    <div className="bg-white border border-ticketBorder rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-ink mb-4">Recommended stays</h3>
      <div className="space-y-3">
        {hotels.map((hotel, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border border-ticketBorder rounded-xl px-4 py-3"
          >
            <div>
              <p className="font-medium text-ink text-sm">{hotel.name}</p>
              <p className="text-xs text-inkMuted mt-0.5">{hotel.tier}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm text-ink">${hotel.estimatedCostNightUSD}/night</p>
              <p className="text-xs text-sage font-mono mt-0.5">{hotel.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
