import React from "react";
import { useNavigate } from "react-router-dom";

function Reauth() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to the home URL
    navigate("/");
  }, [navigate]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl">Reauthenticating...</h1>
    </div>
  );
}

export default Reauth;
