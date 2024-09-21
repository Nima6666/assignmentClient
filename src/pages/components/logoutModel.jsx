import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/slices/uiSlice";

export default function LogoutModel() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.login.loggedInUser);

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-[#000000a7] z-40 text-white text-2xl flex justify-center items-center"
      onClick={() => dispatch(uiActions.setLogoutModelFalse())}
    >
      {!user && "Logged Out"}
    </div>
  );
}
