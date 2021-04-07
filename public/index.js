console.warn(
  "IF YOU HAVE BEEN ASKED TO ENTER ANYTHING INTO THE CONSOLE THEN MOST LIKELY YOU ARE BEING SCAMMED OR HACKED! Unless you know what you are doing."
);

// Assigning variables
const loginPage = document.querySelector("#loginPage"); // The login page html reference
const footer = document.querySelector("#mainfooter");

const txtEmail = document.querySelector("#emailInput"); // The email input
const txtPassword = document.querySelector("#passwordInput"); // The password input
const txtUsername = document.querySelector("#usernameInput"); // The username input
const btnSignIn = document.querySelector("#signInBtn"); // The sign in button
const btnSignUp = document.querySelector("#signUpBtn"); // The sign up button
const btnSignOut = document.querySelector("#signOutBtn"); // The sign out button

// HTML Elements
let subjectInputError = document.querySelector("#subjectinputerror"); // The subject input error html
let taskInputError = document.querySelector("#taskinputerror"); // The task input error html
let userDisplay = document.querySelector("#user"); // The username display name
let burger = document.querySelector("#burger"); // The burger that opens and closes the side navbar
let displayUser = document.querySelector("#user"); // The display user
let signInError = document.querySelector("#signInError"); // The sign in error text

// Nav Bar
const btnOpenSubjectWindow = document.querySelector("#btnOpenSubjectWindow"); // Open subject window
const openTaskWindowBtn = document.querySelector("#openTaskWindowBtn"); // Opens the task window

// Add subject window
const addSubjectWindow = document.querySelector("#addsubjectwindow"); // The add subject window
const btnAddSubject = document.querySelector("#btnAddSubject"); // Submit the subject button

// Subjects
const txtSubejct = document.querySelector("#subjectInput"); // The subject input
var txtPriority = document.querySelector("#priorityselect"); // The priority of the input
var txtSubject = document.querySelector("#subjectselect"); // The subject chosen

var subjectArray = []; // Subject Array
let taskDocuments = []; // Creating an array for the tasks [MUST BE GLOBAL!]

//Tasks
const txtTask = document.querySelector("#taskInput"); // The task input

// Add task window
const addTaskWindow = document.querySelector("#addtaskwindow"); // The add task window
const btnAddTask = document.querySelector("#btnAddTask"); // The add task window

const editSubjectWindow = document.querySelector("#deletesubjectwindow");
const btnOpenEditSubjectWindow = document.querySelector(
  "#btnOpenEditSubjectWindow"
);

let toDoList = document.querySelector("#toDoList");

// Removing windows on start
addSubjectWindow.classList.add("hidden"); // Removing add subject window
addTaskWindow.classList.add("hidden"); // Removing add task window
editSubjectWindow.classList.add("hidden"); // Removing edit subject window
toDoList.classList.add("hidden");

// Firebase reference

const auth = firebase.auth(); // The authenticator for firebase
const db = firebase.firestore(); // The firebase firestore database

const users = db.collection("users"); // THe user collection
