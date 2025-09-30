// src/component/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/login"); // redirect to login
  };

  return (
    <div className="flex justify-between items-center mb-6 ml-6">
      {/* Left: App Title */}
      <h1 className="text-3xl font-bold">Investment Tracker</h1>

      {/* Right: Logout Button */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
