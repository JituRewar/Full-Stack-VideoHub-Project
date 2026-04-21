import { useState } from "react"
import { API } from "../api/axios"
import { useNavigate, Link } from "react-router-dom"

function Signup() {
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)

  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)

  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    setAvatar(file)
    if (file) setAvatarPreview(URL.createObjectURL(file))
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    setCoverImage(file)
    if (file) setCoverPreview(URL.createObjectURL(file))
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (password !== confirm) {
      return setError("Passwords do not match")
    }

    if (!avatar || !coverImage) {
      return setError("Avatar and Cover Image are required")
    }

    try {
      const formData = new FormData()
      formData.append("fullName", fullName)
      formData.append("username", username)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("avatar", avatar)
      formData.append("coverImage", coverImage)

      await API.post("/v1/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate("/login")
    } catch (err) {
      console.log(err.response?.data)
      setError(err.response?.data?.message || "Signup failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-red-100 to-blue-100">

      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">

        <h1 className="text-xl font-bold text-center mb-2">
          Join the Hub
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Create your account
        </p>

        <form onSubmit={handleSignup} className="space-y-4">

          {/* FULL NAME */}
          <input
            placeholder="Full Name"
            className="w-full p-3 bg-gray-100 rounded-lg"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          {/* USERNAME */}
          <input
            placeholder="Username"
            className="w-full p-3 bg-gray-100 rounded-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 bg-gray-100 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORDS */}
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-gray-100 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm"
              className="w-full p-3 bg-gray-100 rounded-lg"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {/* AVATAR UPLOAD */}
          <div>
            <label className="text-sm font-semibold">
              Upload Avatar
            </label>

            <input type="file" accept="image/*" onChange={handleAvatarChange} />

            {avatarPreview && (
              <img
                src={avatarPreview}
                className="w-16 h-16 rounded-full mt-2"
              />
            )}
          </div>

          {/* COVER IMAGE UPLOAD */}
          <div>
            <label className="text-sm font-semibold">
              Upload Cover Image
            </label>

            <input type="file" accept="image/*" onChange={handleCoverChange} />

            {coverPreview && (
              <img
                src={coverPreview}
                className="w-full h-24 object-cover mt-2 rounded"
              />
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button className="w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:scale-105 transition">
            Create Account →
          </button>

        </form>

        {/* DIVIDER */}
        <div className="my-6 text-center text-gray-400 text-sm">
          OR CONTINUE WITH
        </div>

        {/* GOOGLE BUTTON UI */}
        <button className="w-full bg-gray-100 py-3 rounded-lg flex items-center justify-center gap-2">
          <span className="w-4 h-4 bg-blue-500 rounded-sm"></span>
          Sign up with Google
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 font-semibold">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Signup