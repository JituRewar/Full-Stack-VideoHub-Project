import { useEffect, useState } from "react"
import { API } from "../api/axios"

function History() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    API.get("/v1/users/watch-history")
      .then((res) => setVideos(res.data.data))
      .catch(() => {})
  }, [])

  return (
    <div className="p-6 grid grid-cols-4 gap-4">
      {videos.map((v) => (
        <div key={v._id}>
          <img src={v.thumbnail} />
          <p>{v.title}</p>
        </div>
      ))}
    </div>
  )
}

export default History