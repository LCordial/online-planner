btnAddSubject.addEventListener("click", (e) => {
  writeSubjectToDB();
});

btnAddTask.addEventListener("click", (e) => {
  writeTasktoDB();
});

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
    addToDoTask();
  }
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
          option.value = subjects; // Set a value to the html element
          var node = document.createTextNode(subjects[i]); // Create text node (creating text) variable
          option.appendChild(node); // Appending the text node to the option
          var element = document.querySelector("#subjectselect"); // The element of which it will be created in
          element.appendChild(option); // Appending the option with the text node and attribute to the element

          console.log("Created HTML elements: ", option);
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

function fetchAllTasks() {
  users
    .doc(auth.currentUser.uid)
    .collection("tasks")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        taskDocuments.push(doc.id);
        console.log("Current Tasks", taskDocuments);
        let item = {
          child: document.createElement("p"),
          title: document.createElement("h2"),
        }; // Each loop get the field values
        var priority = doc.data().priority;
        var subject = doc.data().subject;
        var task = doc.data().task;
        console.log(priority, subject, task);

        // Creating the HTML Elements

        var taskDiv = document.createElement("div");

        taskDiv.setAttribute("id", task); // Setting Id to the Div
        var completeTaskUI = item.child;
        // completeTask.onclick = completeTask(doc.id);
        var taskText = item.title;
        var priorityText = item.child;
        var subjectText = item.child;
        // Text Nodes
        var nodeCompleteTask = document.createTextNode("✕");
        completeTaskUI.addEventListener("click", () => {
          completeTask(doc.id);
        });
        var nodeTitle = document.createTextNode(task);
        var nodePriority = document.createTextNode("Priority: ", priority);
        var nodeSubject = document.createTextNode("Subject: ", subject);

        // Appending everything together
        taskText.appendChild(nodeTitle);
        priorityText.appendChild(nodePriority);
        subjectText.appendChild(nodeSubject);
        completeTaskUI.appendChild(nodeCompleteTask);

        taskDiv.appendChild(taskText);
        taskDiv.appendChild(completeTaskUI);
        taskDiv.appendChild(priorityText);
        taskDiv.appendChild(subjectText);

        var element = document.querySelector("#toDoList");

        element.appendChild(taskDiv);

        console.log(taskDiv);
      });
    });
}

function addToDoTask() {
  let item = {
    child: document.createElement("p"),
    title: document.createElement("h2"),
  }; // Each loop get the field values
  var priority = txtPriority.value;
  var subject = txtSubject.value;
  var task = txtTask.value;
  console.log(priority, subject, task);

  var n = taskDocuments.includes(task);
  console.log(n);

  if (n === false) {
    taskDocuments.push(task);
    console.log("Current Tasks", taskDocuments);

    // Creating the HTML Elements

    var taskDiv = document.createElement("div");

    taskDiv.setAttribute("id", task); // Setting Id to the Div
    var completeTaskUI = item.child;
    var taskText = item.title;
    var priorityText = item.child;
    var subjectText = item.child;
    // Text Nodes
    var nodeCompleteTask = document.createTextNode("✕");
    completeTaskUI.addEventListener("click", () => {
      completeTask(task);
    });
    var nodeTitle = document.createTextNode(task);
    var nodePriority = document.createTextNode("Priority: ", priority);
    var nodeSubject = document.createTextNode("Subject: ", subject);

    // Appending everything together
    taskText.appendChild(nodeTitle);
    priorityText.appendChild(nodePriority);
    subjectText.appendChild(nodeSubject);
    completeTaskUI.appendChild(nodeCompleteTask);

    taskDiv.appendChild(taskText);
    taskDiv.appendChild(completeTaskUI);
    taskDiv.appendChild(priorityText);
    taskDiv.appendChild(subjectText);

    var element = document.querySelector("#toDoList");

    element.appendChild(taskDiv);

    console.log(taskDiv);
  }
}

function removeToDo(p) {
  var element = document.getElementById(p);
  element.parentNode.removeChild(element);
}

// A general function that updates 'almost' everything on start of application \\
function updateSubjectOnStart() {
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
        console.log("Created HTML elements: ", option);
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

function completeTask(p) {
  users
    .doc(auth.currentUser.uid)
    .collection("tasks")
    .doc(p)
    .delete()
    .then(() => {
      console.log(p, " successfully deleted");
      taskDocuments.splice(p);
      removeToDo(p);
    })
    .catch((error) => {
      console.error("Error deleting document: ", error);
    });
}

// Small functions

function increaseKarma(amount) {
  users.doc(auth.currentUser.uid).collection("Karma").doc("User Karma").set({
    karma: amount,
  });
}

function removeAllToDo() {
  var element = document.querySelector("#toDoList");
  element.removeChild(element.firstChild);
}
