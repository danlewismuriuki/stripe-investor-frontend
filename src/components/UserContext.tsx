// import React, { createContext, useContext, useEffect, useState } from "react";

// // Define the shape of the user data
// interface User {
//   customerId: string;
//   email?: string; // Mark optional if it may be undefined
//   connectedAccountId?: string;
//   setConnectedAccountId?: (id: string) => void;
// }

// // Create the context
// const UserContext = createContext<User | null>(null);

// // Create the provider component
// export function UserProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // Fetch user data from your authentication system or API
//     async function fetchUser() {
//       try {
//         const response = await fetch("/api/user"); // Replace with your API endpoint
//         const data = await response.json();
//         setUser(data);
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//       }
//     }
//     fetchUser();
//   }, []);

//   return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
// }

// // Create a custom hook to use the user context
// export function useUser() {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// }

import React, { createContext, useContext, useEffect, useState } from "react";

// Enhanced User interface with all required properties
interface User {
  id: string;
  customerId: string;
  email?: string;
  connectedAccountId?: string;
  setConnectedAccountId: (id: string) => void;
  refreshUser: () => Promise<void>;
  walletBalance?: number;
}

// Create the context with proper typing
const UserContext = createContext<User | null>(null);

// Create the provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<Omit<
    User,
    "setConnectedAccountId" | "refreshUser"
  > | null>(null);

  // Function to update connectedAccountId
  const setConnectedAccountId = (id: string) => {
    setUserData((prev) => (prev ? { ...prev, connectedAccountId: id } : null));
  };

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  // Initial user data fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUserData(data);

        // If onboarding just completed, fetch connected account
        if (data.email && !data.connectedAccountId) {
          const accountResponse = await fetch(
            `/api/user-connected-account/${data.email}`
          );
          const accountData = await accountResponse.json();
          if (accountData.connectedAccountId) {
            setUserData((prev) =>
              prev
                ? {
                    ...prev,
                    connectedAccountId: accountData.connectedAccountId,
                  }
                : null
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  // Only provide the context value when userData exists
  const contextValue = userData
    ? {
        ...userData,
        setConnectedAccountId,
        refreshUser,
      }
    : null;

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// Enhanced custom hook with additional safety checks
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
