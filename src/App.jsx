import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";

import {
  AiOutlinePieChart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLogout,
} from "react-icons/ai";
import { GiPlantSeed } from "react-icons/gi";
import {  FaBolt, FaTools  } from "react-icons/fa";
import { MdOutlineLocalGroceryStore, MdOutlineAttachMoney } from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { BiSolidReport } from "react-icons/bi";


import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StokBibit from "./pages/StokBibit";
import Penjualan from "./pages/Penjualan";
import ModalPage from "./pages/Modal";
import Laporan from "./pages/Laporan";
import NotFound from "./pages/NotFound";
import BiayaPakan from "./pages/BiayaPakan";
import BiayaListrik from "./pages/BiayaListrik";
import BiayaLainLain from "./pages/BiayaLainnya";
import History from './pages/History';
import { GiFishBucket } from "react-icons/gi";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <AiOutlinePieChart size={22} />, path: "/" },
    { name: "Stok Bibit", icon: <GiPlantSeed size={22} />, path: "/stok-bibit" },
    { name: "Penjualan", icon: <MdOutlineLocalGroceryStore size={22} />, path: "/penjualan" },
    { name: "Modal", icon: <MdOutlineAttachMoney size={22} />, path: "/modal" },
    { name: "Biaya Pakan", icon: <GiFishBucket  size={22} />, path: "/biaya/pakan" },
    { name: "Biaya Listrik", icon: <FaBolt size={22} />, path: "/biaya/listrik" },
    { name: "Biaya Lain-lain", icon: <FaTools size={22} />, path: "/biaya/lain-lain" },
    { name: "Laporan", icon: <BiSolidReport size={22} />, path: "/laporan" },
    { name: "History", icon: <RxActivityLog  size={22} />, path: "/history"},
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-indigo-700 text-white z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 shadow-lg" : "-translate-x-full md:translate-x-0 md:shadow-none"
        }`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-600">
          <h1 className="text-xl font-bold tracking-wide select-none">Manajemen Lele</h1>
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <AiOutlineClose size={26} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1" role="menu" aria-label="Main navigation">
          {menuItems.map(({ name, icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={name}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 mx-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-md font-semibold"
                    : "text-indigo-200 hover:bg-indigo-600 hover:text-white"
                }`}
                role="menuitem"
                tabIndex={0}
              >
                {icon}
                <span className="truncate">{name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [userName] = useState("Admin");

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  function handleLogin() {
    setIsLoggedIn(true);
    localStorage.setItem("loggedIn", "true");
  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem("loggedIn");
  }

  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <div className="flex flex-col flex-1 min-h-screen md:pl-64">
            <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-700 dark:text-gray-200 md:hidden focus:outline-none"
                  aria-label="Toggle sidebar"
                  aria-expanded={sidebarOpen}
                >
                  <AiOutlineMenu size={28} />
                </button>

                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 select-none">
                  Welcome, {userName}
                </span>
              </div>

              <div className="flex items-center gap-5">
                <label htmlFor="dark-toggle" className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="dark-toggle"
                    className="sr-only"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative dark:bg-gray-600 shadow-inner">
                    <div
                      className={`dot absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 transition-transform duration-300 ease-in-out ${
                        darkMode ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </div>
                </label>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Logout"
                >
                  <AiOutlineLogout size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </header>

            <main className="flex-grow p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
              <Routes>
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/stok-bibit" element={<StokBibit />} />
                <Route path="/penjualan" element={<Penjualan />} />
                <Route path="/modal" element={<ModalPage />} />
                <Route path="/biaya/pakan" element={<BiayaPakan />} />
                <Route path="/biaya/listrik" element={<BiayaListrik />} />
                <Route path="/biaya/lain-lain" element={<BiayaLainLain />} />
                <Route path="/laporan" element={<Laporan />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      )}
    </Router>
  );
}
