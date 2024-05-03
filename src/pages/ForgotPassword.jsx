import React from 'react'
import { useState } from 'react'
import { FaUserAlt, FaSignInAlt } from "react-icons/fa";
import { MdOutlineLockReset } from "react-icons/md";
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState("")

  const onChange = (e) => setEmail(e.target.value)

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      setEmail("")
      toast.success("Password reset link sent!")
    } catch (error) {
      toast.error("Could not send the link!")
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='my-5 text-3xl font-bold'>Reset Password</h1>

      <form onSubmit={onSubmit}>
        <div className='flex justify-around bg-white p-3 rounded-full mb-7'>
          <FaUserAlt className='text-2xl'/>
          <input className='w-11/12 outline-none' id='email' type="email" placeholder='E-mail' value={email} onChange={onChange}/>
        </div>

        <div className='text-right'>
          <Link to="/sign-in" className='font-semibold text-lg text-indigo-500 hover:text-indigo-800'>Sign In</Link>
        </div>

        <div className='flex mt-10 gap-12 lg:justify-start justify-center'>
          <p className='text-2xl font-semibold cursor-pointer'>Send Reset Link</p>

          <button className='bg-indigo-500 rounded-full p-2 hover:bg-indigo-700'>
            <MdOutlineLockReset fill='white' className='text-3xl'/>
          </button>
        </div>
        
      </form>

    </div>
  )
}

export default ForgotPassword