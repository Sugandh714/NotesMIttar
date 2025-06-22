import React from 'react';
import { useParams } from 'react-router-dom';
import '../style/Contributor.css';

const contributorData = {
  'Sugandh Kushwaha': {
    rank: 1,
    docs: [
      { title: 'DBMS Notes - Unit 1', views: 152, rating: 4.8, link: './docs/dbms-unit1.pdf' },
      { title: 'CN Past Paper 2023', views: 101, rating: 4.5, link: '/docs/cn-2023.pdf' },
    ],
  },
  'Amit Verma': {
    rank: 2,
    docs: [
      { title: 'DSA Book Summary', views: 123, rating: 4.7, link: '/docs/dsa-summary.pdf' },
    ],
  },
  // Add other contributors similarly
};

export default function Contributor() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const contributor = contributorData[decodedName];
  console.log("Decoded Name:", decodedName);
console.log("Contributor:", contributor);

  if (!contributor) {
    return <div className="contributor-container">Contributor not found.</div>;
  }

  return (
    <div className="contributor-container">
      <h1 className="contributor-name">{decodedName}</h1>
      <h3 className="contributor-rank">Rank #{contributor.rank}</h3>

      <table className="contributions-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Views</th>
            <th>Rating</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {contributor.docs.map((doc, index) => (
            <tr key={index}>
              <td>{doc.title}</td>
              <td>{doc.views}</td>
              <td>{doc.rating}</td>
              <td>
                <a href={doc.link} target="_blank" rel="noopener noreferrer" download>
                  Open/Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
