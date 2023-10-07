import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

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

var adminEmail = document.getElementById("adminEmail");
var adminPassword = document.getElementById("adminPassword");
var signinBTN = document.getElementById("signinBTN");
var loadingBTN = document.getElementById("loadingBTN");
var redirectingBTN = document.getElementById("redirectingBTN");
var errorDiv = document.getElementById("errorDiv");
var errorMsg = document.getElementById("errorMsg");

//EVENT LISTENERS
signinBTN.addEventListener("click", signinFunc);

function signinFunc() {
  // console.log("Email: " + adminEmail.value);
  // console.log("Password: " + adminPassword.value);
  signinBTN.style.display = "none";
  errorDiv.style.display = "none";
  loadingBTN.style.display = "block";

  signInWithEmailAndPassword(auth, adminEmail.value, adminPassword.value)
    .then((userCredential) => {
      // Signed in
      // const user = userCredential.user;
      redirectingBTN.style.display = "block";
      loadingBTN.style.display = "none";
      window.location.replace("./pages/dashboard.html");
      // ...
    })
    .catch((error) => {
      signinBTN.style.display = "block";
      loadingBTN.style.display = "none";
      errorDiv.style.display = "block";

      const errorCode = error.code;
      // const errorMessage = error.message;

      errorMsg.innerHTML = errorCode;
    });
}
