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
  const [types, setTypes] = useState("");
  const [groupTypes, setGroupTypes] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [timeInput, setTimeInput] = useState("");
  const [count, setCount] = useState(timeInput);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submit, setSubmit] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [options, setOptions] = useState([]);
  const [checkAnswer, setCheckAnswer] = useState("");
  const [add, setAdd] = useState(false);

  // const audioRef =useRef();
  //const mins = min;
  //const maxs = max;
  // const result = eval(question);

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
    const typesIndex = Math.floor(Math.random() * groupTypes.length);
    const types = groupTypes[typesIndex];
    const num1 = randomNumber(Number(mins), Number(maxs));
    const num2 = randomNumber(Number(mins), Number(maxs));

    if (types === "+") {
      setQuestion(`${num1} ${types} ${num2}`);
      setAnswer(num1 + num2);
    }
    if (types === "-") {
      num1 > num2
        ? (setQuestion(`${num1} ${types} ${num2}`), setAnswer(num1 - num2))
        : (setQuestion(`${num2} ${types} ${num1}`), setAnswer(num2 - num1));
    }
    if (types === "*") {
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
        answerCheck[0] = answer - 3;
      }
      if (answerIndex !== 1) {
        answerCheck[1] = answer + 3;
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
    if (!startGame) {
      setCount(timeInput);
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
      if (checkAnswer == answer) {
        new Audio("src/component/soundCorrect.mp3").play();
        setCount(timeInput); // gia lập giá trị nhập vao la 15
        setScore(score + 1);
        setAdd(true);
        setOptions([]);
        setTypes("");
        setTimeout(() => {
          generateQuestion();
          setSubmit(true);
        }, 1000);
      } else {
        new Audio("src/component/soundError.mp3").play();
        setTimeout(() => {
          setWrong(wrong + 1);
          setCount(0);
        }, 3000);
        setAnswer("");
        setQuestion("");
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
    setMin("");
    setMax("");
    setTimeInput("");
    setOptions([]);
    setCheckAnswer("");
    setGroupTypes([]);
    setTypes("");
    setSubmit(false);
    setAdd(false);
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
    setMin("");
    setMax("");
    setTimeInput("");
    setOptions([]);
    setCheckAnswer("");
    setGroupTypes([]);
    setTypes("");
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
        new Audio("src/component/soundCongratulation.mp3").play();
      }
    }
  }, [startGame, count]);

  //console.log (startGame);
  // console.log(count);
  // console.log("count", count);
  //console.log("timeInput", timeInput);
  // console.log("a", a);
  //console.log("submit", submit);
  //console.log("options", options);
  //console.log("checkAnswer", checkAnswer);
  //console.log("answer", answer);
  //console.log("question", question);
  // console.log("add", add);
  // console.log("GroupTypes", groupTypes);
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
                    groupTypes.includes(symbol, 0)
                      ? { backgroundColor: "orange" }
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
              <div className="reset" onClick={handleReset}>
                <button>Reset</button>
              </div>
              <div className="score">
                Score: <strong>{score}</strong>
              </div>
              <div className="count">
                Time: <strong>{count}</strong>
              </div>
            </div>

            <div className="game">{question} = ?</div>
            <div className="number">
              {options.map((number) => (
                <button
                  key={number}
                  onClick={() => {
                    handleCheckAnwer(number), setTypes(number);
                  }}
                  style={types === number ? { backgroundColor: "orange" } : {}}
                >
                  {number}
                </button>
              ))}
            </div>

            <div className="submit" onClick={handleSubmit}>
              Submit
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
              <button on>Reset</button>
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
