import { auth } from '../config/firebase';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in to do that.');
  return user.getIdToken();
};

// Attaches the Firebase ID token required by protected backend routes.
export const apiFetch = async (path, options = {}) => {
  const token = await getToken();
  const { headers, ...rest } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }

  return data;
};
