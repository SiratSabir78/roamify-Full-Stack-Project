import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");

    alert("You have been logged out.");

    navigate("/");
  }, [navigate]);

  return null; 
};

export default Logout;
