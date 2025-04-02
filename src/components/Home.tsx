// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useUser } from "./UserContext";
// // import { usePayments } from "../hooks/usePayments";

// // function Home() {
// //   const [email, setEmail] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const { generateOnboardingLink, isMockMode } = usePayments();
// //   const { refreshUser } = useUser();
// //   const navigate = useNavigate();

// //   const handleLiveOnboarding = async (email: string) => {
// //     // Verify environment variables
// //     if (!import.meta.env.VITE_API_URL) {
// //       throw new Error("Backend API URL is not configured");
// //     }

// //     try {
// //       // 1. Create Stripe account - production endpoint
// //       const accountResponse = await fetch(
// //         `${import.meta.env.VITE_API_URL}/stripe/create-account`,
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Accept: "application/json",
// //           },
// //           body: JSON.stringify({ email }),
// //         }
// //       );

// //       // Handle non-2xx responses
// //       if (!accountResponse.ok) {
// //         const error = await accountResponse.json().catch(() => ({}));
// //         throw new Error(
// //           error.message || `Account creation failed (${accountResponse.status})`
// //         );
// //       }

// //       const { accountId } = await accountResponse.json();
// //       if (!accountId) throw new Error("Missing accountId in response");

// //       // 2. Generate onboarding link
// //       const onboardingResponse = await fetch(
// //         `${import.meta.env.VITE_API_URL}/stripe/onboarding-link`,
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Accept: "application/json",
// //           },
// //           body: JSON.stringify({ accountId }),
// //         }
// //       );

// //       if (!onboardingResponse.ok) {
// //         const error = await onboardingResponse.json().catch(() => ({}));
// //         throw new Error(
// //           error.message ||
// //             `Onboarding link failed (${onboardingResponse.status})`
// //         );
// //       }

// //       const { url } = await onboardingResponse.json();
// //       if (!url) throw new Error("Missing onboarding URL in response");

// //       // 3. Redirect to Stripe
// //       window.location.href = url;
// //     } catch (error) {
// //       console.error("Onboarding error:", error);
// //       throw new Error(
// //         error instanceof Error ? error.message : "Onboarding process failed"
// //       );
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsLoading(true);
// //     setError(null);

// //     try {
// //       if (import.meta.env.VITE_MOCK_MODE === "true") {
// //         // Mock mode handling
// //         await new Promise((resolve) => setTimeout(resolve, 1000));
// //         refreshUser();
// //         navigate("/paymentdashboard");
// //         return;
// //       }

// //       // Production flow
// //       await handleLiveOnboarding(email);
// //     } catch (err) {
// //       setError(
// //         err instanceof Error
// //           ? err.message
// //           : "Onboarding failed. Please try again."
// //       );
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
// //       <h1 className="text-2xl font-bold text-center mb-6">
// //         Investor Onboarding
// //       </h1>

// //       {isMockMode && (
// //         <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg mb-4">
// //           <p className="font-medium">NOTE: Using Demo Mode</p>
// //           <p className="text-sm">Switch to live mode for production</p>
// //         </div>
// //       )}

// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-1">
// //             Email Address
// //           </label>
// //           <input
// //             type="email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //             placeholder="your@email.com"
// //           />
// //         </div>

// //         <button
// //           type="submit"
// //           disabled={isLoading}
// //           className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center"
// //         >
// //           {isLoading ? (
// //             <>
// //               <svg
// //                 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /* spinner */
// //               />
// //               Processing...
// //             </>
// //           ) : (
// //             "Continue to Stripe Onboarding"
// //           )}
// //         </button>

// //         {error && (
// //           <div className="bg-red-50 text-red-600 p-2 rounded text-sm">
// //             {error}
// //           </div>
// //         )}
// //       </form>
// //     </div>
// //   );
// // }

// // export default Home;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "./UserContext";
// import { usePayments } from "../hooks/usePayments";

// function Home() {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { generateOnboardingLink, isMockMode } = usePayments();
//   const { refreshUser } = useUser();
//   const navigate = useNavigate();

//   const handleLiveOnboarding = async (email: string) => {
//     // Verify environment variables
//     if (!import.meta.env.VITE_API_URL) {
//       throw new Error("Backend API URL is not configured");
//     }

//     try {
//       // 1. Create Stripe account - production endpoint
//       const accountResponse = await fetch(
//         `${import.meta.env.VITE_API_URL}/stripe/create-account`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({ email }),
//         }
//       );

//       // Handle non-2xx responses
//       if (!accountResponse.ok) {
//         const error = await accountResponse.json().catch(() => ({}));
//         throw new Error(
//           error.message || `Account creation failed (${accountResponse.status})`
//         );
//       }

//       const accountData = await accountResponse.json();
//       if (!accountData.accountId) throw new Error("Missing account data");

//       // Store all account data including token
//       localStorage.setItem("stripeData", JSON.stringify(accountData));

//       // 2. Generate onboarding link
//       const onboardingResponse = await fetch(
//         `${import.meta.env.VITE_API_URL}/stripe/onboarding-link`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({
//             accountId: accountData.accountId,
//             email: accountData.email, // Include email from response
//           }),
//         }
//       );

//       if (!onboardingResponse.ok) {
//         const error = await onboardingResponse.json().catch(() => ({}));
//         throw new Error(
//           error.message ||
//             `Onboarding link failed (${onboardingResponse.status})`
//         );
//       }

//       const { url, token: updatedToken } = await onboardingResponse.json();
//       if (!url) throw new Error("Missing onboarding URL in response");

//       // Update stored token if a new one was returned
//       if (updatedToken) {
//         const storedData = JSON.parse(
//           localStorage.getItem("stripeData") || "{}"
//         );
//         localStorage.setItem(
//           "stripeData",
//           JSON.stringify({
//             ...storedData,
//             token: updatedToken,
//           })
//         );
//       }

//       // 3. Redirect to Stripe
//       window.location.href = url;
//     } catch (error) {
//       console.error("Onboarding error:", error);
//       throw new Error(
//         error instanceof Error ? error.message : "Onboarding process failed"
//       );
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       if (import.meta.env.VITE_MOCK_MODE === "true") {
//         // Mock mode handling
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         refreshUser();
//         navigate("/paymentdashboard");
//         return;
//       }

//       // Production flow
//       await handleLiveOnboarding(email);
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Onboarding failed. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
//       <h1 className="text-2xl font-bold text-center mb-6">
//         Investor Onboarding
//       </h1>

//       {isMockMode && (
//         <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg mb-4">
//           <p className="font-medium">NOTE: Using Demo Mode</p>
//           <p className="text-sm">Switch to live mode for production</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Email Address
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="your@email.com"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center"
//         >
//           {isLoading ? (
//             <>
//               <svg
//                 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Processing...
//             </>
//           ) : (
//             "Continue to Stripe Onboarding"
//           )}
//         </button>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-2 rounded text-sm">
//             {error}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }

// export default Home;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { usePayments } from "../hooks/usePayments";

function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { generateOnboardingLink, isMockMode } = usePayments();
  const { refreshUser } = useUser();
  const navigate = useNavigate();

  const handleLiveOnboarding = async (email: string) => {
    if (!import.meta.env.VITE_API_URL) {
      throw new Error("Backend API URL is not configured");
    }

    try {
      // 1. Create Stripe account
      const accountResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/create-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!accountResponse.ok) {
        const error = await accountResponse.json().catch(() => ({}));
        throw new Error(
          error.message || `Account creation failed (${accountResponse.status})`
        );
      }

      const accountData = await accountResponse.json();
      if (!accountData.accountId || !accountData.token) {
        throw new Error("Missing account data in response");
      }

      // Store ONLY the JWT token (not the full account data)
      localStorage.setItem("stripeAuthToken", accountData.token);

      // 2. Generate onboarding link
      const onboardingResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/onboarding-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId: accountData.accountId,
            email: accountData.email,
          }),
        }
      );

      if (!onboardingResponse.ok) {
        const error = await onboardingResponse.json().catch(() => ({}));
        throw new Error(
          error.message || `Onboarding failed (${onboardingResponse.status})`
        );
      }

      const { url, token: updatedToken } = await onboardingResponse.json();
      if (!url) throw new Error("Missing onboarding URL");

      // Update token if a new one was provided
      if (updatedToken) {
        localStorage.setItem("stripeAuthToken", updatedToken);
      }

      // 3. Redirect to Stripe
      window.location.href = url;
    } catch (error) {
      console.error("Onboarding error:", error);
      throw error instanceof Error
        ? error
        : new Error("Onboarding process failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isMockMode) {
        // Mock mode - skip real onboarding
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Set a mock token if needed
        localStorage.setItem("stripeAuthToken", "mock-token-123");
        refreshUser();
        navigate("/paymentdashboard");
        return;
      }

      // Production flow
      await handleLiveOnboarding(email);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Onboarding failed. Please try again."
      );
      // Clear any invalid token
      localStorage.removeItem("stripeAuthToken");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Investor Onboarding
      </h1>

      {isMockMode && (
        <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg mb-4">
          <p className="font-medium">NOTE: Using Demo Mode</p>
          <p className="text-sm">All transactions are simulated</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="your@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Continue to Stripe Onboarding"
          )}
        </button>

        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default Home;
