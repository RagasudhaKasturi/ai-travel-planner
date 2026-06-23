import React, { useState } from 'react';

const INTEREST_OPTIONS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'Nightlife', 'History', 'Relaxation'];

export default function CreateTripForm({ onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    destination: '',
    durationDays: 5,
    budgetTier: 'Medium',
    interests: []
  });

  function toggleInterest(interest) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest]
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.destination.trim()) return;
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-ticketBorder rounded-2xl p-6 space-y-5"
    >
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">Plan a new trip</h3>
        <p className="text-xs text-inkMuted mt-1">The agent builds the full itinerary in one go.</p>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-inkMuted mb-1.5">
          Destination
        </label>
        <input
          type="text"
          required
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
          placeholder="Tokyo, Japan"
          className="w-full rounded-lg border border-ticketBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-inkMuted mb-1.5">
            Days
          </label>
          <input
            type="number"
            min={1}
            max={30}
            required
            value={form.durationDays}
            onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
            className="w-full rounded-lg border border-ticketBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-inkMuted mb-1.5">
            Budget
          </label>
          <select
            value={form.budgetTier}
            onChange={(e) => setForm({ ...form, budgetTier: e.target.value })}
            className="w-full rounded-lg border border-ticketBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-inkMuted mb-2">
          Interests
        </label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const active = form.interests.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? 'bg-sage text-white border-sage'
                    : 'border-ticketBorder text-inkMuted hover:border-sage'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-accent text-parchment font-medium rounded-full py-2.5 hover:bg-accentDark transition-colors disabled:opacity-60"
        >
          {submitting ? 'Generating itinerary…' : 'Generate itinerary'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-5 rounded-full text-inkMuted hover:bg-surfaceAlt transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
