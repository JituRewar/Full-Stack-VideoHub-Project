import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import SideBar1 from "./components/SideBar1";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadVideo from "./pages/UploadVideo";
import VideoPage from "./pages/VideoPage";
import Profile from "./pages/Profile";
import WatchHistory from "./pages/WatchHistory";
import Subscriptions from "./pages/Subscriptions";
import Playlist from "./pages/Playlist";
import AIAssistant from "./pages/AIAssistant";
import Community from "./pages/Community"; 

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <SideBar1 />
        <div className="ml-60 p-6">{children}</div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />

        <Route
          path="/video/:id"
          element={
            <Layout>
              <VideoPage />
            </Layout>
          }
        />

        <Route
          path="/c/:username"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/dashboard"
          element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/upload"
          element={
            <Layout>
              <ProtectedRoute>
                <UploadVideo />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/ai-assistant"
          element={
            <Layout>
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/history"
          element={
            <Layout>
              <ProtectedRoute>
                <WatchHistory />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <Layout>
              <ProtectedRoute>
                <Subscriptions />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/playlist"
          element={
            <Layout>
              <ProtectedRoute>
                <Playlist />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/community"
          element={
            <Layout>
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;