import Navbar from '../Others/Navbar';
import Dashboard from './Dashboard';
import Sidenav from './Sidenav';
import { Route, Routes } from 'react-router-dom';


function TeacherDashboard() {
  return (
    <div className=''>
      <Navbar />
      <div className='w-full h-screen flex flex-col md:flex-row '>
        <Sidenav />
        <div className='md:w-[80%]  w-full h-full p-10'>
          <Routes>
         <Route path='/' element={<Dashboard />} />


          

            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
// make it reponsive for all devices like laptop,desktop,tablets and diffrent smartphones and iphones .

