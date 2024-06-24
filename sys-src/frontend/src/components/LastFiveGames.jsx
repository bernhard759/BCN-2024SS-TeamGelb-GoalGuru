import React, { useState, useEffect } from 'react';
import axios from 'axios'; //for makinf HTTPS request
import './LastFiveGames.css'; //CSS layout


//functional component :- for last five games of each team.

const LastFiveGames = ({ team1, team2 }) => {
  const [team1Games, setTeam1Games] = useState([]);
  const [team2Games, setTeam2Games] = useState([]);
  const team1Name = "Bayern";
  const team2Name = "Union Berlin";

// UseEffect:-only chnage if team 1 or team 2 changes

  useEffect(() => {
    console.log("useEffect triggered:", team1Name, team2Name);
    if (team1Name) {
      fetchLastFiveGames(team1Name, setTeam1Games);
    }
    if (team2Name) {
      fetchLastFiveGames(team2Name, setTeam2Games);
    }
  }, [team1Name, team2Name]);

  //getting request from api request from api.openligadb.de

  const fetchLastFiveGames = async (teamName, setGames) => {
    try {
      const response = await axios.get('https://api.openligadb.de/getmatchdata/bl1/2023');
      console.log(`API Response for ${teamName}:`, response.data);

  //filter Names and no. of teams according to Api response in console.
      const teamGames = response.data.filter(game => 
        game.team1.shortName.toLowerCase() === teamName.toLowerCase() || 
        game.team2.shortName.toLowerCase() === teamName.toLowerCase()
      ).slice(-5);
      console.log(`Filtered games for team ${teamName}:`, teamGames);
      setGames(teamGames);
    } catch (error) {
      console.error('Error fetching last five games:', error);
      setGames([]);
    }
  };


  //change of circle color to display win,draw or loss.
  const CircleColor = (game, teamName) => {
    const result = game.matchResults.find(result => result.resultTypeID === 2);
    if (!result) {
      return 'red'; // Default to loss if no result.
    }
    const pointsTeam1 = result.pointsTeam1;
    const pointsTeam2 = result.pointsTeam2;
    if (pointsTeam1 === pointsTeam2) return 'orange'; // Draw
    if ((game.team1.shortName.toLowerCase() === teamName.toLowerCase() && pointsTeam1 > pointsTeam2) ||
        (game.team2.shortName.toLowerCase() === teamName.toLowerCase() && pointsTeam2 > pointsTeam1)) {
      return 'green'; // Win
    }
    return 'red'; // Loss
  };

  
  //render table to display fast five games.
  const renderGamesTable = (games, teamName) => {
    console.log(`Rendering table for ${teamName}:`, games);
    if (!Array.isArray(games) || games.length === 0) {
      return <div>No games available for Team {teamName}</div>;
    }

    return (
      <div className="table-container">
        <h4>
          Last Five Games for 
          <span className="result-circles">
            {games.map((game, index) => (
              <span key={index} className={`circle ${CircleColor(game, teamName)}`}></span>
            ))}
          </span> {teamName}
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

              let opponent;
              if (match.team1.shortName.toLowerCase() === teamName.toLowerCase()) {
                opponent = match.team2;
              } else if (match.team2.shortName.toLowerCase() === teamName.toLowerCase()) {
                opponent = match.team1;
              } else {
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

  //return tables using renderGamesTable.
  return (
    <div className="last-five-games">
      <div className="tables-container">
        {renderGamesTable(team1Games, team1Name)}
        {renderGamesTable(team2Games, team2Name)}
      </div>
    </div>
  );
};

export default LastFiveGames;
