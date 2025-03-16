// import { useState } from 'react';
// import type { PaymentTransfer, PayoutRequest } from '../lib/types';

// export function usePayments() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const generateOnboardingLink = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       // TODO: Implement API call to generate onboarding link
//       const response = await fetch('/api/onboarding/generate-link', {
//         method: 'POST',
//       });
//       const data = await response.json();
//       return data.url;
//     } catch (err) {
//       setError('Failed to generate onboarding link');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const initializePayment = async (amount: number, currency: string) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       // TODO: Implement Stripe payment initialization
//       const response = await fetch('/api/payments/initialize', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount, currency }),
//       });
//       const data = await response.json();
//       return data.clientSecret;
//     } catch (err) {
//       setError('Failed to initialize payment');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const createTransfer = async (transfer: PaymentTransfer) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await fetch('/api/transfers', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(transfer),
//       });
//       return await response.json();
//     } catch (err) {
//       setError('Failed to create transfer');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const requestPayout = async (payout: PayoutRequest) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await fetch('/api/payouts', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payout),
//       });
//       return await response.json();
//     } catch (err) {
//       setError('Failed to process payout');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     isLoading,
//     error,
//     generateOnboardingLink,
//     initializePayment,
//     createTransfer,
//     requestPayout,
//   };
// }


import { useState } from 'react';
import type { PaymentTransfer, PayoutRequest } from '../lib/types';

const BASE_URL = 'https://stripe-investor-wallet.onrender.com/stripe';

export function usePayments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOnboardingLink = async (accountId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/account-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });
      const data = await response.json();
      return data.url;
    } catch (err) {
      setError('Failed to generate onboarding link');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const initializePayment = async (amount: number, currency: string, paymentMethodId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/fund-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, paymentMethodId }),
      });
      const data = await response.json();
      return data.clientSecret;
    } catch (err) {
      setError('Failed to initialize payment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createTransfer = async (transfer: PaymentTransfer) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transfer),
      });
      return await response.json();
    } catch (err) {
      setError('Failed to create transfer');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPayout = async (payout: PayoutRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payout),
      });
      return await response.json();
    } catch (err) {
      setError('Failed to process payout');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generateOnboardingLink,
    initializePayment,
    createTransfer,
    requestPayout,
  };
}
