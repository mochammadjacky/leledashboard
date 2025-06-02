import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBoxes,
  FaDollarSign,
  FaShoppingCart,
  FaFileAlt,
  FaBolt,
  FaTools,
} from "react-icons/fa";


export default function Sidebar() {
  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/modal", label: "Modal", icon: <FaDollarSign /> },
    { to: "/stok-bibit", label: "Stok Bibit", icon: <FaBoxes /> },
    { to: "/penjualan", label: "Penjualan", icon: <FaShoppingCart /> },
    { to: "/biaya/pakan", label: "Biaya Pakan"},
    { to: "/biaya/listrik", label: "Biaya Listrik", icon: <FaBolt /> },
    { to: "/biaya/lain-lain", label: "Biaya Lain-lain", icon: <FaTools /> },
    { to: "/laporan", label: "Laporan", icon: <FaFileAlt /> },
    { to: "/history", label: "Histroy", icon: <FaFileAlt /> },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 dark:from-gray-900 dark:to-gray-800 shadow-lg flex flex-col min-h-screen">
      <nav className="flex flex-col flex-1">
        {menuItems.map((item) => (
          <NavLink
            to={item.to}
            key={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 transition-all duration-200 rounded-md mx-3 my-1 ${
                isActive
                  ? "bg-indigo-300 text-indigo-900 dark:bg-indigo-500 dark:text-white font-semibold shadow-md"
                  : "text-indigo-100 hover:bg-indigo-500 dark:hover:bg-indigo-700 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-base">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
