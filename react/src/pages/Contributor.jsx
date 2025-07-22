import React from 'react';
import { useParams } from 'react-router-dom';
import '../style/Contributor.css';

export default function Contributor() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const contributor = contributorData[decodedName];

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
