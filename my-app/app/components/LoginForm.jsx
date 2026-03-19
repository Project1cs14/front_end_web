"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import SocialLoginButtons from "./SocialLoginButtons";
const BASE_URL = "https://back-end-sawu.onrender.com";

// Attend X millisecondes
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ Login avec retry automatique (3 tentatives, 4s entre chaque)
async function loginUser({ email, password }, onRetry) {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
     const res = await fetch(`${BASE_URL}/auth/web/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");

      // Le serveur répond avec du HTML → pas encore prêt
      if (!contentType || !contentType.includes("application/json")) {
        if (attempt < MAX_RETRIES) {
          onRetry(attempt);
          await wait(4000);
          continue;
        }
        throw new Error(
          "Le serveur ne répond pas. Veuillez réessayer dans quelques instants."
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      return data;

    } catch (err) {
      // Erreur réseau (pas de réponse du tout)
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        if (attempt < MAX_RETRIES) {
          onRetry(attempt);
          await wait(4000);
          continue;
        }
        throw new Error("Impossible de contacter le serveur. Vérifiez votre connexion.");
      }
      throw err; // autres erreurs (401, 400...) → propagées directement
    }
  }
}

// Ping silencieux au chargement pour réveiller Render
async function pingBackend() {
  try {
  await fetch(`${BASE_URL}/auth/web/login`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  } catch {
    // silencieux
  }
}

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryMsg, setRetryMsg] = useState("");

  useEffect(() => {
    pingBackend();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const redirectByRole = (role) => {
    switch (role) {
      case "admin":
        router.push("/admin/Dashboard");
        break;
      case "maire":
        router.push("/maire/Dashboard");
        break;
      default:
        router.push("/admin/Dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setRetryMsg("");

    try {
      const data = await loginUser(
        { email: form.email, password: form.password },
        (attempt) => {
          setRetryMsg(`Serveur en démarrage… tentative ${attempt}/3`);
        }
      );

      setRetryMsg("");
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("accessToken", data.accessToken);
      storage.setItem("refreshToken", data.refreshToken);
      storage.setItem("user", JSON.stringify(data.user));

      redirectByRole(data.user?.role);
    } catch (err) {
      setRetryMsg("");
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-[20%] flex flex-col justify-center min-h-[560px] shadow-sm px-2 py-10">
      <div className="w-[80%] mx-auto flex flex-col gap-5">
        <h2 className="text-3xl font-bold text-[#0d1b6e] text-center mb-2">
          Log In
        </h2>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <InputField
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#0d1b6e] cursor-pointer"
              />
              Remember me
            </label>
            <a
              href="/ForgotPassword"
              className="text-sm text-[#0d1b6e] underline hover:opacity-70 transition-opacity"
            >
              Forgot password
            </a>
          </div>

          {/* Message pendant le retry */}
          {retryMsg && (
            <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg py-2.5 text-center">
              ⏳ {retryMsg}
            </div>
          )}

          {/* Erreur finale */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg py-2.5 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#0d1b6e] text-white font-bold text-base rounded-xl hover:bg-[#1a2d8f] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-1"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              "Login"
            )}
          </button>

          <SocialLoginButtons />
        </form>
      </div>
    </div>
  );
}