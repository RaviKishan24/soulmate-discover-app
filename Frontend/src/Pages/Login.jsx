import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);   // ← new
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needVerify, setNeedVerify] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNeedVerify(false);

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, form);
      localStorage.setItem("coyToken", data.token);
      localStorage.setItem("coyUser", JSON.stringify(data.user));
      navigate("/discover");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Login failed. Try again.";
      if (status === 403) {
        setNeedVerify(true);
        setError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-brand-soft">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-brand-purple">
          Welcome back
        </h2>
        <p className="text-sm text-center text-gray-500 mt-1">
          Log in to continue discovering
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-pink"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                placeholder="Your password"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-brand-purple"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {needVerify && (
            <p className="text-xs text-gray-600 bg-yellow-50 rounded-lg px-3 py-2">
              Didn't get the email? Check spam, or register again with a
              different address.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-brand-pink to-brand-purple text-white py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-5">
          New to Coy?{" "}
          <Link to="/register" className="text-brand-purple font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}