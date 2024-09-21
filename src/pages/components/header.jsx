import { Link, useNavigate } from "react-router-dom";
import logoImg from "/air-plane.png";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/slices/uiSlice";
import Login from "./login";
import { useEffect } from "react";

import axios from "axios";
import { loginActions } from "../../store/slices/userSlice";
import toast from "react-hot-toast";
import LogoutModel from "./logoutModel";

export default function Header() {
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { loginForm, submitting, logoutModel } = useSelector(
    (state) => state.ui
  );

  const { resolved, user } = useSelector((state) => state.login.loggedInUser);

  console.log(" user ", user);

  useEffect(() => {
    async function getUserByToken(token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/users/getUserByToken`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.success) {
          dispatch(loginActions.setLoggedInUser(response.data.user));
        } else {
          dispatch(loginActions.setUserResolvedTrue());
        }
      } catch (error) {
        console.error(error);
        if (error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        localStorage.removeItem("token");
        dispatch(loginActions.setUserResolvedTrue());
      }
    }
    if (token) {
      getUserByToken(token);
    } else {
      dispatch(loginActions.setUserResolvedTrue());
    }
  }, []);

  function logoutHandler() {
    localStorage.removeItem("token");
    navigate("/");
    dispatch(loginActions.setUserResolvedTrue());
    dispatch(uiActions.closeLoginForm());
    dispatch(uiActions.setLogoutModelFalse());
  }

  return (
    <header
      className={`h-[100px] bg-slate-500 z-50 w-full ${
        submitting && "cursor-wait"
      }`}
    >
      <div
        className={`container mx-auto flex justify-between items-center px-4 md:px-8 lg:px-16 ${
          submitting && "pointer-events-none"
        }`}
      >
        {/* Logo and Title Section */}
        <div className="h-[90px] flex items-center space-x-3">
          <img src={logoImg} className="h-full w-auto p-4" alt="INFINITY AIR" />
          <div className="text-white text-2xl md:text-3xl font-bold leading-tight">
            <div>INFINITY</div>
            <div>AIRLINES</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="font-semibold text-white text-lg md:text-xl hover:text-yellow-300 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/package"
            className="font-semibold text-white text-lg md:text-xl hover:text-yellow-300 transition-colors duration-200"
          >
            Packages
          </Link>

          {/* Conditional Rendering for User/Login/Logout */}
          {resolved ? (
            user ? (
              <div className="relative">
                <div className="relative">
                  <div
                    className="h-10 w-10 bg-blue-900 text-2xl font-semibold text-white rounded-full flex justify-center items-center cursor-pointer ml-4"
                    onClick={() => dispatch(uiActions.setLogoutModelTrue())}
                  >
                    {user.picture ? (
                      <img
                        src={user.picture}
                        className="rounded-full"
                        alt={user.name.slice(0, 1)}
                      />
                    ) : (
                      user.name.slice(0, 1)
                    )}
                  </div>

                  {/* Dropdown for Logout and Profile */}
                  {logoutModel && (
                    <div className="absolute bg-white text-black p-2 rounded-lg shadow-lg border top-[110%] right-0 w-40 z-50">
                      <Link
                        to="/billing"
                        onClick={() =>
                          dispatch(uiActions.setLogoutModelFalse())
                        }
                        className="block bg-blue-600 text-white font-semibold text-center px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 ease-in-out"
                      >
                        Billing
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() =>
                          dispatch(uiActions.setLogoutModelFalse())
                        }
                        className="block mt-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 p-2 rounded-lg transition-all duration-200"
                      >
                        Profile
                      </Link>

                      <button
                        className="w-full text-left text-red-600 hover:bg-red-100 hover:text-red-800 p-2 rounded-lg transition-all duration-200"
                        onClick={logoutHandler}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to={window.location.pathname === "/signup" && "/"}
                className="font-semibold text-lg md:text-xl text-white p-2 bg-yellow-300 rounded-lg hover:bg-yellow-400 transition-all duration-200"
                onClick={() => dispatch(uiActions.openLoginForm())}
              >
                Login
              </Link>
            )
          ) : (
            <div className="h-10 w-10 bg-blue-900 text-2xl font-semibold text-white rounded-full flex justify-center items-center cursor-pointer ml-4">
              ...
            </div>
          )}
        </div>
      </div>

      {loginForm && !user && <Login />}
      {logoutModel && <LogoutModel />}
    </header>
  );

  // return (
  //   <header
  //     className={`h-[100px] bg-slate-500 z-50 ${submitting && "cursor-wait"}`}
  //   >
  //     <div
  //       className={`container mx-auto flex justify-between items-center ${
  //         submitting && "pointer-events-none"
  //       }`}
  //     >
  //       <div className="h-[90px] flex justify-center items-center">
  //         <img src={logoImg} className="h-full w-auto p-4" alt="INFINITY AIR" />
  //         <div className="text-white text-2xl font-bold">
  //           <div>INFINITY</div>
  //           <div>AIRLINES</div>
  //         </div>
  //       </div>
  //       <div className="flex justify-center items-center">
  //         <Link to="/" className="font-semibold text-white mx-2 text-xl">
  //           Home
  //         </Link>

  //         {resolved ? (
  //           user ? (
  //             <div
  //               className="h-10 w-10 bg-blue-900 text-2xl font-semibold text-white rounded-full flex justify-center items-center cursor-pointer ml-4 z-50 relative"
  //               onClick={() => dispatch(uiActions.setLogoutModelTrue())}
  //             >
  //               {user.name.slice(0, 1)}
  //               {logoutModel && (
  //                 <div className="text-lg absolute bg-white p-2 rounded-lg border border-yellow-400 top-[110%]">
  //                   <button
  //                     className="text-black hover:bg-red-400 p-2 duration-200 transition-all rounded-lg w-full"
  //                     onClick={logoutHandler}
  //                   >
  //                     Logout
  //                   </button>
  //                   <Link
  //                     to="/profile"
  //                     className="text-black hover:bg-slate-400 p-2 duration-200 transition-all rounded-lg mt-2 w-full"
  //                   >
  //                     Profile
  //                   </Link>
  //                 </div>
  //               )}
  //             </div>
  //           ) : (
  //             <Link
  //               to={window.location.pathname === "/signup" && "/"}
  //               className="font-semibold text-login mx-2 text-xl p-2 bg-yellow-300 rounded-lg hover:cursor-pointer"
  //               onClick={() => dispatch(uiActions.openLoginForm())}
  //             >
  //               Login
  //             </Link>
  //           )
  //         ) : (
  //           <div className="h-10 w-10 bg-blue-900 text-2xl font-semibold text-white rounded-full flex justify-center items-center cursor-pointer ml-4">
  //             ...
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //     {loginForm && !user && <Login />}
  //     {logoutModel && <LogoutModel />}
  //   </header>
  // );
}
