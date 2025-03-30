// import React, { createContext, useContext, useEffect, useState } from "react";

// interface User {
//   id: string;
//   customerId: string;
//   email?: string;
//   connectedAccountId?: string;
//   walletBalance?: number;
// }

// interface UserContextValue {
//   user: User | null;
//   isLoading: boolean;
//   error: Error | null;
//   setConnectedAccountId: (id: string) => void;
//   refreshUser: () => Promise<void>;
// }

// const UserContext = createContext<UserContextValue | undefined>(undefined);

// export function UserProvider({ children }: { children: React.ReactNode }) {
//   const [state, setState] = useState<{
//     user: User | null;
//     isLoading: boolean;
//     error: Error | null;
//   }>({
//     user: null,
//     isLoading: true,
//     error: null,
//   });

//   const setConnectedAccountId = (id: string) => {
//     setState((prev) => ({
//       ...prev,
//       user: prev.user ? { ...prev.user, connectedAccountId: id } : null,
//     }));
//   };

//   // const refreshUser = async () => {
//   //   try {
//   //     setState((prev) => ({ ...prev, isLoading: true, error: null }));
//   //     const response = await fetch("/api/user");
//   //     const data = await response.json();
//   //     setState({ user: data, isLoading: false, error: null });
//   //   } catch (error) {
//   //     setState({ user: null, isLoading: false, error: error as Error });
//   //   }
//   // };

//   const refreshUser = async () => {
//     try {
//       setState((prev) => ({ ...prev, isLoading: true, error: null }));
//       const response = await fetch("/api/user");

//       // First check if the response is successful
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       // Check content type before reading
//       const contentType = response.headers.get("content-type");
//       if (!contentType?.includes("application/json")) {
//         const text = await response.text();
//         console.error("Received non-JSON response:", text.substring(0, 100));
//         throw new Error("Server returned non-JSON response");
//       }

//       // Only read the body once
//       const data = await response.json();
//       setState({ user: data, isLoading: false, error: null });
//     } catch (error) {
//       console.error("API Error:", error);
//       setState({
//         user: null,
//         isLoading: false,
//         error:
//           error instanceof Error
//             ? error
//             : new Error("Failed to load user data"),
//       });
//     }
//   };

//   useEffect(() => {
//     refreshUser();
//   }, []);

//   const contextValue = {
//     user: state.user,
//     isLoading: state.isLoading,
//     error: state.error,
//     setConnectedAccountId,
//     refreshUser,
//   };

//   return (
//     <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// }

// Updated UserContext.tsx

// import React, { createContext, useContext, useEffect, useState } from "react";

// interface User {
//   id: string;
//   email: string;
//   customerId: string;
//   connectedAccountId?: string;
//   walletBalance?: number;
// }

// interface UserContextValue {
//   user: User | null;
//   isLoading: boolean;
//   error: Error | null;
//   refreshUser: () => Promise<void>;
//   isMockMode: boolean;
// }

// const UserContext = createContext<UserContextValue | undefined>(undefined);

// export function UserProvider({ children }: { children: React.ReactNode }) {
//   const [state, setState] = useState<{
//     user: User | null;
//     isLoading: boolean;
//     error: Error | null;
//   }>({
//     user: null,
//     isLoading: true,
//     error: null,
//   });

//   const isMockMode = process.env.REACT_APP_MOCK_MODE === "true";

//   const refreshUser = async () => {
//     try {
//       setState((prev) => ({ ...prev, isLoading: true, error: null }));

//       if (isMockMode) {
//         await new Promise((resolve) => setTimeout(resolve, 800));
//         setState({
//           user: {
//             id: "mock-user-123",
//             email: "mock@example.com",
//             customerId: "mock-customer-123",
//             connectedAccountId: "mock-account-123",
//             walletBalance: 1000,
//           },
//           isLoading: false,
//           error: null,
//         });
//         return;
//       }

//       const response = await fetch("/api/user");
//       if (!response.ok) throw new Error("Failed to fetch user");
//       const userData = await response.json();
//       setState({ user: userData, isLoading: false, error: null });
//     } catch (error) {
//       setState({
//         user: null,
//         isLoading: false,
//         error: error instanceof Error ? error : new Error("Unknown error"),
//       });
//     }
//   };

//   useEffect(() => {
//     refreshUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ ...state, refreshUser, isMockMode }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// }

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
