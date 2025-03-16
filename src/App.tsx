// import React from 'react';
// import { PaymentDashboard } from './components/PaymentDashboard';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <PaymentDashboard />
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PaymentDashboard } from "./components/PaymentDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={
              <h1 className="text-center mt-10 text-3xl">Welcome to the App</h1>
            }
          />
          {/* Payment Dashboard route */}
          <Route path="/dashboard" element={<PaymentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
