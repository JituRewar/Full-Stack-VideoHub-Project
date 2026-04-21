import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Community() {
  const { user } = useAuth();

  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  //  FETCH TWEETS
  const fetchTweets = async () => {
    try {
      const res = await API.get(`/v1/tweets/user/${user._id}`);
      setTweets(res.data.data || []);
    } catch (err) {
      console.error("Fetch Tweets Error:", err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchTweets();
  }, [user]);

  //  CREATE TWEET
  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);

      await API.post("/v1/tweets", { content });

      setContent("");
      fetchTweets();
    } catch (err) {
      console.error("Create Tweet Error:", err);
    } finally {
      setLoading(false);
    }
  };

  //  DELETE TWEET
  const deleteTweet = async (id) => {
    try {
      await API.delete(`/v1/tweets/${id}`);
      fetchTweets();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex gap-6 bg-gray-100 min-h-screen p-6">
      {/* LEFT MENU */}
      <div className="w-60 bg-white rounded-xl p-4 shadow h-fit">
        <h2 className="font-bold mb-4">Menu</h2>

        <div className="space-y-2 text-gray-600">
          <p>Home</p>
          <p className="text-red-500 font-semibold">Community</p>
          <p>Trending</p>
          <p>Library</p>
        </div>

        <button className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg">
          + Create Post
        </button>
      </div>

      {/* CENTER */}
      <div className="flex-1">
        <div className="sticky top-16 bg-gray-100 z-10 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Community</h1>
          <p className="text-gray-500 text-sm">
            Share updates, connect with creators 🚀
          </p>
        </div>
        {/* CREATE POST */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full border rounded-lg p-3"
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={handlePost}
              disabled={loading}
              className="bg-red-500 text-white px-6 py-2 rounded-full"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {/* POSTS */}
        <div className="space-y-4">
          
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={`https://ui-avatars.com/api/?name=Jitu`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">Jitu Rewar</h3>
                <p className="text-xs text-gray-500">@jitu_rewar</p>
              </div>
            </div>

            <p className="text-gray-800">
               Jitu's YT channel going on trendy 🔥🔥 Massive growth + insane
              edits 💯
            </p>

            <div className="text-sm text-gray-500 mt-2">
              ❤️ 12 • 🔁 4 • 💬 2
            </div>
          </div>

          {/* USER TWEETS */}
          {tweets.map((t) => (
            <div key={t._id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    t.owner?.avatar ||
                    `https://ui-avatars.com/api/?name=${t.owner?.username}`
                  }
                  className="w-10 h-10 rounded-full"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{t.owner?.username}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* DELETE BUTTON */}
                {t.owner?._id === user._id && (
                  <button
                    onClick={() => deleteTweet(t._id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>

              <p className="text-gray-800">{t.content}</p>

              <div className="text-sm text-gray-500 mt-2">
                ❤️ {t.likesCount || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-72 bg-white rounded-xl p-4 shadow h-fit">
        <h2 className="font-bold mb-4">Trending</h2>

        <div className="space-y-3 text-sm">
          <p>#AIEditing</p>
          <p>#CinematicShots</p>
          <p>#VlogLife</p>
          <p>#VideoHub</p>
        </div>
      </div>
    </div>
  );
}

export default Community;
