import React from "react";
import DarkModeToggle from "./DarkModeToggle";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Dashboard Budidaya Lele
      </h1>
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
    </header>
  );
}
