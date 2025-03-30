import { useState } from 'react';
import type { PaymentTransfer, PayoutRequest } from '../lib/types';

const BASE_URL = 'https://stripe-investor-wallet.onrender.com/stripe';

interface UsePaymentsReturn {
  isLoading: boolean;
  error: string | null;
  isMockMode: boolean;
  generateOnboardingLink: (accountId: string) => Promise<string>;
  initializePayment: (amount: number, currency: string, customerId: string) => Promise<string>;
  createTransfer: (transfer: PaymentTransfer) => Promise<any>;
  requestPayout: (payout: PayoutRequest) => Promise<any>;
}

export function usePayments(): UsePaymentsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'; // Using Vite's env variables

  // Mock implementations
  const mockGenerateOnboardingLink = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'https://mock-stripe-onboarding.example.com';
  };

  const mockInitializePayment = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'mock_client_secret_123456';
  };

  const mockCreateTransfer = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, transactionId: `mock_tx_${Date.now()}` };
  };

  const mockRequestPayout = async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + 3);
    return { 
      success: true, 
      payoutId: `mock_po_${Date.now()}`,
      arrivalDate: arrivalDate.toISOString()
    };
  };

  // Real implementations
  const generateOnboardingLink = async (accountId: string) => {
    if (isMockMode) return mockGenerateOnboardingLink();
    
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

  const initializePayment = async (amount: number, currency: string, customerId: string) => {
    if (isMockMode) return mockInitializePayment();
    
    try {
      const response = await fetch(`${BASE_URL}/fund-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, customerId }),
      });
      const data = await response.json();
      return data.clientSecret;
    } catch (err) {
      throw new Error("Failed to initialize payment");
    }
  };

  const createTransfer = async (transfer: PaymentTransfer) => {
    if (isMockMode) return mockCreateTransfer();
    
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
    if (isMockMode) return mockRequestPayout();
    
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
    isMockMode,
    generateOnboardingLink,
    initializePayment,
    createTransfer,
    requestPayout,
  };
}