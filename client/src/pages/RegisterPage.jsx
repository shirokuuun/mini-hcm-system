import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/firebase/authService.js";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    scheduleStart: "09:00",
    scheduleEnd: "18:00",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        schedule: {
          start: form.scheduleStart,
          end: form.scheduleEnd,
        },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-500/40 rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black/70">Create Account</h1>
          <p className="text-gray-400 mt-1">Join the HCM System</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-white text-black/60 border border-gray-500/40 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-700"
              placeholder="Juan dela Cruz"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-white text-black/60 border border-gray-500/40 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-700"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-white text-black/60 border border-gray-500/40 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-700"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-white text-black/60 border border-gray-500/40 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-700"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-1">
                Shift Start
              </label>
              <input
                type="time"
                name="scheduleStart"
                value={form.scheduleStart}
                onChange={handleChange}
                className="w-full bg-white text-black/60 border border-gray-500/40 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-700"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-1">
                Shift End
              </label>
              <input
                type="time"
                name="scheduleEnd"
                value={form.scheduleEnd}
                onChange={handleChange}
                className="w-full bg-white text-black/60 border border-gray-500/40 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-500 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
