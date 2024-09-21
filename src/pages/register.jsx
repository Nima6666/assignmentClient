import React, { useEffect, useRef, useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { uiActions } from "../store/slices/uiSlice";
import { toast } from "react-hot-toast";

import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { loginActions } from "../store/slices/userSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { user } = useSelector((state) => state.login.loggedInUser);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const navigate = useNavigate();

  const { submitting } = useSelector((state) => state.ui);

  // for google reCaptcha
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const recaptchaRef = useRef();

  const dispatch = useDispatch();

  const resetRecaptcha = () => {
    setRecaptchaValue(null);
    recaptchaRef.current.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (recaptchaValue) {
      // Validate passwords match
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        resetRecaptcha();
        return;
      }

      const formData = {
        name,
        email,
        password,
        recaptchaToken: recaptchaValue, // Include the reCAPTCHA token
      };

      try {
        dispatch(uiActions.setSubmitting());
        const response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/users/register`,
          formData
        );
        console.log(response.data);
        if (response.data.success) {
          localStorage.setItem("token", response.data.user.token);
          toast.success(response.data.message);
          navigate("/");
          dispatch(loginActions.setLoggedInUser(response.data.user));
        }
      } catch (error) {
        console.log(error);
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      } finally {
        dispatch(uiActions.setSubmittingResolved());
      }

      console.log("Name:", name, "Email:", email, "Password:", password);
    } else {
      console.log("Please complete the reCAPTCHA");
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <div className="h-fit flex items-center justify-center mt-10">
      <div className={`${submitting && "cursor-not-allowed"} `}>
        <div
          className={`bg-white  p-8 rounded-lg shadow-lg max-w-md w-full ${
            submitting && "opacity-60 pointer-events-none"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="w-[400px]">
            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="mb-4 relative">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                <div className="translate-y-4">
                  {passwordVisible ? (
                    <IoEyeOff size={20} />
                  ) : (
                    <IoEye size={20} />
                  )}
                </div>
              </button>
            </div>
            <div className="mb-6 relative">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                <div className="translate-y-4">
                  {confirmPasswordVisible ? (
                    <IoEyeOff size={20} />
                  ) : (
                    <IoEye size={20} />
                  )}
                </div>
              </button>
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
              disabled={submitting}
            >
              {submitting ? "Please Wait.." : "Register"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-blue-500 hover:underline font-semibold"
                onClick={() => dispatch(uiActions.openLoginForm())}
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
