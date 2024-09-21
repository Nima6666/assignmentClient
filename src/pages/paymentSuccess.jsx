import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // React Router for extracting query params
import axios from "axios";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const [message, setMessage] = useState();

  console.log(paymentStatus);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/package");
    }

    // verifying payment
    const verifyPayment = async (sessionId, paymentId) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVERAPI
          }/payment/verify-payment/${paymentId}/${sessionId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setPaymentStatus(response.data.success);
        setMessage(response.data.message);
      } catch (error) {
        console.error("Payment verification failed", error);
        setPaymentStatus(false);
      } finally {
        setIsLoading(false);
      }
    };

    const sessionId = searchParams.get("session_id");
    const paymentId = searchParams.get("payment_id");
    if (sessionId) {
      verifyPayment(sessionId, paymentId);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center text-3xl font-semibold">
        Verifying your payment...
      </div>
    );
  }

  if (paymentStatus) {
    toast.success(message);
    navigate("/billing");
  } else {
    toast.error(message);
    navigate("/package");
  }
};

export default PaymentSuccess;
