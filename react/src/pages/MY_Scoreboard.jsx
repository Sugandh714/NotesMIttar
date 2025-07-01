import React from 'react';
import '../style/Scoreboard.css';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
const contributors = [
  { rank: 1, name: 'Sugandh Kushwaha', contributions: 45 },
  { rank: 2, name: 'Amit Verma', contributions: 38 },
  { rank: 3, name: 'Karishma Patel', contributions: 32 },
  { rank: 4, name: 'Rohan Sharma', contributions: 28 },
  { rank: 5, name: 'Priya Mehta', contributions: 25 },
];

const Scoreboard = () => {
  return (
    <>
    <Navbar/>
    <div className="scoreboard-container">
      <h1 className="scoreboard-title">🏆 Mittar League Champions</h1>
      <table className="scoreboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Contributions</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((user, index) => (
            <tr key={index}>
              <td>{user.rank}</td>
              <td>
                <Link to={`/contributor/${encodeURIComponent(user.name)}`}>
                  {user.name}
                </Link>
              </td>
              <td>{user.contributions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Scoreboard;
