
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: String,          // Topic title
  subtopics: [String]    // Array of essential subpoints for this topic
});

const unitSchema = new mongoose.Schema({
  unitName: String,      // e.g., 'UNIT-I'
  topics: [topicSchema]  // Array of topic objects
});

const syllabusSchema = new mongoose.Schema({
  course: String,        // e.g., 'EEE'
  year: String,          // e.g., '1st Year'
  semester: String,      // e.g., 'Sem 1'
  subject: String,       // e.g., 'Communication Skills'
  units: [unitSchema]    // Array of units with full hierarchy
});

module.exports = mongoose.model('Syllabus', syllabusSchema);