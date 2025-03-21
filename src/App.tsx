// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import { PaymentDashboard } from "./components/PaymentDashboard";
// // import { Reauth } from "./components/Reauth"; // Import the Reauth component

// // function App() {
// //   return (
// //     <Router>
// //       <div className="min-h-screen bg-gray-100">
// //         <Routes>
// //           {/* Default route */}
// //           <Route
// //             path="/"
// //             element={
// //               <h1 className="text-center mt-10 text-3xl">Welcome to the App</h1>
// //             }
// //           />
// //           {/* Payment Dashboard route */}
// //           <Route path="/paymentdashboard" element={<PaymentDashboard />} />
// //           {/* Reauth route */}
// //           <Route path="/reauth" element={<Reauth />} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { PaymentDashboard } from "./components/PaymentDashboard";
// import Home from "./components/Home"; // Import the Home component
// import Reauth from "./components/Reauth"; // Import the Reauth component

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100">
//         <Routes>
//           {/* Default route */}
//           <Route path="/" element={<Home />} />
//           {/* Payment Dashboard route */}
//           <Route path="/paymentdashboard" element={<PaymentDashboard />} />
//           {/* Reauth route */}
//           <Route path="/reauth" element={<Reauth />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "../src/components/UserContext"; // Import the UserProvider
import { PaymentDashboard } from "./components/PaymentDashboard";
import Home from "./components/Home"; // Import the Home component
import Reauth from "./components/Reauth"; // Import the Reauth component

function App() {
  return (
    <UserProvider>
      {" "}
      {/* Wrap the entire app with UserProvider */}
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Default route */}
            <Route path="/" element={<Home />} />
            {/* Payment Dashboard route */}
            <Route path="/paymentdashboard" element={<PaymentDashboard />} />
            {/* Reauth route */}
            <Route path="/reauth" element={<Reauth />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
