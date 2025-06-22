import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Resources from './pages/Resources';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Scoreboard from './pages/Scoreboard';
import Contributor from './pages/Contributor';
import Upload from './pages/Upload';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path ="/Scoreboard" element ={<Scoreboard/>} />
        <Route path ="/Contributor/:name" element ={<Contributor/>}/>     
        <Route path ="/Upload" element ={<Upload/>}/>
     </Routes>
    </div>
  );
}

export default App;
