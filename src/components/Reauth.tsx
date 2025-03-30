// import React from "react";
// import { useNavigate } from "react-router-dom";

// function Reauth() {
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     // Redirect to the home URL
//     navigate("/");
//   }, [navigate]);

//   return (
//     <div className="text-center mt-10">
//       <h1 className="text-3xl">Reauthenticating...</h1>
//     </div>
//   );
// }

// export default Reauth;

import React from "react";
import { useNavigate } from "react-router-dom";

function Reauth() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">
        Reauthentication Required
      </h1>
      <p className="text-gray-600 mb-6">Please reauthenticate to continue.</p>
      <button
        onClick={() => navigate("/payment")}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Continue to Dashboard
      </button>
    </div>
  );
}

export default Reauth;
