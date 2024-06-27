import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const GamedayInfos = () => {
    const { t } = useTranslation();

    // State
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gamedayInfo, setGamedayInfo] = useState(null);
    const [error, setError] = useState(null);

    // Effects
    //----------------------------------------------------------------
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setError(null);
                const response = await axios.get('https://api.openligadb.de/getmatchdata/bl1/2023');
                const allMatches = response.data;

                const latestGameday = Math.max(...allMatches.map(match => match.group.groupOrderID));
                const latestMatches = allMatches.filter(match => match.group.groupOrderID === latestGameday);

                setMatches(latestMatches);

                // Set gameday info
                if (latestMatches.length > 0) {
                    const firstMatch = latestMatches[0];
                    setGamedayInfo({
                        date: new Date(firstMatch.matchDateTime).toLocaleDateString(),
                        number: firstMatch.group.groupOrderID,
                        season: firstMatch.leagueSeason
                    });
                }
            } catch (error) {
                console.error('Error fetching match data:', error);
                setError(t('lastgameday.nodataalert'));
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);
    //----------------------------------------------------------------

    /**
     * Get the winner of the match or draw.
     * @param {*} match 
     * @returns 
     */
    const getWinner = (match) => {
        const team1Score = match.matchResults.find(result => result.resultTypeID === 2).pointsTeam1;
        const team2Score = match.matchResults.find(result => result.resultTypeID === 2).pointsTeam2;

        if (team1Score > team2Score) return match.team1.teamName;
        if (team2Score > team1Score) return match.team2.teamName;
        return 'Draw';
    };

    const SkeletonCard = () => (
        <Col>
            <Card data-testid="skeleton-card" className="skeleton-card border-0 h-100" style={{ backgroundImage: "var(--bs-gradient)", backgroundColor: "var(--bs-secondary-bg-subtle)" }}>
                <Card.Body>
                    <Skeleton height={24} width="80%" />
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={20} width="40%" />
                </Card.Body>
            </Card>
        </Col>
    );

    // Markup
    return (
        <Container>
            <h2 className="my-5 text-center">{t('lastgameday.matchdayresults')}</h2>

            <Row xs={1} md={2} lg={3} className="g-4">
                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : error ? (
                    <Col>
                        <p className="text-center">{t('lastgameday.nodata')}</p>
                    </Col>
                ) : (
                    matches.map((match) => (
                        <Col key={match.matchID}>
                            <Link to={`/match/${match.matchID}`} style={{ textDecoration: 'none' }}>
                                <Card className="border-0 h-100 clickable-card" style={{ backgroundImage: "var(--bs-gradient)", backgroundColor: "var(--bs-secondary-bg-subtle)" }}>
                                    <Card.Body>
                                        <Card.Title className="match-title">{match.team1.teamName} vs {match.team2.teamName}</Card.Title>
                                        <Card.Text className="match-result">
                                            {t('lastgameday.result')}: {match.matchResults.find(result => result.resultTypeID === 2).pointsTeam1} - {match.matchResults.find(result => result.resultTypeID === 2).pointsTeam2}
                                        </Card.Text>
                                        <Card.Text className="match-winner">
                                            {t('lastgameday.winner')}: {getWinner(match)}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default GamedayInfos;
