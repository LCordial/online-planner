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

// Firebase reference

const auth = firebase.auth();
const db = firebase.firestore();

const users = db.collection("users");

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
    // loginPage.classList.add("hidden");
    inputPage.classList.add("hidden"); // Remove input page
    buttonPage.classList.add("hidden"); //Remove button page
    inputPage.classList.remove("inputcontainer"); // Remove container
    buttonPage.classList.remove("buttoncontainer"); // Remove Container
    footer.classList.add("hidden");
    btnSignUp.classList.add("hidden");

    // Check user exists in db
    users
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // User exists
          console.log("Document data:", doc.data());
        } else {
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
    loginPage.classList.remove("hidden");
    btnSignUp.classList.remove("hidden");
    inputPage.classList.add("inputcontainer");
    buttonPage.classList.add("buttoncontainer");
  }
});

// Add new user information to database
function writeUserToDB() {
  let username = txtUsername.value;
  let uid = auth.currentUser.uid;
  let email = txtEmail.value;

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
