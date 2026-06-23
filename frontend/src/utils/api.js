const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload, auth: false }),
  getMe: () => request('/api/auth/me'),

  // Trips
  generateTrip: (payload) => request('/api/trips/generate', { method: 'POST', body: payload }),
  getTrips: () => request('/api/trips'),
  getTrip: (id) => request(`/api/trips/${id}`),
  updateTrip: (id, payload) => request(`/api/trips/${id}`, { method: 'PUT', body: payload }),
  deleteTrip: (id) => request(`/api/trips/${id}`, { method: 'DELETE' }),
  addActivity: (id, payload) => request(`/api/trips/${id}/activities`, { method: 'POST', body: payload }),
  removeActivity: (id, activityId) =>
    request(`/api/trips/${id}/activities/${activityId}`, { method: 'DELETE' }),
  regenerateDay: (id, payload) =>
    request(`/api/trips/${id}/regenerate-day`, { method: 'POST', body: payload }),
  togglePacking: (id, itemId) =>
    request(`/api/trips/${id}/packing/${itemId}`, { method: 'PATCH' })
};
