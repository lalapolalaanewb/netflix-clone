import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';
import { login, logout, selectUser } from './features/userSlice';
import db, { auth } from './firebase';
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import LoginScreen from './screens/LoginScreen'
import { updateSub } from './features/subSlice'
import ProtectedRoute from './screens/ProtectedRoute'

function App() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      if(userAuth) {
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email
        }))

        db.collection('customers')
        .doc(userAuth.uid)
        .collection('subscriptions')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(async subscription => {
            dispatch(updateSub({
              role: subscription.data().role,
              current_period_end: subscription.data().current_period_end.seconds,
              current_period_start: subscription.data().current_period_start
            }))
          })
        })
      } else {
        dispatch(logout())
        dispatch(updateSub(null))
      }
    })

    // clean up
    return unsubscribe
  }, [dispatch])

  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
          <Switch>
            <ProtectedRoute exact path="/" component={HomeScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="*" component={() => "404 Page Not Found!"} />
          </Switch>
        )}
      </Router>
    </div>
  );
}

export default App;

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   // const sub = useSelector(selectSub)
//   // const [subscription, setSubscription] = useState(null)
//   const subscription = useSelector(selectSub)

//   // useEffect(() => {
//   //   const checkSub = () => {
//   //     console.log(sub)
//   //     setSubscription(sub)
//   //   }

//   //   return checkSub()
//   // }, [])

//   return (
//     <Route 
//       {...rest} render={
//         props => { console.log(subscription)
//           if(subscription !== null) return <Component {...props} />
//           else return <Redirect to={
//             {
//               pathname: "/profile",
//               state: { from: props.location }
//             }
//           } />
//         }
//       } 
//     />
//   )
// }