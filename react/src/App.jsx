import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Resources from './pages/Resources';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ContributorPage from './pages/ContributorPage';
import AdminHome from './pages/AdminHome';
import ManageContributor from './pages/ManageContributor';
import ManageResources from './pages/ManageResources';
import Upload from './pages/Upload';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './component/ProtectedRoute';
import LeaderboardPage from './pages/LeaderboardPage';
import NavLogin from './pages/NavLogin';
import ProfilePage from './pages/ProfilePage';
import AdminCheckSessions from './pages/AdminCheckSession';
import AdminSessionDetail from './pages/AdminSessionDetail';



function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Resources" element={<ProtectedRoute>
          <Resources />
        </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/NavLogin" element={<NavLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Scoreboard" element={<ProtectedRoute>
         <LeaderboardPage  />
        </ProtectedRoute>} />
         <Route path="/Contributor/:username" element={<ContributorPage />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
         <Route path="/adminHome" element={<AdminHome />} />
  <Route path="/admin/manage-contributors" element={<ManageContributor />} />
  <Route path="/admin/manage-resources" element={<ManageResources />} />
<Route path="/admin/check-sessions" element={<AdminCheckSessions />} />
<Route path="/admin/session/:sessionID" element={<AdminSessionDetail />} />
   <Route path="/ProfilePage" element={<ProfilePage />} />
      </Routes>
      
      
    </div>
  );
}

export default App;
