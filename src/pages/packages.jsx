// import { packages } from "../assets/packages";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { packageActions } from "../store/slices/packageSlice";
import ViewModel from "./components/viewModel";
import { modelActions } from "../store/slices/viewmodelSlice";

export default function Package() {
  const { resolved, packages } = useSelector(
    (state) => state.package.packageInfo
  );

  const { open } = useSelector((state) => state.model);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getPackages() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/packages`
        );
        console.log("response ", response.data);
        if (response.data.success) {
          dispatch(packageActions.setPackages(response.data.packages));
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
      // toast.success("toast working");
    }
    getPackages();
  }, []);

  function modelHandler(pkg) {
    dispatch(modelActions.setModelPackage(pkg));
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {resolved ? (
        packages.length ? (
          packages.map((pkg) => {
            return (
              <div
                key={pkg.service_name}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {pkg.service_name}
                </h2>
                <p className="text-gray-600 mb-4">{pkg.package_details}</p>
                <div className="text-gray-800 font-semibold text-lg">
                  ${pkg.price}
                </div>
                <button
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => modelHandler(pkg)}
                >
                  Book Now
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center w-full">No packages to show</div>
        )
      ) : (
        <div>Getting Packages...</div>
      )}
      {open && <ViewModel />}
    </div>
  );
}
