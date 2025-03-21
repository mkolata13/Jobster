import "bootstrap/dist/css/bootstrap.min.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JobsterNavbar from './components/Navbar';
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import { Route, Routes } from "react-router-dom";
import JobPostDetails from "./components/JobPostDetails";
import JobPosts from "./components/JobPosts";
import { HelmetProvider } from "react-helmet-async";
import VerifyAccount from "./components/Verification";
import CreateJobPost from "./components/CreateJobPost";
import Profile from "./components/Profile";
import MyApplications from "./components/MyApplications";

function App() {

  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <div>
          <JobsterNavbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<JobPosts />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/verify" element={<VerifyAccount />} />
              <Route path="/job-posts/:id" element={<JobPostDetails />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/create-post" element={<CreateJobPost />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
