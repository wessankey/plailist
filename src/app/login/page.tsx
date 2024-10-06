"use client";

import { login } from "@/actions/login";

export default function LoginPage() {
  const handleLogin = () => {
    login();
  };

  return (
    <div className="flex justify-center mt-32">
      <button
        onClick={handleLogin}
        className="mt-8 w-72 max-w-[400px] bg-yellow-600 text-white text-xl font-bold p-3 rounded-full hover:scale-101 disabled:bg-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        Login with Spotify
      </button>
    </div>
  );
}
