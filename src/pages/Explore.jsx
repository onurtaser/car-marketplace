import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit} from "firebase/firestore"
import { db } from '../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import Spinner from '../components/Spinner'

function Explore() {
  const car1 = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  const car2 = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchListing = async () => {
      const listingsRef = collection(db, "listings")
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5))

      const querySnapshot = await getDocs(q)

      let listings = []

      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
    }
    
    fetchListing()
    
  }, [])

  if(loading) {
    return <Spinner />
  }

  return (
    <div className='w-11/12 md:w-4/5 lg:w-3/5 mx-auto my-10'>
      <h1 className='text-3xl font-bold mb-10'>Explore</h1>

      <h2 className='text-xl font-bold mb-5'>Recommended</h2>
      <div style={{height: "600px"}} className='w-full bg-white mb-5'>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className='h-full w-full rounded-3xl'
          >
            {listings.map(({ data, id }) => (
              <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)} className='cursor-pointer'>
                <div style={{background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: "cover"}} className="h-full w-full relative"></div>
                <p className='absolute top-56 bg-neutral-900 bg-opacity-85 p-2 text-white text-3xl md:text-5xl rounded-md'>
                  {data.name}</p>
                <p className='absolute top-72 left-3 md:left-5 md:mt-3 bg-white font-semibold p-1 px-4 text-lg rounded-full'>
                  ${data.offer ? data.discountedPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : data.regularPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} {data.type === "rent" && "/ Day"}</p>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>      

      <div>
        <h2 className='font-semibold mt-10 mb-5'>Categories</h2>
        <div className='flex gap-16'>
          <div className='w-1/2 flex-auto'>
            <Link to='/category/rent'>
              <img className='w-full h-80 object-cover rounded-3xl' src={car1} alt="car1" />
              <p className='mt-2 font-medium'>Cars for rent</p>
            </Link>
          </div>
          <div className='w-1/2 flex-auto'>
            <Link to='/category/sale'>
              <img className='w-full h-80 object-cover rounded-3xl' src={car2} alt="car2" />
              <p className='mt-2 font-medium'>Cars for sale</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore