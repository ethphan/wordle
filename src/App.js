import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [guesses, setGuesses] = useState(["", "", "", "", "", ""]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [results, setResults] = useState([[], [], [], [], [], []]);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState("");
  const [isWon, setIsWon] = useState(false);

  const handleInputChange = (e) => {
    setCurrentGuess(e.target.value.toUpperCase());
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      if (currentGuess.length !== 5) {
        setMessage("Please enter a 5-letter word.");
        return;
      }

      try {
        const response = await axios.post(
          "https://wordle-apis.vercel.app/api/validate",
          { guess: currentGuess }
        );
        const { is_valid_word: isvalidword, score } = response.data;

        if (!isvalidword) {
          setMessage("Not a valid English word.");
          return;
        }

        const newGuesses = [...guesses];
        newGuesses[attempt] = currentGuess;
        setGuesses(newGuesses);

        const newResults = [...results];
        newResults[attempt] = score;
        setResults(newResults);

        setAttempt(attempt + 1);
        setCurrentGuess("");

        if (score.every((s) => s === 2)) {
          setIsWon(true);
          setMessage("Congratulations! You guessed the word!");
        } else if (attempt === 5) {
          setMessage("Game Over! Try again.");
        } else {
          setMessage("");
        }
      } catch (error) {
        setMessage("Error validating your guess. Please try again.");
      }
    }
  };

  return (
    <div className="App">
      <h1>Wordle Clone</h1>
      <div className="game-board">
        {guesses.map((guess, index) => (
          <div key={index} className="guess-row">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`guess-tile ${
                  results[index][i] === 2
                    ? "correct"
                    : results[index][i] === 1
                    ? "present"
                    : "absent"
                }`}
              >
                {guess[i] || ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      {attempt < 6 && (
        <input
          type="text"
          value={currentGuess}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
          maxLength={5}
          className="guess-input"
          disabled={isWon}
        />
      )}
      <p>{message}</p>
    </div>
  );
};

export default App;
