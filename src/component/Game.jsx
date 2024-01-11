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
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [bestScore, setBestScore] = useState([]);
  const [startGame, setStartGame] = useState(false);
  const [types, setTypes] = useState("+");
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submit, setSubmit] = useState(false);
  const [confetti, setConfetti] = useState(false);


  // const audioRef =useRef();

  const mins = min;
  const maxs = max;

  const result = eval(question);

  const randomNumber = (a, b) => {
    return Math.floor(Math.random() * (b - a + 1) + a);
  };
  const generateQuestion = () => {
    if (types === "+") {
      const num1 = randomNumber(Number(mins), Number(maxs));
      const num2 = randomNumber(Number(mins), Number(maxs));
      setQuestion(`${num1} ${types} ${num2}`);
    }
    if (types === "-") {
      const num1 = randomNumber(Number(mins), Number(maxs));
      const num2 = randomNumber(Number(mins), Number(maxs));
      num1 > num2
        ? setQuestion(`${num1} ${types} ${num2}`)
        : setQuestion(`${num2} ${types} ${num1}`);
    }
  };
  const startGameHandler = () => {
    if (!startGame) {
      
      new Audio(soundReady).play();
      setTimeout(() => {
        setStartGame(true);
        generateQuestion();
      }, 2000);
    }
  };
  const handleSubmit = () => {
    if (count > 0) {
      //console.log(parseInt(result), parseInt(answer));
      if (parseInt(result) === parseInt(answer)) {
        new Audio("src/component/soundCorrect.mp3").play();
        setCount(15); // gia lập giá trị nhập vao la 15
        setScore(score + 1);
        generateQuestion();
        setAnswer("");
        setSubmit(true);
      } else {
        new Audio("src/component/soundError.mp3").play();
        setTimeout(() => {
          setWrong(wrong + 1);
        }, 2000);
        setAnswer("");
        setQuestion("");
      }
    }
  };
  const handleReset = () => {
    setStartGame(false);
    setWrong(0);
    setScore(0);
    setCount(0);
    setQuestion("");
    setAnswer("");
    setConfetti(false);
    setMin("");
    setMax("");
    
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
    setCount("");
    setQuestion("");
    setAnswer("");
    setConfetti(false);
    setBestScore([]);
  };
  useEffect(() => {
    startGame &&
      setInterval(()=> setCount (prevState => prevState -1), 1000);
      return () => clearInterval(setInterval(()=> setCount (prevState => prevState -1), 1000));
  }, [startGame]);

  useEffect(() => {
    if (startGame) {
      if (count === 0) setConfetti(true);
      if (count === 0) {
        new Audio("src/component/soundCongratulation.mp3").play();
      }
    }

    
  }, [startGame, count]);
  //console.log (startGame);
  // console.log(count);
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
            <div className="timeQuestion">
              <span>Time for each question (s):</span>
              <input
                id="timeQuestion"
                type="text"
                value={count}
                title="5"
                onChange={(e) => {
                  setCount(e.target.value);
                }}
              />
            </div>
            <div className="input">
              <span>Min:</span>
              <input
                id="min"
                type="text"
                value={min}
                title="add number"
                onChange={(e) => setMin(e.target.value)}
              />
              <span>Max:</span>
              <input
                id="max"
                type="text"
                value={max}
                title="add number"
                onChange={(e) => setMax(e.target.value)}
              />
            </div>
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
        ) : count > 0 && wrong === 0 ? (
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
