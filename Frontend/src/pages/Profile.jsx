import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const isOwnProfile = user?._id === channel?._id;

  useEffect(() => {
    fetchChannel();
  }, [username]);

  const fetchChannel = async () => {
    try {
      const res = await API.get(`/v1/users/c/${username}`);
      setChannel(res.data.data);

      const vids = await API.get(`/v1/videos/user/${res.data.data._id}`);
      setVideos(vids.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubscribe = async () => {
    try {
      await API.post(`/v1/subscriptions/c/${channel._id}`);
      setSubscribed(!subscribed);
    } catch {
      alert("Login required");
    }
  };

  if (!channel || !user) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      {/*  COVER */}
      <div className="w-full h-64 bg-gray-300 relative">
        <img
          src={channel.coverImage || "https://picsum.photos/1200/400"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* HEADER */}
      <div className="px-8 pt-6">
        <div className="flex items-end gap-6 mt-4">
          {/* AVATAR */}
          <img
            src={
              channel.avatar ||
              `https://ui-avatars.com/api/?name=${channel.fullName}`
            }
            className="w-36 h-36 rounded-2xl border-4 border-white shadow-lg object-cover -mt-16"
          />
          {/* INFO */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{channel.fullName}</h1>
            <p className="text-gray-500">@{channel.username}</p>

            <div className="flex gap-6 text-sm text-gray-600 mt-2">
              <span>{channel.subscribersCount || 0} subscribers</span>
              <span>{videos.length} videos</span>
            </div>
          </div>
          {/* ACTION */}
          <button
            onClick={() => setEditOpen(true)}
            className="px-6 py-2 bg-red-500 text-white rounded-full shadow"
          >
            Edit Profile
          </button>
          
        </div>

        {/*  TABS */}
        <div className="flex gap-8 mt-8 border-b text-sm font-medium">
          <span className="border-b-2 border-red-500 pb-2 cursor-pointer">
            Videos
          </span>
          <span className="text-gray-500 cursor-pointer">About</span>
        </div>
      </div>

      {/*FEATURED VIDEO */}
      {videos.length > 0 && (
        <div className="px-8 mt-8">
          <div
            onClick={() => navigate(`/video/${videos[0]._id}`)}
            className="flex gap-6 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
          >
            <img
              src={videos[0].thumbnail}
              className="w-100 h-56 object-cover"
            />

            <div className="p-4 flex flex-col justify-center">
              <p className="text-xs text-red-500 font-semibold">
                FEATURED VIDEO
              </p>

              <h2 className="text-xl font-bold mt-1">{videos[0].title}</h2>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {videos[0].description || "No description available"}
              </p>

              <p className="text-xs text-gray-400 mt-3">
                {videos[0].views} views
              </p>
            </div>
          </div>
        </div>
      )}

      {/*  VIDEO GRID */}
      <div className="px-8 mt-10 grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.slice(1).map((video) => (
          <div
            key={video._id}
            onClick={() => navigate(`/video/${video._id}`)}
            className="cursor-pointer"
          >
            <img
              src={video.thumbnail}
              className="w-full h-40 object-cover rounded-xl"
            />

            <h3 className="mt-2 text-sm font-semibold line-clamp-2">
              {video.title}
            </h3>

            <p className="text-xs text-gray-500">{video.views} views</p>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <EditProfileModal
          user={channel}
          onClose={() => setEditOpen(false)}
          onUpdate={fetchChannel}
        />
      )}
    </div>
  );
}

export default Profile;
