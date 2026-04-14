import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePlan = () => {
  const [subscription, setSubscription] = useState({
    plan: 'FREE',
    status: 'active',
    currentPeriodEnd: null,
    loading: true
  });

  useEffect(() => {
    const fetchPlan = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubscription(s => ({ ...s, loading: false }));
        return;
      }

      try {
        const response = await axios.get('/api/subscription/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubscription({
          ...response.data,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching plan:', error);
        setSubscription(s => ({ ...s, loading: false }));
      }
    };

    fetchPlan();
  }, []);

  const isPro = () => subscription.plan === 'PRO' || subscription.plan === 'ENTERPRISE';
  const isEnterprise = () => subscription.plan === 'ENTERPRISE';
  const isActive = () => subscription.status === 'active' || subscription.status === 'trialing';

  const redirectToPortal = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/subscription/portal', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error redirecting to portal:', error);
      alert('Failed to open billing portal.');
    }
  };

  return {
    ...subscription,
    isPro,
    isEnterprise,
    isActive,
    redirectToPortal
  };
};
