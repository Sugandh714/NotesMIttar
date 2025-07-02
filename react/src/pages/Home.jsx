import { Link, useNavigate } from 'react-router-dom';
import '../style/Home.css'; // Ensure you have styles (or import global CSS if applicable)
import heroImage from '../assets/images/young-female-friends-studying-together.png';
import resourceImg from '../assets/images/resources.PNG';
import scoreboardImg from '../assets/images/scoreboard.png';
import smartUploadImg from '../assets/images/smartUpload.PNG';
import Navbar from '../component/Navbar';
import ContactUs from '../component/ContactUs';
import { useEffect, useState } from 'react';
import axios from 'axios';


function Home() {
  const navigate = useNavigate();
  const [topScorers, setTopScorers] = useState([]);

  const browseResources = () => {
    navigate('/resources');
  };

  const uploadResource = () => {
    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    navigate(isLoggedIn ? '/upload' : '/login');
  };
  useEffect(() => {
  axios.get('http://localhost:5000/api/leaderboard')
    .then(res => setTopScorers(res.data.slice(0, 3)))
    .catch(err => console.error('Error fetching top scorers:', err));
}, []);

  return (
    <>
     
      <Navbar/>
      <section className="hero">
        <div className="hero-text">
          <h1>Exams hain !</h1>
          <h1>Why fear when your Mittar is here</h1>
          <p className="subtext">Tere Preparation Ka Sacha Yaar</p>
          <div className="hero-buttons">
            <button onClick={browseResources}>Browse Resources</button>
            <button onClick={uploadResource}>Upload Resource</button>
          </div>
        </div>
        <img src={heroImage} alt="Study" className="hero-img" />
      </section>

      <section id="features" className="features">
        <div className="feature-card">
          <Link to="/resources">
            <img src={resourceImg} alt="view_resource" width="80" />
            <h3>View Resources</h3>
          </Link>
          <p>Access notes, papers, and book tips for your semester in seconds.</p>
        </div>
        <div className="feature-card">
          <Link to="/scoreboard">
            <img src={scoreboardImg} alt="Contributors Scoreboard" />
            <h3>Contributors Scoreboard</h3>
          </Link>
          <p>Top Mittars who helped others prep. Get featured for sharing!</p>
        </div>
        <div className="feature-card">
          <Link to="/upload">
            <img src={smartUploadImg} alt="Secure" />
            <h3>Smart Uploads</h3>
          </Link>
          <p>Only syllabus-matching and relevant content gets accepted.</p>
        </div>
      </section>

      <section id="scoreboard" className="scoreboard">
  <h2>Top Mittars of the Month</h2>
  <ol>
    {topScorers.length > 0 ? (
      topScorers.map((user, idx) => (
        <li key={user.username}>
          <strong>{user.username}</strong> – {user.totalUploads} uploads
        </li>
      ))
    ) : (
      <p>Loading top contributors...</p>
    )}
  </ol>
</section>


      <footer>
        <p>© 2025 NotesMittar | Made with ❤️ by Students | Tere Exams Ka Sacha Yaar</p>
      </footer>
    <ContactUs/>
    </>
  );
}

export default Home;
