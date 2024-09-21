import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "../store/slices/userSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Billing() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { resolved, payments } = useSelector(
    (state) => state.login.paymentInfo
  );

  useEffect(() => {
    async function getPaymentsHandler() {
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/payment`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data.success) {
          dispatch(loginActions.setPayment(response.data.payments));
        } else {
          dispatch(loginActions.setPaymentResolvedTrueNull());
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    }
    getPaymentsHandler();
  }, []);

  if (!resolved) {
    return <div>wait..</div>;
  }

  return payments.length ? (
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Payment History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Invoice ID
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Customer
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Product
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Quantity
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Total
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Payment Status
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="hover:bg-gray-100 transition-all duration-200"
              >
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  {payment._id.toString()}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  <p>{payment.user_id.name}</p>
                  <p className="text-xs text-gray-600">
                    {payment.user_id.email}
                  </p>
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  <p>{payment.product.service_name}</p>
                  <p className="text-xs text-gray-600">
                    {payment.product.package_details}
                  </p>
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  ${payment.product.price}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  {payment.quantity}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  ${payment.total}
                </td>
                <td className="px-6 py-4 border-b text-sm">
                  {payment.paymentSuccess ? (
                    <span className="text-green-600 font-semibold">
                      Successful
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">Failed</span>
                  )}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  {new Date(payment.created).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div>No Previous transactions found</div>
  );
}
