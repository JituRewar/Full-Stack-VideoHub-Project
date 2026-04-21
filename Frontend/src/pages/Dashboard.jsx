import { useEffect, useState } from "react"
import { API } from "../api/axios"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [analytics, setAnalytics] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, videosRes] = await Promise.all([
          API.get("/v1/dashboard/stats"),
          API.get("/v1/dashboard/videos"),
        ])

        const vids = videosRes.data.data

        setStats(statsRes.data.data)
        setVideos(vids)

        generateAnalytics(vids)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  const generateAnalytics = (videos) => {
    const daysMap = {}

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString("en-US", {
        weekday: "short",
      })
      daysMap[key] = 0
    }

    videos.forEach((video) => {
      const day = new Date(video.createdAt).toLocaleDateString(
        "en-US",
        { weekday: "short" }
      )

      if (daysMap[day] !== undefined) {
        daysMap[day] += video.views
      }
    })

    const formatted = Object.keys(daysMap).map((day) => ({
      date: day,
      views: daysMap[day],
    }))

    setAnalytics(formatted)
  }

  if (!stats) return <p className="p-6">Loading...</p>

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Channel Overview
        </h1>
        <p className="text-gray-500 text-sm">
          Detailed performance of your creative journey.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Videos" value={stats.totalVideos} />
        <Card title="Total Views" value={stats.totalViews} />
        <Card title="Subscribers" value={stats.totalSubscribers} />
        <Card title="Total Likes" value={stats.totalLikes} />
      </div>

      {/* GRAPH */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">
          Performance Trend (Last 7 Days)
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={analytics}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT UPLOADS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">
          Recent Uploads
        </h2>

        <div className="space-y-4">
          {videos.slice(0, 5).map((video) => (
            <div key={video._id} className="flex gap-4 items-center">
              <img
                src={video.thumbnail}
                className="w-40 h-24 object-cover rounded-lg"
              />

              <div>
                <h3 className="font-semibold text-sm">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {video.views} views •{" "}
                  {new Date(video.createdAt).toDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard

function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  )
}