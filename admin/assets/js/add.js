import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  push,
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
const auth = getAuth();
const database = getDatabase();

var body = document.getElementsByTagName("body");
var loadingBTN = document.getElementById("loadingBTN");
var errorDiv = document.getElementById("errorDiv");
var errorMsg = document.getElementById("errorMsg");
var signOutBTN = document.getElementById("signOutBTN");
var booleanTypeQuestion = document.getElementById("booleanTypeQuestion");
var optionTypeQuestion = document.getElementById("optionTypeQuestion");
var booleanSwitch = document.getElementById("booleanSwitch");
var optionSwitch = document.getElementById("optionSwitch");
var addOptionQuestionBTN = document.getElementById("addOptionQuestion");
var addBooleanQuestionBTN = document.getElementById("addBooleanQuestion");
var booleanQuestion = document.getElementById("booleanQuestion");
var trueOptionCheck = document.getElementById("trueOptionCheck");
var falseOptionCheck = document.getElementById("falseOptionCheck");
var optionQuestion = document.getElementById("optionQuestion");
var option1 = document.getElementById("option1");
var option2 = document.getElementById("option2");
var option3 = document.getElementById("option3");
var option4 = document.getElementById("option4");
var option1Checkbox = document.getElementById("option1Checkbox");
var option2Checkbox = document.getElementById("option2Checkbox");
var option3Checkbox = document.getElementById("option3Checkbox");
var option4Checkbox = document.getElementById("option4Checkbox");

var adminUID = "7Mpa1C5n0kcblcxsf4PtzV2VRLt1";

signOutBTN.addEventListener("click", signOutAdmin);
optionSwitch.addEventListener("click", renderOptionTypeForm);
booleanSwitch.addEventListener("click", renderBooleanTypeForm);
addOptionQuestionBTN.addEventListener("click", addOptionQuestion);
addBooleanQuestionBTN.addEventListener("click", addBooleanQuestion);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // console.log(uid);

    if (uid === adminUID) {
      body[0].style.display = "block";
    }
    // ...
  } else {
    // User is signed out
    window.location.replace("../");
  }
});

function signOutAdmin() {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout it!",
  }).then((result) => {
    if (result.isConfirmed) {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          window.location.replace("../");
        })
        .catch((error) => {
          // An error happened.
          Toast.fire({
            icon: "error",
            title: error,
          });
        });
    }
  });
}

window.onlyOne = function (checkbox, value) {
  var checkboxes = document.getElementsByName("check");

  checkboxes.forEach((item) => {
    if (item !== checkbox) {
      item.checked = false;
    }
  });
};

function renderOptionTypeForm() {
  booleanTypeQuestion.style.display = "none";
  optionTypeQuestion.style.display = "block";
}

function renderBooleanTypeForm() {
  optionTypeQuestion.style.display = "none";
  booleanTypeQuestion.style.display = "block";
}

function addOptionQuestion() {
  errorDiv.style.display = "none";
  var flag = false;

  var obj = {
    options: [],
  };

  if (optionQuestion.value.trim() !== "") {
    obj.question = optionQuestion.value;
    if (
      option1.value.trim() !== "" &&
      option2.value.trim() !== "" &&
      option3.value.trim() !== "" &&
      option4.value.trim() !== ""
    ) {
      obj.options[0] = option1.value;
      obj.options[1] = option2.value;
      obj.options[2] = option3.value;
      obj.options[3] = option4.value;

      if (option1Checkbox.checked) {
        obj.answer = option1.value;
        flag = true;
      } else if (option2Checkbox.checked) {
        obj.answer = option2.value;
        flag = true;
      } else if (option3Checkbox.checked) {
        obj.answer = option3.value;
        flag = true;
      } else if (option4Checkbox.checked) {
        obj.answer = option4.value;
        flag = true;
      } else {
        errorDiv.style.display = "block";
        errorMsg.innerHTML = "Please select Correct answer...";
      }
    } else {
      errorDiv.style.display = "block";
      errorMsg.innerHTML = "Options fields cannot be empty";
    }
  } else {
    errorDiv.style.display = "block";
    errorMsg.innerHTML = "Please input a question to continue";
  }

  // console.log(obj);

  if (flag) {
    sendQuestiotoDatabase(obj);
  }
}
function addBooleanQuestion() {
  errorDiv.style.display = "none";
  var flag = false;
  var obj = {
    options: [true, false],
  };

  if (booleanQuestion.value.trim() !== "") {
    obj.question = booleanQuestion.value;
    if (trueOptionCheck.checked) {
      obj.answer = true;
      flag = true;
    } else if (falseOptionCheck.checked) {
      obj.answer = false;
      flag = true;
    } else {
      errorDiv.style.display = "block";
      errorMsg.innerHTML = "Please select True or False";
    }
  } else {
    errorDiv.style.display = "block";
    errorMsg.innerHTML = "Please input a question to continue";
  }

  if (flag) {
    sendQuestiotoDatabase(obj);
  }
}

function sendQuestiotoDatabase(obj) {
  loadingBTN.style.display = "block";
  addBooleanQuestionBTN.style.display = "none";
  addOptionQuestionBTN.style.display = "none";

  var referKey = ref(database);
  var randomID = push(referKey).key;

  var questionObj = obj;
  questionObj.key = randomID;

  var REFER = ref(database, `quiz/html/${questionObj.key}`);
  set(REFER, questionObj)
    .then(function (success) {
      window.location.replace("./dashboard.html");
    })
    .catch(function (error) {
      console.log("error occured while sending to database");
    });

  // console.log(questionObj);
}
