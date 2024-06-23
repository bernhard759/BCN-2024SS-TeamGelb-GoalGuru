// src/MatchInfo.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchInfo.css'; // Add a CSS file for styling

function MatchInfo({ team1, team2 }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/matches', {
          params: {
            home_team: team1,
            away_team: team2
          }
        });
        setMatches(response.data);
      } catch (error) {
        console.error('There was an error fetching the match data!', error);
        setError(error);
      } finally {
        console.log('Checking teams: ', team1, team2)
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
      <h1>Last Five Matches Between {team1} and {team2}</h1>
     
        <table>
          <thead>
            <tr>
              <th>Result</th>   
            </tr>
          </thead>
          <tbody>
            {matches.slice(-5).map((match, index) => (
              <tr key={index}>
                <td>
                  <img src={`path/to/team/logos/${match.home_team}.png`} alt={match.home_team} className="team-logo" />
                  {match.team1}
                 </td>
                <td>
                  <img src={`path/to/team/logos/${match.away_team}.png`} alt={match.away_team} className="team-logo" />
                  {match.team2}
                </td>
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
