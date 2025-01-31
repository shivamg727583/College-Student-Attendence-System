import React from 'react';
import AppRouter from './Components/Routing/AppRouter';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Navbar from './Components/Others/Navbar';
function App() {
  return (
    <div>
       <ToastContainer
          position="bottom-right"
          autoClose={3000} // Auto close after 3 seconds
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // Change to "dark" if needed
        />
        <Navbar />
      <AppRouter />
    </div>
  );
}

export default App;
