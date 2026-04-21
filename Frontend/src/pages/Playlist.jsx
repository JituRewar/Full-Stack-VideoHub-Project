import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Playlist() {
  const { user, loading } = useAuth();

  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?._id) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      setError("");

      const res = await API.get(`/v1/playlist/user/${user._id}`);

      const data = res.data.data || [];

      setPlaylists(data);

      if (data.length > 0) {
        setSelected(data[0]);
      } else {
        setSelected(null);
      }
    } catch (err) {
      console.error("PLAYLIST ERROR:", err);

      if (err.response?.status === 401) {
        setError("Please login again");
      } else if (err.response?.status === 404) {
        setError("No playlists found");
      } else {
        setError("Something went wrong");
      }
    }
  };

  //  Loading state
  if (loading) return <p className="p-6">Loading...</p>;

  //  Not logged in
  if (!user) {
    return (
      <p className="p-6 text-red-500">
        You are not logged in. Please login.
      </p>
    );
  }

  return (
    <div className="flex p-6 gap-6 bg-gray-100 min-h-screen">
      
      {/* LEFT SIDE */}
      <div className="w-80 space-y-4">
        <h2 className="text-xl font-bold">Your Playlists</h2>

        {/*  Error */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Empty */}
        {!error && playlists.length === 0 && (
          <p className="text-gray-500 text-sm">
            No playlists created yet
          </p>
        )}

        {/*  List */}
        {playlists.map((p) => (
          <div
            key={p._id}
            onClick={() => setSelected(p)}
            className={`p-4 rounded-xl cursor-pointer shadow transition ${
              selected?._id === p._id
                ? "bg-red-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm opacity-70">
              {p.totalVideos} videos
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      {selected && (
        <div className="flex-1 bg-white rounded-2xl shadow p-6">
          
          {/* HEADER */}
          <div className="flex items-center gap-6 mb-6">
            <img
              src={
                selected.videos?.[0]?.thumbnail ||
                "https://picsum.photos/200"
              }
              className="w-40 h-40 rounded-xl object-cover"
            />

            <div>
              <h1 className="text-3xl font-bold">
                {selected.name}
              </h1>

              <p className="text-gray-500 mt-1">
                {selected.description}
              </p>

              <div className="flex gap-4 text-sm text-gray-600 mt-3">
                <span>{selected.totalVideos} videos</span>
                <span>
                  {new Date(selected.createdAt).toDateString()}
                </span>
              </div>

              <button className="mt-4 bg-red-500 text-white px-5 py-2 rounded-full">
                ▶ Play All
              </button>
            </div>
          </div>

          {/* VIDEO LIST */}
          <div className="space-y-4">
            {selected.videos?.length === 0 && (
              <p className="text-gray-500">
                No videos in this playlist
              </p>
            )}

            {selected.videos?.map((v, index) => (
              <div
                key={v._id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100"
              >
                <span className="text-gray-500 w-6">
                  {index + 1}
                </span>

                <img
                  src={v.thumbnail}
                  className="w-32 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-medium">{v.title}</h3>
                </div>

                <span className="text-sm text-gray-500">
                  {v.duration || "--"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Playlist;