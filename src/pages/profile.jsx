import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "../store/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiLock } from "react-icons/fi";

export default function Profile() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { resolved, user } = useSelector((state) => state.login.loggedInUser);

  console.log(resolved, user, " user details");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && resolved) {
      navigate("/");
    }
  }, [resolved, user]);

  if (!resolved) {
    return <div>Please wait</div>;
  }

  const handleChangePassword = () => {
    alert("Change password clicked!");
  };

  if (resolved && user) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] flex-col">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            My Profile
          </h1>

          {user.picture && (
            <div className="flex items-center justify-center">
              <img src={user.picture} alt="" className="rounded-full mb-6" />
            </div>
          )}

          {/* User Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">Name:</span>
              <span className="text-xl font-medium text-gray-900">
                {user.name}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">
                Email:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {user.email}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">
                Verified:
              </span>
              <span className="text-xl font-medium flex items-center">
                {user.verified ? (
                  <FiCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <div className="flex">
                    <span
                      className="text-sm mr-4 text-green-600 underline"
                      onClick={() => navigate("/verification")}
                    >
                      verify
                    </span>
                    <FiXCircle className="text-red-500 mr-2" />
                  </div>
                )}
                {user.verified ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* Change Password Button */}
          <Link
            to="/resetpassword"
            className="flex items-center justify-center w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FiLock className="mr-2" /> Change Password
          </Link>
        </div>
      </div>
    );
  }
}
