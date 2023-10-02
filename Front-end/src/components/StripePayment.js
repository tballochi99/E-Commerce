import React, {useState} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51NcqJQKF6fvU0I8l4fN0hZVkGjo8RqZ20YrKWDPXyRvPXu5CDx0bJdSXKJZ8GZFlIiu7TpZkKXRJxS6FJYaFRcp100S6lo0MAD');

const CheckoutForm = ({onSuccess}) => {
    const [isLoading, setIsLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!stripe || !elements) {
            setIsLoading(false);
            return;
        }

        const card = elements.getElement(CardElement);
        const result = await stripe.createToken(card);

        if (result.error) {
            console.log(result.error.message);
            setIsLoading(false);
        } else {
            onSuccess && onSuccess();
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stripe-form">
            <CardElement className="CardElement"/>
            <button type="submit" disabled={!stripe || isLoading}>
                {isLoading ? "Chargement..." : "Payer"}
            </button>
        </form>
    );
};


const StripePayment = ({onSuccess}) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm onSuccess={onSuccess}/>
        </Elements>
    );
};

export default StripePayment;
