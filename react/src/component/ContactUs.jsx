import React, { useState } from 'react';
import '../style/ContactUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';


export default function ContactUs() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for contacting us!');
    setShowForm(false);
  };

  return (
  <div className="contact-wrapper">
    <div className="contact-toggle" onClick={toggleForm}>
      <FontAwesomeIcon icon={faComments} size="lg" />
    </div>

    {showForm && (
      <div className="contact-overlay" onClick={() => setShowForm(false)}>
        <div className="contact-form" onClick={(e) => e.stopPropagation()}>
          <h3>Contact Us</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message..." rows="4" required />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    )}
  </div>
);

}
