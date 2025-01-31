import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
      <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
      <Link to="/" className="mt-4 bg-blue-500 text-white p-2 rounded">
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;
