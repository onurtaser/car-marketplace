import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { db } from "../firebase.config"
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function CreateListing() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "sale",
    name: "",
    model: "",
    kilometer: "",
    year: "",
    address: "",
    offer: false,
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
    // eslint-disable-next-line
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if(images.length > 6){
      setLoading(false)
      toast.error("Max 6 images")
      return
    }

    if(discountedPrice >= regularPrice){
      setLoading(false)
      toast.error("Discounted price needs to be less than regular price")
      return
    }

    // let geolocation = {}
    // let location

    // const response = await fetch(`https://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_API_KEY}&query=${address}`)

    // const data = await response.json()

    // geolocation.lat = data.data[0]?.latitude
    // geolocation.lng = data.data[0]?.longitude
    
    // if(data.data.length === 0){
    //   setLoading(false)
    //   toast.error("Please enter correct address")
    //   return
    // } else {
    //   // eslint-disable-next-line
    //   location = data.data[0]?.label
    // }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        
        const storageRef = ref(storage, "images/" + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on('state_changed', 
          (snapshot) => {
            // eslint-disable-next-line
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          }, 
          (error) => {
            reject(error)
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        )
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false)
      toast.error("Images not uploaded. Try to upload images less than 2MB!")
      return
    })

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp()
    }

    formDataCopy.location = address
    delete formDataCopy.images
    delete formDataCopy.address
    !formDataCopy.offer && delete formDataCopy.discountedPrice
    
    const docRef = await addDoc(collection(db, "listings"), formDataCopy)
    setLoading(false)
    toast.success("Listing saved")
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
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
      <div className='w-11/12 md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto mt-10'>
        <h1 className='text-3xl font-bold mb-10'>Create a Listing</h1>

        <form onSubmit={onSubmit}>
          <label className='font-semibold text-lg'>Sell / Rent</label>
          <div className='flex space-x-4 mt-3'>
            <button type='button' className={type === "sale" ? 'p-3 px-12 bg-indigo-500 text-white rounded-xl' : 'p-3 px-12 bg-white rounded-xl'} id='type' value='sale' onClick={onMutate}>Sell</button>
            <button type='button' className={type === "rent" ? 'p-3 px-12 bg-indigo-500 text-white rounded-xl' : 'p-3 px-12 bg-white rounded-xl'} id='type' value='rent' onClick={onMutate}>Rent</button>
          </div>

          <label className='block font-semibold text-lg mt-3'>Name</label>
          <input className='w-80 sm:w-96 py-2 pl-2 rounded-xl mt-3' type="text" id="name" maxLength="32" minLength="3" value={name} onChange={onMutate} required/>
          
          <div className='flex space-x-20'>
            <div>
              <label className='block font-semibold text-lg mt-3'>Kilometer</label>
              <input className='w-24 py-2 rounded-xl mt-3 text-center' type="number" id="kilometer" value={kilometer} max="999999" min="0" onChange={onMutate} required />
            </div>
            <div>
              <label className='block font-semibold text-lg mt-3'>Year</label>
              <input className='w-24 py-2 rounded-xl mt-3 text-center' type="number" id="year" value={year} max="2024" min="1950" onChange={onMutate} required />
            </div>
          </div>

          <label className='block font-semibold text-lg mt-3'>Model</label>
          <input className='w-80 sm:w-96 py-2 pl-2 rounded-xl mt-3' type="text" id="model" maxLength="32" minLength="2" value={model} onChange={onMutate} required/>

          <label className='block font-semibold text-lg mt-3'>Address</label>
          <textarea className='w-80 sm:w-96 py-2 pl-2 rounded-xl mt-3' type="text" id="address" value={address} onChange={onMutate} required/>

          <label className='block font-semibold text-lg mt-3'>Offer</label>
          <div className='flex space-x-4 mt-3'>
            <button type='button' className={offer && offer !== null ? 'p-3 px-12 bg-indigo-500 text-white rounded-xl' : 'p-3 px-12 bg-white rounded-xl'} id='offer' value={true} onClick={onMutate}>Yes</button>
            <button type='button' className={!offer && offer !== null ? 'p-3 px-12 bg-indigo-500 text-white rounded-xl' : 'p-3 px-12 bg-white rounded-xl'} id='offer' value={false} onClick={onMutate}>No</button>
          </div>

          <label className='block font-semibold text-lg mt-3'>Regular Price</label>
          <div className='flex space-x-5'>
            <input className='w-36 py-2 rounded-xl mt-3 text-center' type="number" id="regularPrice" value={regularPrice} max="999999999" min="100" onChange={onMutate} required />
            {type === "rent" && <p className='font-semibold text-lg pt-5'>$ / Day</p>}
          </div>

          {offer && (
            <>
              <label className='block font-semibold text-lg mt-3'>Discounted Price</label>
              <input className='w-36 py-2 rounded-xl mt-3 text-center' type="number" id="discountedPrice" value={discountedPrice} max="999999999" min="100" onChange={onMutate} required />
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