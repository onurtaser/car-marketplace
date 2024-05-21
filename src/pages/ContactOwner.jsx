import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { getDoc, doc } from 'firebase/firestore'
import Spinner from '../components/Spinner'

function ContactOwner() {
  const [carOwner, setCarOwner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {

    const getCarOwner = async () => {
      setLoading(true)
      const docRef = doc(db, "users", params.ownerId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()) {
        setLoading(false)
        setCarOwner(docSnap.data())
      } else {
        toast.error("Could not find the user")
        navigate("/")
      }
    }

    getCarOwner()
  }, [params.ownerId, navigate])

  const onChange = e => setMessage(e.target.value)

  if(loading){
    return <Spinner />
  }

  return (
    <div className='w-11/12 md:w-4/5 lg:w-3/5 mx-auto my-10'>
      <h1 className='font-bold text-3xl'>Contact Owner</h1>
      <p className='font-semibold text-lg mt-10'>Contact {carOwner?.name}</p>

      <form className='flex flex-col mt-10'>
        <label htmlFor='message' className='mb-5'>Message</label>
        <textarea name="message" id="message" value={message} onChange={onChange} className='h-[300px] rounded-xl py-2 px-5 outline-none'></textarea>

        <a href={`mailto:${carOwner?.email}?Subject=${searchParams.get("listingName")}&body=${message}`} className='flex justify-center font-semibold text-xl bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl py-2 mt-8'>
          Send Message
        </a>
      </form>
    </div>
  )
}

export default ContactOwner