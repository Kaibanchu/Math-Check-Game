import React from "react";
import { useState, useEffect } from "react";
import "./Game.scss";
import Confetti from "react-confetti";
import soundReady from "./soundReady.mp3";
import soundCorrect from "./soundCorrect.mp3";
import soundError from "./soundError.mp3";
import soundCongratulation from "./soundCongratulation.mp3";
//import soundHurry from "./soundHurry.mp3";
//const newScore= [];
const symbols = ["+", "-", "x", "/"];
//const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const Game = () => {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("6");
  const [min2, setMin2] = useState("1");
  const [max2, setMax2] = useState("6");
  const [bestScore, setBestScore] = useState([]);
  const [startGame, setStartGame] = useState(false);
  const [types, setTypes] = useState("");
  const [groupTypes, setGroupTypes] = useState(["+"]);
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [timeInput, setTimeInput] = useState("30");
  const [count, setCount] = useState(timeInput);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submit, setSubmit] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [options, setOptions] = useState([]);
  const [checkAnswer, setCheckAnswer] = useState("");
  const [add, setAdd] = useState(false);
  const [disable, setDisable] = useState(true);

  const handleSetTypes = (symbol) => {
    const indexTypes = groupTypes.findIndex((t) => t === symbol);
    let prevTypes = [...groupTypes];
    if (indexTypes === -1) {
      prevTypes = [...prevTypes, symbol];
    } else {
      prevTypes.splice(indexTypes, 1);
    }
    setGroupTypes([...prevTypes]);
    // setGroupTypes((prev) => prev.includes(symbol)?[...prev] = prev.slice(prev.indexOf(symbol),prev.indexOf(symbol)+ 1): [...prev, symbol]);
  };

  const randomNumber = (a, b) => {
    return Math.floor(Math.random() * (b - a + 1) + a);
  };

  const generateQuestion = () => {
    const mins = min;
    const maxs = max;
    const mins2 = min2;
    const maxs2 = max2;
    const typesIndex = Math.floor(Math.random() * groupTypes.length);
    const types = groupTypes[typesIndex];
    const num1 = randomNumber(Number(mins), Number(maxs));
    const num2 = randomNumber(Number(mins2), Number(maxs2));

    if (types === "+") {
      setQuestion(`${num1} ${types} ${num2}`);
      setAnswer(num1 + num2);
    }
    if (types === "-") {
      num1 > num2
        ? (setQuestion(`${num1} ${types} ${num2}`), setAnswer(num1 - num2))
        : (setQuestion(`${num2} ${types} ${num1}`), setAnswer(num2 - num1));
    }
    if (types === "x") {
      setQuestion(`${num1} ${types} ${num2}`);
      setAnswer(num1 * num2);
    }

    if (types === "/") {
      if (num1 > num2 && num1 % num2 === 0 && num2 !== 0) {
        setQuestion(`${num1} ${types} ${num2}`);
        setAnswer(num1 / num2);
        setAdd(false);
      }
      return generateQuestion(); // gọi lại trong lần đầu tiên nếu không chọn số phù hợp.
    }
    setAdd(false);
  };
  useEffect(() => {
    const answerCheck = Array.from({ length: 4 });
    if (startGame) {
      // const answerCheck= Array.from ({length: 4})
      const answerIndex = Math.floor(Math.random() * 4);
      answerCheck[answerIndex] = answer;
      if (answerIndex !== 0) {
        answerCheck[0] = answer - 1;
      }
      if (answerIndex !== 1) {
        answerCheck[1] = answer + 1;
      }
      if (answerIndex !== 2) {
        answerCheck[2] = answer + 2;
      }
      if (answerIndex !== 3) {
        answerCheck[3] = answer - 2;
      }
    }
    setOptions(answerCheck);
  }, [startGame, add]);

  const startGameHandler = () => {
    if (!startGame && disable) {
      setCount(timeInput);
      new Audio(soundReady).play();
      setDisable(false)
      setTimeout(() => {
        setStartGame(true);
        generateQuestion();
      }, 2000);
    }
  };
  const handleSubmit = (number) => {
    if (count > 0) {
      //console.log(parseInt(result), parseInt(answer));
      if (number == answer) {
        new Audio(soundCorrect).play();
        setCount(timeInput); // gia lập giá trị nhập vao la 15
        setScore(score + 1);
        setAdd(true);
        setOptions([]);
        setTypes("");

        setTimeout(() => {
          generateQuestion();
          setSubmit(true);
        }, 300);
      } else {
        new Audio(soundError).play();
        setTimeout(() => {
          setWrong(wrong + 1);
          setCount(0);
          setQuestion("");
        }, 3000);
        setAnswer("");
        
      }
    }
  };
  const handleCheckAnwer = (number) => {
    setCheckAnswer(number);
    if (submit) {
      setSubmit(false);
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
    setMin("1");
    setMax("6");
    setTimeInput("30");
    setOptions([]);
    setCheckAnswer("");
    setGroupTypes(["+"]);
    setTypes("");
    setSubmit(false);
    setAdd(false);
    setDisable(true);
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
    setMin("1");
    setMax("6");
    setMin2("1");
    setMax2("6");
    setTimeInput("30");
    setOptions([]);
    setCheckAnswer("");
    setGroupTypes(["+"]);
    setTypes("");
    setDisable(true);
  };
  useEffect(() => {
    let interval = null;
    if (startGame) {
      interval =
        count > 0 &&
        setInterval(() => {
          setCount((preState) => preState - 1);
        }, 1000);
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [count, startGame]);

  useEffect(() => {
    if (startGame) {
      if (count === 0) setConfetti(true);
      if (count === 0) {
        new Audio(soundCongratulation).play();
      }
    }
  }, [startGame, count]);

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
                value={timeInput}
                title="5"
                onChange={(e) => {
                  setTimeInput(e.target.value);
                }}
              />
            </div>
            <div className="input">
              <span>Factory 1:</span>
              <span>Min</span>
              <input
                id="min"
                type="text"
                value={min}
                title="add number"
                onChange={(e) => setMin(e.target.value)}
              />
              <span>Max</span>
              <input
                id="max"
                type="text"
                value={max}
                title="add number"
                onChange={(e) => setMax(e.target.value)}
              />
            </div>
            <div className="input2">
            <span>Factory 2:</span>
              <span>Min</span>
              <input
                id="min2"
                type="text"
                value={min2}
                title="add number"
                onChange={(e) => setMin2(e.target.value)}
              />
              <span>Max</span>
              <input
                id="max2"
                type="text"
                value={max2}
                title="add number"
                onChange={(e) => setMax2(e.target.value)}
              />

            </div>
            <div className="type">
              {symbols.map((symbol) => (
                <button
                  key={symbol}
                  style={
                    groupTypes.includes(symbol, 0)
                      ? { backgroundColor: "rgb(240, 212, 165)" }
                      : {}
                  }
                  onClick={() => handleSetTypes(symbol)}
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
            <div className="header">
              <div className="count">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-stopwatch"
                  viewBox="1 -2.2 18 18"
                >
                  <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z" />
                  <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3" />
                </svg>
                {count}
              </div>
              <div className="score">
                <strong>{score}</strong>
              </div>

              <div className="reset" onClick={handleReset}>
                <button>
                  Reset
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
                    />
                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="game">{question} = ?</div>
            <div className="number">
              <button
                className="n0"
                key={options[0]}
                onClick={() => {
                  handleCheckAnwer(options[0]),
                    setTypes(options[0]),
                    handleSubmit(options[0]);
                }}
              >
                {options[0]}
              </button>
              <button
                className="n1"
                key={options[1]}
                onClick={() => {
                  handleCheckAnwer(options[1]),
                    setTypes(options[1]),
                    handleSubmit(options[1]);
                }}
              >
                {options[1]}
              </button>

              <button
                className="n2"
                key={options[2]}
                onClick={() => {
                  handleCheckAnwer(options[2]),
                    setTypes(options[2]),
                    handleSubmit(options[2]);
                }}
              >
                {options[2]}
              </button>
              <button
                className="n3"
                key={options[3]}
                onClick={() => {
                  handleCheckAnwer(options[3]),
                    setTypes(options[3]),
                    handleSubmit(options[3]);
                }}
              >
                {options[3]}
              </button>
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
              <button on>Go Back!</button>
            </div>
            <div className="clearStore" onClick={handleClearStore}>
              <button>Clear Score</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Game;
