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
  const { isLoading, error, initializePayment } = usePayments();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const user = useUser();
  const customerId = user?.customerId;
  const connectedAccountId = user?.connectedAccountId;

  useEffect(() => {
    async function fetchConnectedAccount() {
      if (!user || !user.email) return; // Ensure user is not null before function execution

      try {
        const response = await fetch(
          `https://stripe-investor-wallet.onrender.com/stripe/user-connected-account/${user.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch connected account");
        }
        const data = await response.json();

        if (data.connectedAccountId && user.setConnectedAccountId) {
          user.setConnectedAccountId(data.connectedAccountId);
        }
      } catch (error) {
        console.error("Failed to fetch connected account:", error);
      }
    }

    fetchConnectedAccount();
  }, [user]); // Keep user as the dependency

  const handleDeposit = async () => {
    if (!customerId) {
      alert("Please log in or provide a valid customer ID.");
      return;
    }

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Payment Dashboard</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit Funds Section */}
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

            {/* Payment Methods List */}
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Select a payment method:
              </h3>
              <div className="space-y-2">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPaymentMethod(pm.id)}
                      className={`w-full text-left p-2 rounded-md border ${
                        selectedPaymentMethod === pm.id
                          ? "bg-blue-100 border-blue-500"
                          : "border-gray-300"
                      } hover:bg-gray-100 transition`}
                    >
                      **** **** **** {pm.card.last4} ({pm.card.brand})
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No saved payment methods found.
                  </p>
                )}
              </div>
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

        {/* Send Payment Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaArrowRight className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Send Payment</h2>
          </div>
          <button
            onClick={() => alert("Feature not yet implemented")}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Send Payment"}
          </button>
        </div>

        {/* Withdraw Funds Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaBan className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Withdraw Funds</h2>
          </div>
          <button
            onClick={() => alert("Feature not yet implemented")}
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
