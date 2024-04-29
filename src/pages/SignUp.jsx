import React from 'react'
import { FaUserAlt, FaSignInAlt, FaAddressCard } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from "../firebase.config"


function SignUp() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  })

  const {email, password, name} = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const auth = getAuth()
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, "users", user.uid), formDataCopy)

      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='my-5 text-3xl font-bold'>You can sign up here!</h1>
      <form onSubmit={onSubmit}>
        <div className='flex justify-around bg-white p-3 rounded-full mb-7'>
          <FaAddressCard className='text-2xl'/>
          <input className='w-11/12 outline-none' id='name' type="text" placeholder='Name' value={name} onChange={onChange}/>
        </div>
        <div className='flex justify-around bg-white p-3 rounded-full mb-7'>
          <FaUserAlt className='text-2xl'/>
          <input className='w-11/12 outline-none' id='email' type="email" placeholder='E-mail' value={email} onChange={onChange}/>
        </div>
        <div className='flex justify-around bg-white p-3 rounded-full mb-7'>
          <FaKey className='text-2xl'/>
          <input className='w-11/12 outline-none' id='password' type="password" placeholder='Password' value={password} onChange={onChange}/>
        </div>
        <div className='text-right'>
          <Link to="/forgot-password" className='font-semibold text-lg text-indigo-500 hover:text-indigo-800'>Forgot Password</Link>
        </div>
        <div className='flex mt-10 gap-12 lg:justify-start md:justify-center'>
          <p className='text-2xl font-semibold cursor-pointer'>Sign Up</p>
          <button className='bg-indigo-500 rounded-full p-2 hover:bg-indigo-700'>
            <FaSignInAlt fill='white' className='text-3xl'/>
          </button>
        </div>
      </form>

      {/* Google Auth */}

      <div className='text-center mt-16'>
          <Link to="/sign-in" className='font-semibold text-lg text-indigo-500 hover:text-indigo-800'>Sign In Instead</Link>
      </div>

    </div>
  )
}

export default SignUp