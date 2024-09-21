import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/slices/uiSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { submitting } = useSelector((state) => state.ui);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(uiActions.setSubmitting());

      const formData = {
        email,
      };

      console.log(formData);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/users/forgetPassword`,
        formData
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setMessage(response.data.message);
      } else {
        toast.error(response.data.message);
        setMessage(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      dispatch(uiActions.setSubmittingResolved());
    }
  };
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {message ? (
          <div className="text-2xl font-semibold text-green-700">{message}</div>
        ) : (
          <div className={`${submitting && "cursor-not-allowed opacity-60"}`}>
            <h2
              className={`text-2xl font-bold text-center mb-6 text-gray-800 ${
                submitting && "pointer-events-none"
              }`}
            >
              Forgot Password
            </h2>
            <form
              onSubmit={handleSubmit}
              className={`${submitting && "pointer-events-none"}`}
            >
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                disabled={submitting}
              >
                {submitting ? "Sending" : "Send Reset Link"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
