import React, { useState } from 'react';

const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening'];
// Slight alternating rotation gives the stamp badges a hand-stamped feel
const ROTATIONS = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3', 'rotate-1'];

export default function ItineraryDay({ day, onAddActivity, onRemoveActivity, onRegenerateDay, busy }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRegenForm, setShowRegenForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    estimatedCostUSD: 0,
    timeOfDay: 'Afternoon'
  });
  const [feedback, setFeedback] = useState('');

  const rotation = ROTATIONS[(day.dayNumber - 1) % ROTATIONS.length];

  function submitActivity(e) {
    e.preventDefault();
    if (!newActivity.title.trim()) return;
    onAddActivity(day.dayNumber, newActivity);
    setNewActivity({ title: '', description: '', estimatedCostUSD: 0, timeOfDay: 'Afternoon' });
    setShowAddForm(false);
  }

  function submitRegenerate(e) {
    e.preventDefault();
    if (!feedback.trim()) return;
    onRegenerateDay(day.dayNumber, feedback);
    setFeedback('');
    setShowRegenForm(false);
  }

  return (
    <div className="relative pl-16">
      <div
        className={`stamp-badge ${rotation} absolute left-0 top-0 w-12 h-12 text-ink`}
        aria-hidden="true"
      >
        <span className="text-sm">D{day.dayNumber}</span>
      </div>

      <div className="bg-white border border-ticketBorder rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-mono text-xs text-sage uppercase tracking-wide">
              Day {day.dayNumber}
            </p>
            <h4 className="font-display text-lg font-semibold text-ink">
              {day.theme || 'Untitled day'}
            </h4>
          </div>
          <button
            onClick={() => setShowRegenForm((v) => !v)}
            disabled={busy}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-accent text-accent hover:bg-accent hover:text-parchment transition-colors whitespace-nowrap disabled:opacity-50"
          >
            ↻ Regenerate day
          </button>
        </div>

        {showRegenForm && (
          <form
            onSubmit={submitRegenerate}
            className="mb-4 bg-surfaceAlt rounded-xl p-3.5 space-y-2"
          >
            <label className="block text-xs font-mono uppercase tracking-wide text-inkMuted">
              What should change?
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder='e.g. "More outdoor activities, less shopping"'
              rows={2}
              className="w-full rounded-lg border border-ticketBorder px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent text-parchment hover:bg-accentDark transition-colors disabled:opacity-50"
              >
                {busy ? 'Regenerating…' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => setShowRegenForm(false)}
                className="text-xs font-medium px-3 py-1.5 rounded-full text-inkMuted hover:bg-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {day.activities.map((act) => (
            <div
              key={act._id}
              className="flex items-start justify-between gap-3 border border-ticketBorder rounded-xl px-3.5 py-2.5"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-surfaceAlt text-inkMuted px-2 py-0.5 rounded-full">
                    {act.timeOfDay}
                  </span>
                  <p className="font-medium text-ink text-sm truncate">{act.title}</p>
                </div>
                {act.description && (
                  <p className="text-xs text-inkMuted mt-1">{act.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-mono text-xs text-ink">${act.estimatedCostUSD}</span>
                <button
                  onClick={() => onRemoveActivity(act._id)}
                  disabled={busy}
                  aria-label={`Remove ${act.title}`}
                  className="text-inkMuted hover:text-danger transition-colors disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddForm ? (
          <form onSubmit={submitActivity} className="mt-3 bg-surfaceAlt rounded-xl p-3.5 space-y-2.5">
            <input
              type="text"
              required
              placeholder="Activity name"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              className="w-full rounded-lg border border-ticketBorder px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <input
              type="text"
              placeholder="Short description (optional)"
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              className="w-full rounded-lg border border-ticketBorder px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <div className="flex gap-2">
              <select
                value={newActivity.timeOfDay}
                onChange={(e) => setNewActivity({ ...newActivity, timeOfDay: e.target.value })}
                className="rounded-lg border border-ticketBorder px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                placeholder="Cost USD"
                value={newActivity.estimatedCostUSD}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, estimatedCostUSD: Number(e.target.value) })
                }
                className="w-28 rounded-lg border border-ticketBorder px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-ink text-parchment hover:bg-ink/90 transition-colors"
              >
                Add activity
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs font-medium px-3 py-1.5 rounded-full text-inkMuted hover:bg-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-3 text-xs font-medium text-sage hover:underline"
          >
            + Add an activity
          </button>
        )}
      </div>
    </div>
  );
}
