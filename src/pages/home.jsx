import { useEffect } from "react";
import { Link } from "react-router-dom";
export default function Home() {
  useEffect(() => {
    window.scrollTo({
      top: 500,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center text-center flex-col text-2xl bg-gradient-to-br from-blue-100 to-purple-100">
      <p className="text-gray-800">EXPLORE WORLD WITH</p>
      <span className="block font-semibold text-yellow-600 text-5xl mt-2">
        INFINITE AIRLINES
      </span>
      <p className="text-lg mt-6 text-gray-800">
        Explore exciting offers below
      </p>
      <Link
        to="/package"
        className="p-3 bg-yellow-400 mt-4 rounded-lg flex text-lg border border-green-600 shadow-lg shadow-green-900 transition duration-300 hover:bg-yellow-500"
      >
        View Packages
      </Link>
    </div>
  );
}
