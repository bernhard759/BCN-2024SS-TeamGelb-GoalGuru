// src/LastFiveGames.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LastFiveGames.css';

const LastFiveGames = ({ team1, team2 }) => {
  const [team1Games, setTeam1Games] = useState([]);
  const [team2Games, setTeam2Games] = useState([]);

  useEffect(() => {
    console.log("useEffect triggered:", team1, team2); // Log to see if useEffect is triggered
    if (team1 && team2) {
      fetchLastFiveGames(team1, setTeam1Games);
      fetchLastFiveGames(team2, setTeam2Games);
    }
  }, [team1, team2]);

  const fetchLastFiveGames = async (teamId, setGames) => {
    try {
      const response = await axios.get(`https://api.openligadb.de/getmatchdata/bl1/2023`);
      const teamGames = response.data.filter(game => game.team1.teamId == teamId || game.team2.teamId == teamId).slice(-5);
      setGames(teamGames);
      console.log(`Games for team ${teamId}:`, teamGames);
    } catch (error) {
      console.error('Error fetching last five games:', error);
    }
  };

  const getResultColor = (game, teamId) => {
    teamId = parseInt(teamId, 10)
    console.log('Game details:', game);
    const result = game.matchResults.find(result => result.resultTypeID === 2);
    if (!result) {
        console.error('Result not found for game:', game);
        return 'red'; // Default to loss if no result is found
    }
    const pointsTeam1 = result.pointsTeam1;
    const pointsTeam2 = result.pointsTeam2;
    
    if (pointsTeam1 === pointsTeam2) return 'orange'; // Draw
    if ((game.team1.teamId === teamId && pointsTeam1 > pointsTeam2) ||
        (game.team2.teamId === teamId && pointsTeam2 > pointsTeam1)) {
      return 'green'; // Win
    }
    return 'red'; // Loss
};

const renderGamesTable = (games, teamId) => {
  if (!games || games.length === 0) {
    return <div>No games available for Team {teamId}</div>;
  }

  return (
    <div className="table-container">
      <h4>
        Last Five Games for Team 
        <span className="result-circles">
          {games.map((game, index) => (
            <span key={index} className={`circle ${getResultColor(game, teamId)}`}></span>
          ))}
        </span> {teamId}
      </h4>
        <table className="games-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Opponent</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
  {games.map((match) => {
    const result = match.matchResults.find(result => result.resultTypeID === 2);
    const pointsTeam1 = result ? result.pointsTeam1 : 'N/A';
    const pointsTeam2 = result ? result.pointsTeam2 : 'N/A';

    // Ensure teamId is an integer
    const teamIdInt = parseInt(teamId, 10);

    console.log(`Game: ${match.matchID}, Team1: ${match.team1.teamId}, Team2: ${match.team2.teamId}, PointsTeam1: ${pointsTeam1}, PointsTeam2: ${pointsTeam2}`);
    console.log('Function teamId: ', teamIdInt);
    
    let opponent;
    if (match.team1.teamId === teamIdInt) {
      opponent = match.team2;
    } else if (match.team2.teamId === teamIdInt) {
      opponent = match.team1;
    } else {
      // If the teamId does not match either team, log an error or handle as needed
      console.error(`teamId ${teamIdInt} does not match either team in match ${match.matchID}`);
      opponent = { teamName: "Unknown", teamIconUrl: "" };
    }

    return (
      <tr key={match.matchID}>
        <td>{new Date(match.matchDateTimeUTC).toLocaleString()}</td>
        <td>
          <div>
            <img src={opponent.teamIconUrl} alt={opponent.teamName} width="30" />
            {opponent.teamName}
          </div>
        </td>
        <td>{pointsTeam1} - {pointsTeam2}</td>
      </tr>
    );
  })}
</tbody>


        </table>
      </div>
    );
  };

  return (
    <div className="last-five-games">
      <div className="tables-container">
        {renderGamesTable(team1Games, team1)}
        {renderGamesTable(team2Games, team2)}
      </div>
    </div>
  );
};

export default LastFiveGames;
