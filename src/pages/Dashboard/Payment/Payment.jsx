import { loadStripe } from "@stripe/stripe-js";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GETWAY_PK)

const Payment = () => {

    return (
        <div>
            <SectionTitle heading="Payment" subHeading="Pay for it"></SectionTitle>
            <div>
                {/* <h2>Money you come to me quickly</h2> */}
                <Elements stripe={stripePromise}>
                <CheckoutForm></CheckoutForm>
                </Elements>
            </div>
        </div>
    );
};

export default Payment;