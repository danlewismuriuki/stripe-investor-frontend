// import React, { useState, useEffect } from "react";
// import { usePayments } from "../hooks/usePayments";
// import { useUser } from "./UserContext";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import {
//   FaCreditCard,
//   FaExchangeAlt,
//   FaWallet,
//   FaArrowDown,
//   FaArrowUp,
//   FaUniversity,
//   FaPlus, // Added FaPlus import
// } from "react-icons/fa";

// // Type definitions - moved to match your actual types
// export interface PayoutMethod {
//   id: string;
//   bank_name?: string;
//   last4: string;
//   currency: string;
// }

// export interface PaymentMethod {
//   id: string;
//   card: {
//     brand: string;
//     last4: string;
//   };
// }

// // Make sure this matches exactly with what usePayments expects
// export interface PayoutRequest {
//   amount: number;
//   currency: string;
//   accountId: string;
//   bankAccountId: string; // Changed to required to match your types
// }

// export function PaymentDashboard() {
//   const { user, isMockMode } = useUser();
//   const { isLoading, error, initializePayment, requestPayout } = usePayments();
//   const stripe = useStripe();
//   const elements = useElements();

//   // State
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("USD");
//   const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
//   const [showCardForm, setShowCardForm] = useState(false);
//   const [transactionStatus, setTransactionStatus] = useState<string | null>(
//     null
//   );
//   const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
//   const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
//   const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

//   // Load mock or real data
//   useEffect(() => {
//     if (isMockMode) {
//       setPayoutMethods([
//         {
//           id: "ba_mock_1",
//           bank_name: "Mock Bank",
//           last4: "4242",
//           currency: "usd",
//         },
//       ]);
//       setPaymentMethods([
//         {
//           id: "pm_mock_1",
//           card: { brand: "visa", last4: "4242" },
//         },
//       ]);
//     } else {
//       // TODO: Load real data from API
//     }
//   }, [isMockMode]);

//   const handlePayment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setTransactionStatus(null);

//     try {
//       if (activeTab === "deposit") {
//         // Fix for "Expected 3 arguments" error
//         const paymentData = {
//           amount: Number(amount),
//           currency,
//           customerId: user?.customerId || "",
//           paymentMethodId: selectedPaymentMethod || undefined,
//         };

//         const clientSecret = await initializePayment(
//           paymentData.amount,
//           paymentData.currency,
//           paymentData.customerId
//           // Removed the 4th argument to match the hook's expected parameters
//         );
//         setTransactionStatus(`Deposit of ${amount} ${currency} successful!`);
//         setShowCardForm(false);
//       } else {
//         if (!selectedPayoutMethod) {
//           throw new Error("Please select a payout method");
//         }

//         // Fix for PayoutRequest type mismatch
//         const payout: PayoutRequest = {
//           amount: Number(amount),
//           currency,
//           accountId: user?.connectedAccountId || "",
//           bankAccountId: selectedPayoutMethod, // Made required to match type
//         };

//         const result = await requestPayout(payout);
//         setTransactionStatus(
//           `Payout scheduled! Funds will arrive by ${new Date(
//             result.arrivalDate
//           ).toLocaleDateString()}`
//         );
//       }
//     } catch (err: any) {
//       setTransactionStatus(
//         err.message || "Transaction failed. Please try again."
//       );
//     }
//   };

//   // ... rest of your component code remains exactly the same ...
//   // Make sure to keep all your existing JSX and other functions

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       {/* Mock Mode Indicator */}
//       {isMockMode && (
//         <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-6 flex items-center">
//           <span className="font-medium">Demo Mode:</span>
//           <span className="ml-2">Using simulated transactions</span>
//         </div>
//       )}

//       {/* Main Card */}
//       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//         {/* Header */}
//         <div className="bg-indigo-600 p-6 text-white">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold">Payment Dashboard</h1>
//               <p className="opacity-90">Manage your funds</p>
//             </div>
//             <div className="bg-indigo-700 px-4 py-2 rounded-lg">
//               <p className="text-sm">Balance</p>
//               <p className="font-bold text-xl">
//                 ${user?.walletBalance?.toFixed(2) || "0.00"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b">
//           <button
//             onClick={() => setActiveTab("deposit")}
//             className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${
//               activeTab === "deposit"
//                 ? "text-indigo-600 border-b-2 border-indigo-600"
//                 : "text-gray-500"
//             }`}
//           >
//             <FaArrowDown className="inline" /> Deposit
//           </button>
//           <button
//             onClick={() => setActiveTab("withdraw")}
//             className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${
//               activeTab === "withdraw"
//                 ? "text-indigo-600 border-b-2 border-indigo-600"
//                 : "text-gray-500"
//             }`}
//           >
//             <FaArrowUp className="inline" /> Withdraw
//           </button>
//         </div>

//         {/* Form */}
//         <div className="p-6">
//           <form onSubmit={handlePayment}>
//             {/* Amount Input */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Amount
//               </label>
//               <div className="relative rounded-md shadow-sm">
//                 <input
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="0.00"
//                   step="0.01"
//                   min="0"
//                   required
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center">
//                   <select
//                     value={currency}
//                     onChange={(e) => setCurrency(e.target.value)}
//                     className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
//                   >
//                     <option>USD</option>
//                     <option>EUR</option>
//                     <option>GBP</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {activeTab === "deposit" ? (
//               <>
//                 {!showCardForm && paymentMethods.length > 0 && (
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Payment Method
//                     </label>
//                     <div className="space-y-2">
//                       {paymentMethods.map((method) => (
//                         <div
//                           key={method.id}
//                           onClick={() => {
//                             setSelectedPaymentMethod(method.id);
//                             setShowCardForm(false);
//                           }}
//                           className={`p-3 border rounded-md cursor-pointer ${
//                             selectedPaymentMethod === method.id
//                               ? "border-indigo-500 bg-indigo-50"
//                               : "border-gray-300"
//                           }`}
//                         >
//                           <div className="flex items-center">
//                             <FaCreditCard className="text-gray-500 mr-2" />
//                             <div>
//                               <p className="font-medium">
//                                 {method.card.brand} ending in{" "}
//                                 {method.card.last4}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => setShowCardForm(true)}
//                       className="mt-3 text-indigo-600 text-sm flex items-center"
//                     >
//                       <FaPlus className="mr-1" /> Add new card
//                     </button>
//                   </div>
//                 )}

//                 {showCardForm && (
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Card Details
//                     </label>
//                     <div className="p-4 border border-gray-300 rounded-lg">
//                       <CardElement
//                         options={{
//                           style: {
//                             base: {
//                               fontSize: "16px",
//                               color: "#424770",
//                               "::placeholder": {
//                                 color: "#aab7c4",
//                               },
//                             },
//                             invalid: {
//                               color: "#9e2146",
//                             },
//                           },
//                         }}
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => setShowCardForm(false)}
//                       className="mt-2 text-gray-600 text-sm"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}

//                 {!showCardForm && paymentMethods.length === 0 && (
//                   <button
//                     type="button"
//                     onClick={() => setShowCardForm(true)}
//                     className="w-full mb-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
//                   >
//                     Add Payment Method
//                   </button>
//                 )}
//               </>
//             ) : (
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Payout Method
//                 </label>
//                 <div className="space-y-2">
//                   {payoutMethods.length > 0 ? (
//                     payoutMethods.map((method) => (
//                       <div
//                         key={method.id}
//                         onClick={() => setSelectedPayoutMethod(method.id)}
//                         className={`p-3 border rounded-md cursor-pointer ${
//                           selectedPayoutMethod === method.id
//                             ? "border-indigo-500 bg-indigo-50"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           {method.bank_name ? (
//                             <FaUniversity className="text-gray-500 mr-2" />
//                           ) : (
//                             <FaCreditCard className="text-gray-500 mr-2" />
//                           )}
//                           <div>
//                             <p className="font-medium">
//                               {method.bank_name || "Card"} ending in{" "}
//                               {method.last4}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                               {method.currency.toUpperCase()}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500 text-sm">
//                       No payout methods available
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={
//                 isLoading || (activeTab === "withdraw" && !selectedPayoutMethod)
//               }
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <FaExchangeAlt />
//                   {activeTab === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
//                 </>
//               )}
//             </button>
//           </form>

//           {error && (
//             <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
//               {error}
//             </div>
//           )}
//           {transactionStatus && (
//             <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg">
//               {transactionStatus}
//             </div>
//           )}
//         </div>
//       </div>

//       {isMockMode && (
//         <div className="max-w-2xl mx-auto mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg">
//           <h3 className="font-medium mb-2">Demo Instructions:</h3>
//           <ul className="list-disc pl-5 space-y-1">
//             <li>Try any amount - no real money is used</li>
//             <li>Use test card: 4242 4242 4242 4242</li>
//             <li>Any future date for expiry</li>
//             <li>Any 3-digit CVC</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { usePayments } from "../hooks/usePayments";
import { useUser } from "./UserContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  FaCreditCard,
  FaExchangeAlt,
  FaWallet,
  FaArrowDown,
  FaArrowUp,
  FaUniversity,
  FaPlus,
} from "react-icons/fa";

interface PayoutMethod {
  id: string;
  bank_name?: string;
  last4: string;
  currency: string;
  default_for_currency?: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

interface PayoutRequest {
  token: string;
  amount: number;
}

export function PaymentDashboard() {
  const { user, isMockMode } = useUser();
  const { isLoading, error, initializePayment, requestPayout } = usePayments();
  const stripe = useStripe();
  const elements = useElements();

  // State
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [showCardForm, setShowCardForm] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // Load payment and payout methods
  useEffect(() => {
    const stripeData = JSON.parse(localStorage.getItem("stripeData") || "{}");
    if (!stripeData.token) return;

    if (isMockMode) {
      setPayoutMethods([
        {
          id: "ba_mock_1",
          bank_name: "Mock Bank",
          last4: "4242",
          currency: "usd",
          default_for_currency: true,
        },
      ]);
      setPaymentMethods([
        {
          id: "pm_mock_1",
          type: "card",
          card: { brand: "visa", last4: "4242", exp_month: 12, exp_year: 2025 },
        },
      ]);
    } else {
      const loadPaymentMethods = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/stripe/payment-methods/${
              stripeData.token
            }`
          );
          if (!response.ok) throw new Error("Failed to load payment methods");
          const { methods } = await response.json();
          setPaymentMethods(methods);
        } catch (error) {
          console.error("Payment methods error:", error);
          setTransactionStatus("Failed to load payment methods");
        }
      };

      const loadPayoutMethods = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/stripe/payout-methods/${
              stripeData.token
            }`
          );
          if (!response.ok) throw new Error("Failed to load payout methods");
          const { methods, defaultMethod } = await response.json();
          setPayoutMethods(methods);
          if (defaultMethod) setSelectedPayoutMethod(defaultMethod.id);
        } catch (error) {
          console.error("Payout methods error:", error);
          setTransactionStatus("Failed to load payout methods");
        }
      };

      loadPaymentMethods();
      loadPayoutMethods();
    }
  }, [isMockMode]);

  const refreshPaymentMethods = async () => {
    const stripeData = JSON.parse(localStorage.getItem("stripeData") || "{}");
    if (!stripeData.token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/payment-methods/${
          stripeData.token
        }`
      );
      const { methods } = await response.json();
      setPaymentMethods(methods); // Updates the list of saved cards
    } catch (error) {
      console.error("Failed to refresh payment methods:", error);
    }
  };

  const refreshWalletBalance = async () => {
    const stripeData = JSON.parse(localStorage.getItem("stripeData") || "{}");
    if (!stripeData.token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/wallet-balance/${
          stripeData.token
        }`
      );
      const { balance } = await response.json();
      // If using a UserContext, update the balance here
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionStatus(null);

    // Basic validation
    if (!amount || Number(amount) <= 0) {
      setTransactionStatus("Please enter a valid amount");
      return;
    }

    const stripeData = JSON.parse(localStorage.getItem("stripeData") || "{}");
    if (!stripeData?.token) {
      setTransactionStatus("Authentication required. Please sign in again.");
      return;
    }

    try {
      if (activeTab === "deposit") {
        if (showCardForm) {
          // Add null check for Stripe
          if (!stripe || !elements) {
            throw new Error("Payment system not ready. Please try again.");
          }

          const { error: stripeError, paymentIntent } =
            await stripe.confirmPayment({
              elements,
              confirmParams: { return_url: window.location.origin },
              redirect: "if_required",
            });

          if (stripeError) throw stripeError;
          if (!paymentIntent) throw new Error("Payment failed");

          setTransactionStatus(`Deposit of ${amount} ${currency} successful!`);
          setShowCardForm(false);

          // Refresh payment methods - you'll need to implement this
          await fetchPaymentMethods();
        } else {
          // Saved payment method flow
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/stripe/fund-wallet`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: stripeData.token,
                amount: Number(amount),
                currency,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Funding failed");
          }

          if (data.requiresAction && stripe && elements) {
            // Handle 3D Secure authentication
            const { error: confirmationError } = await stripe.confirmPayment({
              elements,
              clientSecret: data.clientSecret,
              confirmParams: { return_url: window.location.origin },
            });
            if (confirmationError) throw confirmationError;
          }

          setTransactionStatus(`Deposit of ${amount} ${currency} completed!`);
        }
      } else {
        // Payout flow
        if (!selectedPayoutMethod) {
          throw new Error("Please select a payout method");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/stripe/payouts`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: stripeData.token,
              amount: Number(amount),
              methodId: selectedPayoutMethod,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Payout failed");
        }

        setTransactionStatus(
          `Payout scheduled! Funds will arrive by ${new Date(
            result.arrivalDate
          ).toLocaleDateString()}`
        );

        // Refresh wallet balance - you'll need to implement this
        await fetchWalletBalance();
      }
    } catch (err: any) {
      setTransactionStatus(
        err.message || "Transaction failed. Please try again."
      );
      console.error("Payment error:", err);
    }
  };

  // Add these helper functions somewhere in your component
  const fetchPaymentMethods = async () => {
    const stripeData = JSON.parse(localStorage.getItem("stripeData") || "{}");
    if (!stripeData.token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/payment-methods/${
          stripeData.token
        }`
      );
      const { methods } = await response.json();
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Failed to refresh payment methods:", error);
    }
  };

  const fetchWalletBalance = async () => {
    const stripeData = JSON.parse(localStorage.getItem("stripeData") || "{}");
    if (!stripeData.token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/wallet-balance/${
          stripeData.token
        }`
      );
      const { balance } = await response.json();
      // Update your user balance here
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    }
  };

  // ... rest of your JSX remains exactly the same ...
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Mock Mode Indicator */}
      {isMockMode && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-6 flex items-center">
          <span className="font-medium">Demo Mode:</span>
          <span className="ml-2">Using simulated transactions</span>
        </div>
      )}

      {/* Main Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Payment Dashboard</h1>
              <p className="opacity-90">Manage your funds</p>
            </div>
            <div className="bg-indigo-700 px-4 py-2 rounded-lg">
              <p className="text-sm">Balance</p>
              <p className="font-bold text-xl">
                ${user?.walletBalance?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${
              activeTab === "deposit"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            <FaArrowDown className="inline" /> Deposit
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${
              activeTab === "withdraw"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            <FaArrowUp className="inline" /> Withdraw
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handlePayment}>
            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>
            </div>

            {activeTab === "deposit" ? (
              <>
                {!showCardForm && paymentMethods.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          onClick={() => {
                            setSelectedPaymentMethod(method.id);
                            setShowCardForm(false);
                          }}
                          className={`p-3 border rounded-md cursor-pointer ${
                            selectedPaymentMethod === method.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-300"
                          }`}
                        >
                          <div className="flex items-center">
                            <FaCreditCard className="text-gray-500 mr-2" />
                            <div>
                              <p className="font-medium">
                                {method.card?.brand} ending in{" "}
                                {method.card?.last4}
                              </p>
                              {method.card && (
                                <p className="text-sm text-gray-500">
                                  Expires {method.card.exp_month}/
                                  {method.card.exp_year}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCardForm(true)}
                      className="mt-3 text-indigo-600 text-sm flex items-center"
                    >
                      <FaPlus className="mr-1" /> Add new card
                    </button>
                  </div>
                )}

                {showCardForm && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Details
                    </label>
                    <div className="p-4 border border-gray-300 rounded-lg">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#424770",
                              "::placeholder": {
                                color: "#aab7c4",
                              },
                            },
                            invalid: {
                              color: "#9e2146",
                            },
                          },
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCardForm(false)}
                      className="mt-2 text-gray-600 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {!showCardForm && paymentMethods.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowCardForm(true)}
                    className="w-full mb-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                  >
                    Add Payment Method
                  </button>
                )}
              </>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Method
                </label>
                <div className="space-y-2">
                  {payoutMethods.length > 0 ? (
                    payoutMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPayoutMethod(method.id)}
                        className={`p-3 border rounded-md cursor-pointer ${
                          selectedPayoutMethod === method.id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          {method.bank_name ? (
                            <FaUniversity className="text-gray-500 mr-2" />
                          ) : (
                            <FaCreditCard className="text-gray-500 mr-2" />
                          )}
                          <div>
                            <p className="font-medium">
                              {method.bank_name || "Card"} ending in{" "}
                              {method.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              {method.currency.toUpperCase()}
                              {method.default_for_currency && " • Default"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No payout methods available
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                isLoading ||
                (activeTab === "withdraw" && !selectedPayoutMethod) ||
                (activeTab === "deposit" && showCardForm && !stripe)
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
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
                <>
                  <FaExchangeAlt />
                  {activeTab === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          {transactionStatus && (
            <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg">
              {transactionStatus}
            </div>
          )}
        </div>
      </div>

      {isMockMode && (
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg">
          <h3 className="font-medium mb-2">Demo Instructions:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Try any amount - no real money is used</li>
            <li>Use test card: 4242 4242 4242 4242</li>
            <li>Any future date for expiry</li>
            <li>Any 3-digit CVC</li>
          </ul>
        </div>
      )}
    </div>
  );
}
