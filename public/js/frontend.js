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

// Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body

function openNav() {
  document.getElementById("appsidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  // document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

// Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white
function closeNav() {
  document.getElementById("appsidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  // document.body.style.backgroundColor = "white";
}

// const navlink = document.querySelector('.navlink');
// const sharelink = document.querySelector('.social-link');

// navlink.addEventListener('click', function() {
//     navlink.classList.toggle('active');
//     sharelink.classList.toggle('active')
// })

$(function () {
  $("#addtaskwindow").draggable();
  $("#addsubjectwindow").draggable();
  $("#deletesubjectwindow").draggable();
});
