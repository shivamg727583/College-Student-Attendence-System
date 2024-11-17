import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <div className='w-full p-4 shadow-sm flex items-center justify-around'>
        <h1 className='text-2xl font-bold'>ATMS</h1>
        <ul className='flex items-center gap-4'>
            <NavLink to='/login' >
                Admin Login
            </NavLink>
            <NavLink to='/teachers/login' >Teachers Login</NavLink>
        </ul>
    </div>
  )
}

export default Navbar