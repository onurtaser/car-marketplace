import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAuth, updateProfile, verifyBeforeUpdateEmail } from 'firebase/auth'
import { updateDoc, deleteDoc, doc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from "../firebase.config"
import { toast } from 'react-toastify'
import { FaCar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'

function Profile() {
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState(null)

  const auth = getAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    timestamp: new Date(auth.currentUser.metadata.creationTime)
  })

  const { name, email, timestamp } = formData

  const [changeDetails, setChangeDetails] = useState(false)

  const onLogout = () => {
    auth.signOut()

    navigate("/")
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  const onDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", id))
      const updatedListings = listings.filter((listing) => listing.id !== id)
      setListings(updatedListings)
      toast.success("Successfully deleted listing")
    }
  }

  const onSubmit = async () => {
    try {
      auth.currentUser.displayName !== name &&
        (await updateProfile(auth.currentUser, {
          displayName: name
        }));
 
      auth.currentUser.email !== email &&
        (await verifyBeforeUpdateEmail(auth.currentUser, email));
 
      const useRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(useRef, {
        name,
        email
      });
      
    } catch (error) {
      toast.error("Could not update profile details")
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings")
      const q = query(listingsRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"))

      const querySnapshot = await getDocs(q)

      let listings = []

      querySnapshot.forEach((doc) => {
        return listings.push({
          data: doc.data(),
          id: doc.id
        })
      })

      setLoading(false)
      setListings(listings)
    }

    fetchListings()
  }, [auth.currentUser.uid])

  if(loading){
    return <Spinner />
  }

  return (
    <>
      <div className='w-11/12 md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto'>
        <div className='mt-10 p-10 bg-white rounded-xl'>
          <div className='flex justify-between mb-10'>
            <p className='text-3xl font-bold'>My Profile</p>
            <button onClick={onLogout} className='font-semibold bg-indigo-500 hover:bg-indigo-700 text-white p-3 rounded-full'>Logout</button>
          </div>

          <div className='flex justify-between'>
            <h3 className='font-semibold'>Personal Details</h3>
            <p onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }} 
            className='text-indigo-500 hover:text-indigo-800 cursor-pointer'>
              {!changeDetails ? "Edit" : "Done"}
            </p>
          </div>

          <div className='mt-10'>
            <form>
              <input className='outline-indigo-500 p-2 pl-5 w-full' type="text" id="name" value={name} disabled={!changeDetails} onChange={onChange}/>
              <input className='outline-indigo-500 p-2 pl-5 w-full' type="text" id="email" value={email} disabled={!changeDetails} onChange={onChange}/>
              <div>
                <h3 className='font-semibold my-3'>Creation Time:</h3>
                <input className='outline-indigo-500 w-full bg-white' type="text" value={timestamp} disabled/>
              </div>
            </form>
          </div>
        </div>
      
      
        <div className='mt-5 p-4 bg-white rounded-xl hover:bg-gray-200'>
          <Link to="/create-listing">
            <div className='flex justify-between'>
              <FaCar fill='rgb(63, 81, 181)' className='text-3xl'/>
              <p className='text-lg font-semibold'>Rent or sell your car</p>
              <IoIosArrowForward fill='rgb(63, 81, 181)' className='text-3xl'/>
            </div>
          </Link>
        </div>
      </div>
      
      <div className='w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-4/12 mx-auto'>
        {listings?.length > 0 && !loading && (
          listings.map((listing) => (
            <ListingItem key={listing.id} id={listing.id} listing={listing.data} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)}/>
          ))
        )}
      </div>

    </>
  )
}

export default Profile