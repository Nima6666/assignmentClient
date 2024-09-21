import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { uiActions } from "../store/slices/uiSlice";

export default function GetGoogleUserByToken() {
  const { accessToken } = useParams();

  const { user } = useSelector((state) => state.login.loggedInUser);

  const navigate = useNavigate();

  const [resolved, setResolved] = useState(false);

  const { submitting } = useSelector((state) => state.ui);

  const [loading, setLoading] = useState(true);

  const [userDetails, setUserDetails] = useState();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!accessToken || user) {
      navigate("/");
    }

    async function getGoogleUser() {
      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(userInfoResponse.data);
        setUserDetails(userInfoResponse.data);
      } catch (error) {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      } finally {
        setResolved(true);
      }
    }
    getGoogleUser();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Password do not match");
    }

    try {
      dispatch(uiActions.setSubmitting());
      const formData = {
        name: `${userDetails.given_name} ${userDetails.family_name}`,
        email: userDetails.email,
        password: newPassword,
        picture: userDetails.picture,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/googleoauth/register`,
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message);

        dispatch(uiActions.openLoginForm());
      } else {
        toast.error(response.data.message);
      }
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      setLoading(false);
    } finally {
      setLoading(false);
      dispatch(uiActions.setSubmittingResolved());
    }
  }

  if (!resolved) {
    return <div>Please Wait ...</div>;
  } else {
    return (
      <>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div
            className={`bg-white p-8 rounded-lg shadow-md w-full max-w-md ${
              submitting && "cursor-not-allowed"
            }`}
          >
            <div className="flex items-center justify-center">
              <img
                src={userDetails.picture}
                alt={userDetails.given_name}
                className="rounded-full"
              />
            </div>
            <p className="text-center">
              Hello {`${userDetails.given_name} ${userDetails.family_name}`}
            </p>
            <h2 className="text-2xl font-bold text-center">Set Password</h2>
            <p className="text-center mb-6">for your account</p>
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
                {submitting ? "Wait..." : "Set Password"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}
