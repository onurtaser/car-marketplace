import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MdOutlineExplore, MdOutlineLocalOffer } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathMatchRoute = (route) => {
    if(route === location.pathname){
      return true
    }
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 p-5 bg-white' style={{zIndex: 1000}}>
      <div className='container mx-auto'>
        <div className='flex justify-around'>
          <div className='flex flex-col items-center cursor-pointer' onClick={() => navigate("/")}>
            <MdOutlineExplore fill={pathMatchRoute("/") ? "#2c2c2c" : "#8f8f8f"} className='text-4xl' />
            <p className='text-xl font-semibold' style={pathMatchRoute("/") ? {color: "#2c2c2c"} : {color: "#8f8f8f"}}>Explore</p>
          </div>
          <div className='flex flex-col items-center cursor-pointer' onClick={() => navigate("/offers")}>
            <MdOutlineLocalOffer fill={pathMatchRoute("/offers") ? "#2c2c2c" : "#8f8f8f"} className='text-4xl'/>
            <p className='text-xl font-semibold' style={pathMatchRoute("/offers") ? {color: "#2c2c2c"} : {color: "#8f8f8f"}} >Offers</p>
          </div>
          <div className='flex flex-col items-center cursor-pointer' onClick={() => navigate("/profile")}>
            <FaRegUser fill={pathMatchRoute("/profile") ? "#2c2c2c" : "#8f8f8f"} className='text-4xl'/>
            <p className='text-xl font-semibold' style={pathMatchRoute("/profile") ? {color: "#2c2c2c"} : {color: "#8f8f8f"}}>Profile</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar