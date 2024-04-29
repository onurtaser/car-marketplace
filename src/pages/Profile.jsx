import React from 'react'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'

function Profile() {
  const [user, setUser] = useState(null)

  const auth = getAuth()

  useEffect(() => {
    setUser(auth.currentUser);
  }, [])

  return (
    <div className='container mx-auto py-10 text-3xl font-bold'>
      {user ? <h1>{user.displayName}</h1> : <h1>Logged out</h1> }
    </div>
  )
}

export default Profile