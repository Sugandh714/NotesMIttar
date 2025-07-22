import React, { useState } from 'react';
import '../style/Upload.css';
import ContributionHistory from './ContributionHistory';
import Navbar from '../component/Navbar';
import ContactUs from '../component/ContactUs';
import { getSessionHeaders } from '../component/getSessionHeaders';

const Upload = () => {

  const [activeTab, setActiveTab] = useState('upload');
  const [formData, setFormData] = useState({
  type: '',
  semester: '',
  course: '',
  subject: '',
  unit: [],
  year: '',
  examType: '', // 🆕 Add this
});


  const [file, setFile] = useState(null);

  const courseOptions = ['CSE', 'AIML', 'ECE', 'EEE', 'ME', 'IT']; // Add more as needed
  const subjectsBySemester = {
    "Sem 1": [
      "Probability and Statistics",
      "EVS",
      "IT Workshop",
      "Programming with Python",
      "Communication Skills"
    ],
    "Sem 2": [
      "Applied Maths",
      "Applied Physics",
      "Introduction to DS",
      "Data Structures",
      "OOPS"
    ],
    "Sem 3": [
      "Discrete Structures",
      "DBMS",
      "AI",
      "Software Engineering",
      "MSE",
      "Numerical Method"
    ],
    "Sem 4": [
      "Disaster Management",
      "Computer Networks",
      "Operation Management",
      "Design and Analysis of Algorithm",
      "Operating System",
      "Machine Learning"
    ]
  };


  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUnitChange = (e) => {
    const selectedUnits = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      unit: selectedUnits,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!file) {
    alert('Please select a file first');
    return;
  }

  try {
    const uploadFormData = new FormData();
    uploadFormData.append('pdf', file); // Note: 'pdf' matches your multer config
    
    // Add all the form data
    uploadFormData.append('course', formData.course);
    uploadFormData.append('semester', formData.semester);
    uploadFormData.append('subject', formData.subject);
    uploadFormData.append('type', formData.type);
    
    // Handle unit array
    if (formData.unit && formData.unit.length > 0) {
      formData.unit.forEach(unit => {
        uploadFormData.append('unit', unit);
      });
    }
    
    // Add year if it's a PYQ
    if (formData.type === 'PYQs' && formData.year) {
      uploadFormData.append('year', formData.year);
    }
    if (formData.type === 'PYQs' && formData.examType) {
  uploadFormData.append('examType', formData.examType);
}

    console.log('Sending request to backend...');
    const username = sessionStorage.getItem('username');
    const email = sessionStorage.getItem('email');

if (!username || !email) {
  alert("Please log in before uploading.");
  return;
}

    const response = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  headers: {
   ...getSessionHeaders()
  // 'session-id': sessionStorage.getItem('sessionID') || 'unknown-session',
  // 'username': sessionStorage.getItem('username') || 'unknown'
  // do NOT set 'Content-Type' when sending FormData
},

  

  
  body: uploadFormData,
});

    console.log('📤 Headers being sent:', {
  'session-id': sessionStorage.getItem('sessionID'),
  'userid': sessionStorage.getItem('userId'),
  'username': sessionStorage.getItem('username'),
  'role': sessionStorage.getItem('isAdmin') === 'true' ? 'admin' : 'user'
});

    console.log("🧠 Upload sessionID:", sessionStorage.getItem('sessionID'));


    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Success response:', result);
    
    // Show success message
    alert(result.message || 'Upload successful!');


    // Reset form
    setFormData({
  type: '',
  semester: '',
  course: '',
  subject: '',
  unit: [],
  year: '',
  examType: '', // 🆕 clear this too
});

    setFile(null);
    
  } catch (error) {
    console.error('Detailed error:', error);
    alert(`Upload failed: ${error.message}`);

     // Reset the form if multer error
  setFormData({
  type: '',
  semester: '',
  course: '',
  subject: '',
  unit: [],
  year: '',
  examType: '', // 🆕 clear this too
});

  setFile(null);
  }
};



  return (
    <>
      <Navbar />
      <div className={`upload-container ${activeTab === 'history' ? 'full-width' : ''}`}>

        <div className="upload-tabs">
          <button
            className={activeTab === 'upload' ? 'active' : ''}
            onClick={() => setActiveTab('upload')}
          >
            Upload Resource
          </button>
          <button
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            Contribution History
          </button>
        </div>

        {activeTab === 'upload' && (
          <form className="upload-form" onSubmit={handleSubmit}>
            <div
              className="drag-drop-area"
              onClick={() => document.getElementById('fileInput').click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {file ? (
                <p>📄 {file.name}</p>
              ) : (
                <p>📂 Drag and drop your file here <br /> or <strong>select pdf from computer</strong></p>
              )}
            </div>

            <input
              type="file"
              id="fileInput"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />


            <label>
              Resource Type:
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Notes">Notes</option>
                <option value="PYQs">PYQs</option>
                <option value="Books">Books</option>
              </select>
            </label>

            <label>
              Semester:
              <select name="semester" value={formData.semester} onChange={handleChange} required>
                <option value="">Select</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={`Sem ${i + 1}`}>{`Sem ${i + 1}`}</option>
                ))}
              </select>
            </label>

            <label>
              Course:
              <select name="course" value={formData.course} onChange={handleChange} required>
                <option value="">Select</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </label>
            {formData.course === "AIML" && subjectsBySemester[formData.semester] ? (
              <label>
                Subject:
                <select name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Select Subject</option>
                  {subjectsBySemester[formData.semester].map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label>
                Subject:
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </label>
            )}



            {formData.type === 'Notes' && (
              <div className="unit-checkboxes">
                <label>Select Units:</label>
                <div className="unit-options">
                  {[1, 2, 3, 4].map((num) => (
                    <label key={num} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={num}
                        checked={formData.unit.includes(num.toString())}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            unit: prev.unit.includes(value)
                              ? prev.unit.filter((u) => u !== value)
                              : [...prev.unit, value],
                          }));
                        }}
                      />
                      Unit {num}
                    </label>
                  ))}
                </div>
              </div>
            )}


            {formData.type === 'PYQs' && (
              <label>
                Year of PYQ:
                <input
                  type="number"
                  name="year"
                  min="2000"
                  max={new Date().getFullYear()}
                  placeholder="e.g. 2023"
                  value={formData.year || ''}
                  onChange={handleChange}
                  required
                />
              </label>
            )}
            {formData.type === 'PYQs' && (
  <label>
    Exam Type:
    <select
      name="examType"
      value={formData.examType}
      onChange={handleChange}
      required
    >
      <option value="">Select</option>
      <option value="Mid Sem">Mid Sem</option>
      <option value="End Sem">End Sem</option>
    </select>
  </label>
)}


            <button type="submit">Upload</button>
          </form>
        )}

        {activeTab === 'history' && <ContributionHistory />}
      </div>
      <ContactUs />
    </>
  );
};

export default Upload;
