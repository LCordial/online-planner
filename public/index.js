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

//#region SUBJECTS

// Add subject window
const addSubjectWindow = document.querySelector("#addsubjectwindow"); // The add subject window
const btnAddSubject = document.querySelector("#btnAddSubject"); // Submit the subject button

// Subjects
const txtSubejct = document.querySelector("#subjectInput"); // The subject input
var txtPriority = document.querySelector("#priorityselect"); // The priority of the input
var txtSubject = document.querySelector("#subjectselect"); // The subject chosen

var subjectArray = []; // Subject Array

//#endregion

//#region TASK

//Tasks
const txtTask = document.querySelector("#taskInput"); // The task input

// Add task window
const addTaskWindow = document.querySelector("#addtaskwindow"); // The add task window
const btnAddTask = document.querySelector("#btnAddTask"); // The add task window

//#endregion

//#region EDIT SUBJECTS

const editSubjectWindow = document.querySelector("#deletesubjectwindow")

//#endregion

// Removing windows on start
addSubjectWindow.classList.add("hidden"); //Removing add subject window
addTaskWindow.classList.add("hidden"); //Removing add task window

// Firebase reference

const auth = firebase.auth(); // The authenticator for firebase
const db = firebase.firestore(); // The firebase firestore database

const users = db.collection("users"); // THe user collection

///////////// THE ACTUAL CODE AND NOT VARIABLES \\\\\\\\\\\\\\\

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

  if (email.length == 0 || password.length == 0) {
    signInError.innerHTML = "Incorrect Email/Password";
  } else {
    signInError.innerHTML = "";
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch((e) => {
      console.log(e.message);
      signInError.innerHTML = "Incorrect Email/Password";
    });
  }
});

// Sign up existing user
btnSignUp.addEventListener("click", (e) => {
  // TODO: Check for real email.
  let email = txtEmail.value;
  let password = txtPassword.value;

  if (email.length == 0 || password.length < 6) {
    signInError.innerHTML = "It needs an Email/Password";
  } else {
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
    btnSignUp.classList.add("hidden"); // Hide sign up button
    burger.classList.remove("hidden"); // Showing the burger
    displayUser.classList.remove("hidden"); // Showing the display user
    footer.classList.add("hidden"); // Hiding the footer

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
          updateOnStart();
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
        subject: firebase.firestore.FieldValue.arrayUnion(subject),
      })
      .then(() => {
        // Once it successfully was written...
        console.log("Subject successfully written with:", subject);
        subjectInputError.innerHTML = "";
        updatedSubjectSelect();
      })
      .catch((error) => {
        // If it catches an error...
        console.error("Error writing document: ", error);
        subjectInputError.innerHTML = "Error unknown!";
      });
  }
}

// Writing task to the Database
function writeTasktoDB() {
  let task = txtTask.value;
  let priority = txtPriority.value;
  let subject = txtSubject.value;

  console.log("Name:", task, "   Priority:", priority, "   Subject:", subject);

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

function updatedTaskDisplay(){
  users.doc(auth.currentUser.uid).collection("tasks")
}

// Getting the subjects that the user has entered
function updatedSubjectSelect() {
  users
    .doc(auth.currentUser.uid)
    .collection("subjects")
    .doc("User Subjects")
    .get()
    .then((doc) => {
      console.log(doc.data().subject); // Console logging the data of subject
      let subjects = doc.data().subject; // Making the local subjects variable equal to the subject data
      console.log(subjects); // Console logging the subjects to check if it works.

      for (i = 0; i < subjects.length; i++) {
        // Looping through each data thingy in the array

        if (subjects[i] === txtSubejct.value) {
          // Does the subject not exist on the array? If it doesn't than create new element

          var option = document.createElement("option"); // Create an option element variable
          option.value = subject; // Set a value to the html element
          var node = document.createTextNode(subjects[i]); // Create text node (creating text) variable
          option.appendChild(node); // Appending the text node to the option
          var element = document.querySelector("#subjectselect"); // The element of which it will be created in
          element.appendChild(option); // Appending the option with the text node and attribute to the element

          console.log(option);
        } else {
          // Do nothing
          console.log("Nothing edited");
        }
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

// A general function that updates 'almost' everything on start of application \\
function updateOnStart() {
  users
    .doc(auth.currentUser.uid)
    .collection("subjects")
    .doc("User Subjects")
    .get()
    .then((doc) => {
      let subjects = doc.data().subject;

      for (i = 0; i < subjects.length; i++) {
        var option = document.createElement("option");
        option.value = subjects[i];
        var node = document.createTextNode(subjects[i]);
        option.appendChild(node);
        var element = document.querySelector("#subjectselect");
        element.appendChild(option);
        console.log(option);
        console.log("Nothing edited");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
