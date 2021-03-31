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

//Tasks
const txtTask = document.querySelector("#taskInput"); // The task input

// Add task window
const addTaskWindow = document.querySelector("#addtaskwindow"); // The add task window
const btnAddTask = document.querySelector("#btnAddTask"); // The add task window

// Removing windows on start
addSubjectWindow.classList.add("hidden"); //Removing add subject window
addTaskWindow.classList.add("hidden"); //Removing add task window

var subjectArray = [] // Subject Array

// Firebase reference

const auth = firebase.auth(); // The authenticator for firebase
const db = firebase.firestore(); // The firebase firestore database

const users = db.collection("users"); // THe user collection

btnAddSubject.addEventListener("click", (e) => {
  writeSubjectToDB();
});

btnAddTask.addEventListener("click", (e) => {
  writeTasktoDB();
});

// Sign existing user in
btnSignIn.addEventListener("click", (e) => {
  let email = txtEmail.value;
  let password = txtPassword.value;

  if(email.length == 0 || password.length == 0){
    signInError.innerHTML = "Incorrect Email/Password"
  }else{
    signInError.innerHTML = ""
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch((e) => {
      console.log(e.message)
      signInError.innerHTML = "Incorrect Email/Password"
    });
  }

});

// Sign up existing user
btnSignUp.addEventListener("click", (e) => {
  // TODO: Check for real email.
  let email = txtEmail.value;
  let password = txtPassword.value;

  if(email.length == 0 || password.length < 6){
    signInError.innerHTML = "It needs an Email/Password"
  }else{
    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch((e) => console.log(e.message));
  }
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
    btnSignUp.classList.add("hidden");
    burger.classList.remove("hidden");
    displayUser.classList.remove("hidden");
    footer.classList.add("hidden")

    // Check user exists in db
    users
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        // If the user exists on the database...
        if (doc.exists) {
          console.log("Document data:", doc.data());
          getUsername();
          openNav();
          updatedSubjectSelect();
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

// Writing subjects to Database
function writeSubjectToDB() {
  let subject = txtSubejct.value;
  if (txtSubejct.value.length == 0) {
    //Is the field empty?
    console.log("Field needs to be filled in");
    subjectInputError.innerHTML = "Subject needs a name";
  } else {
      subjectArray.push(subject);
      console.log(subjectArray);
    // If not...
    users // Access users collection
      .doc(auth.currentUser.uid) // Access user UID
      .collection("subjects") // Access/Create Subjects collection
      .doc("User Subjects") // Add a document named with user subjects
      .update({
        // Set document fields to...
        // Write to db
        "subject": firebase.firestore.FieldValue.arrayUnion(subject)
      })
      .then(() => {
        // Once it successfully was written...
        console.log("Subject successfully written with:", subject);
        subjectInputError.innerHTML = "";
        updatedSubjectSelect()
      })
      .catch((error) => {
        // If it catches an error...
        console.error("Error writing document: ", error);
        subjectInputError.innerHTML = "Error unknown!";
      });
  }
}

// Writing task to the Database
function writeTasktoDB(){
  let task = txtTask.value;
  let priority = txtPriority.value;
  let subject = txtSubejct.value;

  updatedSubjectSelect();

  console.log(task);

  if (txtTask.value.length == 0) {
    console.log("Field needs to be filled in");
    taskInputError.innerHTML = "Task needs a name";
  } else {
    users.doc(auth.currentUser.uid).collection("tasks").doc(task).set({
      task: task,
      subject: subject,
      priority: priority,
    });
  }
}

// Getting Username on start and login
function getUsername() {
  users.doc(auth.currentUser.uid).get()
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

// Getting the subjects that the user has entered
function updatedSubjectSelect() {
    users.doc(auth.currentUser.uid).collection("subjects").doc("User Subjects").get()
      .then((doc) => {
        console.log(doc.data().subject)
        let subjects = doc.data().subject
        console.log(subjects)
      
        for(i=0; i < subjects.length; i++){

          var option = document.createElement("option");
          option.setAttribute("value", subjects[i])
          var node = document.createTextNode(subjects[i]);
          option.appendChild(node);
          var element = document.querySelector("#subjectselect")
          element.appendChild(option);

          console.log(option);
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
}