import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtbDnJqVr7sRS3GQRvFOljhpzxHeQKjUs",
  authDomain: "quizapp88.firebaseapp.com",
  projectId: "quizapp88",
  storageBucket: "quizapp88.appspot.com",
  messagingSenderId: "981360366094",
  appId: "1:981360366094:web:4215a64323b36cee5ea25f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();

var root = document.getElementById("root");
var questionCount = document.getElementById("questionCount");
var question = document.getElementById("question");
var options = document.getElementById("options");
var main = document.getElementById("main");
var result = document.getElementById("result");
var progressBar = document.getElementById("progressBar");
var timer = document.getElementById("timer");

var questionData = [];
var currentUserName = "";

var currentQuestion = 0;
var score = 0;

var setIntervalFunc;
var intervalMinutes = 7;
var intervalSeconds = 0;

function getDataFromDatabase() {
  var REFER = ref(database, "quiz/html");
  onChildAdded(REFER, function (data) {
    console.log();
    // questionData = [];
    saveInQuestionDataObject(data.val());
  });
}

getDataFromDatabase();

function saveInQuestionDataObject(data) {
  questionData.push(data);
  startDiv();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

window.progressFunc = function () {
  var percentage = ((currentQuestion * 100) / questionData.length).toFixed(2);
  progressBar.innerHTML = "";
  progressBar.innerHTML = `<div
  class="progress-bar progress-bar-striped bg-dark" 
  role="progressbar"
  style="width: ${percentage}%"
  aria-valuenow="${percentage}"
  aria-valuemin="0"
  aria-valuemax="100"
></div>`;
};

window.timerFunction = function () {
  if (intervalSeconds > 0) {
    intervalSeconds--;
    timer.innerHTML = `Time left: ${intervalMinutes}:${intervalSeconds}`;
  } else if (intervalMinutes > 0 && intervalSeconds === 0) {
    intervalMinutes--;
    intervalSeconds = 59;
    timer.innerHTML = `Time left: ${intervalMinutes}:${intervalSeconds}`;
  } else {
    clearInterval(setIntervalFunc);
    Swal.fire({
      title: "Time up!",
      text: `Hey ${currentUserName.toUpperCase()}, your time is up. See results by clicking below button`,
      icon: "info",
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "Show result!",
    }).then(() => {
      renderResult();
    });

    console.log("Countdown finished.");
  }
};

window.startTimer = function () {
  setIntervalFunc = setInterval(timerFunction, 1000);
};

window.startDiv = function () {
  shuffleArray(questionData);
  intervalMinutes = Math.floor(questionData.length / 3);
  root.innerHTML = "";
  root.innerHTML = `
  <div id="startDiv" class="container p-5 my-5 section-1">
        <h1 class="my-5 heading-1 text-center">HTML QUIZ</h1>

        <div>
          <div class="row mb-4">
            
            <div class="col-6 h4 ">
              No. of Questions:
              <span class="badge rounded-pill badge-primary px-5">${questionData.length}</span>
            </div>
            <div class="col-6 h4 text-end">
              Time allowed:
              <span class="badge rounded-pill badge-primary">${intervalMinutes} minutes</span>
            </div>
          </div>
        </div>
        <button class="btn btn-secondary btn-lg w-100 line-height-3 animate__animated animate__fadeInUp" type="button" onclick="startQuiz();">Start</button>
      </div>
  `;
};

window.startQuiz = function () {
  if (currentUserName !== "") {
    root.style.display = "none";
    main.style.display = "block";
    startTimer();
    renderQuestion();
  } else {
    (async () => {
      const { value: text } = await Swal.fire({
        icon: "info",
        title: "What's your name?",
        input: "text",
        inputPlaceholder: "Type your name here...",
        showCloseButton: true,
        confirmButtonText: "Save",
      });

      if (text) {
        currentUserName = text;
        Swal.fire({
          title: `Welcome, ${text.toUpperCase()}`,
          text: "You won't be able to revert back any question!",
          icon: "warning",
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: "Start quiz!",
        }).then((result) => {
          root.style.display = "none";
          main.style.display = "block";
          startTimer();
          renderQuestion();
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Please enter your name to continue",
        });
      }
    })();
  }
};

window.renderQuestion = function () {
  if (questionData.length > currentQuestion) {
    questionCount.innerHTML = `${currentQuestion + 1} of ${
      questionData.length
    }`;

    questionData[currentQuestion].question = questionData[
      currentQuestion
    ].question.replaceAll("<", "&lt;");
    questionData[currentQuestion].question = questionData[
      currentQuestion
    ].question.replaceAll(">", "&gt;");

    question.innerHTML = questionData[currentQuestion].question;
    progressFunc();
    renderOptions();
  } else {
    clearInterval(setIntervalFunc);
    renderResult();
  }
};

window.renderOptions = function () {
  options.innerHTML = "";

  for (var i = 0; i < questionData[currentQuestion].options.length; i++) {
    options.innerHTML += `
    <div class="col-md-6 p-3">
            <button onclick="checkAns('${questionData[currentQuestion].options[i]}', '${questionData[currentQuestion].answer}')" type="button" class="custom-btn">
            ${questionData[currentQuestion].options[i]}
            </button>
          </div>`;
  }
};

window.nextQuestion = function () {
  currentQuestion++;
  renderQuestion();
};

window.checkAns = function (selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    // console.log("selectedAnswer >>>", selectedAnswer);
    // console.log("correctAnswer >>>", correctAnswer);
    score++;
  } else {
    // console.log("selectedAnswer >>>", selectedAnswer);
    // console.log("correctAnswer >>>", correctAnswer);
  }
  nextQuestion();
};

window.renderResult = function () {
  var percentage = ((score * 100) / questionData.length).toFixed(2);
  var date = new Date().toLocaleString();

  var referKey = ref(database);
  var randomID = push(referKey).key;

  var objResult = {
    attemptedAt: date.toString(),
    username: currentUserName,
    percentage: percentage,
    key: randomID,
    quizName: "html",
  };

  var REFER = ref(database, `results/${objResult.quizName}/${objResult.key}`);
  set(REFER, objResult)
    .then(function () {
      main.style.display = "none";
      result.style.display = "block";

      result.innerHTML = `
  <div id="resultDiv" class="container p-5 my-5 section-1 ">
  <h3 class="my-5 heading-1 text-center">${currentUserName.toUpperCase()}'s RESULT</h1>
        <div class="row">
          <div class="col-6 animate__animated animate__bounceInLeft">
            <h3>Correct: <span class="badge rounded-pill badge-primary px-5">${score}</span></h3>
          </div>
          <div class="col-6 text-end animate__animated animate__bounceInDown">
          
          <h3>You got: <span class="badge rounded-pill badge-primary px-5">${percentage}%</span></h3>
          </div>
        </div>
        <button class="btn btn-secondary btn-lg mt-5" type="button" onclick="retakeQuiz();">Retake</button>
      </div>`;
    })
    .catch(function (error) {
      Toast.fire({
        icon: "error",
        title: error,
      });
    });
};

window.retakeQuiz = function () {
  currentUserName = "";
  let timerInterval;
  Swal.fire({
    title: "Regenerating Questions!",
    html: "Please wait. It will loaded in <b></b> milliseconds.",
    timer: 4000,
    allowEscapeKey: false,
    allowOutsideClick: false,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
      result.style.display = "none";
      root.style.display = "block";
      currentQuestion = 0;
      score = 0;
      intervalMinutes = 0;
      intervalSeconds = 0;
      timer.innerHTML = `Time left: ${intervalMinutes}:${intervalSeconds}`;
      startDiv();
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
