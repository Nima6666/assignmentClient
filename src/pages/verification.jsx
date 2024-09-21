import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { loginActions } from "../store/slices/userSlice";

export default function VerifyAccount() {
  const { verificationId } = useParams();

  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(false);

  const [timeLeft, setTimeLeft] = useState();

  useEffect(() => {
    if (timeLeft > 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1000); // Decrease by 1 second (1000 ms)
      }, 1000);

      // Clear the interval when the component unmounts or time runs out
      return () => clearInterval(intervalId);
    } else {
      setServerMessage({});
    }
  }, [timeLeft, verificationId, navigate]);

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const [sending, setSending] = useState();

  const [serverMessage, setServerMessage] = useState({});

  const { resolved, user } = useSelector((state) => state.login.loggedInUser);

  useEffect(() => {
    if (!user && resolved) {
      navigate("/");
    }
    if (user && user.verified) {
      toast.success("user already verified");
      navigate("/");
    }
  }, [user, resolved]);

  useEffect(() => {
    async function handleAccountVerification() {
      try {
        console.log("verifying account");
        const response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/users/verify`,
          { verificationId },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          dispatch(loginActions.setLoggedInUser(response.data.user));
          navigate("/package");
        } else {
          toast.error(response.data.message);
          navigate("/verification");
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    }

    if (verificationId) {
      handleAccountVerification();
    }
  }, [verificationId]);

  async function handleResendingActivationLink() {
    try {
      setSending(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/users/resend-key`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("resending verification response ", response.data);

      if (response.data.success) {
        setServerMessage({
          success: true,
          message: response.data.message,
        });
      } else {
        if (response.data.timeRemaining) {
          setTimeLeft(response.data.timeRemaining);
        }
        setServerMessage({
          success: false,
          message: response.data.message,
        });
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      setSending(false);
    } finally {
      setSending(false);
    }
  }

  if (user && !user.verified && !verificationId) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col justify-center items-center text-xl px-4">
        {/* Message Section */}
        <p className="text-center mb-4">
          Please check your email{" "}
          <span className="text-xl font-semibold text-[#122c53]">
            ({user.email})
          </span>{" "}
          for the verification link. Verify your account to perform
          transactions.
        </p>

        {/* Text and Button */}
        <div className="text-center mt-4">
          {Object.keys(serverMessage).length ? (
            <div
              className={`text-xl font-bold ${
                serverMessage.success ? "text-green-800" : "text-red-800"
              }`}
            >
              <p>{serverMessage.message}</p>
              <div className="mt-4 text-2xl font-bold">
                {timeLeft > 0 && formatTime(timeLeft) + " Remaining"}
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Didn't receive the verification link?
              </p>
              <button
                className={`bg-blue-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-700 transition-all duration-300 ${
                  sending && "opacity-70 cursor-wait"
                }`}
                disabled={sending}
                onClick={handleResendingActivationLink}
              >
                {sending ? "Sending.." : "Resend Link"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[70vh] flex justify-center items-center text-3xl font-semibold">
      {user && verificationId && verifying ? (
        <div> Please Wait... Verifying Your Account</div>
      ) : (
        <div>Verification Response</div>
      )}
    </div>
  );
}
