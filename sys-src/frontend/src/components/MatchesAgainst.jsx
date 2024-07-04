//import of all libraries
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import './MatchesAgainst.css';


//components for showing matches between two teams
function MatchesAgainst({ team1, team2 }) {

  //states hooks for error, loading, and match management.
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetching data whenever team1 or team2 props are modified
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 0));
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

  if (error) {
    return (
      <>
      <h3 className="text-center">Last Matches Against Each Other</h3>
      <Table striped bordered hover className="mt-4">
         <thead>
          <tr>
            <th>Date</th>
            <th>{team1}</th>
            <th>{team2}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="3" className="text-center text-danger-emphasis">Error loading matches</td>
          </tr>
        </tbody>
      </Table>
      </>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="match-info">
        <h3><Skeleton width={300} /></h3>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th><Skeleton /></th>
              <th><Skeleton /></th>
              <th><Skeleton /></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td><Skeleton /></td>
                <td><Skeleton /></td>
                <td><Skeleton /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  //Render the information once loading is finished
  return (
    <div className="match-info">
      <h3>Last Matches Against Each Other</h3>
      <Table striped bordered hover className="mt-4">
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
      </Table>
    </div>
  );
}

export default MatchesAgainst;
