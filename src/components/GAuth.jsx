import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

function GAuth() {

    const navigate = useNavigate()

    const onGoogleAuth = async () => {
        
        try {
            const provider = new GoogleAuthProvider()
            provider.setCustomParameters({
                prompt: "select_account"
            })
            const auth = getAuth()

            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)

            if(!docSnap.exists()){
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate("/")
        } catch (error) {
            toast.error("Could not sign in with Google")
        }
    }

  return (
    <div className='flex justify-center md:mt-8 mt-3'>
        <button onClick={onGoogleAuth} className='bg-white p-3 rounded-full'>
          <FcGoogle className='text-3xl'/>
        </button>
    </div>
  )
}

export default GAuth