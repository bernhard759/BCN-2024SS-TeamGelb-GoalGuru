import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MatchInfo = ({ team1, team2 }) => {
  const [team1Games, setTeam1Games] = useState([]);
  const [team2Games, setTeam2Games] = useState([]);

  useEffect(() => {
    fetchLastFiveGames(team1, setTeam1Games);
    fetchLastFiveGames(team2, setTeam2Games);
  }, [team1, team2]);

  const fetchLastFiveGames = async (teamId, setGames) => {
    try {
      const response = await axios.get(`https://api.openligadb.de/getmatchdata/bl1/2023`);
      const teamGames = response.data.filter(game => game.team1.teamId == teamId || game.team2.teamId == teamId).slice(-5);
      setGames(teamGames);
    } catch (error) {
      console.error('Error fetching last five games:', error);
    }
  };

  const renderLastGamesHeader = (teamId) => {
    return (
      <div className="last-games-header">
        <h5>Last 5 games for Team {teamId}</h5>
        <div className="last-games-circles">
          {/* Render win, draw, loss circles here */}
        </div>
      </div>
    );
  };

  const renderLastGamesTable = (games) => {
    return (
      <table className="table table-bordered game-info-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Opponent</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {games.map((match) => (
            <tr key={match.matchID}>
              <td>{new Date(match.matchDateTimeUTC).toLocaleString()}</td>
              <td>{match.team1.teamId === team1 ? match.team2.teamName : match.team1.teamName}</td>
              <td>{match.matchResults[0].pointsTeam1} - {match.matchResults[0].pointsTeam2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="match-info-container d-flex justify-content-center align-items-center flex-column mt-4">
      <div className="team-info-container d-flex justify-content-between mt-3">
        <div className="team-info mx-3">
          {renderLastGamesHeader(team1)}
          {renderLastGamesTable(team1Games)}
        </div>
        <div className="team-info mx-3">
          {renderLastGamesHeader(team2)}
          {renderLastGamesTable(team2Games)}
        </div>
      </div>
    </div>
  );
};

export default MatchInfo;
