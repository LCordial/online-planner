var isSubjectClicked = true;
var isTaskClicked = true;
var isEditSubjectClicked = true;

function openSubjectWindow() {
  if (isSubjectClicked === true) {
    console.log("first case");
    addSubjectWindow.classList.remove("hidden");
    btnOpenSubjectWindow.innerHTML = "Close Subjects";
    isSubjectClicked = false;
  } else if (isSubjectClicked === false) {
    console.log("second case");
    addSubjectWindow.classList.add("hidden");
    btnOpenSubjectWindow.innerHTML = "Add Subjects";
    isSubjectClicked = true;
  }
}

function openTaskWindow() {
  if (isTaskClicked === true) {
    console.log("first case");
    addTaskWindow.classList.remove("hidden");
    openTaskWindowBtn.innerHTML = "Close Tasks";
    isTaskClicked = false;
  } else if (isTaskClicked === false) {
    console.log("second case");
    addTaskWindow.classList.add("hidden");
    openTaskWindowBtn.innerHTML = "Add Tasks";
    isTaskClicked = true;
  }
}

function openEditSubjectWindow() {
  if (isEditSubjectClicked === true) {
    editSubjectWindow.classList.remove("hidden");
    btnOpenEditSubjectWindow.innerHTML = "Close Edit";
    isEditSubjectClicked = false;
  } else if (isEditSubjectClicked === false) {
    editSubjectWindow.classList.add("hidden");
    btnOpenEditSubjectWindow.innerHTML = "Edit Subjects";
    isEditSubjectClicked = true;
  }
}
