import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { FaCheck, FaTimes, FaMinus } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { stringSimilarity } from "string-similarity-js";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './TeamMatches.css';

const TeamMatches = ({ team1, team2 }) => {
  // Translation
  const { t } = useTranslation();

  // State
  //------------------------------------------------------------
  const [team1Games, setTeam1Games] = useState([]);
  const [team2Games, setTeam2Games] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //------------------------------------------------------------

  // Effects
  //------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch available teams
        const teamsResponse = await axios.get('https://api.openligadb.de/getavailableteams/bl1/2023');
        const teamList = teamsResponse.data.map(team => team.teamName);
        setAvailableTeams(teamList);
        if (team1) {
          await fetchLastFiveGames(team1, setTeam1Games, teamList);
        }
        if (team2) {
          await fetchLastFiveGames(team2, setTeam2Games, teamList);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [team1, team2]);
  //------------------------------------------------------------


  // Funcs
  //------------------------------------------------------------
  // Find the most similar team from the available teams
  const findMostSimilarTeam = (inputTeam, teamList) => {
    let highestSimilarity = 0;
    let mostSimilarTeam = '';

    teamList.forEach(team => {
      const similarity = stringSimilarity(inputTeam.toLowerCase(), team.toLowerCase());
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilarTeam = team;
      }
    });
    return mostSimilarTeam;
  };



  /**
   * Get the last five games for a team from openligadb
   * @param {*} teamName 
   * @param {*} setGames 
   * @param {*} teamList 
   */
  const fetchLastFiveGames = async (teamName, setGames, teamList) => {
    teamName = findMostSimilarTeam(teamName, teamList);
    try {
      const response = await axios.get(`https://api.openligadb.de/getmatchdata/bl1/2023/${teamName}`);
      //console.log(`API Response for ${teamName}:`, response.data);
      const teamGames = response.data.slice(-5).sort((a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime));
      //console.log(`Filtered games for team ${teamName}:`, teamGames);
      setGames(teamGames);
    } catch (error) {
      console.error('Error fetching last five games:', error);
      setError(error);
      setGames([]);
    }
  };

  /**
   * Get the result color by using bootstrap classes
   * @param {*} game 
   * @param {*} teamName 
   * @returns 
   */
  const getResultColor = (game, teamName) => {
    teamName = findMostSimilarTeam(teamName, availableTeams);
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

  /**
   * Render the games table
   * @param {*} games 
   * @param {*} teamName 
   * @returns 
   */
  const renderGamesTable = (games, teamName) => {
    // Loading
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

    // Error
    if (error) {
      return (
        <div className="table-container">
          <h4 className="text-center">{t("teammatches.header")} {teamName}</h4>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>{t("teammatches.date")}</th>
                <th>{t("teammatches.opp")}</th>
                <th>{t("teammatches.result")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="text-center text-danger-emphasis">{t("teammatches.error")}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )
    }

    // No matches there
    if (!Array.isArray(games) || games.length === 0) {
      return (
        <div className="table-container">
          <h4 className="text-center">{t("teammatches.header")} {teamName}</h4>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>{t("teammatches.date")}</th>
                <th>{t("teammatches.opp")}</th>
                <th>{t("teammatches.result")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="text-center text-warning-emphasis">{t("teammatches.notavailable")} {teamName}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )
    }

    // Render the tables for the last five games of the teams
    return (
      <div className="table-container">
        <h4 className="text-center">{t("teammatches.header")} {teamName}</h4>
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
              <th>{t("teammatches.date")}</th>
              <th>{t("teammatches.opp")}</th>
              <th>{t("teammatches.result")}</th>
            </tr>
          </thead>
          <tbody>
            {games.map((match) => {
              //console.log("games", games);
              const result = match.matchResults.find(result => result.resultTypeID === 2);
              const pointsTeam1 = result ? result.pointsTeam1 : '-';
              const pointsTeam2 = result ? result.pointsTeam2 : '-';
              let opponent;
              let theTeam = findMostSimilarTeam(teamName, availableTeams);
              if (match.team1.teamName.toLowerCase() == theTeam.toLowerCase()) {
                opponent = match.team2;
              } else if (match.team2.teamName.toLowerCase() == theTeam.toLowerCase()) {
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
  //------------------------------------------------------------

  // Markup
  return (
    //container for last five games.
    <div className="last-five-games">
      <div className="tables-container">
        {renderGamesTable(team1Games, team1)}
        {renderGamesTable(team2Games, team2)}
      </div>
    </div>
  );
};

export default TeamMatches;
