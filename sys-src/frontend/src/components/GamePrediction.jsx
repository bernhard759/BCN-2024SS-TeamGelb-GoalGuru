import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from "./GamePrediction.module.css";
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function GamePrediction({ teams }) {

    // Translation
    const { t } = useTranslation();

    // State
    //----------------------------------------------------------------
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prediction, setPrediction] = useState(null);
    //----------------------------------------------------------------

    // Fetching
    //----------------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const homeTeam = teams[0];
                const awayTeam = teams[1];

                let mockData = {
                    teams: ["Team A", "Team B"],
                    probabilities: {
                        home: 0.6,
                        draw: 0.3,
                        away: 0.1
                    }
                };
                //await new Promise(r => setTimeout(() => r(), 2000));
                //setPrediction(mockData)

                const response = await axios.get(`/api/predict?home_team=${homeTeam}&away_team=${awayTeam}`);
                setPrediction(response.data);
                
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [teams]);
    //----------------------------------------------------------------

    // Funcs
    //----------------------------------------------------------

    /**
     * Retrieves the maximum probability value from the prediction object.
     *
     * @param {Object} prediction - The prediction object containing probabilities.
     * @returns {number|null} The maximum probability value, or null if the prediction object is falsy.
     */
    function getMaxProba(prediction) {
        if (!prediction) return null;
        return Math.max(...Object.values(prediction.probabilities));
    }

    /**
     * Retrieves the key corresponding to the maximum probability value from the prediction object.
     *
     * @param {Object} prediction - The prediction object containing probabilities.
     * @returns {string|null} The key corresponding to the maximum probability value, or null if the prediction object is falsy.
     */
    function getMaxProbabilityKey(prediction) {
        if (!prediction) return null;
        const maxProba = getMaxProba(prediction);
        return Object.keys(prediction.probabilities).find(key => prediction.probabilities[key] === maxProba);
    }

    /**
     * Generates a message based on the result and probability value.
     *
     * @param {string} result - The result of the match ('win', 'draw', or 'lose').
     * @param {number} value - The probability value.
     * @returns {string} The formatted message with the result and probability value.
     */
    function getPopupMessage(result, value) {
        switch (result) {
            case 'home':
                return `${teams[0]} ${t("prediction.win")} (${probaValuePercentageDisplay(value)})`;
            case 'draw':
                return `${teams[0]} ${t("prediction.and")} ${teams[1]} ${t("prediction.share")} (${probaValuePercentageDisplay(value)})`;
            case 'away':
                return `${teams[0]} ${t("prediction.loses")} (${probaValuePercentageDisplay(value)})`;
            default:
                return '';
        }
    }

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

    //----------------------------------------------------------

    // Error markup
    if (error) {
        return <h4 className="text-center m-5 text-secondary" data-testid="errortext">&#10060; {t("prediction.fetcherror")}</h4>;
    }

    // Component Markup
    return (
        <>
            {/*Prediction text */}
            {!isLoading ? (
                <p className="lead text-center" style={{fontSize: "1.5em"}} data-testid="predictiontext">{t("prediction.sentencewe")} {probaValuePercentageDisplay(getMaxProba(prediction))} {t("prediction.sentencesure")} {
                    getMaxProbabilityKey(prediction) == "home" ? `${prediction.teams[0]} ${t("prediction.sentencewin")}` : getMaxProbabilityKey(prediction) == "away" ? `${prediction.teams[0]} ${t("prediction.sentencelose")}` : `${t("prediction.sentencedraw")}`}</p>
            ) :
                <div className="d-flex justify-content-center" data-testid="loadingskeleton1">
                    <Skeleton containerClassName="my-2" width={400} />
                </div>}

            {/*Prediction proba bar*/}
            {!isLoading ? (
                <div className={styles["probability-bar"]}>
                    {Object.entries(prediction.probabilities).map(([probability, value]) => (
                        <OverlayTrigger
                            key={probability}
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-${probability}`}>
                                    {getPopupMessage(probability, value)}
                                </Tooltip>
                            }
                        >
                            {/*Percentage bar*/}
                            <div
                                key={probability}
                                className={`
                                    ${styles["probability-section"]} 
                                    ${probability === getMaxProbabilityKey(prediction) ? (
                                        `${probability === 'home'
                                            ? 'bg-success'
                                            : probability === 'draw'
                                                ? 'bg-warning'
                                                : 'bg-danger'
                                        } text-light fw-bolder`) : (
                                        `${probability === 'home'
                                            ? styles["proba-bg-win"]
                                            : probability === 'draw'
                                                ? styles["proba-bg-draw"]
                                                : styles["proba-bg-lose"]
                                        } text-secondary fw-normal`)}  
                                     d-flex justify-content-center align-items-center`}
                                style={{ width: `${value * 100}%` }}
                            >
                                {(probaValuePercentageDisplay(value))}
                                <span className={styles.popup}></span>
                            </div>
                        </OverlayTrigger>
                    ))}
                </div>
            ) : <div data-testid="loadingskeleton2"><Skeleton height={40} /></div>}

        </>
    );
}
