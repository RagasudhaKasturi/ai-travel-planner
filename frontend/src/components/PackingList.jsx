import React from 'react';

const CATEGORY_ORDER = ['Documents', 'Clothing', 'Gear', 'Other'];

export default function PackingList({ items = [], onToggle, toggling }) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((i) => i.category === category)
  })).filter((g) => g.items.length > 0);

  return (
    <div className="bg-white border border-ticketBorder rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🧳</span>
        <h3 className="font-display text-lg font-semibold text-ink">Weather-aware packing list</h3>
      </div>
      <p className="text-xs text-inkMuted mb-5">
        Generated from this itinerary's activities and the destination's climate.
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-inkMuted">No packing list yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {grouped.map((group) => (
            <div key={group.category}>
              <p className="font-mono text-xs uppercase tracking-wide text-sage mb-2">
                {group.category}
              </p>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item._id}>
                    <button
                      type="button"
                      disabled={toggling === item._id}
                      onClick={() => onToggle(item._id)}
                      className="flex items-center gap-2.5 w-full text-left group"
                    >
                      <span
                        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                          item.isPacked
                            ? 'bg-sage border-sage text-white'
                            : 'border-ticketBorder group-hover:border-sage'
                        }`}
                      >
                        {item.isPacked && (
                          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none">
                            <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-sm ${
                          item.isPacked ? 'line-through text-inkMuted' : 'text-ink'
                        }`}
                      >
                        {item.item}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
