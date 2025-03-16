export interface User {
  id: string;
  onboardingComplete: boolean;
}

export interface PaymentTransfer {
  amount: number;
  currency: string;
  destinationId: string;
}

export interface PayoutRequest {
  amount: number;
  currency: string;
  bankAccountId: string;
}