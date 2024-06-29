import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, ListGroup, Badge, Table, Button } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import 'react-loading-skeleton/dist/skeleton.css';
import { MdErrorOutline, MdOutlineSearchOff } from "react-icons/md";

const MatchDetails = () => {

    // Translation
    const { t } = useTranslation();

    // Route params
    const { matchId } = useParams();

    // State
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [predictionLoading, setPredictionLoading] = useState(true);
    const [predictionError, setPredictionError] = useState(null);

    // Effects
    //-----------------------------------------------------------
    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                setError(null);
                const response = await axios.get(`https://api.openligadb.de/getmatchdata/${matchId}`);
                console.warn(response.data)
                setMatch(response.data);
            } catch (error) { 
                console.error('Error fetching match details:', error);
                (!error.response || typeof error.response.data !== 'string' || error.response.data == "") ? setError(t('matchdetails.error')) : undefined;
            } finally {
                setLoading(false);
            }
        };

        fetchMatchDetails();
    }, []);

    useEffect(() => {
        const fetchPrediction = async () => {
            setPredictionError(null);
            setPredictionLoading(true);
            try {
                if (match) {
                    const homeTeam = match.team1.teamName;
                    const awayTeam = match.team2.teamName;

                    // Mock data for demonstration
                    let mockData = {
                        teams: [homeTeam, awayTeam],
                        probabilities: {
                            home: 0.6,
                            draw: 0.3,
                            away: 0.1
                        }
                    };

                    //await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
                    //setPrediction(mockData);
                    const response = await axios.get(`/api/predict?home_team=${homeTeam}&away_team=${awayTeam}`);
                    setPrediction(response.data);
                }
            } catch (error) {
                console.error('Error fetching prediction:', error);
                setPredictionError(t('prediction.fetcherror'));
            } finally {
                setPredictionLoading(false);
            }
        };

        fetchPrediction();
    }, [match]);

    //-----------------------------------------------------------


    // Funcs
    //-----------------------------------------------------------
    const getMaxProbabilityKey = (prediction) => {
        if (!prediction) return null;
        return Object.keys(prediction.probabilities).reduce((a, b) => prediction.probabilities[a] > prediction.probabilities[b] ? a : b);
    };

    const getMatchResult = (match) => {
        const team1Score = match.matchResults.find(result => result.resultTypeID === 2).pointsTeam1;
        const team2Score = match.matchResults.find(result => result.resultTypeID === 2).pointsTeam2;

        if (team1Score > team2Score) return 'home';
        if (team2Score > team1Score) return 'away';
        return 'draw';
    };

    const isPredictionCorrect = (prediction, match) => {
        const matchResult = getMatchResult(match);
        const predictedResult = getMaxProbabilityKey(prediction);
        return matchResult === predictedResult;
    };

    /**
     * Get the name of the winning team or draw.
     * @param {string} result 
     * @param {Object} match 
     * @returns 
     */
    const getWinnerName = (result, match) => {
        if (result === 'home') return match.team1.teamName;
        if (result === 'away') return match.team2.teamName;
        return t('matchdetails.draw');
    };

    /**
     * Formats a probability value as a percentage string.
     *
     * @param {number} value - The probability value to be formatted.
     * @returns {string} The formatted percentage string.
     */
    function probaValuePercentageDisplay(value) {
        return Number(value).toLocaleString(undefined, {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    /**
     * Render the prediction bar
     * @param {Object} prediction 
     * @param {string} actualResult 
     * @returns 
     */
    function renderPredictionBar(prediction, actualResult) {
        console.log("Prediction: ", prediction);
        const barStyle = {
            display: 'flex',
            height: '25px',
            width: '100%',
            /*border: '1px solid var(--bs-secondary-bg-subtle)',*/
            borderRadius: '10px',
            overflow: 'hidden'
        };

        const segmentStyle = (result) => ({
            width: `${prediction.probabilities[result] * 100}%`,
            backgroundColor: result === "home" ? 'var(--bs-success-border-subtle)' : result === "draw" ? 'var(--bs-warning-border-subtle)' : 'var(--bs-danger-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold'
        });

        return (
            <div style={barStyle} className="opacity-75">
                <div style={segmentStyle('home')}>{probaValuePercentageDisplay(prediction.probabilities.home)}</div>
                <div style={segmentStyle('draw')}>{probaValuePercentageDisplay(prediction.probabilities.draw)}</div>
                <div style={segmentStyle('away')}>{probaValuePercentageDisplay(prediction.probabilities.away)}</div>
            </div>
        );
    };

    //-----------------------------------------------------------

    // Error and loading guard
    if (loading) return <div className="d-flex flex-column justify-content-center align-items-center border-2 gap-2 text-secondary lead my-4 p-2"><p className="text-center mt-5">{t('matchdetails.loading')}</p></div>;
    if (error) return <div className="d-flex flex-column justify-content-center align-items-center border-2 gap-2 lead text-danger my-5 p-2 border-bottom border-top"><MdErrorOutline className="display-5"/><p className="text-center text-danger fw-bold">{error}</p></div>;
    if (!match) return <div className="d-flex flex-column justify-content-center align-items-center border-2 lead gap-2 text-warning my-5 p-2 border-bottom border-top"><MdOutlineSearchOff className="display-5"/><p className="text-center text-warning fw-bold">{t('matchdetails.nomatch')}</p></div>;


    // Markup
    return (
        <Container className="my-5">

            <Card className="mb-4 border-1" style={{background: "transparent"}}>
                <Card.Body>
                    <Card.Title as="h2" className="mb-4 text-center">{match.team1.teamName} vs {match.team2.teamName}</Card.Title>
                    <div className="d-flex justify-content-center mb-3">
                        <Badge pill bg="secondary" style={{ fontSize: "1.25em", maxWidth: "10em" }}>
                            {t('matchdetails.result')}: {match.matchResults.find(result => result.resultTypeID === 2).pointsTeam1} - {match.matchResults.find(result => result.resultTypeID === 2).pointsTeam2}
                        </Badge>
                    </div>
                    <ListGroup variant="flush">
                        <ListGroup.Item><strong>{t('matchdetails.date')}:</strong> {new Date(match.matchDateTime).toLocaleString()}</ListGroup.Item>
                        <ListGroup.Item><strong>{t('matchdetails.league')}:</strong> {match.leagueName}</ListGroup.Item>
                        <ListGroup.Item><strong>{t('matchdetails.season')}:</strong> {match.leagueSeason}</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
            {/* Prediction error, loading and success */}
            {predictionError ? (
                <Card className="mb-4 border-0 p-3 text-center">
                    <div role="alert" className="text-danger text-center my-4">
                        {t("prediction.fetcherror")}
                    </div>
                </Card>
            ) : (predictionLoading) ?
                (<Card className="mb-4 border-1 p-3 text-center" style={{background: "transparent"}}>
                    <div data-testid="loadingskeleton1">
                        <Skeleton className="mb-2" count={1} height={15} style={{ width: "30%" }} />
                        <Skeleton className="mb-2" count={1} height={50} style={{ width: "100%" }} />
                        <Skeleton count={2} height={25} style={{ width: "100%" }} />
                        <Skeleton className="my-2" count={1} height={20} style={{ width: "15%" }} />
                    </div>
                </Card>) : (prediction) ? (
                    <>
                        <Card className="my-4 p-3 border-1" style={{background: "transparent"}}>
                            <Card.Body>
                                <Card.Title className="text-center">{t('prediction.probabilities')}</Card.Title>
                                {renderPredictionBar(prediction, getMatchResult(match))}
                            </Card.Body>

                            <Table bordered striped>
                                <tbody>
                                    <tr>
                                        <td><strong>{t('prediction.predictedwinner')}</strong></td>
                                        <td>{getMaxProbabilityKey(prediction) == "draw" ? t("matchdetails.draw") : getWinnerName(getMaxProbabilityKey(prediction), match) + " " + t("matchdetails.wins")}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('prediction.actualwinner')}</strong></td>
                                        <td>{getMatchResult(match) == "draw" ? t("matchdetails.draw") : getWinnerName(getMatchResult(match), match) + " " + t("matchdetails.wins")}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <div className="text-center my-4" style={{ fontSize: "1.15em" }}>
                                <Badge pill bg={isPredictionCorrect(prediction, match) ? "success" : "danger"} className="p-2">
                                    {isPredictionCorrect(prediction, match) ? t("prediction.correct") : t("prediction.incorrect")}
                                </Badge>
                            </div>
                        </Card>
                    </>
                ) : (<></>)}


            <div className="text-center" style={{ marginBlock: "4em" }}>
                <Link to="/gameday">
                    <Button variant="secondary">{t('matchdetails.back')}</Button>
                </Link>
            </div>

        </Container>
    );
};

export default MatchDetails;
