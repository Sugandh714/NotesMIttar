import React, { useState } from 'react';
import '../style/Upload.css';
import ContributionHistory from './ContributionHistory';

const Upload = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [formData, setFormData] = useState({
    type: '',
    semester: '',
    course: '',
    subject: '',
    unit: [],
    year: '',
  });

  const [file, setFile] = useState(null);

  const courseOptions = ['CSE', 'AIML', 'ECE', 'EEE', 'ME', 'IT']; // Add more as needed

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData, file);
    // Upload logic will go here
  };

  return (
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
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {file ? (
              <p>📄 {file.name}</p>
            ) : (
              <p>📂 Drag and drop your file here</p>
            )}
          </div>

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
          <label>
  Subject:
  <input
    type="text"
    name="subject"
    placeholder="e.g. DBMS"
    value={formData.subject}
    onChange={handleChange}
    required
  />
</label>

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


          <button type="submit">Upload</button>
        </form>
      )}

      {activeTab === 'history' && <ContributionHistory/>}
    </div>
  );
};

export default Upload;
