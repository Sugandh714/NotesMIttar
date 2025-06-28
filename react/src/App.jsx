import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Resources from './pages/Resources';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Scoreboard from './pages/Scoreboard';
import Contributor from './pages/Contributor';
import Upload from './pages/Upload';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './component/ProtectedRoute';

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
        <Route path="/signup" element={<Signup />} />
        <Route path="/Scoreboard" element={<ProtectedRoute>
          <Scoreboard />
        </ProtectedRoute>} />
        <Route path="/Contributor/:name" element={<Contributor />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
