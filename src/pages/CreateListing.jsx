import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Spinner from '../components/Spinner'

function CreateListing() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "sale",
    name: "",
    model: "",
    kilometer: "",
    year: "",
    address: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
  })

  const {type, name, model, kilometer, year, address, offer, regularPrice, discountedPrice, images} = formData

  const navigate = useNavigate()
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        setFormData({...formData, userRef:user.uid})
      } else {
        navigate("/sign-in")
      }
    })
  }, [])
  

  const onSubmit = (e) => {
    e.preventDefault()

    console.log(formData);
  }

  const onMutate = (e) => {
    let boolean = null

    if(e.target.value === "true") {
      boolean = true
    }

    if(e.target.value === "false") {
      boolean = false
    }

    if(e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files
      }))
    }

    if(!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
    }
  }

  if(loading) {
    return <Spinner />
  }

  return (
    <>
      <div className='container mx-auto mt-10'>
        <h1 className='text-3xl font-bold mb-10'>Create a Listing</h1>

        <form onSubmit={onSubmit}>
          <label className='font-semibold text-lg'>Sell / Rent</label>
          <div className='flex space-x-4 mt-3'>
            <button type='button' className={type === "sale" ? 'p-3 px-12 bg-indigo-500 text-white rounded-xl' : 'p-3 px-12 bg-white rounded-xl'} id='type' value='sale' onClick={onMutate}>Sell</button>
            <button type='button' className={type === "rent" ? 'p-3 px-12 bg-indigo-500 text-white rounded-xl' : 'p-3 px-12 bg-white rounded-xl'} id='type' value='rent' onClick={onMutate}>Rent</button>
          </div>

          <label className='block font-semibold text-lg mt-3'>Name</label>
          <input className='w-96 py-2 pl-2 rounded-xl mt-3' type="text" id="name" maxLength="32" minLength="10" value={name} onChange={onMutate} required/>
          
          <div className='flex space-x-20'>
            <div>
              <label className='block font-semibold text-lg mt-3'>Kilometer</label>
              <input className='w-24 py-2 rounded-xl mt-3 text-center' type="number" id="kilometer" value={kilometer} max="999" min="0" onChange={onMutate} required />
            </div>
            <div>
              <label className='block font-semibold text-lg mt-3'>Year</label>
              <input className='w-24 py-2 rounded-xl mt-3 text-center' type="number" id="year" value={year} max="2024" min="1950" onChange={onMutate} required />
            </div>
          </div>

          <label className='block font-semibold text-lg mt-3'>Model</label>
          <input className='w-96 py-2 pl-2 rounded-xl mt-3' type="text" id="model" maxLength="32" minLength="2" value={model} onChange={onMutate} required/>

          <label className='block font-semibold text-lg mt-3'>Address</label>
          <textarea className='w-96 py-2 pl-2 rounded-xl mt-3' type="text" id="address" value={address} onChange={onMutate} required/>

          <label className='block font-semibold text-lg mt-3'>Offer</label>
          <div className='flex space-x-4 mt-3'>
            <button type='button' className={offer && offer !== null ? 'p-3 px-12 bg-indigo-500 text-white rounded-xl' : 'p-3 px-12 bg-white rounded-xl'} id='offer' value={true} onClick={onMutate}>Yes</button>
            <button type='button' className={!offer && offer !== null ? 'p-3 px-12 bg-indigo-500 text-white rounded-xl' : 'p-3 px-12 bg-white rounded-xl'} id='offer' value={false} onClick={onMutate}>No</button>
          </div>

          <label className='block font-semibold text-lg mt-3'>Regular Price</label>
          <div className='flex space-x-5'>
            <input className='w-36 py-2 rounded-xl mt-3 text-center' type="number" id="regularPrice" value={regularPrice} max="50000" min="100" onChange={onMutate} required />
            {type === "rent" && <p className='font-semibold text-lg pt-5'>$ / Day</p>}
          </div>

          {offer && (
            <>
              <label className='block font-semibold text-lg mt-3'>Discounted Price</label>
              <input className='w-36 py-2 rounded-xl mt-3 text-center' type="number" id="discountedPrice" value={discountedPrice} max="50000" min="100" onChange={onMutate} required />
            </>
          )}

          <label className='block font-semibold text-lg mt-3'>Images</label>
          <p className='mt-3'>The first image will be the cover (max 6).</p>
          <input className='mt-3 cursor-pointer file:cursor-pointer bg-white p-3 rounded-xl w-11/12 file:bg-indigo-500 file:text-white file:p-2 file:px-8 file:rounded-xl file:border-none file:mr-5 file:font-semibold' type="file" onChange={onMutate} id="images" max="6" accept=".jpg,.png,.jpeg" multiple required  />

          <button className='w-full mx-auto p-3 px-36 bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl text-lg mt-16' type='submit'>Create Listing</button>

        </form>
      </div>
    </>
  )
}

export default CreateListing