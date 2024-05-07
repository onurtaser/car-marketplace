import React from 'react'
import { Link } from 'react-router-dom'

function Explore() {
  const car1 = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  const car2 = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  return (
    <div className='container mx-auto my-10'>
      <h1 className='text-3xl font-bold'>Explore</h1>

      {/* SLIDER */}

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