import React from 'react';

const ROWS = [
  ['flights', 'Flights'],
  ['accommodation', 'Accommodation'],
  ['food', 'Food'],
  ['activities', 'Activities'],
  ['transport', 'Local transport']
];

export default function BudgetSummary({ budget }) {
  if (!budget) return null;

  return (
    <div className="bg-white border border-ticketBorder rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-ink mb-1">Cost ledger</h3>
      <p className="text-xs text-inkMuted mb-4">Estimated, in USD</p>

      <div className="space-y-2.5 font-mono text-sm">
        {ROWS.map(([key, label]) => (
          <div key={key} className="flex justify-between text-inkMuted">
            <span>{label}</span>
            <span>${(budget[key] ?? 0).toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t border-dashed border-ticketBorder pt-3 flex justify-between text-ink font-semibold text-base">
          <span>Total</span>
          <span>${(budget.total ?? 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
