import React, { createContext, useContext, useEffect, useState } from "react";

// Define the shape of the user data
interface User {
  customerId: string;
  // Add other user properties as needed
  connectedAccountId?: string;
}

// Create the context
const UserContext = createContext<User | null>(null);

// Create the provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data from your authentication system or API
    async function fetchUser() {
      try {
        const response = await fetch("/api/user"); // Replace with your API endpoint
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    fetchUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// Create a custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
