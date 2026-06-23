import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import TripSidebar from '../components/TripSidebar.jsx';
import CreateTripForm from '../components/CreateTripForm.jsx';
import ItineraryDay from '../components/ItineraryDay.jsx';
import BudgetSummary from '../components/BudgetSummary.jsx';
import HotelList from '../components/HotelList.jsx';
import PackingList from '../components/PackingList.jsx';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [dayBusy, setDayBusy] = useState(false);
  const [togglingItem, setTogglingItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    setLoading(true);
    setError('');
    try {
      const data = await api.getTrips();
      setTrips(data);
      if (data.length > 0) setSelectedTrip(data[0]);
      else setShowCreateForm(true);
    } catch (err) {
      setError(err.message || 'Could not load your trips.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTrip(form) {
    setCreating(true);
    setError('');
    try {
      const trip = await api.generateTrip(form);
      setTrips((prev) => [trip, ...prev]);
      setSelectedTrip(trip);
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message || 'The AI agent could not generate this trip. Please try again.');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteTrip(id) {
    const prevTrips = trips;
    setTrips((prev) => prev.filter((t) => t._id !== id));
    if (selectedTrip?._id === id) setSelectedTrip(null);
    try {
      await api.deleteTrip(id);
    } catch (err) {
      setError(err.message || 'Could not delete trip.');
      setTrips(prevTrips); // revert on failure
    }
  }

  async function handleAddActivity(dayNumber, activity) {
    if (!selectedTrip) return;
    setDayBusy(true);
    try {
      const updated = await api.addActivity(selectedTrip._id, { dayNumber, ...activity });
      applyTripUpdate(updated);
    } catch (err) {
      setError(err.message || 'Could not add activity.');
    } finally {
      setDayBusy(false);
    }
  }

  async function handleRemoveActivity(activityId) {
    if (!selectedTrip) return;
    setDayBusy(true);
    try {
      const updated = await api.removeActivity(selectedTrip._id, activityId);
      applyTripUpdate(updated);
    } catch (err) {
      setError(err.message || 'Could not remove activity.');
    } finally {
      setDayBusy(false);
    }
  }

  async function handleRegenerateDay(dayNumber, feedback) {
    if (!selectedTrip) return;
    setDayBusy(true);
    setError('');
    try {
      const updated = await api.regenerateDay(selectedTrip._id, { dayNumber, feedback });
      applyTripUpdate(updated);
    } catch (err) {
      setError(err.message || 'The AI agent could not regenerate this day.');
    } finally {
      setDayBusy(false);
    }
  }

  async function handleTogglePacking(itemId) {
    if (!selectedTrip) return;
    setTogglingItem(itemId);
    try {
      const updated = await api.togglePacking(selectedTrip._id, itemId);
      applyTripUpdate(updated);
    } catch (err) {
      setError(err.message || 'Could not update packing list.');
    } finally {
      setTogglingItem(null);
    }
  }

  function applyTripUpdate(updatedTrip) {
    setSelectedTrip(updatedTrip);
    setTrips((prev) => prev.map((t) => (t._id === updatedTrip._id ? updatedTrip : t)));
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-inkMuted font-mono text-sm">
        Loading your trips…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {error && (
        <div className="mb-6 text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside>
          <TripSidebar
            trips={trips}
            selectedTripId={selectedTrip?._id}
            onSelect={(trip) => {
              setSelectedTrip(trip);
              setShowCreateForm(false);
            }}
            onNewTrip={() => setShowCreateForm(true)}
            onDelete={handleDeleteTrip}
          />
        </aside>

        <main className="space-y-6">
          {showCreateForm ? (
            <CreateTripForm
              onSubmit={handleCreateTrip}
              onCancel={() => setShowCreateForm(false)}
              submitting={creating}
            />
          ) : selectedTrip ? (
            <>
              <div>
                <h2 className="font-display text-3xl font-semibold text-ink">
                  {selectedTrip.destination}
                </h2>
                <p className="text-sm text-inkMuted font-mono mt-1">
                  {selectedTrip.durationDays} days · {selectedTrip.budgetTier} budget
                  {selectedTrip.interests?.length ? ` · ${selectedTrip.interests.join(', ')}` : ''}
                </p>
              </div>

              <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
                <div className="space-y-5">
                  {selectedTrip.itinerary.map((day) => (
                    <ItineraryDay
                      key={day.dayNumber}
                      day={day}
                      busy={dayBusy}
                      onAddActivity={handleAddActivity}
                      onRemoveActivity={handleRemoveActivity}
                      onRegenerateDay={handleRegenerateDay}
                    />
                  ))}
                </div>

                <div className="space-y-6">
                  <BudgetSummary budget={selectedTrip.estimatedBudget} />
                  <HotelList hotels={selectedTrip.hotels} />
                </div>
              </div>

              <PackingList
                items={selectedTrip.packingList}
                onToggle={handleTogglePacking}
                toggling={togglingItem}
              />
            </>
          ) : (
            <div className="text-center py-20 text-inkMuted">
              Select a trip from the left, or plan a new one.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
