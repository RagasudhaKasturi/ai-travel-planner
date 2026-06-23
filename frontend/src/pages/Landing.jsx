import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-sage border border-sage/40 rounded-full px-3 py-1 mb-6">
          AI Travel Planner
        </span>
        <h1 className="font-display text-5xl sm:text-6xl font-semibold text-ink leading-[1.05]">
          Your trip, planned in
          <br />
          the time it takes to <span className="text-accent italic">board</span>.
        </h1>
        <p className="text-inkMuted text-lg mt-6 leading-relaxed">
          Tell the agent where you're headed, how long, and what you're into. It builds the
          itinerary, prices it out, finds hotels, and packs your bag — climate checked.
        </p>
        <div className="mt-9 flex items-center justify-center gap-4">
          <Link
            to={user ? '/dashboard' : '/register'}
            className="bg-accent text-parchment font-medium rounded-full px-7 py-3 hover:bg-accentDark transition-colors"
          >
            {user ? 'Go to dashboard' : 'Start planning it’s free'}
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            mark: '01',
            title: 'Day-by-day itinerary',
            body: 'A structured plan, morning to evening, tuned to your budget and interests.'
          },
          {
            mark: '02',
            title: 'Live budget ledger',
            body: 'Flights, stays, food, and activities broken down — and recalculated as you edit.'
          },
          {
            mark: '03',
            title: 'Weather-aware packing',
            body: 'A checklist built from your actual itinerary and the destination’s climate.'
          }
        ].map((f) => (
          <div
            key={f.mark}
            className="boarding-pass bg-white rounded-2xl p-6"
          >
            <span className="font-mono text-xs text-sage">{f.mark}</span>
            <h3 className="font-display text-lg font-semibold text-ink mt-2">{f.title}</h3>
            <p className="text-sm text-inkMuted mt-2 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
