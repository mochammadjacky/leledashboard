import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Sorry Bro Kamu Nyasar.</p>
      <a
        href="/"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
