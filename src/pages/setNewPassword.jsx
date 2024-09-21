import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { uiActions } from "../store/slices/uiSlice";

export default function SetNewPassword() {
  const { userId, resetKey } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userId || !resetKey) {
      navigate("/");
    }

    async function resetLinkVerificationHandler() {
      try {
        const formData = {
          userId,
          resetKey,
        };

        const response = await axios.post(
          `${import.meta.env.VITE_SERVERAPI}/users/verifyResetLink`,
          formData
        );
        console.log(response);
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
          setErrorMessage(error.response.data.message);
        } else {
          toast.error(error.message);
          setErrorMessage(error.message);
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    resetLinkVerificationHandler();
  }, []);

  const { submitting } = useSelector((state) => state.ui);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Password do not match");
    }

    try {
      const formData = {
        userId,
        resetKey,
        newPassword,
      };

      dispatch(uiActions.setSubmitting());

      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/users/setNewPassword`,
        formData
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
        dispatch(uiActions.openLoginForm());
      } else {
        toast.error(response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
        setErrorMessage(error.response.data.message);
      } else {
        toast.error(error.message);
        setErrorMessage(error.message);
      }
      setLoading(false);
    } finally {
      setLoading(false);
      dispatch(uiActions.setSubmittingResolved());
    }
  };

  if (loading) {
    return <div className="container mx-auto mt-10">Please Wait...</div>;
  }

  if (errorMessage) {
    return <div className="container mx-auto mt-10">{errorMessage}</div>;
  } else
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div
          className={`bg-white p-8 rounded-lg shadow-md w-full max-w-md ${
            submitting && "cursor-not-allowed"
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Set New Password
          </h2>
          <form
            onSubmit={handleSubmit}
            className={`${submitting && "pointer-events-none"}`}
          >
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="new-password"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="new-password"
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full text-white font-semibold py-2 rounded-md  transition duration-200 ${
                submitting ? "bg-slate-500" : "hover:bg-blue-600 bg-blue-500"
              }`}
              disabled={submitting}
            >
              {submitting ? "Wait..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    );
}
