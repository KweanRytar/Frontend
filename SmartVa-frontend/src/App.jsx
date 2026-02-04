// App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Nav from "./Nav";
import { ToastContainer } from "react-toastify";

// Public pages
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Protected pages
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import Notes from "./pages/Notes";
import Documents from "./pages/Documents";
import Visitors from "./pages/Visitors";
import Events from "./pages/Events";
import TaskDetails from "./pages/TaskDetails";
import DelegateDetails from "./pages/DelegateDetails";
import EditNote from "./pages/EditNote";
import NoteDetails from "./pages/NoteDetails";
import CreateNote from "./pages/CreateNote";
import DocumentDetails from "./pages/DocumentDetails";
import VisitorDetails from "./pages/VisitorDetails";
import EventDetails from "./pages/EventDetails";
import DelegateTaskDetails from "./pages/DelegateTaskDetails";
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import ProtectedRouteFallback from "./pages/ProtectedRouteFallback";

// Socket
import SocketConnection from "./components/SocketConnection";

function App() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => setIsDark(prev => !prev);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  // Pages that should NOT show Nav
  const publicPaths = ["/signup", "/login", "/reset-password", "/verify-email"];
  const isPublic = publicPaths.includes(location.pathname);

  return (
    <>
      <SocketConnection />

      {!isPublic && (
        <Nav isDark={isDark} toggleDarkMode={toggleDarkMode} />
      )}

      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* -------- PROTECTED ROUTES -------- */}
        <Route element={<ProtectedRouteFallback />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/task" element={<Task />} />
          <Route path="/note" element={<Notes />} />
          <Route path="/document" element={<Documents />} />
          <Route path="/visitor" element={<Visitors />} />
          <Route path="/event" element={<Events />} />
          <Route path="/task-details/:id" element={<TaskDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/delegate-details/:email" element={<DelegateDetails />} />
          <Route path="/note-details/:id" element={<NoteDetails />} />
          <Route path="/create-note" element={<CreateNote />} />
          <Route path="/document-details/:id" element={<DocumentDetails />} />
          <Route path="/visitor-details/:id" element={<VisitorDetails />} />
          <Route path="/event-details/:id" element={<EventDetails />} />
          <Route path="/edit-note/:id" element={<EditNote />} />
          <Route
            path="/delegate-task-details/:id"
            element={<DelegateTaskDetails />}
          />
        </Route>

        {/* -------- FALLBACK -------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
