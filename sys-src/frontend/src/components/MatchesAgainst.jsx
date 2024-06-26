//import of all libraries
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchesAgainst.css'; 


//components for showing matches between two teams
function MatchInfo({ team1, team2 }) {

//states hooks for error, loading, and match management.
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//Fetching data whenever team1 or team2 props are modified
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/api/matches', {
          params: {
            home_team: team1,
            away_team: team2
          }
        });
        //update status with fetched data
        setMatches(response.data);
        //handle of any error 
      } catch (error) {
        console.error('Error fetcing data!', error);
        setError(error);
        //update loading once data is fetched.
      } finally {
        console.log('Checking teams: ', team1, team2);
        setLoading(false);
      }
    };

    fetchMatches();
  }, [team1, team2]);

  //Whilst the data is being fetched, a loading notice is displayed.
    if (loading) {
    return <div>Loading...</div>;
  }

  //Render the information once loading is finished
  return (
    <div className="match-info">
      <h3>Last Matches Against Each Other</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th> 
            <th>{team1}</th>
            <th>{team2}</th>
          </tr>
        </thead>
        <tbody>
          {matches.slice(-5).map((match, index) => (
            <tr key={index}>

              <td>{match.Date}</td>
              <td>{match.Goals_Home}</td>
              <td>{match.Goals_Away}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatchInfo;
