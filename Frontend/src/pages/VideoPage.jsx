import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/axios";
import { useAuth } from "../context/AuthContext";

function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [relatedVideos, setRelatedVideos] = useState([]);


  useEffect(() => {
    fetchVideo();
    fetchComments();
    fetchRelatedVideos();
  }, [id]);

  const fetchVideo = async () => {
    const res = await API.get(`/v1/videos/${id}`);
    setVideo(res.data.data);
    setLikesCount(res.data.data.likes || 0);
  };

  const fetchComments = async () => {
    try {
      const res = await API.get(`/v1/comments/video/${id}`);

      const data = res.data.data;

      // HANDLE ALL CASES
      if (Array.isArray(data)) {
        setComments(data);
      } else if (Array.isArray(data?.comments)) {
        setComments(data.comments);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.log(err);
      setComments([]);
    }
  };

  const fetchRelatedVideos = async () => {
    const res = await API.get("/v1/videos");
    const vids = res.data.data?.videos || [];
    setRelatedVideos(vids.filter((v) => v._id !== id));
  };


  const toggleLike = async () => {
    try {
      await API.patch(`/v1/likes/video/${id}`);
      setLiked(!liked);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch {
      alert("Login required");
    }
  };

 
  const toggleSubscribe = async () => {
    try {
      await API.post(`/v1/subscriptions/c/${video.owner._id}`);
      setSubscribed(!subscribed);
    } catch {
      alert("Login required");
    }
  };

  
  const addComment = async () => {
    if (!newComment.trim()) return;

    const res = await API.post(`/v1/comments/video/${id}`, {
      content: newComment,
    });

    setComments((prev) => [
      res.data.data,
      ...(Array.isArray(prev) ? prev : []),
    ]);
    setNewComment("");
  };

  if (!video) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex gap-6">
      {/* LEFT SIDE */}
      <div className="flex-1">
        {/* VIDEO PLAYER */}
        <div className="bg-black rounded-xl overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            src={video.videoFile}
            controls
            autoPlay
            className="w-full h-100 object-cover"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold mt-4">{video.title}</h1>

        {/* CHANNEL + ACTIONS */}
        <div className="flex justify-between items-center mt-4">
          {/* CHANNEL */}
          <div className="flex items-center gap-3">
            <img src={video.owner?.avatar} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold">{video.owner?.username}</p>
              <p className="text-sm text-gray-500">1.2M subscribers</p>
            </div>

            <button
              onClick={toggleSubscribe}
              className={`ml-4 px-4 py-2 rounded-full text-sm ${
                subscribed ? "bg-gray-300" : "bg-black text-white"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={toggleLike}
              className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300"
            >
              👍 {likesCount}
            </button>

            <button className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300">
              Share
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white p-4 rounded-xl mt-4 shadow">
          <p className="text-sm text-gray-600 mb-2">
            {video.views || 0} views • Recently uploaded
          </p>
          <p className="text-gray-800 text-sm">
            {video.description || "No description"}
          </p>
        </div>

        {/* COMMENTS */}
        <div className="mt-6">
          <h2 className="font-semibold mb-3">{comments.length} Comments</h2>

          {/* ADD COMMENT */}
          <div className="flex gap-3 mb-4">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-3 rounded-full border"
            />
            <button
              onClick={addComment}
              className="bg-red-500 text-white px-4 rounded-full"
            >
              Comment
            </button>
          </div>

          {/* LIST */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-3">
                <img src={c.owner?.avatar} className="w-9 h-9 rounded-full" />
                <div>
                  <p className="text-sm font-semibold">{c.owner?.username}</p>
                  <p className="text-sm text-gray-700">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-87.5 hidden lg:block">
        <h2 className="font-semibold mb-4">Up Next</h2>

        <div className="space-y-4">
          {relatedVideos.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/video/${v._id}`)}
              className="flex gap-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition"
            >
              <img
                src={v.thumbnail}
                className="w-40 h-24 object-cover rounded-lg"
              />

              <div>
                <p className="text-sm font-semibold line-clamp-2">{v.title}</p>
                <p className="text-xs text-gray-500">{v.views} views</p>
              </div>
            </div>
          ))}
        </div>

        {/* PREMIUM CARD */}
        <div className="bg-teal-600 text-white p-4 rounded-xl mt-6">
          <p className="text-sm font-semibold">
            Upgrade to Premium for 8K Streaming
          </p>
          <button className="mt-2 bg-white text-teal-600 px-3 py-1 rounded">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
