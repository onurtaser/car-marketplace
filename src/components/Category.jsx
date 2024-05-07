import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from './Spinner'
import ListingItem from './ListingItem'
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from '../firebase.config'

function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listingRef = collection(db, "listings")

                const q = query(listingRef,
                    where("type", "==", params.categoryName),
                    orderBy("timestamp", "desc"),
                    limit(10))

                const querySnapshot = await getDocs(q)

                const listings = []
                querySnapshot.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error("Could not fetch the data!")
            }
        }

        fetchData()
    }, [params.categoryName])

    const onDelete = () => {
        
    }

  return (
    <div className='my-10'>
        <header>
            <h1 className="text-center mb-10 text-3xl font-extrabold text-gray-900"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Cars for</span> {params.categoryName}</h1>
        </header>

        {loading ? <Spinner /> : listings && listings.length > 0 ?
        <>
            <main>
                <div className='grid lg:w-4/5 mx-auto gap-8 md:grid-cols-2 sm:w-11/12 sm:grid-cols-1'>
                    {listings.map((listing) => (
                        <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
                    ))}
                </div>
            </main>
        </>
        : <div className='container mx-auto'><p>No listings for {params.categoryName}</p></div>}
        
    </div>
  )
}

export default Category