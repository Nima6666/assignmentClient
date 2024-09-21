import { useDispatch, useSelector } from "react-redux";
import { modelActions } from "../../store/slices/viewmodelSlice";
import { FaPerson } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { uiActions } from "../../store/slices/uiSlice";
import axios from "axios";
import { useState } from "react";

export default function ViewModel() {
  const { modelDetails } = useSelector((state) => state.model);

  const token = localStorage.getItem("token");

  const { user } = useSelector((state) => state.login.loggedInUser);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  async function handlePayment() {
    if (!user) {
      toast("Please Login", {
        icon: "🔒",
      });
      dispatch(modelActions.resetModel());
      dispatch(uiActions.openLoginForm());
      return;
    } else if (user && !user.verified) {
      dispatch(modelActions.resetModel());

      navigate("/verification");
      return;
    }
    setLoading(true);
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

    const productInfo = modelDetails;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/payment/create-stripe-session`,
        productInfo,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("stripe session response ", response.data);
      if (response.data.success) {
        const checkout = await stripe.redirectToCheckout({
          sessionId: response.data.id,
        });
        setLoading(false);
        console.log("checkout? ", checkout);
        if (checkout.error) {
          console.error(checkout.error);
          toast.error(checkout.error);
        }
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      setLoading(false);
    }
  }

  console.log(modelDetails);

  return (
    <div className="h-screen w-screen fixed top-0 left-0">
      <div className="flex justify-center items-center min-h-screen bg-[#000000a7]">
        <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {modelDetails.packageDetails.service_name}
            </h2>
            <p className="text-gray-600 mt-2">
              {modelDetails.packageDetails.package_details}
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-gray-700 text-sm">Price per unit:</p>
            <p className="text-2xl font-bold text-gray-800">
              ${modelDetails.packageDetails.price}
            </p>
            <div className="mt-4 flex items-center">
              <label
                htmlFor="quantity"
                className="text-gray-700 text-sm mr-4 flex justify-center items-center"
              >
                Person <FaPerson size={22} />:
              </label>

              <button
                className="bg-gray-200 text-gray-800 border border-gray-300 rounded-l px-3 py-1 transition hover:bg-gray-300"
                onClick={() => {
                  dispatch(modelActions.decrementPackage());
                }}
                disabled={loading}
              >
                -
              </button>

              <input
                id="quantity"
                type="number"
                value={modelDetails.quantity}
                min="1"
                className="border border-gray-300 rounded text-center w-[40px] py-1"
                readOnly
              />

              <button
                className="bg-gray-200 text-gray-800 border border-gray-300 rounded-r px-3 py-1 transition hover:bg-gray-300"
                onClick={() => {
                  dispatch(modelActions.incrementPackage());
                }}
                disabled={loading}
              >
                +
              </button>
            </div>
            <p className="text-gray-700 text-sm mt-4">Total Price:</p>
            <p className="text-2xl font-bold text-gray-800">
              ${modelDetails.total}
            </p>
          </div>
          <div className="px-6 py-4">
            <button
              className={`${
                loading
                  ? "bg-slate-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }   text-white py-2 px-4 rounded duration-200 transition-all`}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Initiating Payment" : "Book Now"}
            </button>
            {!loading && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 ml-2 rounded"
                onClick={() => dispatch(modelActions.resetModel())}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
