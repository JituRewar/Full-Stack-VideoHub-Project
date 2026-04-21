import { useState } from "react"
import { API } from "../api/axios"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post("/v1/users/login", { email, password })
      setUser(res.data.data)
      navigate("/")
    } catch {
      setError("Invalid credentials. Please check your email and password.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">

        {/* LOGO */}
        <h1 className="text-2xl font-bold text-red-500 text-center">
          VideoHub
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          THE CINEMATIC CANVAS
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm font-semibold">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <label className="font-semibold">Password</label>
              <span className="text-red-500 cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 p-3 rounded-lg bg-gray-100 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button className="w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:scale-105 transition">
            Sign In →
          </button>
        </form>

        {/* DIVIDER */}
        <div className="my-6 text-center text-gray-400 text-sm">
          OR CONTINUE WITH
        </div>

        {/* GOOGLE BUTTON (UI ONLY) */}
        <button className="w-full bg-gray-100 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition">
          <span className="w-4 h-4 bg-black rounded-sm"></span>
          Sign up with Google
        </button>

        {/* SIGNUP LINK */}
        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-red-500 font-semibold">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login