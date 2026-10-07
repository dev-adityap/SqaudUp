import { auth } from '../config/firebase';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Safely gets the token without crashing if the user state is still loading
const getToken = async (forceRefresh = false) => {
  const user = auth.currentUser;
  if (!user) return null; // Return null instead of throwing an error
  try {
    return await user.getIdToken(forceRefresh);
  } catch (err) {
    console.error("Token fetch error:", err);
    return null;
  }
};

export const apiFetch = async (path, options = {}) => {
  const { token: explicitToken, headers, ...rest } = options;

  let token = explicitToken || (await getToken());

  const doFetch = (tok) => {
    // Only attach the Authorization header if a valid token actually exists
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    if (tok) {
      reqHeaders['Authorization'] = `Bearer ${tok}`;
    }

    return fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: reqHeaders,
    });
  };

  let res = await doFetch(token);
  
  // If the server rejected our token, force-refresh and retry exactly once.
  if ((res.status === 401 || res.status === 403) && auth.currentUser) {
    const freshToken = await getToken(true); // force refresh
    if (freshToken && freshToken !== token) {
      res = await doFetch(freshToken);
    }
  }

  // Safely parse the response (handles empty responses without crashing)
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text };
  }

  if (!res.ok) {
    const err = new Error(data.error || data.message || `Request failed with status ${res.status}`);
    err.status = res.status;
    err.response = { data };
    throw err;
  }

  return data;
};