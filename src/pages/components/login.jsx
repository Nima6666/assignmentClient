import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { uiActions } from "../../store/slices/uiSlice";

import { FaGoogle } from "react-icons/fa";

import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import toast from "react-hot-toast";
import { loginActions } from "../../store/slices/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { submitting } = useSelector((state) => state.ui);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // for google reCaptcha
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const recaptchaRef = useRef();

  const resetRecaptcha = () => {
    setRecaptchaValue(null);
    recaptchaRef.current.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (recaptchaValue) {
      console.log("Email:", email, "Password:", password);

      try {
        dispatch(uiActions.setSubmitting());

        const formData = {
          email,
          password,
          recaptchaToken: recaptchaValue,
        };

        const response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/users`,
          formData
        );
        console.log(response);
        if (response.data.success) {
          dispatch(uiActions.openLoginForm());
          localStorage.setItem("token", response.data.user.token);
          toast.success(response.data.message);
          navigate("/");
          dispatch(loginActions.setLoggedInUser(response.data.user));
        } else {
          toast.error(response.data.message);
          resetRecaptcha();
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        resetRecaptcha();
      } finally {
        dispatch(uiActions.setSubmittingResolved());
      }
    } else {
      toast.error("Please complete the reCAPTCHA");
    }
  };

  const googleSignup = async (e) => {
    window.location.href = `${import.meta.env.VITE_SERVERAPI}/googleoauth`;
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <div className="h-screen w-screen fixed top-0 left-0">
      <div className="min-h-screen flex items-center justify-center bg-[#000000a7]">
        <div className={`${submitting && "cursor-not-allowed opacity-65"}`}>
          <div
            className={`bg-white p-8 rounded-lg shadow-lg max-w-md w-[400px] relative ${
              submitting && "pointer-events-none"
            }`}
          >
            <div
              className="absolute right-4 top-2 p-2  rounded-lg text-red-700 cursor-pointer transition-all duration-300 hover:bg-slate-200"
              onClick={() => dispatch(uiActions.closeLoginForm())}
            >
              Close
            </div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              Login
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="my-4">
                <Link
                  to="/forgetpassword"
                  className="text-sm text-red-700 hover:underline"
                  onClick={() => dispatch(uiActions.closeLoginForm())}
                >
                  Forget Password?
                </Link>
              </div>
              <div className="mb-4">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // Replace with your reCAPTCHA site key
                  onChange={handleRecaptchaChange}
                  ref={recaptchaRef}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300"
              >
                {submitting ? "logging" : "Log In"}
              </button>
              <button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300 mt-4 flex justify-center items-center"
                onClick={googleSignup}
              >
                <p>Signup with google</p>
                <div className="ml-4">
                  <FaGoogle size={20} />
                </div>
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-500 hover:underline font-semibold"
                  onClick={() => dispatch(uiActions.closeLoginForm())}
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
