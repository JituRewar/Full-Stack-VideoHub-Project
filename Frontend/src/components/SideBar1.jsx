import { Link } from "react-router-dom";

function SideBar1() {
  return (
    <div className="w-64 h-full fixed left-0 top-16 bottom-0 bg-white shadow p-5">
      <h1 className="text-xl font-bold mb-6">Menu</h1>

      <div className="space-y-3 text-gray-700">
        <Link to="/" className="block hover:bg-gray-100 p-2 rounded">
          Home
        </Link>

        <Link to="/dashboard" className="block hover:bg-gray-100 p-2 rounded">
          Dashboard
        </Link>

        <Link
          to="/subscriptions"
          className="block hover:bg-gray-100 p-2 rounded"
        >
          Subscriptions
        </Link>

        <Link to="/playlist" className="block hover:bg-gray-100 p-2 rounded">
          Playlist
        </Link>

        <Link to="/history" className="block hover:bg-gray-100 p-2 rounded">
          History
        </Link>
        <Link
          to="/community"
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
        >
          Community
        </Link>
      </div>
    </div>
  );
}

export default SideBar1;
