import { useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";

function UploadVideo() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FILE HANDLERS =================
  const handleVideoChange = (file) => {
    setVideoFile(file);
  };

  const handleThumbnailChange = (file) => {
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // ================= UPLOAD =================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !videoFile || !thumbnail) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      await API.post("/v1/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Video uploaded successfully 🚀");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex gap-6">

      {/* LEFT SIDEBAR SPACE (optional if you already have Sidebar) */}
      <div className="hidden md:block w-56"></div>

      {/* MAIN */}
      <div className="flex-1">

        {/* HEADER */}
        <h1 className="text-3xl font-bold">Upload Content</h1>
        <p className="text-gray-500 mb-6">
          Ready to share your vision with the world?
        </p>

        <form onSubmit={handleUpload} className="flex gap-6">

          {/* LEFT SECTION */}
          <div className="flex-1 space-y-6">

            {/* DRAG & DROP BOX */}
            <div className="border-2 border-dashed border-red-300 bg-white rounded-2xl p-10 text-center shadow-sm">

              <p className="text-red-500 text-lg font-semibold mb-2">
                upload_file
              </p>

              <p className="text-gray-700 font-semibold">
                Select files to upload
              </p>

              <p className="text-gray-400 text-sm mb-4">
                Drag & drop video files or click below
              </p>

              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoChange(e.target.files[0])}
                className="hidden"
                id="videoUpload"
              />

              <label
                htmlFor="videoUpload"
                className="bg-red-500 text-white px-5 py-2 rounded-full cursor-pointer hover:scale-105 transition"
              >
                Browse Files
              </label>

              {videoFile && (
                <p className="text-sm mt-3 text-gray-600">
                  Selected: {videoFile.name}
                </p>
              )}
            </div>

            {/* TITLE */}
            <div>
              <label className="text-sm font-semibold">Video Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a name..."
                className="w-full mt-1 p-3 rounded-xl bg-white border"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-semibold">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write something about your video..."
                className="w-full mt-1 p-3 rounded-xl bg-white border h-28"
              />
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="w-[320px] space-y-6">

            {/* THUMBNAIL */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-sm font-semibold mb-2">
                Thumbnail Preview
              </h2>

              <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center overflow-hidden">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-400 text-sm">No preview</p>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleThumbnailChange(e.target.files[0])}
                className="mt-3"
              />
            </div>

            {/* VISIBILITY */}
            <div className="bg-white p-4 rounded-xl shadow">
              <label className="text-sm font-semibold">Visibility</label>
              <select className="w-full mt-2 p-2 border rounded">
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>

            {/* CATEGORY */}
            <div className="bg-white p-4 rounded-xl shadow">
              <label className="text-sm font-semibold">Category</label>
              <select className="w-full mt-2 p-2 border rounded">
                <option>Education</option>
                <option>Entertainment</option>
              </select>
            </div>

            {/* BUTTONS */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                {loading ? "Publishing..." : "Publish Now"}
              </button>

              <button
                type="button"
                className="w-full bg-gray-300 py-3 rounded-xl"
              >
                Save as Draft
              </button>
            </div>

            {/* TIP */}
            <div className="bg-teal-100 p-4 rounded-xl">
              <p className="text-sm font-semibold">💡 Pro Tip</p>
              <p className="text-xs text-gray-600 mt-1">
                High-quality thumbnails increase clicks by up to 60%.
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadVideo;