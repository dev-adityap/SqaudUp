import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiFetch, API_BASE } from '../utils/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const GamesContext = createContext(null);

const todayISO = () => new Date().toISOString().slice(0, 10);

export function GamesProvider({ children }) {
  const { currentUser, profile } = useAuth();
  const toast = useToast();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingIds, setPendingIds] = useState({});

  const meId = profile?._id || null;

  const loadGames = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/games`);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setGames(data.data || []);
    } catch (err) {
      setError(err.message || 'Could not reach the server');
      if (!silent) toast.error('Could not load games. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Refetch on mount and whenever the identity changes (join state is per-user).
  useEffect(() => {
    loadGames();
  }, [loadGames, meId]);

  const isJoined = useCallback(
    (game) => !!meId && Array.isArray(game?.players) && game.players.some((p) => String(p) === String(meId)),
    [meId]
  );

  const isHost = useCallback(
    (game) => !!meId && String(game?.hostId) === String(meId),
    [meId]
  );

  const setPending = (id, value) =>
    setPendingIds((prev) => ({ ...prev, [id]: value }));

  // Merge a server response back into the list so every page updates at once.
  const mergeGame = useCallback((updated) => {
    setGames((prev) => {
      const idx = prev.findIndex((g) => g._id === updated._id);
      if (idx === -1) return [updated, ...prev];
      const next = [...prev];
      next[idx] = { ...next[idx], ...updated };
      return next;
    });
  }, []);

  const joinGame = useCallback(async (gameId) => {
    if (!currentUser) {
      toast.info('Sign in to join a squad.');
      return false;
    }
    setPending(gameId, 'join');

    // Optimistic: reflect the new slot immediately.
    const snapshot = games;
    setGames((prev) => prev.map((g) => {
      if (g._id !== gameId) return g;
      const already = meId && g.players?.some((p) => String(p) === String(meId));
      if (already) return g;
      return {
        ...g,
        players: [...(g.players || []), meId],
        openSlots: Math.max(0, (g.openSlots ?? 0) - 1),
      };
    }));

    try {
      const res = await apiFetch(`/api/games/${gameId}/join`, { method: 'POST' });
      mergeGame(res.data);
      toast.success('You joined the squad!');
      return true;
    } catch (err) {
      setGames(snapshot); // revert
      toast.error(err.message || 'Could not join this game.');
      return false;
    } finally {
      setPending(null);
    }
  }, [currentUser, games, meId, mergeGame, toast]);

  const leaveGame = useCallback(async (gameId) => {
    if (!currentUser) return false;
    setPending(gameId, 'leave');

    const snapshot = games;
    setGames((prev) => prev.map((g) => {
      if (g._id !== gameId || !meId) return g;
      return {
        ...g,
        players: (g.players || []).filter((p) => String(p) !== String(meId)),
        openSlots: Math.min(g.maxPlayers ?? 0, (g.openSlots ?? 0) + 1),
        status: 'OPEN',
      };
    }));

    try {
      const res = await apiFetch(`/api/games/${gameId}/leave`, { method: 'POST' });
      mergeGame(res.data);
      toast.success('You left the game.');
      return true;
    } catch (err) {
      setGames(snapshot);
      toast.error(err.message || 'Could not leave this game.');
      return false;
    } finally {
      setPending(null);
    }
  }, [currentUser, games, meId, mergeGame, toast]);

  const createGame = useCallback(async (payload) => {
    const res = await apiFetch('/api/games', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // Prepend so the new game is visible without a refetch.
    setGames((prev) => [res.data, ...prev]);
    toast.success('Game created.');
    return res.data;
  }, [toast]);

  const getGameById = useCallback(
    (id) => games.find((g) => g._id === id) || null,
    [games]
  );

  const myGames = useMemo(
    () => games.filter((g) => isJoined(g) || isHost(g)),
    [games, isJoined, isHost]
  );
  const hostingGames = useMemo(() => games.filter((g) => isHost(g)), [games, isHost]);
  const joinedGames = useMemo(() => games.filter((g) => isJoined(g) && !isHost(g)), [games, isJoined, isHost]);
  const historyGames = useMemo(
    () => games.filter((g) => g.date && g.date.substring(0, 10) < todayISO()),
    [games]
  );

  const value = useMemo(() => ({
    games,
    loading,
    error,
    refresh: loadGames,
    meId,
    isJoined,
    isHost,
    joinGame,
    leaveGame,
    createGame,
    getGameById,
    myGames,
    hostingGames,
    joinedGames,
    historyGames,
    pendingIds,
    isPending: (id) => !!pendingIds[id],
  }), [
    games, loading, error, loadGames, meId, isJoined, isHost, joinGame, leaveGame,
    createGame, getGameById, myGames, hostingGames, joinedGames, historyGames, pendingIds,
  ]);

  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>;
}

export const useGames = () => {
  const ctx = useContext(GamesContext);
  if (!ctx) throw new Error('useGames must be used inside <GamesProvider>');
  return ctx;
};
