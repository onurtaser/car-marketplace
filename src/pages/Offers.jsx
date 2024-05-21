import React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import { collection, query, where, orderBy, limit, getDocs, startAfter, getCountFromServer } from "firebase/firestore";
import { db } from '../firebase.config'

function Offers() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
    const [count, setCount] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listingRef = collection(db, "listings")

                const countQuery = query(listingRef,
                    where("offer", "==", true)
                )
                const countDocs = await getCountFromServer(countQuery)
                setCount(countDocs.data().count)

                const q = query(listingRef,
                    where("offer", "==", true),
                    orderBy("timestamp", "desc"),
                    limit(10))

                const querySnapshot = await getDocs(q)

                const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
                setLastFetchedListing(lastVisible)

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
    }, [])

    const onLoadMoreFetchData = async () => {
        try {
            const listingRef = collection(db, "listings")

            const q = query(listingRef,
                where("offer", "==", true),
                orderBy("timestamp", "desc"),
                startAfter(lastFetchedListing),
                limit(5))

            const querySnapshot = await getDocs(q)
            
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
            setLastFetchedListing(lastVisible)

            const listings = []
            querySnapshot.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)
        } catch (error) {
            toast.error("Could not fetch the data!")
        }
    }

  return (
    <div className='my-10'>
        <header>
            <h1 className='text-center mb-10 text-3xl font-bold'>Offers</h1>
        </header>

        {loading ? <Spinner /> : listings && listings.length > 0 ?
        <>
            <main>
                <div className='grid grid-cols-1 mt-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
                    {listings.map((listing) => (
                        <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
                    ))}
                </div>
            </main>
        </>
        : 
        <div className='container mx-auto'><p>There are no current offers</p></div>}

        <div className='flex justify-center mt-5'>
            {lastFetchedListing && listings?.length < count && (
                <button className='font-semibold bg-indigo-500 hover:bg-indigo-700 text-white py-1 px-4 rounded-full' onClick={onLoadMoreFetchData}>Load More</button>
            )}
        </div>
        
    </div>
  )
}

export default Offers