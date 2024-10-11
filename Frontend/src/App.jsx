import React from 'react'
import Login from './Pages/Login'
import AdminDashboard from './Components/Admin/Dashboard'
import TeacherDashboard from './Components/Teacher/Dashboard'

function App() {
  return (
    <div>
      <Login />
      <AdminDashboard />
      <TeacherDashboard />
    </div>
  )
}

export default App