import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeamMatches.css';


//components to show the two teams' last five games
const LastFiveGames = ({ team1, team2 }) => {
  //states to hold games data.
 const [team1Games, setTeam1Games] = useState([]);
  const [team2Games, setTeam2Games] = useState([]);
  const team1Name = team1;
  const team2Name = team2;

 // When team names or props are changed, retrieve the data.
    useEffect(() => {
    console.log("useEffect triggered:", team1Name, team2Name);
    if (team1Name) {
      fetchLastFiveGames(team1Name, setTeam1Games);
    }
    if (team2Name) {
      fetchLastFiveGames(team2Name, setTeam2Games);
    }
  }, [team1Name, team2Name]);

  //function to retrieve the teams' latest five games.
  const fetchLastFiveGames = async (teamName, setGames) => {
    teamName=CaptalizeFirstLetter(getLongestWord(teamName));
    console.log("TESTER", teamName)
    try {
      const response = await axios.get(`https://api.openligadb.de/getmatchdata/bl1/2023/${teamName}`);
      console.log(`API Response for ${teamName}:`, response.data);

      
      const teamGames = response.data.slice(-5).sort((a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime))  ;
      
      console.log(`Filtered games for team ${teamName}:`, teamGames);
      setGames(teamGames);
    } catch (error) {
      console.error('Error fetching last five games:', error);
      setGames([]);
    }
  };


  function CaptalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  function getLongestWord(string){
    const words = string.trim().split(" ").filter(word => word.length > 3);
    if (words.length > 1) {
      words.shift();
    }
    return words.reduce((longest,current) => {
      return current.length > longest.length ? current : longest;
    },'');
  }


  //use bootstrap to select the result color based on the game output.
  const getResultColor = (game, teamName) => {
    teamName=CaptalizeFirstLetter(getLongestWord(teamName))
    console.log("Game", game.team1, teamName)

    const result = game.matchResults.find(result => result.resultTypeID === 2);
    if (!result) {
      return 'bg-danger'; 
    }
    const pointsTeam1 = result.pointsTeam1;
    const pointsTeam2 = result.pointsTeam2;
    if (pointsTeam1 === pointsTeam2) return 'bg-warning'; // Draw
    if ((game.team1.teamName.includes(teamName)  && pointsTeam1 > pointsTeam2) ||
        (game.team2.teamName.includes(teamName) && pointsTeam2 > pointsTeam1)) {
      return 'bg-success'; 
    }
    return 'bg-danger'; 
  };

  const renderGamesTable = (games, teamName) => {
    console.log(`Rendering table for ${teamName}:`, games);
    if (!Array.isArray(games) || games.length === 0) {
      return <div>No games available for Team {teamName}</div>;
    }

    //render the tables for the last five games of the teams
    return (
      <div className="table-container">
        <h4>Last Five Games for {teamName}</h4>
          <div className="result-circles d-flex justify-content-center align-item-center gap-1 my-3">
            {games.map((game, index) => (
              <span key={index} className={`circle ${getResultColor(game, teamName)}`}></span>
            )) 
            }
          </div> 
        
        <table className="games-table">
          <thead>
            <tr>
              {/*column names of the table*/}
              <th>Date</th>
              <th>Opponent</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {games.map((match) => {

              console.log("games", games);
              const result = match.matchResults.find(result => result.resultTypeID === 2);
              const pointsTeam1 = result ? result.pointsTeam1 : 'N/A';
              const pointsTeam2 = result ? result.pointsTeam2 : 'N/A';


              let opponent;
              let theTeam = CaptalizeFirstLetter(getLongestWord(teamName))
              if (match.team1.teamName.toLowerCase().includes(theTeam.toLowerCase())) {
                opponent = match.team2;
              } else if (match.team2.teamName.toLowerCase().includes(theTeam.toLowerCase())) {
                opponent = match.team1;
              } else {
                opponent = { teamName: "Unknown", teamIconUrl: "" };
              }

              return (
                <tr key={match.matchID}>
                  <td>{new Date(match.matchDateTimeUTC).toLocaleString()}</td>
                  <td>
                    <div>
                      {opponent.teamName}
                    </div>
                  </td>
                  <td>{opponent == match.team1 ?  <span>{pointsTeam2} : {pointsTeam1}</span>: <span>{pointsTeam1} : {pointsTeam2}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };


  return (
    //container for last five games.
    <div className="last-five-games">
      <div className="tables-container">
        {renderGamesTable(team1Games, team1Name)}
        {renderGamesTable(team2Games, team2Name)}
      </div>
    </div>
  );
};

export default LastFiveGames;
