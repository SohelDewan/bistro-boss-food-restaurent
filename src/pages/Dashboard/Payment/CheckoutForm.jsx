import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";

const CheckoutForm = () => {

    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const axiousSecure = useAxiosSecure();
    const { user} = useAuth();
    const [cart] = useCart();
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    useEffect(()=>{
        axiousSecure.post('/create-payment-intent', {price: totalPrice})
        .then(res=> {
            console.log(res.data.clientSecret);
            setClientSecret(res.data.clientSecret);
        })
    },[axiousSecure, totalPrice])
  
    const handleSubmit = async (event) => {
      // Block native form submission.
      event.preventDefault();
 
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }
  
      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const card = elements.getElement(CardElement);
  
      if (card == null) {
        return;
      }
  
      // Use your card Element with other Stripe.js APIs
      const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });
  
      if (error) {
        console.log('[error]', error);
        setError(error.message);
      } else {
        console.log('[PaymentMethod]', paymentMethod);
        setError('');
      }
      // confirm payment
      const {paymentIntent, error:confirmError} = await stripe.confirmCardPayment(clientSecret,{
        payment_method:{
          card: card,
          billing_details:{
            email:user?.email || 'anonymous',
            name:user?.displayName || 'anonymous'
          }
        }
      });
      if(confirmError){
        console.log(confirmError);
      }else{
        console.log(paymentIntent);
        if(paymentIntent.status === 'succeeded'){
          console.log('transaction id:', paymentIntent.id);
          setTransactionId(paymentIntent.id);
          // send the transaction id to the database
          const payment = {
            transactionId: paymentIntent.id,
            email: user.email,
            price: totalPrice,
            date: new Date(), // utc date convert use moment js
            cartIds: cart.map(item=> item._id),
            menuItemIds: cart.map(item=> item.menuId),
            status:'pending',
          }
          const res = axiousSecure.post('/payments', payment);
          console.log('payment saved', res.data);
      }
    }
    }
    return (
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
        <button className="btn bg-[#D1A054] border-0 my-4" type="submit" disabled={!stripe || !clientSecret}>
          Pay
        </button>
        <p className="text-red-700">{error}</p>
        {
          transactionId && (
            <div className="text-green-600">
              <p>Transaction ID: {transactionId}</p>
            </div>
          )
        }
      </form>
    );
}

export default CheckoutForm;