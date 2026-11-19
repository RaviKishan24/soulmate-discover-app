import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail =
    location.state?.email || sessionStorage.getItem("pendingVerifyEmail") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [checking, setChecking] = useState(true);  
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    let cancelled = false;
    if (!initialEmail) {
      navigate("/register", { replace: true });
      return;
    }

    axios
      .get(`${API}/auth/verify-status`, { params: { email: initialEmail } })
      .then((res) => {
        if (cancelled) return;
        if (!res.data.exists) {
          sessionStorage.removeItem("pendingVerifyEmail");
          navigate("/register", { replace: true });
          return;
        }
        if (res.data.emailVerified) {
          sessionStorage.removeItem("pendingVerifyEmail");
          navigate("/login", { replace: true });
          return;
        }
        setChecking(false);   
      })
      .catch(() => {
     
        if (!cancelled) setChecking(false);
      });

    return () => { cancelled = true; };
  }, [initialEmail, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !otp) {
      setError("Email and OTP are required.");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/verify-email`, { email, otp });
      setSuccess(data.message || "Email verified!");
      sessionStorage.removeItem("pendingVerifyEmail");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setSuccess("");
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setResending(true);
    try {
      const { data } = await axios.post(`${API}/auth/resend-otp`, { email });
      setSuccess(data.message || "A new OTP has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP.");
    } finally {
      setResending(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-soft">
        <p className="text-gray-600">Checking your verification status…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-soft">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-brand-purple">
          Verify your email
        </h2>
        <p className="text-sm text-center text-gray-500 mt-1">
          Enter the 6-digit code we sent to your inbox
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-pink"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">OTP</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-pink"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-brand-pink to-brand-purple text-white py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="w-full text-sm text-brand-purple font-semibold hover:underline disabled:opacity-60"
          >
            {resending ? "Resending…" : "Didn't get the code? Resend"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-5">
          Wrong email?{" "}
          <Link to="/register" className="text-brand-purple font-semibold">
            Register again
          </Link>
        </p>
      </div>
    </div>
  );
}