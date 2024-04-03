import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export default function CheckoutForm({ clientSecret }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [amount, setAmount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log('paymentIntent', paymentIntent);

      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment already succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setAmount(paymentIntent.amount / 100);
          setMessage('Please submit your payment.');
          setHasError(false);
          break;
        default:
          setMessage('Invalid payment intent.');
          setHasError(true);
          break;
      }
    });
  }, [clientSecret, stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasError) {
      router.push('/');
      return;
    }

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const confirm = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    console.log('confirm', confirm);

    const { error } = confirm;
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      setMessage('An unexpected error occurred.');
    } else {
      router.push('/success');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <hr />
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <h5>Payment Amount: ${amount}</h5>
        </div>
        <button
          style={{ maxWidth: '200px' }}
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : hasError ? (
              'Return to Home'
            ) : (
              'Pay now'
            )}
          </span>
        </button>
      </div>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
