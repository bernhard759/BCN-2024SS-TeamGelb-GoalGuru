import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchesAgainst.css'; 



function MatchInfo({ team1, team2 }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/api/matches', {
          params: {
            home_team: team1,
            away_team: team2
          }
        });
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetcing data!', error);
        setError(error);
      } finally {
        console.log('Checking teams: ', team1, team2);
        setLoading(false);
      }
    };

    fetchMatches();
  }, [team1, team2]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="match-info">
      <h1>Last Five Matches </h1>
      <table>
        <thead>
          <tr>
            <th>Date</th> 
            <th>Team1</th>
            <th>Team2</th>
          </tr>
        </thead>
        <tbody>
          {matches.slice(-5).map((match, index) => (
            <tr key={index}>

              <td>{match.date}</td>
              <td>{match.home_goals}</td>
              <td>{match.away_goals}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatchInfo;
