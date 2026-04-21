import SideBar1 from "../components/SideBar1"
import { useEffect, useState } from "react"
import { API } from "../api/axios"
import { useNavigate } from "react-router-dom"

function Home() {
  const [videos, setVideos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await API.get("/v1/videos")
      setVideos(res.data.data.videos || [])
    }
    fetchVideos()
  }, [])

  return (
<div className="bg-gray-100 min-h-screen">
  <SideBar1 />

      {/* MAIN */}
      <div className="ml-64 p-6 space-y-8">

        {/* HERO SECTION */}
        <div className="bg-white rounded-2xl p-6 flex justify-between items-center shadow">
          
          <div className="max-w-xl">
            <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs">
              STAFF PICK
            </span>

            <h1 className="text-4xl font-bold mt-3 leading-tight">
              The Art of Modern Living.
            </h1>

            <p className="text-gray-500 mt-3">
              A deep dive into architectural minimalism and the spaces that breathe life into the city.
            </p>

            <button className="mt-5 bg-black text-white px-5 py-2 rounded-full">
               Watch Feature
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            className="w-80 rounded-xl"
          />
        </div>

        {/* VIDEO ROW */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommended</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {videos.map((v) => (
              <div
                key={v._id}
                onClick={() => navigate(`/video/${v._id}`)}
                className="cursor-pointer bg-white rounded-xl shadow hover:scale-105 transition"
              >
                <img
                  src={v.thumbnail}
                  className="w-full h-40 object-cover rounded-t-xl"
                />

                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {v.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {v.views} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home