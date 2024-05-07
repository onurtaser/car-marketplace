import React from 'react'
import { Link } from 'react-router-dom'
import { IoSpeedometerOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

function ListingItem({ id, listing, onDelete }) {
  
  return (
    <>
      <Link to={`/category/${listing.type}/${id}`}>
        <div className='flex gap-8 items-center justify-center'>
          <img className='flex-1 h-80 object-cover rounded-3xl w-80' src={listing.imgUrls[0]} alt={listing.name} />
          <div className='flex-1'>
            <p className='text-sm'><span className='font-semibold'>Location:</span> {listing.location}</p>
            <h3 className='font-bold text-center text-xl mb-5'>{listing.name}</h3>
            <p className='text-indigo-500 font-bold'>{listing.offer ? listing.discountedPrice : listing.regularPrice}$ {listing.type === "rent" && "/ Day"}</p>
            <p className='mt-3'><span className='font-semibold'>Model:</span> {listing.model}</p>
            <div className='flex mt-3'>
              <IoSpeedometerOutline className='text-3xl mr-2'/>
              <p>Kilometer: {listing.kilometer}</p>
            </div>
            <div className='flex mt-3'>
              <CiCalendar className='text-3xl mr-2'/>
              <p>Year: {listing.year}</p>
            </div>
          </div>
        </div>
      </Link>

      {onDelete && (
        <MdDeleteForever fill='indigo' onClick={() => onDelete(listing.id, listing.name)} />
      )}
    </>
  )
}

export default ListingItem