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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       // In mock mode, skip API calls and simulate success
//       if (isMockMode) {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         refreshUser();
//         navigate("/paymentdashboard");
//         return;
//       }

//       // LIVE MODE: Full Stripe flow
//       // 1. Create Stripe account
//       const accountResponse = await fetch(
//         `${import.meta.env.VITE_API_URL}/stripe/create-account`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );

//       if (!accountResponse.ok) {
//         const errorData = await accountResponse.json();
//         throw new Error(errorData.message || "Account creation failed");
//       }

//       const { accountId } = await accountResponse.json();

//       // 2. Generate onboarding link
//       const onboardingUrl = await generateOnboardingLink(accountId);

//       // 3. Redirect to Stripe
//       window.location.href = onboardingUrl;
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to start onboarding. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
//       <h1 className="text-2xl font-bold text-center mb-6">
//         Welcome to Investor Wallet
//       </h1>

//       {isMockMode && (
//         <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4">
//           <p className="font-medium">Demo Mode Active</p>
//           <p className="text-sm">Using simulated onboarding flow</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="email"
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
//             "Start Onboarding"
//           )}
//         </button>

//         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
    // 1. Create Stripe Connected Account
    const accountResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/stripe/create-account`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    if (!accountResponse.ok) {
      const errorData = await accountResponse.json();
      throw new Error(errorData.message || "Account creation failed");
    }

    const { accountId } = await accountResponse.json();

    // 2. Generate Onboarding Link
    const onboardingResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/stripe/onboarding-link`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      }
    );

    if (!onboardingResponse.ok) {
      throw new Error("Failed to generate onboarding link");
    }

    const { url } = await onboardingResponse.json();
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isMockMode) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        refreshUser();
        navigate("/paymentdashboard");
        return;
      }

      // PRODUCTION FLOW
      const onboardingUrl = await handleLiveOnboarding(email);
      window.location.href = onboardingUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onboarding failed");
      console.error("Onboarding error:", err);
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
          <p className="text-sm">Switch to live mode for production</p>
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
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /* spinner */
              />
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
