import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LastFiveGames.css';

const LastFiveGames = ({ team1, team2 }) => {
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

  const renderGamesTable = (games, teamId) => {
    if (!games || games.length === 0) {
      return <div>No games available for Team {teamId}</div>;
    }

    return (
      <div className="table-container">
        <h4>Last Five Games for Team {teamId}</h4>
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
              const opponent = match.team1.teamId === teamId ? match.team2 : match.team1;

              return (
                <tr key={match.matchID}>
                  <td>{new Date(match.matchDateTimeUTC).toLocaleString()}</td>
                  <td>
                    <div>
                      <img src={opponent.teamIconUrl} alt={opponent.teamName} width="50" />
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
