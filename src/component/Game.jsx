import React from "react";
import { useState, useEffect } from "react";
import "./Game.scss";

const symbols = ["+", "-", "*", "/"];
const Game = () => {
  const [startGame, setStartGame] = useState(false);
  const [types, setTypes] = useState("+");
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(60);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submit, setSubmit] = useState(false);
  //const [confetti, setConfetti] = useState(false);
  //const inputRef =useRef(null)

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const generateQuestion = () => {
    if (types === "+" || types === "-") {
      const num1 = randomNumber(0, 20);
      const num2 = randomNumber(0, 20);
      setQuestion(`${num1} ${types} ${num2}`);
    } else {
      const num1 = randomNumber(1, 10);
      const num2 = randomNumber(1, 10);
      setQuestion(`${num1} ${types} ${num2}`);
    }
  };
  const startGameHandler = () => {
    if (!startGame) {
      setStartGame(true);
      generateQuestion();
    }
  };
  const handleSubmit = () => {
    if (count > 0) {
      const result = eval(question);
      console.log(parseInt(result), parseInt(answer));
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
    let interval = null;
    if (startGame) {
      interval =
        count > 0 &&
        setInterval(() => {
          setCount((preState) => preState - 1);
        }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [count, startGame]);

  return (
    <>
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
        ) : (
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
        )}
      </div>
    </>
  );
};

export default Game;
