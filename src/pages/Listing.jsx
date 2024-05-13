import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { getAuth } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { FaShareAlt } from "react-icons/fa"
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'


function Listing() {
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)
    const [listing, setListing] = useState(null)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            
            const docRef = doc(db, "listings", params.listingId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                setListing(docSnap.data())
                console.log(docSnap.data());
                setLoading(false)
            }

        }

        fetchListing()
    }, [params.listingId])

    if(loading){
      return <Spinner />
    }

  return (
    <main>

      <div className='fixed z-10 top-14 right-14 bg-white p-3 rounded-full cursor-pointer' onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(() => {
          setShareLinkCopied(false)
        }, 2000)
      }}>
        <FaShareAlt className='text-2xl'/>
      </div>

      {shareLinkCopied && <p className='font-semibold text-lg z-10 fixed right-10 top-28'>Link Copied!</p>}

      <div className='container mx-auto my-10'>

        <div style={{height: "600px"}} className='w-full bg-white mb-5'>
          <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className='h-full w-full rounded-3xl'
          >
            {listing.imgUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div style={{background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: "cover"}} className="h-full w-full"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className='mb-3'>
          <h1 className='text-3xl font-bold'>{listing.name} - ${listing.offer ? listing.discountedPrice : listing.regularPrice}</h1>
          <p className='font-semibold mt-1'>{listing.location}</p>
        </div>

        <div className='flex space-x-5'>
          <p className='bg-indigo-500 text-sm text-white px-2 rounded-xl font-semibold'>For {params.categoryName}</p>
          {listing.offer && (
            <p className='bg-black text-sm text-white px-3 rounded-xl font-semibold'>${listing.regularPrice - listing.discountedPrice} discount</p>
          )}
        </div>

        <div className='mt-5'>
          <ul>
            <li><span className='font-semibold'>Model : </span>{listing.model}</li>
            <li><span className='font-semibold'>Year : </span>{listing.year}</li>
            <li><span className='font-semibold'>Kilometer : </span>{listing.kilometer.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} km</li>
          </ul>
        </div>

        <div className='mt-10 h-96 w-full z-10'>
          <MapContainer className='h-full w-full rounded-3xl' center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser.uid !== listing.userRef && (
          <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='flex justify-center items-center mx-auto font-semibold text-xl bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl px-52 py-3 mt-8'>Contact Owner</Link>
        )}
      </div>
    </main>
  )
}

export default Listing