// import React, { useState, useEffect } from "react";
// import { usePayments } from "../hooks/usePayments";
// import { FaWallet, FaArrowRight, FaBan } from "react-icons/fa";
// import { useUser } from "./UserContext";

// interface PaymentMethod {
//   id: string;
//   card: {
//     last4: string;
//     brand: string;
//   };
// }

// export function PaymentDashboard() {
//   const { isLoading, error, initializePayment } = usePayments();
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("USD");
//   const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

//   const user = useUser();
//   const customerId = user?.customerId;
//   const connectedAccountId = user?.connectedAccountId;

//   useEffect(() => {
//     async function fetchConnectedAccount() {
//       if (!user || !user.email) return; // Ensure user is not null before function execution

//       try {
//         const response = await fetch(
//           `https://stripe-investor-wallet.onrender.com/stripe/user-connected-account/${user.email}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch connected account");
//         }
//         const data = await response.json();

//         if (data.connectedAccountId && user.setConnectedAccountId) {
//           user.setConnectedAccountId(data.connectedAccountId);
//         }
//       } catch (error) {
//         console.error("Failed to fetch connected account:", error);
//       }
//     }

//     fetchConnectedAccount();
//   }, [user]); // Keep user as the dependency

//   const handleDeposit = async () => {
//     if (!customerId) {
//       alert("Please log in or provide a valid customer ID.");
//       return;
//     }

//     if (!selectedPaymentMethod) {
//       alert("Please select a payment method.");
//       return;
//     }

//     try {
//       const clientSecret = await initializePayment(
//         Number(amount) * 100,
//         currency,
//         selectedPaymentMethod
//       );
//       console.log("Payment initialized:", clientSecret);
//     } catch (err) {
//       console.error("Deposit failed:", err);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">Payment Dashboard</h1>

//       {error && (
//         <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Deposit Funds Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <FaWallet className="w-6 h-6 mr-2" />
//             <h2 className="text-xl font-semibold">Deposit Funds</h2>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Amount
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <input
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                   placeholder="0.00"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center">
//                   <select
//                     value={currency}
//                     onChange={(e) => setCurrency(e.target.value)}
//                     className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                   >
//                     <option>USD</option>
//                     <option>EUR</option>
//                     <option>GBP</option>
//                     <option>KES</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Methods List */}
//             <div>
//               <h3 className="text-sm font-medium text-gray-700">
//                 Select a payment method:
//               </h3>
//               <div className="space-y-2">
//                 {paymentMethods.length > 0 ? (
//                   paymentMethods.map((pm) => (
//                     <button
//                       key={pm.id}
//                       onClick={() => setSelectedPaymentMethod(pm.id)}
//                       className={`w-full text-left p-2 rounded-md border ${
//                         selectedPaymentMethod === pm.id
//                           ? "bg-blue-100 border-blue-500"
//                           : "border-gray-300"
//                       } hover:bg-gray-100 transition`}
//                     >
//                       **** **** **** {pm.card.last4} ({pm.card.brand})
//                     </button>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-sm">
//                     No saved payment methods found.
//                   </p>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={handleDeposit}
//               disabled={isLoading || !selectedPaymentMethod}
//               className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
//             >
//               {isLoading ? "Processing..." : "Deposit"}
//             </button>
//           </div>
//         </div>

//         {/* Send Payment Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <FaArrowRight className="w-6 h-6 mr-2" />
//             <h2 className="text-xl font-semibold">Send Payment</h2>
//           </div>
//           <button
//             onClick={() => alert("Feature not yet implemented")}
//             disabled={isLoading}
//             className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
//           >
//             {isLoading ? "Processing..." : "Send Payment"}
//           </button>
//         </div>

//         {/* Withdraw Funds Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <FaBan className="w-6 h-6 mr-2" />
//             <h2 className="text-xl font-semibold">Withdraw Funds</h2>
//           </div>
//           <button
//             onClick={() => alert("Feature not yet implemented")}
//             disabled={isLoading}
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//           >
//             {isLoading ? "Processing..." : "Withdraw to Bank"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import {
//   FaWallet,
//   FaArrowRight,
//   FaBan,
//   FaPlus,
//   FaUniversity,
//   FaCreditCard,
// } from "react-icons/fa";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { useUser } from "./UserContext";

// interface PayoutMethod {
//   id: string;
//   object: "bank_account" | "card";
//   bank_name?: string;
//   last4: string;
//   currency: string;
// }

// export function PaymentDashboard() {
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("USD");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("deposit");
//   const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
//   const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
//   const [showCardForm, setShowCardForm] = useState(false);

//   const stripe = useStripe();
//   const elements = useElements();
//   const user = useUser();

//   // Fetch payout methods from connected account
//   useEffect(() => {
//     if (!user?.connectedAccountId) return;

//     const fetchPayoutMethods = async () => {
//       try {
//         const response = await fetch(
//           `/api/payout-methods?accountId=${user.connectedAccountId}`
//         );
//         const data = await response.json();
//         setPayoutMethods(data);
//       } catch (err) {
//         setError("Failed to load payout methods");
//       }
//     };

//     fetchPayoutMethods();
//   }, [user?.connectedAccountId]);

//   const handleDeposit = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/create-payment-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: parseFloat(amount) * 100,
//           currency,
//           customerId: user?.customerId,
//         }),
//       });

//       const { clientSecret } = await response.json();

//       if (!stripe || !elements) throw new Error("Stripe not initialized");

//       const { error: stripeError } = await stripe.confirmCardPayment(
//         clientSecret,
//         {
//           payment_method: {
//             card: elements.getElement(CardElement)!,
//           },
//         }
//       );

//       if (stripeError) throw stripeError;

//       // Update wallet balance
//       await fetch("/api/update-wallet", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user?.id,
//           amount: parseFloat(amount),
//           currency,
//         }),
//       });

//       alert("Deposit successful!");
//       setShowCardForm(false);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleWithdraw = async () => {
//     if (!selectedPayoutMethod) {
//       setError("Please select a payout method");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/create-payout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: parseFloat(amount) * 100,
//           currency,
//           accountId: user?.connectedAccountId,
//           payoutMethodId: selectedPayoutMethod,
//         }),
//       });

//       const data = await response.json();
//       alert(`Withdrawal initiated! Transaction ID: ${data.id}`);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderDepositSection = () => (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Amount
//         </label>
//         <div className="mt-1 relative rounded-md shadow-sm">
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             placeholder="0.00"
//           />
//           <div className="absolute inset-y-0 right-0 flex items-center">
//             <select
//               value={currency}
//               onChange={(e) => setCurrency(e.target.value)}
//               className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             >
//               <option>USD</option>
//               <option>EUR</option>
//               <option>GBP</option>
//               <option>KES</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {showCardForm ? (
//         <>
//           <div className="border rounded-md p-3">
//             <CardElement
//               options={{
//                 style: {
//                   base: {
//                     fontSize: "16px",
//                     color: "#424770",
//                     "::placeholder": {
//                       color: "#aab7c4",
//                     },
//                   },
//                   invalid: {
//                     color: "#9e2146",
//                   },
//                 },
//               }}
//             />
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={handleDeposit}
//               disabled={isLoading || !amount}
//               className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
//             >
//               {isLoading ? "Processing..." : "Confirm Deposit"}
//             </button>
//             <button
//               type="button"
//               onClick={() => setShowCardForm(false)}
//               className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//           </div>
//         </>
//       ) : (
//         <button
//           onClick={() => setShowCardForm(true)}
//           className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//         >
//           Add Card & Deposit
//         </button>
//       )}
//     </div>
//   );

//   const renderWithdrawSection = () => (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Amount
//         </label>
//         <div className="mt-1 relative rounded-md shadow-sm">
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             placeholder="0.00"
//           />
//           <div className="absolute inset-y-0 right-0 flex items-center">
//             <select
//               value={currency}
//               onChange={(e) => setCurrency(e.target.value)}
//               className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             >
//               <option>USD</option>
//               <option>EUR</option>
//               <option>GBP</option>
//               <option>KES</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-sm font-medium text-gray-700">Payout Method</h3>
//         <div className="mt-1 space-y-2">
//           {payoutMethods.length > 0 ? (
//             payoutMethods.map((method) => (
//               <div
//                 key={method.id}
//                 onClick={() => setSelectedPayoutMethod(method.id)}
//                 className={`p-3 border rounded-md cursor-pointer ${
//                   selectedPayoutMethod === method.id
//                     ? "border-indigo-500 bg-indigo-50"
//                     : "border-gray-300"
//                 }`}
//               >
//                 <div className="flex items-center">
//                   {method.object === "bank_account" ? (
//                     <FaUniversity className="text-gray-500 mr-2" />
//                   ) : (
//                     <FaCreditCard className="text-gray-500 mr-2" />
//                   )}
//                   <div>
//                     <p className="font-medium">
//                       {method.object === "bank_account"
//                         ? "Bank Account"
//                         : "Debit Card"}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       ****{method.last4} • {method.currency.toUpperCase()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-sm">
//               No payout methods available. Complete onboarding to add bank
//               accounts.
//             </p>
//           )}
//         </div>
//       </div>

//       <button
//         onClick={handleWithdraw}
//         disabled={isLoading || !selectedPayoutMethod}
//         className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//       >
//         {isLoading ? "Processing..." : "Withdraw Funds"}
//       </button>
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">Payment Dashboard</h1>

//       {error && (
//         <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
//           {error}
//         </div>
//       )}

//       <div className="flex border-b mb-6">
//         <button
//           onClick={() => setActiveTab("deposit")}
//           className={`py-2 px-4 font-medium ${
//             activeTab === "deposit"
//               ? "border-b-2 border-indigo-500 text-indigo-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           Deposit Funds
//         </button>
//         <button
//           onClick={() => setActiveTab("withdraw")}
//           className={`py-2 px-4 font-medium ${
//             activeTab === "withdraw"
//               ? "border-b-2 border-indigo-500 text-indigo-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           Withdraw Funds
//         </button>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <div className="flex items-center mb-4">
//           {activeTab === "deposit" ? (
//             <>
//               <FaWallet className="w-6 h-6 mr-2" />
//               <h2 className="text-xl font-semibold">Deposit Funds</h2>
//             </>
//           ) : (
//             <>
//               <FaBan className="w-6 h-6 mr-2" />
//               <h2 className="text-xl font-semibold">Withdraw Funds</h2>
//             </>
//           )}
//         </div>

//         {activeTab === "deposit"
//           ? renderDepositSection()
//           : renderWithdrawSection()}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  FaWallet,
  FaArrowRight,
  FaBan,
  FaPlus,
  FaUniversity,
  FaCreditCard,
} from "react-icons/fa";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useUser } from "./UserContext";

interface PayoutMethod {
  id: string;
  object: "bank_account" | "card";
  bank_name?: string;
  last4: string;
  currency: string;
}

interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
  };
}

export function PaymentDashboard() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("deposit");
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const user = useUser();

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch connected account if missing
        if (user.email && !user.connectedAccountId) {
          const accountResponse = await fetch(
            `https://stripe-investor-wallet.onrender.com/stripe/user-connected-account/${user.email}`
          );
          const accountData = await accountResponse.json();
          if (accountData.connectedAccountId && user.setConnectedAccountId) {
            user.setConnectedAccountId(accountData.connectedAccountId);
          }
        }

        // Fetch payout methods if connected account exists
        if (user.connectedAccountId) {
          const payoutResponse = await fetch(
            `/api/payout-methods?accountId=${user.connectedAccountId}`
          );
          setPayoutMethods(await payoutResponse.json());
        }

        // Fetch payment methods if customer exists
        if (user.customerId) {
          const pmResponse = await fetch(
            `/api/payment-methods?customerId=${user.customerId}`
          );
          setPaymentMethods(await pmResponse.json());
        }
      } catch (err) {
        setError("Failed to load account data");
      }
    };

    fetchData();
  }, [user]);

  // const handleDeposit = async () => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     let paymentMethodId = selectedPaymentMethod;

  //     // If using new card, create and attach payment method
  //     if (showCardForm) {
  //       if (!stripe || !elements) throw new Error("Stripe not initialized");

  //       const { error: pmError, paymentMethod } =
  //         await stripe.createPaymentMethod({
  //           type: "card",
  //           card: elements.getElement(CardElement)!,
  //         });

  //       if (pmError) throw pmError;
  //       if (!paymentMethod?.id)
  //         throw new Error("Payment method creation failed");

  //       paymentMethodId = paymentMethod.id;

  //       // Attach to customer if exists
  //       if (user?.customerId) {
  //         await fetch("/api/attach-payment-method", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             paymentMethodId,
  //             customerId: user.customerId,
  //           }),
  //         });
  //       }
  //     }

  //     const response = await fetch("/api/create-payment-intent", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         amount: parseFloat(amount) * 100,
  //         currency,
  //         customerId: user?.customerId,
  //         paymentMethodId,
  //       }),
  //     });

  //     const { clientSecret } = await response.json();

  //     // Confirm payment if using new card
  //     if (showCardForm) {
  //       const { error: stripeError } = await stripe.confirmCardPayment(
  //         clientSecret,
  //         {
  //           payment_method: {
  //             card: elements.getElement(CardElement)!,
  //           },
  //         }
  //       );
  //       if (stripeError) throw stripeError;
  //     }

  //     // Update wallet balance and refresh user data
  //     await fetch("/api/update-wallet", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userId: user?.id,
  //         amount: parseFloat(amount),
  //         currency,
  //       }),
  //     });

  //     if (user?.refreshUser) {
  //       await user.refreshUser();
  //     }

  //     alert("Deposit successful!");
  //     setShowCardForm(false);
  //   } catch (err: any) {
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDeposit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let paymentMethodId = selectedPaymentMethod;

      // Ensure Stripe and Elements are initialized before proceeding
      if (!stripe || !elements) {
        throw new Error("Stripe has not been initialized.");
      }

      // If using new card, create and attach payment method
      if (showCardForm) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error("CardElement is not available");

        const { error: pmError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
          });

        if (pmError) throw pmError;
        if (!paymentMethod?.id)
          throw new Error("Payment method creation failed");

        paymentMethodId = paymentMethod.id;

        // Attach to customer if exists
        if (user?.customerId) {
          await fetch("/api/attach-payment-method", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentMethodId,
              customerId: user.customerId,
            }),
          });
        }
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100,
          currency,
          customerId: user?.customerId,
          paymentMethodId,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment if using new card
      if (showCardForm) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error("CardElement is not available");

        const { error: stripeError } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (stripeError) throw stripeError;
      }

      // Update wallet balance and refresh user data
      await fetch("/api/update-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          amount: parseFloat(amount),
          currency,
        }),
      });

      if (user?.refreshUser) {
        await user.refreshUser();
      }

      alert("Deposit successful!");
      setShowCardForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedPayoutMethod) {
      setError("Please select a payout method");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100,
          currency,
          accountId: user?.connectedAccountId,
          payoutMethodId: selectedPayoutMethod,
        }),
      });

      const data = await response.json();

      // Refresh user data after successful withdrawal
      if (user?.refreshUser) {
        await user.refreshUser();
      }

      alert(`Withdrawal initiated! Transaction ID: ${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDepositSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0.00"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>KES</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saved Payment Methods */}
      {!showCardForm && paymentMethods.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Saved Payment Methods
          </h3>
          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                onClick={() => {
                  setSelectedPaymentMethod(pm.id);
                  setShowCardForm(false);
                }}
                className={`w-full text-left p-3 rounded-md border ${
                  selectedPaymentMethod === pm.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300"
                } hover:bg-gray-50 transition`}
              >
                <div className="flex items-center">
                  <FaCreditCard className="text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">
                      {pm.card.brand} ending in {pm.card.last4}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setShowCardForm(true);
              setSelectedPaymentMethod("");
            }}
            className="mt-3 flex items-center text-indigo-600 text-sm"
          >
            <FaPlus className="mr-1" /> Add new payment method
          </button>
        </div>
      )}

      {/* New Card Form */}
      {showCardForm && (
        <>
          <div className="border rounded-md p-3">
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
          <div className="flex space-x-2">
            <button
              onClick={handleDeposit}
              disabled={isLoading || !amount}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Confirm Deposit"}
            </button>
            <button
              type="button"
              onClick={() => setShowCardForm(false)}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Initial Add Payment Method Button */}
      {!showCardForm && paymentMethods.length === 0 && (
        <button
          onClick={() => setShowCardForm(true)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Payment Method
        </button>
      )}
    </div>
  );

  const renderWithdrawSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0.00"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>KES</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700">Payout Method</h3>
        <div className="mt-1 space-y-2">
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
                  {method.object === "bank_account" ? (
                    <FaUniversity className="text-gray-500 mr-2" />
                  ) : (
                    <FaCreditCard className="text-gray-500 mr-2" />
                  )}
                  <div>
                    <p className="font-medium">
                      {method.object === "bank_account"
                        ? "Bank Account"
                        : "Debit Card"}
                    </p>
                    <p className="text-sm text-gray-500">
                      ****{method.last4} • {method.currency.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No payout methods available. Complete onboarding to add bank
              accounts.
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleWithdraw}
        disabled={isLoading || !selectedPayoutMethod}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Withdraw Funds"}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Payment Dashboard</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`py-2 px-4 font-medium ${
            activeTab === "deposit"
              ? "border-b-2 border-indigo-500 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Deposit Funds
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`py-2 px-4 font-medium ${
            activeTab === "withdraw"
              ? "border-b-2 border-indigo-500 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Withdraw Funds
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          {activeTab === "deposit" ? (
            <>
              <FaWallet className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Deposit Funds</h2>
            </>
          ) : (
            <>
              <FaBan className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Withdraw Funds</h2>
            </>
          )}
        </div>

        {activeTab === "deposit"
          ? renderDepositSection()
          : renderWithdrawSection()}
      </div>
    </div>
  );
}
