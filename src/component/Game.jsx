import React from "react";
import { useState, useEffect } from "react";
import "./Game.scss";
import Confetti from "react-confetti";
import soundReady from "./soundReady.mp3";
//import soundHurry from "./soundHurry.mp3";
//const newScore= [];
const symbols = ["+", "-", "*", "/"];
//const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const Game = () => {
  const [bestScore, setBestScore] = useState([]);
  const [startGame, setStartGame] = useState(false);
  const [types, setTypes] = useState("+");
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(60);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submit, setSubmit] = useState(false);
  const [confetti, setConfetti] = useState(false);
  // const audioRef =useRef();

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const generateQuestion = () => {
    if (types === "+") {
      const num1 = randomNumber(0, 20);
      const num2 = randomNumber(0, 20);
      setQuestion(`${num1} ${types} ${num2}`);
    }
    if (types === "-") {
      const num1 = randomNumber(0, 20);
      const num2 = randomNumber(0, 20);
      num1 > num2
        ? setQuestion(`${num1} ${types} ${num2}`)
        : setQuestion(`${num2} ${types} ${num1}`);
    } else {
      const num1 = randomNumber(1, 10);
      const num2 = randomNumber(1, 10);
      setQuestion(`${num1} ${types} ${num2}`);
    }
  };

  const startGameHandler = () => {
    if (!startGame) {
      new Audio(soundReady).play();
      setTimeout(() => {
        setStartGame(true);
        generateQuestion();
      }, 2500);
    }
  };
  const handleSubmit = () => {
    if (count > 0) {
      const result = eval(question);
      //console.log(parseInt(result), parseInt(answer));
      if (parseInt(result) === parseInt(answer)) {
        setScore(score + 1);
      } else {
        setWrong(wrong + 1);
      }
      generateQuestion();
      setAnswer("");
      setSubmit(true);
    }
  };
  const handleReset = () => {
    setStartGame(false);
    setWrong(0);
    setScore(0);
    setCount(60);
    setQuestion("");
    setAnswer("");
    setConfetti(false);
  };

  const n = (digit) => {
    let wcAnswer = answer;
    if (submit) {
      wcAnswer = "";
      setSubmit(false);
    }
    setAnswer(wcAnswer + digit);
  };
  useEffect(() => {
    if (count > 0 && startGame === true) {
      setBestScore((prev) => {
        const newScore = [...prev, score];
        const jsonScore = JSON.stringify(newScore);
        localStorage.setItem("bestScores", jsonScore);
        return newScore;
      });
    }
  }, [score]);

  let maxScore = (JSON.parse(localStorage.getItem("bestScores")) ?? [0]).reduce(
    function (a, b) {
      return a > b ? a : b;
    }
  );

  const handleClearStore = () => {
    localStorage.removeItem("bestScores");
    setStartGame(false);
    setWrong(0);
    setScore(0);
    setCount(60);
    setQuestion("");
    setAnswer("");
    setConfetti(false);
  };

  useEffect(() => {
    let interval = null;
    if (startGame) {
      interval =
        count > 0 &&
        setInterval(() => {
          setCount((preState) => preState - 1);
        }, 1000);
      if (count === 15) {
        new Audio("src/component/soundHurry .mp3").play();
      }
      if (count === 0) setConfetti(true);
      if (count === 0) {
        new Audio("src/component/soundCongratulation.mp3").play();
      }
    }
    //setConfetti(true);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [count, startGame]);

  return (
    <>
      {confetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={2000}
          recycle={false}
        />
      )}
      <div className="game-container">
        {!startGame ? (
          <div className="game-content">
            <div className="type">
              {symbols.map((symbol) => (
                <button
                  key={symbol}
                  style={
                    types === symbol
                      ? {
                          backgroundColor: "orange",
                        }
                      : {}
                  }
                  onClick={() => setTypes(symbol)}
                >
                  {symbol}
                </button>
              ))}
            </div>

            <div className="game-start" onClick={startGameHandler}>
              Start
            </div>
          </div>
        ) : count > 0 ? (
          <div className="calculator">
            <div className="wrong">
              Wrong: <strong>{wrong}</strong>
            </div>
            <div className="score">
              Score: <strong>{score}</strong>
            </div>
            <div className="count">
              Time: <strong>{count}</strong>
            </div>
            <div className="game">
              {question} = {answer}
            </div>
            <div className="n1" onClick={() => n("1")}>
              <button>1</button>
            </div>
            <div className="n2" onClick={() => n("2")}>
              <button>2</button>
            </div>
            <div className="n3" onClick={() => n("3")}>
              <button>3</button>
            </div>
            <div className="n4" onClick={() => n("4")}>
              <button>4</button>
            </div>
            <div className="n5" onClick={() => n("5")}>
              <button>5</button>
            </div>
            <div className="n6" onClick={() => n("6")}>
              <button>6</button>
            </div>
            <div className="n7" onClick={() => n("7")}>
              <button>7</button>
            </div>
            <div className="n8" onClick={() => n("8")}>
              <button>8</button>
            </div>
            <div className="n9" onClick={() => n("9")}>
              <button>9</button>
            </div>
            <div className="n0" onClick={() => n("0")}>
              <button>0</button>
            </div>

            <div className="reset" onClick={handleReset}>
              <button>Reset</button>
            </div>
            <div className="submit" onClick={handleSubmit}>
              <button>Submit</button>
            </div>
          </div>
        ) : (
          <div className="result">
            <div className="credit1"> CONGRATULATION </div>
            <br />
            <div className="credit2">
              Your Score: <div className="score1">{score} </div>
            </div>
            <div className="credit3">
              {" "}
              Best Score: <div className="score2">{maxScore}</div>{" "}
            </div>
            <div className="reset" onClick={handleReset}>
              <button>Reset</button>
            </div>
            <div className="clearStore" onClick={handleClearStore}>
              <button>Clear Store</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Game;
