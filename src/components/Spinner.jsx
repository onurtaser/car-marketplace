import React from 'react'
import spinner from "./assets/spinner.gif"

function Spinner() {
  return (
    <div className='flex h-screen justify-center items-center'>
        <img width={90} src={spinner} alt="Loading..." />
    </div>
  )
}

export default Spinner