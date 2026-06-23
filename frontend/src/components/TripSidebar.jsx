import React from 'react';

export default function TripSidebar({ trips, selectedTripId, onSelect, onNewTrip, onDelete }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onNewTrip}
        className="w-full bg-ink text-parchment font-medium rounded-full py-2.5 hover:bg-ink/90 transition-colors text-sm"
      >
        + Plan a new trip
      </button>

      {trips.length === 0 ? (
        <p className="text-sm text-inkMuted px-1">
          No trips yet — your first itinerary will show up here.
        </p>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => {
            const active = trip._id === selectedTripId;
            return (
              <div
                key={trip._id}
                className={`boarding-pass rounded-2xl px-4 py-3.5 cursor-pointer transition-colors ${
                  active ? 'bg-surfaceAlt' : 'bg-white hover:bg-surfaceAlt/60'
                }`}
                onClick={() => onSelect(trip)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-ink truncate">
                      {trip.destination}
                    </p>
                    <p className="text-xs text-inkMuted font-mono mt-0.5">
                      {trip.durationDays} days · {trip.budgetTier}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(trip._id);
                    }}
                    aria-label={`Delete trip to ${trip.destination}`}
                    className="text-inkMuted hover:text-danger transition-colors text-sm flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
