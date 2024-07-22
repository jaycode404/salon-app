import React, { useContext } from 'react'
import { GeneralContext } from '../context/GeneralContext'

export default function AdminRoute() {
    const {user, loading } = useContext(GeneralContext)

    if(!loading){
        {user.admin === 1 ? () : ()}

        
    }
  return (
    <div>
      
    </div>
  )
}
