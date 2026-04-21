import { useEffect, useState } from "react"
import { API } from "../api/axios"
import { useNavigate } from "react-router-dom"

function WatchHistory() {
  const [videos, setVideos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await API.get("/v1/users/watch-history")
      setVideos(res.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Watch History</h1>

      {videos.length === 0 ? (
        <p>No history yet</p>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">

          {videos.map((video) => (
            <div
              key={video._id}
              onClick={() => navigate(`/video/${video._id}`)}
              className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              {/* THUMBNAIL */}
              <img
                src={video.thumbnail}
                className="w-full h-40 object-cover rounded-t-xl"
              />

              {/* CONTENT */}
              <div className="p-3 space-y-2">

                <h2 className="text-sm font-semibold line-clamp-2">
                  {video.title}
                </h2>

                {/* CHANNEL */}
                <div className="flex items-center gap-2">

                  <img
                    src={video.owner?.avatar}
                    className="w-6 h-6 rounded-full"
                  />

                  <p className="text-xs text-gray-600">
                    {video.owner?.username}
                  </p>
                </div>

                <p className="text-xs text-gray-500">
                  {video.views} views
                </p>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default WatchHistory