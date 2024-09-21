import { Route, Routes } from "react-router-dom";
import Header from "./pages/components/header";
import Home from "./pages/home";
import Package from "./pages/packages";
import Register from "./pages/register";
import VerifyAccount from "./pages/verification";
import Profile from "./pages/profile";
import PaymentSuccess from "./pages/paymentSuccess";
import Billing from "./pages/billing";
import ChangePassword from "./pages/changePassword";
import ForgetPassword from "./pages/forgetPassword";
import SetNewPassword from "./pages/setNewPassword";
import GetGoogleUserByToken from "./pages/getGoogleUser";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/package" element={<Package />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resetpassword" element={<ChangePassword />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />

        <Route
          path="/password_reset/:userId/:resetKey"
          element={<SetNewPassword />}
        />

        <Route path="/password_reset" element={<SetNewPassword />} />

        <Route path="/payment/success" element={<PaymentSuccess />} />

        <Route path="/verification" element={<VerifyAccount />} />
        <Route
          path="/verification/:verificationId"
          element={<VerifyAccount />}
        />
        <Route path="/billing" element={<Billing />} />

        <Route path="/google" element={<GetGoogleUserByToken />} />

        <Route path="/google/:accessToken" element={<GetGoogleUserByToken />} />

        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
