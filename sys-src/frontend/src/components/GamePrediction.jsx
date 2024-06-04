import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from "./GamePrediction.module.css";

export default function GamePrediction({ teams }) {

    const mockResponse = {
        "prediction": "Team 1",
        "probabilities": {
            "win": 0.2520,
            "draw": 0.64168,
            "lose": 0.10001
        }
    };

    const maxProba = Math.max(...Object.values(mockResponse.probabilities));
    const maxProbabilityKey = Object.keys(mockResponse.probabilities).find(key => mockResponse.probabilities[key] === maxProba);

    // Funcs
    //----------------------------------------------------------

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

    // Markup
    return (
        <>
            {mockResponse.probabilities && (
                <>
                    <p className="lead text-center">We are {probaValuePercentageDisplay(maxProba)} sure that {
                        maxProbabilityKey == "win" ? `${mockResponse.prediction} wins the game.` : maxProbabilityKey == "lose" ? `${mockResponse.prediction} loses the game.` : "the game is a draw"}</p>

                    <div className={styles["probability-bar"]}>
                        {Object.entries(mockResponse.probabilities).map(([probability, value]) => (
                            <OverlayTrigger
                                key={probability}
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-${probability}`}>
                                        {getPopupMessage(probability, value)}
                                    </Tooltip>
                                }
                            >

                                <div
                                    key={probability}
                                    className={`${styles["probability-section"]} ${probability === maxProbabilityKey ? (
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
                                        } text-secondary fw-normal`)}  d-flex justify-content-center align-items-center `}
                                    style={{ width: `${value * 100}%` }}
                                >
                                    {(probaValuePercentageDisplay(value))}
                                    <span className={styles.popup}></span>
                                </div>
                            </OverlayTrigger>
                        ))}
                    </div>

                </>
            )}
        </>
    );
}