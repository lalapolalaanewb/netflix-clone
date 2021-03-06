import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import db from '../firebase'
import { loadStripe } from '@stripe/stripe-js'
import './PlansScreen.css'
import { selectSub} from '../features/subSlice'

function PlansScreen() {
  const user = useSelector(selectUser)
  const subscription = useSelector(selectSub)
  const [products, setProducts] = useState([])

  useEffect(() => {
    db.collection('products')
    .where('active', '==', true)
    .get()
    .then(querySnapshot => {
      const products = {}

      querySnapshot.forEach(async productDoc => {
        products[productDoc.id] = productDoc.data()
        
        const priceSnap = await productDoc.ref.collection('prices').get()
        
        priceSnap.docs.forEach(price => {
          products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data
          } 
        })
      })

      setProducts(products)
    })
  }, []); console.log(products)

  const loadCheckout = async priceId => {
    const docRef = await db.collection('customers')
    .doc(user.uid)
    .collection('checkout_sessions')
    .add({
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin
    })

    docRef.onSnapshot(async snap => {
      const { error, sessionId } = snap.data()

      if(error) {
        // Show an error to your costomer and
        // inspect your Cloud Function logs in the Firebase console
        alert(`An error occured: ${error.message}`)
      }

      if(sessionId) {
        // We have a session, let's redirect to Checkout
        // Init Stripe
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_TEST_PUBLISHED_KEY)

        stripe.redirectToCheckout({ sessionId })
      }
    })
  }

  return (
    <div className="plansScreen">
      {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}

      {Object.entries(products).map(([productId, productData]) => {
        // add some logic if the user's sub is active
        const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role)

        return (
          <div key={productId} className={`${isCurrentPackage && 'plansScreen__plan--disabled'} plansScreen__plan`}>
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default PlansScreen
