import React from 'react'
import { Link } from 'react-router-dom'
import { TiDelete } from "react-icons/ti"
import { MdEdit } from "react-icons/md"
import { IoIosArrowForward } from "react-icons/io";

function ListingItem({ id, listing, onDelete, onEdit }) {
  
  return (
    <>
      <div className='relative my-5 p-10 mx-auto w-10/12 sm:w-11/12 border border-gray-300 sm:py-7 sm:px-14'>
        <div className='flex justify-between mt-5 md:mt-10 items-center'>
          <h3 className='font-bold text-md md:text-lg lg:text-xl'>{listing.name}</h3>
          <Link to={`/category/${listing.type}/${id}`}>
            <button className='flex font-semibold bg-indigo-500 text-xs md:text-sm hover:bg-indigo-700 text-white p-1 px-2 md:p-2 lg:p-3 rounded-xl h-8 items-center'>
              <span>Go to Page</span>
              <IoIosArrowForward className='text-xl'/>
            </button>
          </Link>
        </div>

        <img className='h-80 object-cover rounded-3xl w-60 sm:w-full mx-auto mt-5' src={listing.imgUrls[0]} alt={listing.name} />

        <div className='mt-5 sm:flex sm:my-5 sm:divide-x-2 lg:divide-x-0 sm:h-20 sm:justify-center lg:justify-evenly'>
          <div className='sm:flex sm:flex-col sm:justify-between sm:w-48 md:max-lg:mr-3'>
            <p className='text-sm font-semibold'>Location:</p>
            <p className='text-sm'>{listing.location}</p>
            <p className='font-bold sm:font-semibold sm:bg-indigo-500 sm:text-sm sm:text-white sm:py-1 sm:px-2 sm:rounded-xl w-36 sm:text-center'>{listing.offer ? listing.discountedPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}$ {listing.type === "rent" && "/ Day"}</p>
          </div>
          
          <div className='sm:pl-5'>
            <p className='sm:max-md:text-sm'><span className='font-semibold'>Model:</span> {listing.model}</p>
            <p className='sm:max-md:text-sm'><span className='font-semibold'>Kilometer:</span> {listing.kilometer.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
            <p className='sm:max-md:text-sm'><span className='font-semibold'>Year:</span> {listing.year}</p>
          </div>
        </div>

        {onDelete && (
          <TiDelete className='absolute top-4 md:top-6 right-5 text-2xl fill-indigo-800 hover:fill-red-600 cursor-pointer' onClick={() => onDelete(id)} />
        )}

        {onEdit && (
          <MdEdit className='absolute top-4 md:top-6 right-14 text-xl lg:text-2xl fill-indigo-800 hover:fill-black cursor-pointer' onClick={() => onEdit(id)} />
        )}

        
      </div>

    </>
  )
}

export default ListingItem