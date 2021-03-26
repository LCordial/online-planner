// Assigning variables
const loginPage = document.querySelector("#loginPage");
const inputPage = document.querySelector("#inputPage");
const buttonPage = document.querySelector("#buttonPage");
const footer = document.querySelector("#mainfooter");

const txtEmail = document.querySelector("#emailInput");
const txtPassword = document.querySelector("#passwordInput");
const txtUsername = document.querySelector("#usernameInput");
const btnSignIn = document.querySelector("#signInBtn");
const btnSignUp = document.querySelector("#signUpBtn");
const btnSignOut = document.querySelector("#signOutBtn");

// HTML Elements
let subjectInputError = document.querySelector("#subjectinputerror");
let taskInputError = document.querySelector("#taskinputerror")
let userDisplay = document.querySelector("#user");
let burger = document.querySelector("#burger");
let displayUser = document.querySelector("#user");

// Nav Bar
const btnOpenSubjectWindow = document.querySelector("#btnOpenSubjectWindow");
const openTaskWindowBtn = document.querySelector("#openTaskWindowBtn");

// Add subject window
const addSubjectWindow = document.querySelector("#addsubjectwindow");
const btnAddSubject = document.querySelector("#btnAddSubject");

// Subjects
const txtSubejct = document.querySelector("#subjectInput");

//Tasks
const txtTask = document.querySelector("#taskInput");
// const txtPriority = document.querySelector("priorityselect");

// Add task window
const addTaskWindow = document.querySelector("#addtaskwindow");
const btnAddTask = document.querySelector("#btnAddTask");

// Removing windows on start
addSubjectWindow.classList.add("hidden"); //Removing add subject window
addTaskWindow.classList.add("hidden"); //Removing add task window

// Firebase reference

const auth = firebase.auth();
const db = firebase.firestore();

const users = db.collection("users");

btnAddSubject.addEventListener("click", (e) => {
  writeSubjectToDB();
});

btnAddTask.addEventListener("click", (e) => {
  writeTasktoDB();
})

// Sign existing user in
btnSignIn.addEventListener("click", (e) => {
  let email = txtEmail.value;
  let password = txtPassword.value;

  const promise = auth.signInWithEmailAndPassword(email, password);
  promise.catch((e) => console.log(e.message));
});

// Sign up existing user
btnSignUp.addEventListener("click", (e) => {
  // TODO: Check for real email.
  let email = txtEmail.value;
  let password = txtPassword.value;

  const promise = auth.createUserWithEmailAndPassword(email, password);
  promise.catch((e) => console.log(e.message));
});

// Sign out current user
btnSignOut.addEventListener("click", (e) => {
  firebase.auth().signOut();
});

// Detecy when auth state changes
firebase.auth().onAuthStateChanged((firebaseUser) => {
  // If signed in
  if (firebaseUser) {
    console.log(firebaseUser);
    btnSignOut.classList.remove("hidden"); // Show logout button
    inputPage.classList.remove("inputcontainer"); // Remove container
    buttonPage.classList.remove("buttoncontainer"); // Remove Container
    footer.classList.add("hidden");
    btnSignUp.classList.add("hidden");
    burger.classList.remove("hidden");
    displayUser.classList.remove("hidden");

    // Check user exists in db
    users
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        // If the user exists on the database...
        if (doc.exists) {
          console.log("Document data:", doc.data());
          getUsername();
          openNav()
        } else {
          // If user doesn't exists on the databse...
          // Add user data to db
          console.log("No such document!");
          writeUserToDB();
        }

        loginPage.classList.add("hidden");
      })
      .catch((error) => {
        // Catch any errors
        console.log("Error getting document:", error);
      });
  } else {
    // Confirm logout
    console.log("not logged in.");

    btnSignOut.classList.add("hidden");
    burger.classList.add("hidden");
    displayUser.classList.add("hidden");
    loginPage.classList.remove("hidden");
    btnSignUp.classList.remove("hidden");

    closeNav();
  }
});

// Add new user information to database
function writeUserToDB() {
  let username = txtUsername.value;
  let uid = auth.currentUser.uid;
  let email = txtEmail.value;

  getUsername();

  users
    .doc(uid)
    .set({
      // Write to db
      username: username,
      uid: uid,
      email: email,
    })
    .then(() => {
      // If success
      console.log("Document successfully written!");
    })
    .catch((error) => {
      // Catch errors
      console.error("Error writing document: ", error);
    });
}

function writeSubjectToDB() {
  let subject = txtSubejct.value;

  if (txtSubejct.value.length == 0) {
    //Is the field empty?
    console.log("Field needs to be filled in");
    subjectInputError.innerHTML = "Subject needs a name";
  } else {
    // If not...
    users // Access users collection
      .doc(auth.currentUser.uid) // Access user UID
      .collection("subjects") // Access/Create Subjects collection
      .doc(subject) // Add a document named with user choice
      .set({
        // Set document fields to...
        // Write to db
        subject: subject,
      })
      .then(() => {
        // Once it successfully was written...
        console.log("Subject successfully written with:", subject);
        subjectInputError.innerHTML = "";
      })
      .catch((error) => {
        // If it catches an error...
        console.error("Error writing document: ", error);
        subjectInputError.innerHTML = "Error unknown!";
      });
  }
}

function writeTasktoDB(){
  let task = txtTask.value;
  var e = document.querySelector("#priorityselect").value;
  var i = document.querySelector("#subjectselect").value;

  console.log(task);

  if(txtTask.value.length == 0){
    console.log("Field needs to be filled in");
    taskInputError.innerHTML = "Task needs a name"
  }else{
    users
      .doc(auth.currentUser.uid)
      .collection("tasks")
      .doc(task)
      .set({
        task: task,
        subject: i,
        priority: e,
      })
  }
}

// Getting Username on start and login

function getUsername() {
  users
    .doc(auth.currentUser.uid)
    .get()
    .then((doc) => {
      // If the user exists on the database...
      if (doc.exists) {
        userDisplay.innerHTML = doc.data().username;
      } else {
        // If user doesn't exists on the databse...
        console.log("Username doesn't exist");
        userDisplay.innerHTML = "";
      }

      loginPage.classList.add("hidden");
    })
    .catch((error) => {
      // Catch any errors
      console.log("Error getting document:", error);
    });
}

function updatedSubjectSelect(){
  for(i = 1; i > 0; i++){
    
  }
}