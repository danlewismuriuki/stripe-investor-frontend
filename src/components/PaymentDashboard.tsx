// import React, { useState } from "react";
// import {
//   Wallet,
//   SendHorizontal,
//   CreditCard,
//   Check as BankCheck,
// } from "lucide-react";
// import { usePayments } from "../hooks/usePayments";

// export function PaymentDashboard() {
//   const { isLoading, error, initializePayment, createTransfer, requestPayout } =
//     usePayments();
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("USD");

//   // const handleDeposit = async () => {
//   //   try {
//   //     const clientSecret = await initializePayment(Number(amount) * 100, currency);
//   //     // TODO: Initialize Stripe Elements and handle payment
//   //     console.log('Payment initialized:', clientSecret);
//   //   } catch (err) {
//   //     console.error('Deposit failed:', err);
//   //   }
//   // };

//   const handleDeposit = async () => {
//     try {
//       const paymentMethodId = "your-payment-method-id"; // Replace with actual payment method ID
//       const clientSecret = await initializePayment(
//         Number(amount) * 100,
//         currency,
//         paymentMethodId
//       );
//       console.log("Payment initialized:", clientSecret);
//     } catch (err) {
//       console.error("Deposit failed:", err);
//     }
//   };

//   const handleTransfer = async () => {
//     try {
//       await createTransfer({
//         amount: Number(amount) * 100,
//         currency,
//         destinationId: "DESTINATION_ACCOUNT_ID", // This should be dynamic
//       });
//     } catch (err) {
//       console.error("Transfer failed:", err);
//     }
//   };

//   const handlePayout = async () => {
//     try {
//       await requestPayout({
//         amount: Number(amount) * 100,
//         currency,
//         bankAccountId: "BANK_ACCOUNT_ID", // This should be dynamic
//       });
//     } catch (err) {
//       console.error("Payout failed:", err);
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
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <Wallet className="w-6 h-6 mr-2" />
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
//             <button
//               onClick={handleDeposit}
//               disabled={isLoading}
//               className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
//             >
//               {isLoading ? "Processing..." : "Deposit"}
//             </button>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <SendHorizontal className="w-6 h-6 mr-2" />
//             <h2 className="text-xl font-semibold">Send Payment</h2>
//           </div>
//           <button
//             onClick={handleTransfer}
//             disabled={isLoading}
//             className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
//           >
//             {isLoading ? "Processing..." : "Send Payment"}
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <BankCheck className="w-6 h-6 mr-2" />
//             <h2 className="text-xl font-semibold">Withdraw Funds</h2>
//           </div>
//           <button
//             onClick={handlePayout}
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
// import { usePayments } from "../hooks/usePayments";

// export function PaymentDashboard() {
//   const { isLoading, error, initializePayment, createTransfer, requestPayout } =
//     usePayments();
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("USD");
//   const [paymentMethods, setPaymentMethods] = useState([]);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

//   const customerId = "cus_123456789"; // Replace with the actual customer ID

//   // Fetch saved payment methods when the component mounts
//   useEffect(() => {
//     async function fetchPaymentMethods() {
//       try {
//         const res = await fetch(
//           `/api/stripe/saved-payment-methods/${customerId}`
//         );
//         const data = await res.json();
//         setPaymentMethods(data);
//       } catch (error) {
//         console.error("Failed to fetch payment methods:", error);
//       }
//     }
//     fetchPaymentMethods();
//   }, [customerId]);

//   const handleDeposit = async () => {
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

//   const handleTransfer = async () => {
//     try {
//       await createTransfer({
//         amount: Number(amount) * 100,
//         currency,
//         destinationId: "DESTINATION_ACCOUNT_ID", // This should be dynamic
//       });
//     } catch (err) {
//       console.error("Transfer failed:", err);
//     }
//   };

//   const handlePayout = async () => {
//     try {
//       await requestPayout({
//         amount: Number(amount) * 100,
//         currency,
//         bankAccountId: "BANK_ACCOUNT_ID", // This should be dynamic
//       });
//     } catch (err) {
//       console.error("Payout failed:", err);
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
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <Wallet className="w-6 h-6 mr-2" />
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
//             <div>
//               <h3 className="text-sm font-medium text-gray-700">
//                 Select a payment method:
//               </h3>
//               {paymentMethods.map((pm) => (
//                 <button
//                   key={pm.id}
//                   onClick={() => setSelectedPaymentMethod(pm.id)}
//                   className="w-full text-left p-2 hover:bg-gray-100"
//                 >
//                   **** **** **** {pm.card.last4} ({pm.card.brand})
//                 </button>
//               ))}
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

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <SendHorizontal className="w-6 h-6 mr-2" />
//             <h2 className="text-xl font-semibold">Send Payment</h2>
//           </div>
//           <button
//             onClick={handleTransfer}
//             disabled={isLoading}
//             className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
//           >
//             {isLoading ? "Processing..." : "Send Payment"}
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <BankCheck className="w-6 h-6 mr-2" />
//             <h2 className="text-xl font-semibold">Withdraw Funds</h2>
//           </div>
//           <button
//             onClick={handlePayout}
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

import React, { useState, useEffect } from "react";
import { usePayments } from "../hooks/usePayments";
import { FaWallet, FaArrowRight, FaBan } from "react-icons/fa";
import { useUser } from "./UserContext";

interface PaymentMethod {
  id: string;
  card: {
    last4: string;
    brand: string;
  };
}

export function PaymentDashboard() {
  const { isLoading, error, initializePayment, createTransfer, requestPayout } =
    usePayments();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const user = useUser();
  const customerId = user?.customerId; // Dynamically fetch customerId

  // Fetch saved payment methods when the component mounts
  useEffect(() => {
    if (!customerId) return;

    async function fetchPaymentMethods() {
      try {
        const res = await fetch(
          `/api/stripe/saved-payment-methods/${customerId}`
        );
        const data = await res.json();
        setPaymentMethods(data);
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      }
    }
    fetchPaymentMethods();
  }, [customerId]);

  const handleDeposit = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const clientSecret = await initializePayment(
        Number(amount) * 100,
        currency,
        selectedPaymentMethod
      );
      console.log("Payment initialized:", clientSecret);
    } catch (err) {
      console.error("Deposit failed:", err);
    }
  };

  const handleTransfer = async () => {
    try {
      await createTransfer({
        amount: Number(amount) * 100,
        currency,
        destinationId: "DESTINATION_ACCOUNT_ID", // This should be dynamic
      });
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  const handlePayout = async () => {
    try {
      await requestPayout({
        amount: Number(amount) * 100,
        currency,
        bankAccountId: "BANK_ACCOUNT_ID", // This should be dynamic
      });
    } catch (err) {
      console.error("Payout failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Payment Dashboard</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaWallet className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Deposit Funds</h2>
          </div>
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
              <h3 className="text-sm font-medium text-gray-700">
                Select a payment method:
              </h3>
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setSelectedPaymentMethod(pm.id)}
                  className="w-full text-left p-2 hover:bg-gray-100"
                >
                  **** **** **** {pm.card.last4} ({pm.card.brand})
                </button>
              ))}
            </div>
            <button
              onClick={handleDeposit}
              disabled={isLoading || !selectedPaymentMethod}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Deposit"}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaArrowRight className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Send Payment</h2>
          </div>
          <button
            onClick={handleTransfer}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Send Payment"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaBan className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Withdraw Funds</h2>
          </div>
          <button
            onClick={handlePayout}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Withdraw to Bank"}
          </button>
        </div>
      </div>
    </div>
  );
}
