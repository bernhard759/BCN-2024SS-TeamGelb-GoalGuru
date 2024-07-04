import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { FaCheck, FaTimes, FaMinus } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaTable } from "react-icons/fa";
import axios from 'axios';
import './TeamMatches.css';


//components to show the two teams' last five games
const TeamMatches = ({ team1, team2 }) => {
  //states to hold games data.
  const [team1Games, setTeam1Games] = useState([]);
  const [team2Games, setTeam2Games] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const team1Name = team1;
  const team2Name = team2;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 0));
        if (team1Name) {
          await fetchLastFiveGames(team1Name, setTeam1Games);
        }
        if (team2Name) {
          await fetchLastFiveGames(team2Name, setTeam2Games);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [team1Name, team2Name]);

  //function to retrieve the teams' latest five games.
  const fetchLastFiveGames = async (teamName, setGames) => {
    teamName = CaptalizeFirstLetter(getLongestWord(teamName));
    try {
      const response = await axios.get(`https://api.openligadb.de/getmatchdata/bl1/2023/${teamName}`);
      console.log(`API Response for ${teamName}:`, response.data);


      const teamGames = response.data.slice(-5).sort((a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime));

      console.log(`Filtered games for team ${teamName}:`, teamGames);
      setGames(teamGames);
    } catch (error) {
      console.error('Error fetching last five games:', error);
      setError(error);
      setGames([]);
    }
  };


  function CaptalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  function getLongestWord(string) {
    const words = string.trim().split(" ").filter(word => word.length > 3);
    if (words.length > 1) {
      words.shift();
    }
    return words.reduce((longest, current) => {
      return current.length > longest.length ? current : longest;
    }, '');
  }


  //use bootstrap to select the result color based on the game output.
  const getResultColor = (game, teamName) => {
    teamName = CaptalizeFirstLetter(getLongestWord(teamName))
    console.log("Game", game.team1, teamName)

    const result = game.matchResults.find(result => result.resultTypeID === 2);
    if (!result) {
      return 'bg-danger';
    }
    const pointsTeam1 = result.pointsTeam1;
    const pointsTeam2 = result.pointsTeam2;
    if (pointsTeam1 === pointsTeam2) return 'bg-warning'; // Draw
    if ((game.team1.teamName.includes(teamName) && pointsTeam1 > pointsTeam2) ||
      (game.team2.teamName.includes(teamName) && pointsTeam2 > pointsTeam1)) {
      return 'bg-success';
    }
    return 'bg-danger';
  };

  const renderGamesTable = (games, teamName) => {
    if (loading) {
      return (
        <div className="table-container">
          <h4 className="text-center"><Skeleton width={200} /></h4>
          <div className="result-circles d-flex justify-content-center align-item-center gap-1 my-3">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} circle={true} height={30} width={30} />
            ))}
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th><Skeleton width={125} /></th>
                <th><Skeleton width={175} /></th>
                <th><Skeleton width={50} /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td><Skeleton width={125} /></td>
                  <td><Skeleton width={175} /></td>
                  <td><Skeleton width={50} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }

    if (error) {
      return (
        <div className="table-container">
          <h4 className="text-center">Last Five Games for {teamName}</h4>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="text-center text-danger-emphasis">Error loading last five games</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )
    }


    if (!Array.isArray(games) || games.length === 0) {
      return (
        <div className="table-container">
          <h4 className="text-center">Last Five Games for {teamName}</h4>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="text-center text-warning-emphasis">No games available for Team {teamName}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )
    }

    //render the tables for the last five games of the teams
    return (
      <div className="table-container">
        <h4 className="text-center">Last Five Games for {teamName}</h4>

        {/*Circles*/}
        <div className="result-circles d-flex justify-content-center align-item-center gap-1 my-3">
          {games.map((game, index) => {
            let icon;
            switch (getResultColor(game, teamName)) {
              case 'bg-success':
                icon = <FaCheck className="text-success-emphasis" />;
                break;
              case 'bg-danger':
                icon = <FaTimes className="text-danger-emphasis" />;
                break;
              case 'bg-warning':
                icon = <FaMinus className="text-warning-emphasis" />;
                break;
            }
            return (
              <span key={index} className={`circle ${getResultColor(game, teamName)}-subtle`}>
                {icon}
              </span>
            )
          })}

        </div>

        <Table striped bordered hover>
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
                  <td>{opponent == match.team1 ? <span>{pointsTeam2} : {pointsTeam1}</span> : <span>{pointsTeam1} : {pointsTeam2}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
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

export default TeamMatches;
