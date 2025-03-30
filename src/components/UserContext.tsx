import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  customerId: string;
  connectedAccountId?: string;
  walletBalance?: number;
}

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
  isMockMode: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    user: User | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Use import.meta.env for Vite projects
  const isMockMode = import.meta.env.VITE_MOCK_MODE === "true";

  const refreshUser = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      if (isMockMode) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setState({
          user: {
            id: "mock-user-123",
            email: "mock@example.com",
            customerId: "mock-customer-123",
            connectedAccountId: "mock-account-123",
            walletBalance: 1000,
          },
          isLoading: false,
          error: null,
        });
        return;
      }

      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Failed to fetch user");
      const userData = await response.json();
      setState({ user: userData, isLoading: false, error: null });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ ...state, refreshUser, isMockMode }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
