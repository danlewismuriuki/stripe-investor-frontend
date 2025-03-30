// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { UserProvider } from "../src/components/UserContext"; // Import the UserProvider
// import { PaymentDashboard } from "./components/PaymentDashboard";
// import Home from "./components/Home"; // Import the Home component
// import Reauth from "./components/Reauth"; // Import the Reauth component
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(
//   "pk_test_51QyysURwCZkMupwg2slyTLndKhtucw9xupDqdIwRmyikUxEVl8DSTVLALJZAmMumrlKmcUAwM4Wdb3xY8DQl23PQ00bqr2fakf"
// ); // Use your actual Stripe public key

// function App() {
//   return (
//     <Elements stripe={stripePromise}>
//       <UserProvider>
//         <Router>
//           <div className="min-h-screen bg-gray-100">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/paymentdashboard" element={<PaymentDashboard />} />
//               <Route path="/reauth" element={<Reauth />} />
//             </Routes>
//           </div>
//         </Router>
//       </UserProvider>
//     </Elements>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Home from "./components/Home";
import { PaymentDashboard } from "./components/PaymentDashboard";
import Reauth from "./components/Reauth";

// const stripePromise = loadStripe(
//   process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
//     "pk_test_51QyysURwCZkMupwg2slyTLndKhtucw9xupDqdIwRmyikUxEVl8DSTVLALJZAmMumrlKmcUAwM4Wdb3xY8DQl23PQ00bqr2fakf"
// );

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
    "pk_test_51QyysURwCZkMupwg2slyTLndKhtucw9xupDqdIwRmyikUxEVl8DSTVLALJZAmMumrlKmcUAwM4Wdb3xY8DQl23PQ00bqr2fakf"
);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/paymentdashboard" element={<PaymentDashboard />} />
              <Route path="/reauth" element={<Reauth />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </Elements>
  );
}

export default App;
