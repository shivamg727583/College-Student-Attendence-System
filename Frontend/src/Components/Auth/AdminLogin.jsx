import React from 'react'
import { useForm } from 'react-hook-form'

function AdminLogin() {
  const {register,handleSubmit,reset}  = useForm();

  const adminSubmit = (data)=>{
    console.log(data)
  }
  return (
    <div className='max-w-2xl mt-10 mx-auto p-10 shadow-md'>
      <h1 className='text-center font-bold text-3xl'>Login</h1>
      <form className='p-5 rounded-xl flex flex-col' onSubmit={handleSubmit(adminSubmit)}>
        <input type="email" placeholder='Enter email' {...register('email')}  className='p-3 rounded outline-none shadow border mt-3' required/>
        <input type="password" placeholder='Enter password' {...register('password')} className='p-3 rounded outline-none shadow border mt-3' required />
        <input type="submit" value="Login" className='p-3 bg-blue-400 rounded-xl font-semibold hover:bg-blue-600 text-white mt-4' />
      </form>
      <p className='text-center capitalize'>if you are teacher . then <Link to='/teachers/login' className='text-blue-500 font-medium'>Login</Link> here</p>

    </div>
  )
}

export default AdminLogin