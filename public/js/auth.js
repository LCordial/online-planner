// Sign existing user in
btnSignIn.addEventListener("click", (e) => {
  let email = txtEmail.value;
  let password = txtPassword.value;

  if (email.length == 0 || password.length == 0) {
    signInError.innerHTML = "You need to enter a password/email";
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
    signInError.innerHTML = "There was an error with email and password";
  } else {
    const promise = auth.createUserWithEmailAndPassword(email, password);
    fetchAllTasks();
    promise.catch((e) => console.log(e.message));
  }
});

// Sign out current user
btnSignOut.addEventListener("click", (e) => {
  firebase.auth().signOut();
  burger.classList.add("hidden");
  removeAllToDo();
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
    toDoList.classList.remove("hidden");
    toDoTitle.classList.remove("hidden");

    // Check user exists in db
    users
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        // If the user exists on the database...
        if (doc.exists) {
          console.log("Document data:", doc.data());
          removeAllToDo(); // Removing all ToDo items
          getUsername(); // Getting the username on login
          openNav(); // Opening the Nav bar on login
          updateSubjectOnStart(); // Updating subjects on start
          fetchAllTasks(); // Updating tasks on start
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
    toDoList.classList.add("hidden");
    toDoTitle.classList.add("hidden") 

    closeNav();
    burger.classList.add("hidden");
  }
});

// Add new user information to database
function writeUserToDB() {
  let username = txtUsername.value;
  let uid = auth.currentUser.uid;
  let email = txtEmail.value;

  getUsername();

  users
    .doc(auth.currentUser.uid)
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
