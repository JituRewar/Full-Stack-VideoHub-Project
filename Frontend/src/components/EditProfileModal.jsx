import { useState } from "react"
import { API } from "../api/axios"

function EditProfileModal({ user, onClose, onUpdate }) {
  const [fullName, setFullName] = useState(user.fullName)
  const [email, setEmail] = useState(user.email)

  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)

  const [avatarPreview, setAvatarPreview] = useState(user.avatar)
  const [coverPreview, setCoverPreview] = useState(user.coverImage)

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

  const handleSave = async () => {
    try {
      // 1. Update text fields
      await API.patch("/v1/users/update-account", {
        fullName,
        email,
      })

      // 2. Update avatar
      if (avatar) {
        const formData = new FormData()
        formData.append("avatar", avatar)

        await API.patch("/v1/users/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      // 3. Update cover image
      if (coverImage) {
        const formData = new FormData()
        formData.append("coverImage", coverImage)

        await API.patch("/v1/users/cover-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      onUpdate()
      onClose()
    } catch (err) {
      console.error(err)
      alert("Update failed")
    }
  }

 return (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center overflow-y-auto pt-11 z-999">
    <div className="bg-white w-225 rounded-2xl overflow-hidden shadow-xl">

      {/*  HEADER */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-sm text-gray-500">
          Customize how you appear on VideoHub
        </p>
      </div>

      {/*  COVER */}
      <div className="relative">
        <img
          src={coverPreview || "https://picsum.photos/1200/300"}
          className="w-full h-40 object-cover"
        />

        <input
          type="file"
          onChange={handleCoverChange}
          className="absolute top-3 right-3 bg-white text-sm px-3 py-1 rounded shadow cursor-pointer"
        />
      </div>

      {/*  PROFILE SECTION */}
      <div className="px-6 pb-6">

        {/* AVATAR */}
        <div className="flex items-center gap-4 -mt-12">
          <div className="relative">
            <img
              src={
                avatarPreview ||
                `https://ui-avatars.com/api/?name=${fullName}`
              }
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
            />

            <input
              type="file"
              onChange={handleAvatarChange}
              className="absolute bottom-0 right-0 text-xs"
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg">{fullName}</h3>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        {/*  FORM GRID */}
        <div className="grid grid-cols-2 gap-6 mt-8">

          {/* LEFT */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-sm font-medium">Bio</p>
              <textarea
                className="w-full mt-2 bg-transparent outline-none text-sm"
                placeholder="Tell something about yourself..."
              />
            </div>

            <div className="bg-gray-100 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Private Profile</p>
                <p className="text-xs text-gray-500">
                  Only followers can see your videos
                </p>
              </div>
              <input type="checkbox" />
            </div>

            <div className="bg-gray-100 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Allow Duets</p>
                <p className="text-xs text-gray-500">
                  Let others remix your content
                </p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            Discard Changes
          </button>

          <button
            onClick={handleSave}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
)
}

export default EditProfileModal