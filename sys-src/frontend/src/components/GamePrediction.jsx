import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from "./GamePrediction.module.css";

export default function GamePrediction({ teams }) {

    const mockResponse = {
        "prediction": "Team 1",
        "probabilities": {
            "win": 0.65,
            "draw": 0.25,
            "lose": 0.10
        }
    };

    const maxProba = Math.max(...Object.values(mockResponse.probabilities));
    const maxProbabilityKey = Object.keys(mockResponse.probabilities).find(key => mockResponse.probabilities[key] === maxProba);

    function getPopupMessage(result, value) {
        switch (result) {
            case 'win':
                return `${teams[0]} wins (${value*100}%)`;
            case 'draw':
                return `${teams[0]} and ${teams[1]} share points (${value*100}%)`;
            case 'lose':
                return `${teams[0]} loses (${value*100}%)`;
            default:
                return '';
        }
    };

    // Markup
    return (
        <>
            {mockResponse.probabilities && (
                <>
                    <p className="lead text-center">We are {maxProba * 100}% sure that {
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
                                    {(value * 100)}%
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
