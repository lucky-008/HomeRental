import { useState, useEffect } from 'react';
import { getSavedProperties, saveProperty, unsaveProperty } from '../utils/api';
import { useAuth } from './AuthContext';

export function useSavedProperties() {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshSaved = async () => {
    if (!user) {
      setSaved([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getSavedProperties(user.username);
      setSaved(data.savedProperties || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSaved();
  }, [user]);

  const save = async (propertyId) => {
    if (!user) return;
    const normalizedId = String(propertyId);

    setLoading(true);
    try {
      const isSaved = saved.includes(normalizedId);
      setSaved(prevSaved =>
        isSaved
          ? prevSaved.filter(id => id !== normalizedId)
          : [...prevSaved, normalizedId]
      );

      if (isSaved) {
        await unsaveProperty(user.username, normalizedId);
      } else {
        await saveProperty(user.username, normalizedId);
      }

      await refreshSaved();
      if (window.dashboardRefresh) {
        window.dashboardRefresh();
      }
    } catch (err) {
      setError(err);
      await refreshSaved();
    } finally {
      setLoading(false);
    }
  };

  return { saved, save, loading, error, refreshSaved };
}
