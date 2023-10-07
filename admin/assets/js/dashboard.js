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
  update,
  onChildAdded,
  remove,
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
const database = getDatabase(app);

var body = document.getElementsByTagName("body");
var signOutBTN = document.getElementById("signOutBTN");
var totalAttempts = document.getElementById("totalAttempts");
var highScore = document.getElementById("highScore");
var avgScore = document.getElementById("avgScore");

var adminUID = "7Mpa1C5n0kcblcxsf4PtzV2VRLt1";
var resultsData = [];

signOutBTN.addEventListener("click", signOutAdmin);

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

function getDatafromDatabase() {
  resultsData = [];
  var REFER = ref(database, `results/html`);
  onChildAdded(REFER, function (data) {
    renderResultsData(data.val());
  });
}

function signOutAdmin() {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout!",
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

function renderResultsData(data) {
  var scoreArr = [];
  if (data) {
    resultsData.push(data);
  }

  totalAttempts.innerHTML = resultsData.length;
  for (var i = 0; i < resultsData.length; i++) {
    scoreArr.push(resultsData[i].percentage);
    scoreArr.sort();
    highScore.innerHTML = `${scoreArr[scoreArr.length - 1]}%`;
    avgScore.innerHTML = `${calcAvg(scoreArr)}%`;
  }

  // console.log(scoreArr);

  studentData.innerHTML = "";
  for (var i = 0; i < resultsData.length; i++) {
    studentData.innerHTML += `
              <tr>
                <th scope="row">${i + 1}</th>
                <td>${resultsData[i].username.toUpperCase()}</td>
                <td>${resultsData[i].quizName.toUpperCase()}</td>
                <td>${resultsData[i].percentage}%</td>
                <td>${resultsData[i].attemptedAt}</td>
                <td><button class="btn btn-sm btn-outline-danger" 
                onclick="deleteResult('${i}', '${resultsData[i].key}')"
                >Delete</button></td>
              </tr>
      `;
  }
}

window.onload = renderResultsData();
window.onload = getDatafromDatabase();

function calcAvg(arr) {
  var totalSum = 0;
  for (var i = 0; i < arr.length; i++) {
    totalSum = totalSum + parseInt(arr[i]);
  }
  var avgResult = Math.round(totalSum / parseInt(arr.length));
  // console.log(avgResult);
  return avgResult;
}

window.deleteResult = function (index, key) {
  // console.log(resultsData[index]);
  // console.log(key);

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      var REFER = ref(database, `results/html/${key}`);
      remove(REFER);
      Toast.fire({
        icon: "success",
        title: "Selected result has been deleted.",
      });
      window.location.reload();
    }
  });
};

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
