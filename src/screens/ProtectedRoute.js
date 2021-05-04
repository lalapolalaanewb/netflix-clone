import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router'
import { selectSub } from '../features/subSlice'

function ProtectedRoute({ component: Component, ...rest }) {
  // const sub = useSelector(selectSub)
  // const [subscription, setSubscription] = useState(null)
  const subscription = useSelector(selectSub)

  // useEffect(() => {
  //   const checkSub = () => {
  //     console.log(sub)
  //     setSubscription(sub)
  //   }

  //   return checkSub()
  // }, [])

  return (
    <Route 
      {...rest} render={
        props => { console.log(subscription)
          if(subscription !== null) return <Component {...props} />
          else return <Redirect to={
            {
              pathname: "/profile",
              state: { from: props.location }
            }
          } />
        }
      } 
    />
  )
}

export default ProtectedRoute
