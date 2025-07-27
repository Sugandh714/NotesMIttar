
const mongoose = require('mongoose');
const Syllabus = require('../models/Syllabus');

mongoose.connect('mongodb://localhost:27017/notesmittarDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error:', err));

const sampleSyllabi = [
  // Communication Skills
  {
    course: 'AIML',
    year: '1st Year',
    semester: 'Sem 1',
    subject: 'Communication Skills',
    units: [
      {
        unitName: 'UNIT 1',
        topics: [
          {
            name :"Importance and function of Communication",
            subtopics : [
              "Purpose of communication in personal and professional life",
              "Role of communication in teamwork and leadership",
              "Functions: inform, persuade, motivate, entertain"
            ]
          },
          {
            name : "Communication Cycle",
            subtopics:[
              "Sender, Message, Encoding, Channel, Decoding, Receiver, Feedback, Noise",
              "Examples of communication cycle in real life",
              "Impact of noise on communication"
            ]
          },
          {
            name : "Characteristics and Types of Communication",
            subtopics:[
              "Characteristics: clarity, brevity, coherence",
              "Types: verbal, non-verbal, written, visual",
              "Formal vs Informal communication"
            ]
          },
          {
            name : "Channels and Medium of Communication",
            subtopics: [
              "Different channels: face-to-face, telephonic, written, digital",
              "Selecting the right medium for context",
              "Pros and cons of each communication channel"
            ]
          },
          {
            name: "7 C's of Communication",
            subtopics: [
              "Clear, Concise, Concrete, Correct, Coherent, Complete, Courteous","Explanation with real-life examples","Application in emails and official documents"
            ]
          },
          {
            name: "Barriers to Communication",
            subtopics: [
              "Types: Physical, Semantic, Psychological, Organizational","Examples of barriers in workplaces and classrooms","How to overcome communication barriers"
            ]
          },
          {
            name : "Ethics of Communication (plagiarism, language sensitivity towards gender, caste, race, disability etc.)",
            subtopics: [
              "Understanding and avoiding plagiarism","Using inclusive language (gender, caste, race, disability)","Ethical use of communication tools like email and social media"
            ]
          }
          
          
          
        ]
      },
      {
        unitName: 'UNIT 2',
        topics: [
          {
            name : "Non-Verbal Language (Symbols, Appearance, Paralanguage and Body Language, Proxemics, Chronemics)",
            subtopics: [
              "Meaning and importance of symbols in communication","Body Language: gestures, posture, facial expressions",
              "Paralanguage: pitch, tone, pauses","Proxemics: space in communication","Chronemics: role of time in communication"
            ]

          },
          {
            name : "Listening Skills (Importance, Barriers, Essentials of Good Listening)",
            subtopics: [
              "Difference between hearing and listening","Types: empathetic, active, critical listening","Barriers to good listening","Tips for improving listening skills"
            ]
          },
          {
            name : "Communication Skills ",
            subtopics: [
              "Greeting formally and informally","Introducing self and others",
            "Making polite requests and giving/asking permissions","Offering help and giving directions","Using correct tone and structure in conversations"
            ]

          },
          {
            name : "Understanding Telephone Skills ",
            subtopics: [
              "Structuring a telephone call: opening, body, closing","Leaving professional voice messages","Asking for and giving information clearly","Telephone call etiquette and tone"
            ]
          },
          {
            name : "Net Etiquettes",
            subtopics: [
              "Respectful email and message writing","Avoiding offensive language, emojis in formal writing","Citing sources, avoiding plagiarism","Being inclusive and respectful online"
            ]

          }
        ]
      },    
      {
        unitName: 'UNIT 3',
        topics: [
          {
            name: "Classroom Presentations ",
            subtopics: [
              "Purpose and types of presentations","Content preparation and audience targeting","Slide design principles (minimal text, clear visuals)","Using body language effectively","Handling Q&A sessions confidently"
            ]
          },
          {
            name : "Group Discussion ",
            subtopics: [
              "Purpose and evaluation criteria","Strategies for effective participation","Do's and Don'ts of group discussion","Examples of good and poor GD behavior"
            ]
          },
          {
            name :  "Job Application (Resume and Cover Letter)",
            subtopics: [
              "Resume structure: Header, Objective, Skills, Education, Experience","Cover letter structure: customized, formal format","Common resume and cover letter mistakes","Keyword usage and formatting for ATS systems"
            ]
          }
        ] 
      },   
      {
        unitName: 'UNIT 4',
        topics: [
          {
            name: "Formal and Informal Writing, Basics of Paragraph Writing",
            subtopics: [
              "Differences in tone and structure","Coherence, unity, and organization in paragraphs","Use of transition words","Structure: topic sentence, supporting points"
            ]
          },
          {
            name : "Email Writing, Letters at the workplace",
            subtopics: [
              "Formal email structure and tone","Letter types: complaints, inquiries, appreciation","Common language errors to avoid","Professional formatting and sign-offs"
            ]
          },
          {
            name: "Meeting documentations ",
            subtopics: [
               "Components of agenda and sample format","Structure of minutes of meeting (MoM)","Responsibility and ethics in documentation"
            ]
          },
          {
            name: "Report Writing ",
            subtopics: [
              "Types: progress, analytical, factual reports","Structure: Title page, TOC, Abstract, Body, Conclusion","Report writing features: objectivity, clarity, factual tone","Use of visuals like charts, graphs in reports"
            ]
          }
        ]  
      }    
    ]    
  },  
]   
    
  


const seedDB = async () => {

  await Syllabus.insertMany(sampleSyllabi);
  console.log("✅ All syllabi inserted!");
  mongoose.connection.close();
};

seedDB();