import { useState, useCallback } from 'react';
import { api } from '../services/api';

export function useMandi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrices = useCallback(async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getMandiPrices(searchQuery);
      setData(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch Mandi rates');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchPrices };
}