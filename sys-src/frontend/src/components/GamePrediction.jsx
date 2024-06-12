import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from "./GamePrediction.module.css";
import axios from 'axios';

export default function GamePrediction({ teams }) {
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
            try {
                const homeTeam = teams[0];
                const awayTeam = teams[1];

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
            case 'win':
                return `${teams[0]} wins (${probaValuePercentageDisplay(value)})`;
            case 'draw':
                return `${teams[0]} and ${teams[1]} share points (${probaValuePercentageDisplay(value)})`;
            case 'lose':
                return `${teams[0]} loses (${probaValuePercentageDisplay(value)})`;
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
        return <h4 className="text-center m-5 text-secondary" data-testid="errortext">&#10060; There was a problem fetching the prediction form the backend. Please try again.</h4>;
    }

    // Component Markup
    return (
        <>
            {/*Prediction text */}
            {!isLoading ? (
                <p className="lead text-center display-6" data-testid="predictiontext">We are {probaValuePercentageDisplay(getMaxProba(prediction))} sure that {
                    getMaxProbabilityKey(prediction) == "win" ? `${prediction.team} wins the game.` : getMaxProbabilityKey(prediction) == "lose" ? `${prediction.team} loses the game.` : "the game is a draw"}</p>
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
                                        `${probability === 'win'
                                            ? 'bg-success'
                                            : probability === 'draw'
                                                ? 'bg-warning'
                                                : 'bg-danger'
                                        } text-light fw-bolder`) : (
                                        `${probability === 'win'
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
