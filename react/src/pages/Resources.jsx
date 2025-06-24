import { useState } from 'react';
import '../style/Resources.css'; // You can extract styles from the HTML or reuse parts of Home.css
import Navbar from '../component/Navbar';
import ContactUs from '../component/ContactUs';
function Resources() {
  const [stage, setStage] = useState(1);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const showYears = () => setStage(2);

  const showSemesters = (year) => {
    const semMap = {
      1: [1, 2],
      2: [3, 4],
      3: [5, 6],
      4: [7, 8],
    };
    setSemesters(semMap[year] || []);
    setStage(3);
  };

  const showSubjects = (sem) => {
    const subjMap = {
      1: ['Probability & Statistics', 'EVS', 'IT Workshop', 'Programming with Python', 'Communication Skills'],
      2: ['Applied Maths', 'Applied Physics', 'Intro to DS', 'Data Structures', 'OOPJ'],
    };
    setSubjects(subjMap[sem] || ['Subject 1', 'Subject 2']);
    setStage(4);
  };

  const showResources = () => setStage(5);

  return (
    <>
    <Navbar/>
    <div style={{ padding: '20px' }}>
      <h1>📚 View Resources - NotesMittar</h1>

      {stage === 1 && (
        <div>
          <p className="section-title">Choose Course</p>
          <div className="card-grid">
            <div className="card" onClick={showYears}>AIML</div>
          </div>
        </div>
      )}

      {stage === 2 && (
        <div>
          <p className="section-title">Choose Year</p>
          <div className="card-grid">
            {[1, 2, 3, 4].map(year => (
              <div className="card" key={year} onClick={() => showSemesters(year)}>{`${year} Year`}</div>
            ))}
          </div>
        </div>
      )}

      {stage === 3 && (
        <div>
          <p className="section-title">Choose Semester</p>
          <div className="card-grid">
            {semesters.map(sem => (
              <div className="card" key={sem} onClick={() => showSubjects(sem)}>{`Semester ${sem}`}</div>
            ))}
          </div>
        </div>
      )}

      {stage === 4 && (
        <div>
          <p className="section-title">Choose Subject</p>
          <div className="card-grid">
            {subjects.map(sub => (
              <div className="card" key={sub} onClick={showResources}>{sub}</div>
            ))}
          </div>
        </div>
      )}

      {stage === 5 && (
        <>
          <div className="tabs">
            <div className="tab active">Notes</div>
            <div className="tab">Books</div>
            <div className="tab">PYQs</div>
          </div>

          <div className="resource-list">
            <div className="resource-item">
              <div>
                <strong>Python Basics Notes</strong><br />
                <span className="contributor">MittarX</span> | ⭐⭐⭐⭐☆ | 120 views
              </div>
              <button>View</button>
            </div>
            <div className="resource-item">
              <div>
                <strong>Python Class Slides</strong><br />
                <span className="contributor">StudyBro</span> | ⭐⭐⭐☆☆ | 87 views
              </div>
              <button>View</button>
            </div>
          </div>
        </>
      )}
    </div>
    <ContactUs/>
    </>
  );
}

export default Resources;
