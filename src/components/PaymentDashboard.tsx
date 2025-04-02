// import React, { useState, useEffect } from "react";
// import { useUser } from "./UserContext";
// import {
//   PaymentElement,
//   useStripe,
//   useElements,
//   Elements,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   FaCreditCard,
//   FaExchangeAlt,
//   FaWallet,
//   FaArrowDown,
//   FaArrowUp,
//   FaUniversity,
//   FaPlus,
//   FaTrash,
//   FaCheck,
//   FaSpinner,
// } from "react-icons/fa";

// interface PayoutMethod {
//   id: string;
//   bank_name?: string;
//   last4: string;
//   currency: string;
//   default_for_currency?: boolean;
// }

// interface PaymentMethod {
//   id: string;
//   type: string;
//   card?: {
//     brand: string;
//     last4: string;
//     exp_month: number;
//     exp_year: number;
//   };
//   isDefault?: boolean;
// }

// export function PaymentDashboard() {
//   const { user, isMockMode } = useUser();
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
//   const [authToken, setAuthToken] = useState<string | null>(null);
//   const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
//   const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
//   const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [stripeLoaded, setStripeLoaded] = useState(false);

//   // Initialize Stripe
//   useEffect(() => {
//     const initializeStripe = async () => {
//       try {
//         await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");
//         setStripeLoaded(true);
//       } catch (error) {
//         console.error("Failed to load Stripe", error);
//         setTransactionStatus("Failed to initialize payment system");
//       }
//     };

//     initializeStripe();
//   }, []);

//   // Initialize auth token from URL or localStorage
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const urlToken = params.get("token");
//     const storedToken = localStorage.getItem("stripeAuthToken");

//     const token = urlToken || storedToken;
//     if (token) {
//       setAuthToken(token);
//       if (urlToken) {
//         localStorage.setItem("stripeAuthToken", token);
//         window.history.replaceState({}, "", window.location.pathname);
//       }
//     } else if (!isMockMode) {
//       setTransactionStatus("Please complete onboarding first");
//     }
//   }, [isMockMode]);

//   // Enhanced error handler
//   const getErrorMessage = (error: unknown): string => {
//     if (error instanceof Error) {
//       return error.message;
//     }
//     if (typeof error === "object" && error !== null && "message" in error) {
//       return String(error.message);
//     }
//     return "An unknown error occurred";
//   };

//   // Load payment methods
//   const loadPaymentMethods = async () => {
//     if (!authToken && !isMockMode) return;

//     try {
//       setIsRefreshing(true);
//       if (isMockMode) {
//         setPaymentMethods([
//           {
//             id: "pm_mock_1",
//             type: "card",
//             card: {
//               brand: "visa",
//               last4: "4242",
//               exp_month: 12,
//               exp_year: 2025,
//             },
//             isDefault: true,
//           },
//         ]);
//         return;
//       }

//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/stripe/payment-methods`,
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }
//       const methods = await response.json();
//       setPaymentMethods(methods);
//     } catch (error) {
//       console.error("Payment methods error:", error);
//       setTransactionStatus(getErrorMessage(error));
//       handleAuthError(error);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   // Load payout methods
//   const loadPayoutMethods = async () => {
//     if (!authToken && !isMockMode) return;

//     try {
//       setIsRefreshing(true);
//       if (isMockMode) {
//         setPayoutMethods([
//           {
//             id: "ba_mock_1",
//             bank_name: "Mock Bank",
//             last4: "4242",
//             currency: "usd",
//             default_for_currency: true,
//           },
//         ]);
//         setSelectedPayoutMethod("ba_mock_1");
//         return;
//       }

//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/stripe/payout-methods`,
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }
//       const { methods, defaultMethod } = await response.json();
//       setPayoutMethods(methods);
//       if (defaultMethod) setSelectedPayoutMethod(defaultMethod);
//     } catch (error) {
//       console.error("Payout methods error:", error);
//       setTransactionStatus(getErrorMessage(error));
//       handleAuthError(error);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   // Load all methods when authToken changes
//   useEffect(() => {
//     loadPaymentMethods();
//     loadPayoutMethods();
//   }, [authToken]);

//   const handleAuthError = (error: unknown) => {
//     const errorMessage = getErrorMessage(error);
//     if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
//       localStorage.removeItem("stripeAuthToken");
//       setAuthToken(null);
//       setTransactionStatus("Session expired. Please sign in again.");
//     }
//   };

//   const handleAddNewCard = async () => {
//     if (!authToken && !isMockMode) {
//       setTransactionStatus("Please complete onboarding first");
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       setTransactionStatus(null);

//       if (!stripe) {
//         throw new Error("Payment system not ready");
//       }

//       if (isMockMode) {
//         setClientSecret("mock_client_secret");
//         setShowCardForm(true);
//         return;
//       }

//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/stripe/setup-intent`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }
//       const { clientSecret } = await response.json();

//       if (!clientSecret) {
//         throw new Error("No client secret returned");
//       }

//       setClientSecret(clientSecret);
//       setShowCardForm(true);
//     } catch (error) {
//       console.error("Error creating setup intent:", error);
//       setTransactionStatus(getErrorMessage(error));
//       handleAuthError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handlePayment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setTransactionStatus(null);
//     setIsProcessing(true);

//     // Basic validation
//     if (!amount || Number(amount) <= 0) {
//       setTransactionStatus("Please enter a valid amount");
//       setIsProcessing(false);
//       return;
//     }

//     try {
//       if (activeTab === "deposit") {
//         if (showCardForm) {
//           // Handle new card payment
//           if (!stripe || !elements) {
//             throw new Error("Payment system not ready. Please try again.");
//           }

//           const { error: submitError } = await elements.submit();
//           if (submitError) throw submitError;

//           const { error: stripeError, setupIntent } = await stripe.confirmSetup(
//             {
//               elements,
//               confirmParams: {
//                 return_url: window.location.origin,
//               },
//               redirect: "if_required",
//             }
//           );

//           if (stripeError) throw stripeError;
//           if (!setupIntent?.payment_method) {
//             throw new Error("Payment method setup failed");
//           }

//           // In mock mode, skip API call
//           if (isMockMode) {
//             setTransactionStatus("Mock payment method added successfully!");
//             setShowCardForm(false);
//             setClientSecret(null);
//             await loadPaymentMethods();
//             return;
//           }

//           // Attach the payment method
//           const attachResponse = await fetch(
//             `${import.meta.env.VITE_API_URL}/stripe/attach-payment-method`,
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${authToken}`,
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 paymentMethodId: setupIntent.payment_method,
//               }),
//             }
//           );

//           if (!attachResponse.ok) {
//             throw new Error(await attachResponse.text());
//           }

//           setTransactionStatus("Payment method added successfully!");
//           setShowCardForm(false);
//           setClientSecret(null);
//           await loadPaymentMethods();
//         } else {
//           // Handle payment with saved method
//           if (!selectedPaymentMethod) {
//             throw new Error("Please select a payment method");
//           }

//           if (isMockMode) {
//             setTransactionStatus(
//               `Mock deposit of ${amount} ${currency} completed!`
//             );
//             return;
//           }

//           const response = await fetch(
//             `${import.meta.env.VITE_API_URL}/stripe/fund-wallet`,
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${authToken}`,
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 amount: Number(amount),
//                 paymentMethodId: selectedPaymentMethod,
//                 currency: currency.toLowerCase(),
//               }),
//             }
//           );

//           const data = await response.json();
//           if (!response.ok) {
//             throw new Error(data.message || "Payment failed");
//           }

//           if (data.requiresAction && stripe) {
//             const { error: confirmationError } = await stripe.confirmPayment({
//               clientSecret: data.clientSecret,
//               confirmParams: {
//                 return_url: window.location.origin,
//               },
//             });
//             if (confirmationError) throw confirmationError;
//           }

//           setTransactionStatus(`Deposit of ${amount} ${currency} completed!`);
//           await loadPaymentMethods();
//         }
//       } else {
//         // Handle withdrawal
//         if (!selectedPayoutMethod) {
//           throw new Error("Please select a payout method");
//         }

//         if (isMockMode) {
//           setTransactionStatus(
//             `Mock payout scheduled! Amount: ${amount} ${currency}`
//           );
//           return;
//         }

//         const response = await fetch(
//           `${import.meta.env.VITE_API_URL}/stripe/create-payout`,
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               amount: Number(amount),
//               methodId: selectedPayoutMethod,
//             }),
//           }
//         );

//         const result = await response.json();
//         if (!response.ok) {
//           throw new Error(result.message || "Payout failed");
//         }

//         setTransactionStatus(
//           `Payout scheduled! Funds will arrive by ${new Date(
//             result.arrivalDate
//           ).toLocaleDateString()}`
//         );
//         await loadPayoutMethods();
//       }
//     } catch (err) {
//       const message = getErrorMessage(err);
//       setTransactionStatus(message);
//       console.error("Payment error:", err);
//       handleAuthError(err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleRemovePaymentMethod = async (methodId: string) => {
//     try {
//       setIsProcessing(true);

//       if (isMockMode) {
//         setPaymentMethods(paymentMethods.filter((m) => m.id !== methodId));
//         setTransactionStatus("Mock payment method removed");
//         return;
//       }

//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/stripe/remove-payment-method`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             paymentMethodId: methodId,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }

//       setTransactionStatus("Payment method removed");
//       await loadPaymentMethods();
//     } catch (error) {
//       console.error("Error removing payment method:", error);
//       setTransactionStatus(getErrorMessage(error));
//       handleAuthError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSetDefaultMethod = async (methodId: string) => {
//     try {
//       setIsProcessing(true);

//       if (isMockMode) {
//         setPaymentMethods(
//           paymentMethods.map((m) => ({
//             ...m,
//             isDefault: m.id === methodId,
//           }))
//         );
//         setTransactionStatus("Mock default payment method updated");
//         return;
//       }

//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/stripe/set-default-payment`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             paymentMethodId: methodId,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(await response.text());
//       }

//       setTransactionStatus("Default payment method updated");
//       await loadPaymentMethods();
//     } catch (error) {
//       console.error("Error setting default method:", error);
//       setTransactionStatus(getErrorMessage(error));
//       handleAuthError(error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (!stripeLoaded) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
//         <div className="text-center">
//           <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4 mx-auto" />
//           <p className="text-lg">Loading payment system...</p>
//         </div>
//       </div>
//     );
//   }

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
//             onClick={() => {
//               setActiveTab("deposit");
//               setShowCardForm(false);
//               setClientSecret(null);
//             }}
//             className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${
//               activeTab === "deposit"
//                 ? "text-indigo-600 border-b-2 border-indigo-600"
//                 : "text-gray-500"
//             }`}
//           >
//             <FaArrowDown className="inline" /> Deposit
//           </button>
//           <button
//             onClick={() => {
//               setActiveTab("withdraw");
//               setShowCardForm(false);
//               setClientSecret(null);
//             }}
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
//                           onClick={() => setSelectedPaymentMethod(method.id)}
//                           className={`p-3 border rounded-md cursor-pointer ${
//                             selectedPaymentMethod === method.id
//                               ? "border-indigo-500 bg-indigo-50"
//                               : "border-gray-300"
//                           } ${
//                             method.isDefault ? "ring-1 ring-indigo-300" : ""
//                           }`}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                               <FaCreditCard className="text-gray-500 mr-2" />
//                               <div>
//                                 <p className="font-medium">
//                                   {method.card?.brand} ending in{" "}
//                                   {method.card?.last4}
//                                   {method.isDefault && (
//                                     <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
//                                       Default
//                                     </span>
//                                   )}
//                                 </p>
//                                 {method.card && (
//                                   <p className="text-sm text-gray-500">
//                                     Expires {method.card.exp_month}/
//                                     {method.card.exp_year}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                             <div className="flex gap-2">
//                               {!method.isDefault && (
//                                 <button
//                                   type="button"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleSetDefaultMethod(method.id);
//                                   }}
//                                   className="text-xs text-indigo-600 hover:text-indigo-800"
//                                   title="Set as default"
//                                   disabled={isProcessing}
//                                 >
//                                   <FaCheck />
//                                 </button>
//                               )}
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleRemovePaymentMethod(method.id);
//                                 }}
//                                 className="text-xs text-red-600 hover:text-red-800"
//                                 title="Remove"
//                                 disabled={isProcessing}
//                               >
//                                 <FaTrash />
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <button
//                       type="button"
//                       onClick={handleAddNewCard}
//                       className="mt-3 text-indigo-600 text-sm flex items-center"
//                       disabled={isProcessing || isRefreshing}
//                     >
//                       {isRefreshing ? (
//                         <>
//                           <FaSpinner className="animate-spin mr-1" /> Loading...
//                         </>
//                       ) : (
//                         <>
//                           <FaPlus className="mr-1" /> Add new card
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 )}

//                 {showCardForm && clientSecret && (
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Payment Details
//                     </label>
//                     <div className="p-4 border border-gray-300 rounded-lg">
//                       <Elements stripe={stripe} options={{ clientSecret }}>
//                         <PaymentElement
//                           options={{
//                             layout: "tabs",
//                             fields: {
//                               billingDetails: {
//                                 email: "never",
//                               },
//                             },
//                           }}
//                         />
//                       </Elements>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowCardForm(false);
//                         setClientSecret(null);
//                       }}
//                       className="mt-2 text-gray-600 text-sm"
//                       disabled={isProcessing}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}

//                 {!showCardForm && paymentMethods.length === 0 && (
//                   <button
//                     type="button"
//                     onClick={handleAddNewCard}
//                     className="w-full mb-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
//                     disabled={isProcessing || isRefreshing}
//                   >
//                     {isRefreshing ? (
//                       <span className="flex items-center justify-center">
//                         <FaSpinner className="animate-spin mr-2" /> Loading...
//                       </span>
//                     ) : (
//                       "Add Payment Method"
//                     )}
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
//                               {method.default_for_currency && " • Default"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500 text-sm">
//                       {isRefreshing
//                         ? "Loading..."
//                         : "No payout methods available"}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={
//                 isProcessing ||
//                 isRefreshing ||
//                 (activeTab === "withdraw" && !selectedPayoutMethod) ||
//                 (activeTab === "deposit" && showCardForm && !stripe) ||
//                 (activeTab === "deposit" &&
//                   !showCardForm &&
//                   !selectedPaymentMethod)
//               }
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {isProcessing ? (
//                 <>
//                   <FaSpinner className="animate-spin" />
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

//           {transactionStatus && (
//             <div
//               className={`mt-4 p-3 rounded-lg ${
//                 transactionStatus.includes("Failed") ||
//                 transactionStatus.includes("Error") ||
//                 transactionStatus.includes("Please")
//                   ? "bg-red-50 text-red-600"
//                   : "bg-green-50 text-green-600"
//               }`}
//             >
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
//             <li>
//               For withdrawals, mock bank account is automatically selected
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  FaCreditCard,
  FaExchangeAlt,
  FaWallet,
  FaArrowDown,
  FaArrowUp,
  FaUniversity,
  FaPlus,
  FaTrash,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";

// Move stripePromise outside the component to prevent recreation
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

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
  isDefault?: boolean;
}

export function PaymentDashboard() {
  const { user, isMockMode } = useUser();
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
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        await stripePromise;
        setStripeLoaded(true);
      } catch (error) {
        console.error("Failed to load Stripe", error);
        setTransactionStatus("Failed to initialize payment system");
      }
    };

    initializeStripe();
  }, []);

  // Initialize auth token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const storedToken = localStorage.getItem("stripeAuthToken");

    const token = urlToken || storedToken;
    if (token) {
      setAuthToken(token);
      if (urlToken) {
        localStorage.setItem("stripeAuthToken", token);
        window.history.replaceState({}, "", window.location.pathname);
      }
    } else if (!isMockMode) {
      setTransactionStatus("Please complete onboarding first");
    }
  }, [isMockMode]);

  // Error handler
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null && "message" in error) {
      return String(error.message);
    }
    return "An unknown error occurred";
  };

  // Load payment methods
  const loadPaymentMethods = async () => {
    if (!authToken && !isMockMode) return;

    try {
      setIsRefreshing(true);
      if (isMockMode) {
        setPaymentMethods([
          {
            id: "pm_mock_1",
            type: "card",
            card: {
              brand: "visa",
              last4: "4242",
              exp_month: 12,
              exp_year: 2025,
            },
            isDefault: true,
          },
        ]);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/payment-methods`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!response.ok) throw new Error(await response.text());
      setPaymentMethods(await response.json());
    } catch (error) {
      console.error("Payment methods error:", error);
      setTransactionStatus(getErrorMessage(error));
      handleAuthError(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load payout methods
  const loadPayoutMethods = async () => {
    if (!authToken && !isMockMode) return;

    try {
      setIsRefreshing(true);
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
        setSelectedPayoutMethod("ba_mock_1");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/payout-methods`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!response.ok) throw new Error(await response.text());
      const { methods, defaultMethod } = await response.json();
      setPayoutMethods(methods);
      if (defaultMethod) setSelectedPayoutMethod(defaultMethod);
    } catch (error) {
      console.error("Payout methods error:", error);
      setTransactionStatus(getErrorMessage(error));
      handleAuthError(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load methods when authToken changes
  useEffect(() => {
    loadPaymentMethods();
    loadPayoutMethods();
  }, [authToken]);

  const handleAuthError = (error: unknown) => {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
      localStorage.removeItem("stripeAuthToken");
      setAuthToken(null);
      setTransactionStatus("Session expired. Please sign in again.");
    }
  };

  const handleAddNewCard = async () => {
    if (!authToken && !isMockMode) {
      setTransactionStatus("Please complete onboarding first");
      return;
    }

    try {
      setIsProcessing(true);
      setTransactionStatus(null);

      if (isMockMode) {
        setClientSecret("mock_client_secret");
        setShowCardForm(true);
        setIsPaymentElementReady(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/setup-intent`,
        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!response.ok) throw new Error(await response.text());
      const { clientSecret } = await response.json();
      if (!clientSecret) throw new Error("No client secret returned");

      setClientSecret(clientSecret);
      setShowCardForm(true);
      setIsPaymentElementReady(false);
    } catch (error) {
      console.error("Error creating setup intent:", error);
      setTransactionStatus(getErrorMessage(error));
      handleAuthError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionStatus(null);
    setIsProcessing(true);

    if (!amount || Number(amount) <= 0) {
      setTransactionStatus("Please enter a valid amount");
      setIsProcessing(false);
      return;
    }

    try {
      if (activeTab === "deposit") {
        if (showCardForm) {
          // Explicit check for element readiness
          if (!stripe || !elements || !isPaymentElementReady) {
            throw new Error("Payment form is not ready yet. Please wait.");
          }

          const { error: submitError } = await elements.submit();
          if (submitError) throw submitError;

          const { error: stripeError, setupIntent } = await stripe.confirmSetup(
            {
              elements,
              confirmParams: { return_url: window.location.origin },
              redirect: "if_required",
            }
          );

          if (stripeError) throw stripeError;
          if (!setupIntent?.payment_method) {
            throw new Error("Payment method setup failed");
          }

          if (isMockMode) {
            setTransactionStatus("Mock payment method added successfully!");
            setShowCardForm(false);
            setClientSecret(null);
            await loadPaymentMethods();
            return;
          }

          const attachResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/stripe/attach-payment-method`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentMethodId: setupIntent.payment_method,
              }),
            }
          );

          if (!attachResponse.ok) throw new Error(await attachResponse.text());

          setTransactionStatus("Payment method added successfully!");
          setShowCardForm(false);
          setClientSecret(null);
          await loadPaymentMethods();
        } else {
          if (!selectedPaymentMethod) {
            throw new Error("Please select a payment method");
          }

          if (isMockMode) {
            setTransactionStatus(
              `Mock deposit of ${amount} ${currency} completed!`
            );
            return;
          }

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/stripe/fund-wallet`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: Number(amount),
                paymentMethodId: selectedPaymentMethod,
                currency: currency.toLowerCase(),
              }),
            }
          );

          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Payment failed");

          if (data.requiresAction && stripe) {
            const { error: confirmationError } = await stripe.confirmPayment({
              clientSecret: data.clientSecret,
              confirmParams: { return_url: window.location.origin },
            });
            if (confirmationError) throw confirmationError;
          }

          setTransactionStatus(`Deposit of ${amount} ${currency} completed!`);
          await loadPaymentMethods();
        }
      } else {
        if (!selectedPayoutMethod) {
          throw new Error("Please select a payout method");
        }

        if (isMockMode) {
          setTransactionStatus(
            `Mock payout scheduled! Amount: ${amount} ${currency}`
          );
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/stripe/create-payout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: Number(amount),
              methodId: selectedPayoutMethod,
            }),
          }
        );

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Payout failed");

        setTransactionStatus(
          `Payout scheduled! Funds will arrive by ${new Date(
            result.arrivalDate
          ).toLocaleDateString()}`
        );
        await loadPayoutMethods();
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setTransactionStatus(message);
      console.error("Payment error:", err);
      handleAuthError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePaymentMethod = async (methodId: string) => {
    try {
      setIsProcessing(true);

      if (isMockMode) {
        setPaymentMethods(paymentMethods.filter((m) => m.id !== methodId));
        setTransactionStatus("Mock payment method removed");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/remove-payment-method`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentMethodId: methodId }),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      setTransactionStatus("Payment method removed");
      await loadPaymentMethods();
    } catch (error) {
      console.error("Error removing payment method:", error);
      setTransactionStatus(getErrorMessage(error));
      handleAuthError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetDefaultMethod = async (methodId: string) => {
    try {
      setIsProcessing(true);

      if (isMockMode) {
        setPaymentMethods(
          paymentMethods.map((m) => ({
            ...m,
            isDefault: m.id === methodId,
          }))
        );
        setTransactionStatus("Mock default payment method updated");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/set-default-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentMethodId: methodId }),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      setTransactionStatus("Default payment method updated");
      await loadPaymentMethods();
    } catch (error) {
      console.error("Error setting default method:", error);
      setTransactionStatus(getErrorMessage(error));
      handleAuthError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!stripeLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4 mx-auto" />
          <p className="text-lg">Loading payment system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {isMockMode && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-6 flex items-center">
          <span className="font-medium">Demo Mode:</span>
          <span className="ml-2">Using simulated transactions</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
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

        <div className="flex border-b">
          <button
            onClick={() => {
              setActiveTab("deposit");
              setShowCardForm(false);
              setClientSecret(null);
            }}
            className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${
              activeTab === "deposit"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            <FaArrowDown className="inline" /> Deposit
          </button>
          <button
            onClick={() => {
              setActiveTab("withdraw");
              setShowCardForm(false);
              setClientSecret(null);
            }}
            className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${
              activeTab === "withdraw"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            <FaArrowUp className="inline" /> Withdraw
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handlePayment}>
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
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className={`p-3 border rounded-md cursor-pointer ${
                            selectedPaymentMethod === method.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-300"
                          } ${
                            method.isDefault ? "ring-1 ring-indigo-300" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FaCreditCard className="text-gray-500 mr-2" />
                              <div>
                                <p className="font-medium">
                                  {method.card?.brand} ending in{" "}
                                  {method.card?.last4}
                                  {method.isDefault && (
                                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                </p>
                                {method.card && (
                                  <p className="text-sm text-gray-500">
                                    Expires {method.card.exp_month}/
                                    {method.card.exp_year}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!method.isDefault && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetDefaultMethod(method.id);
                                  }}
                                  className="text-xs text-indigo-600 hover:text-indigo-800"
                                  title="Set as default"
                                  disabled={isProcessing}
                                >
                                  <FaCheck />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemovePaymentMethod(method.id);
                                }}
                                className="text-xs text-red-600 hover:text-red-800"
                                title="Remove"
                                disabled={isProcessing}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNewCard}
                      className="mt-3 text-indigo-600 text-sm flex items-center"
                      disabled={isProcessing || isRefreshing}
                    >
                      {isRefreshing ? (
                        <>
                          <FaSpinner className="animate-spin mr-1" /> Loading...
                        </>
                      ) : (
                        <>
                          <FaPlus className="mr-1" /> Add new card
                        </>
                      )}
                    </button>
                  </div>
                )}

                {showCardForm && clientSecret && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Details
                    </label>
                    <div className="p-4 border border-gray-300 rounded-lg">
                      <Elements
                        stripe={stripePromise}
                        options={{ clientSecret }}
                        key={clientSecret}
                      >
                        <PaymentElement
                          onReady={() => {
                            setIsPaymentElementReady(true);
                            console.log("PaymentElement ready!");
                          }}
                        />
                      </Elements>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCardForm(false);
                        setClientSecret(null);
                        setIsPaymentElementReady(false);
                      }}
                      className="mt-2 text-gray-600 text-sm"
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {!showCardForm && paymentMethods.length === 0 && (
                  <button
                    type="button"
                    onClick={handleAddNewCard}
                    className="w-full mb-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    disabled={isProcessing || isRefreshing}
                  >
                    {isRefreshing ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" /> Loading...
                      </span>
                    ) : (
                      "Add Payment Method"
                    )}
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
                      {isRefreshing
                        ? "Loading..."
                        : "No payout methods available"}
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                isProcessing ||
                isRefreshing ||
                (activeTab === "withdraw" && !selectedPayoutMethod) ||
                (activeTab === "deposit" &&
                  showCardForm &&
                  (!stripe || !isPaymentElementReady)) ||
                (activeTab === "deposit" &&
                  !showCardForm &&
                  !selectedPaymentMethod)
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" />
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

          {transactionStatus && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                transactionStatus.includes("Failed") ||
                transactionStatus.includes("Error") ||
                transactionStatus.includes("Please")
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
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
            <li>
              For withdrawals, mock bank account is automatically selected
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}