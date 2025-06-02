import React, { useState } from "react";
import supabase from "../utils/supabaseClient";
import backgroundImage from "../img/background.jpg"; // import gambar background lokal

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setAlert({ type: "success", message: "Login berhasil!" });
      onLogin();
    }
  }

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-cover bg-center overflow-hidden m-0 p-0"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-90 p-8 rounded shadow-md w-96 backdrop-blur-sm"
      ><h3 className="mb-3 text-center text-gray-900 dark:text-gray-100">
          Selamat Datang
        </h3>
        <h2 className="text-2xl  text-center font-bold mb-6 text-centertext-gray-900 dark:text-gray-100">
          Silahkan Login
        </h2>
        {alert && (
          <div
            className={`mb-4 p-2 rounded ${
              alert.type === "error"
                ? "bg-red-300 text-red-900"
                : "bg-green-300 text-green-900"
            }`}
          >
            {alert.message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-600 dark:text-indigo-400"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? "Sembunyikan" : "Tampilkan"}
          </button>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="rememberMe"
            className="mr-2 rounded border-gray-300 focus:ring-indigo-400"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label
            htmlFor="rememberMe"
            className="text-gray-700 dark:text-gray-300 select-none"
          >
            Ingat Saya
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
