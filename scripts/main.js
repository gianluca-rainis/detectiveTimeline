const header = document.querySelector("header");
const main = document.querySelector("main");
const addEventForm = document.getElementById("addEventForm");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const title = document.getElementById("title");
const time = document.getElementById("time");
const date = document.getElementById("date");
const description = document.getElementById("description");
const today = new Date().getFullYear()+"-"+((new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1)+"-"+((new Date().getDate()+1)<10?"0"+new Date().getDate():new Date().getDate());
const now = (new Date().getHours()<10?"0"+new Date().getHours():new Date().getHours())+":"+(new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes());

let isMobileMenuShowed = false; // If is open the mobile menu
let isLoginShowed = false; // If is open the login menu

document.addEventListener("DOMContentLoaded", () => {
  time.value = now;
  date.value = today;

  addEventForm.addEventListener("submit", (e) => { // When added a new event
    e.preventDefault();

    main.appendChild(GetEvent(title.value, time.value, date.value, description.value)); // Insert in the bottom of the main the event

    // Reset the values of the inputs
    title.value = "";
    time.value = now;
    date.value = today;
    description.value = "";

    orderTimeline(); // Order the events in chronological order
  });

  mobileMenuButton.addEventListener("click", toggleMobileMenu); // Event listener for the mobile menu

  // Event listener for the login button
  document.getElementById("loginButton").addEventListener("click", () => {
    document.getElementById("loginForm").style.display = "none";
  });
});

// Return a new event block with the given informations
function GetEvent(title, time, date, description) {
  const event = document.createElement("div"); // Create the event container
  event.classList = "event";

  const dateToInsert = document.createElement("p"); // Add date
  dateToInsert.classList = "date";
  dateToInsert.innerHTML = `${date} | ${time}`;

  const titleToInsert = document.createElement("h3"); // Add title
  titleToInsert.classList = "title";
  titleToInsert.innerHTML = title;

  const descriptionToInsert = document.createElement("p"); // Add the additional informations
  descriptionToInsert.classList = "description";
  descriptionToInsert.innerHTML = description;

  const deleteInsert = document.createElement("img"); // Add the delete event button
  deleteInsert.className = "delete";
  deleteInsert.src = "./images/delete.png";

  event.appendChild(dateToInsert);
  event.appendChild(titleToInsert);
  event.appendChild(descriptionToInsert);
  event.appendChild(deleteInsert);

  deleteInsert.addEventListener("click", () => { // Handle the delete button click
    event.remove();
  });
  
  return event;
  
  /* The returned structure

  <div class='event'>
    <p className='date'>
      {date} | {time}
    </p>
    <h3 class='title'>
      {title}
    </h3>
    <p class='description'>
      {description}
    </p>
    <img src="./images/delete.png" class="delete" />
  </div> */
}

// Order the events in chronological order
function orderTimeline() {
  const events = document.querySelectorAll(".event"); // Get all the events
  const dates = document.querySelectorAll(".date"); // Get all the dates

  // Selection sort with Date
  for (let i = 0; i < events.length; i++) {
    const thisDate = new Date(dates[i].innerHTML.split(" | ")[0]+" "+dates[i].innerHTML.split(" | ")[1]);

    let minValueIndex = i; // Index of the min value found
    
    for (let j = i+1; j < events.length; j++) {
      const otherDate = new Date(dates[j].innerHTML.split(" | ")[0]+" "+dates[j].innerHTML.split(" | ")[1]);

      if (otherDate < thisDate) {
        minValueIndex = j;
      }
    }

    // Update the content of the events
    let temp = events[i].innerHTML;
    events[i].innerHTML = events[minValueIndex].innerHTML;
    events[minValueIndex].innerHTML = temp;
  }

  // Update the event listeners of the delete button (necessary to prevent bugs)
  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", () => {
      deleteButton.closest(".event").remove();
    });
  });
}

// Toggle the mobile menu (show/hide)
function toggleMobileMenu() {
  isMobileMenuShowed = !isMobileMenuShowed;

  if (isMobileMenuShowed) {
    addEventForm.style.display = "flex";
    header.style.flexDirection = "column";
  }
  else {
    addEventForm.style.display = "none";
    header.style.flexDirection = "row";
  }
}

// On resize of the page update
window.addEventListener("resize", handleResize);

handleResize(); // First call to load the first time

// Handle menu for the screen width
function handleResize() {
  if (window.innerWidth <= 850) {
    addEventForm.style.display = "none";
    mobileMenuButton.style.display = "block";
  }
  else {
    addEventForm.style.display = "flex";
    mobileMenuButton.style.display = "none";

    if (isMobileMenuShowed) {
      toggleMobileMenu();
    }
  }
}