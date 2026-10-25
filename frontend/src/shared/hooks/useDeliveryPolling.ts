import { useEffect, useState } from 'react';

const DEFAULT_INTERVAL = 30000; // 30s

export function useDeliveryPolling(
  deliveryId: number | null,
  interval = DEFAULT_INTERVAL
) {
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deliveryId) return;

    const fetchDelivery = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/v1/delivery/${deliveryId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          }
        );
        const data = await res.json();
        setDelivery(data);
      } catch (e) {
        console.error('Error polling delivery:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
    const timer = setInterval(fetchDelivery, interval);

    return () => clearInterval(timer);
  }, [deliveryId, interval]);

  return { delivery, loading };
}

export function useDeliveryPollingList(
  ids: number[],
  interval = DEFAULT_INTERVAL
) {
  const [deliveries, setDeliveries] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) return;

    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const promises = ids.map(id =>
          fetch(`/api/v1/delivery/${id}`)
            .then(r => r.json())
            .then(d => ({ [id]: d }))
        );
        const results = await Promise.all(promises);
        const merged = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setDeliveries(merged);
      } catch (e) {
        console.error('Error polling deliveries:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
    const timer = setInterval(fetchDeliveries, interval);

    return () => clearInterval(timer);
  }, [ids, interval]);

  return { deliveries, loading };
}