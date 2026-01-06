const header = document.querySelector("header");
const main = document.querySelector("main");
const addTimelineForm = document.getElementById("addTimelineForm");
const addEventForm = document.getElementById("addEventForm");
const loginCreateAccountSection = document.getElementById("loginCreateAccountSection");
const loginForm = document.getElementById("loginForm");
const createAccountForm = document.getElementById("createAccountForm");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const loginButton = document.getElementById("loginButton");
const title = document.getElementById("title");
const time = document.getElementById("time");
const date = document.getElementById("date");
const description = document.getElementById("description");
const today = new Date().getFullYear()+"-"+((new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1)+"-"+((new Date().getDate()+1)<10?"0"+new Date().getDate():new Date().getDate());
const now = (new Date().getHours()<10?"0"+new Date().getHours():new Date().getHours())+":"+(new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes());

const paramsURL = new URLSearchParams(window.location.search); // The params passed with the url
const id = paramsURL.get("id"); // The id of the page to load

let sessionData = null; // Session data
let isMobileMenuShowed = false; // If is open the mobile menu
let isLoginShowed = false; // If is open the login menu

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.href.includes("timeline")) {
    addTimelineForm.style.display = "none";
  }

  time.value = now;
  date.value = today;

  const eventsSaved = await getEvents();

  if (eventsSaved && eventsSaved.length != 0) {
    eventsSaved.forEach(event => {
      const hourMinAndSecArray = event.date.split(" ")[1].split(":"); // [hh, mm, ss]
      const timeStr = hourMinAndSecArray[0] + ":" + hourMinAndSecArray[1]; // hh:mm
      const dateStr = event.date.split(" ")[0];

      main.appendChild(GetEvent(event.id, event.title, timeStr, dateStr, event.description));
    });

    orderTimeline();
  }

  addEventForm.addEventListener("submit", async (e) => { // When added a new event
    e.preventDefault();

    const createdEvent = await createEvent(title.value, time.value, date.value, description.value);

    if (createdEvent) {
      const hourMinAndSecArray = createdEvent.date.split(" ")[1].split(":"); // [hh, mm, ss]
      const timeStr = hourMinAndSecArray[0] + ":" + hourMinAndSecArray[1]; // hh:mm
      const dateStr = createdEvent.date.split(" ")[0];

      main.appendChild(GetEvent(createdEvent.id, createdEvent.title, timeStr, dateStr, createdEvent.description)); // Insert in the bottom of the main the event

      // Reset the values of the inputs
      title.value = "";
      time.value = now;
      date.value = today;
      description.value = "";

      orderTimeline(); // Order the events in chronological order
    }
  });

  loginButton.addEventListener("click", async () => { // Event listener for the login section
    if (loginButton.src.includes("logout")) {
      try {
        await fetch("/api/logout.php", {
          method: "POST",
          credentials: "include"
        });

        window.location.href = "/index.php";
      } catch (error) {
        console.error("Error: " + error.message);
      }
    }
    else {
      toggleLoginSection();
      
      // Close mobile timeline menu if open
      if (addTimelineForm.style.display === "flex" && window.innerWidth <= 850) {
        addTimelineForm.style.display = "none";
        header.style.flexDirection = "row";
      }
    }
  });

  mobileMenuButton.addEventListener("click", toggleMobileMenu); // Event listener for the mobile menu

  // Toggle login/signup
  document.getElementById("signUpButton").addEventListener("click", () => {
    createAccountForm.style.display = "flex";
    loginForm.style.display = "none";
  });

  document.getElementById("loginSwitchButton").addEventListener("click", () => {
    createAccountForm.style.display = "none";
    loginForm.style.display = "flex";
  });

  // Handle login form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch("/api/login.php", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = "/index.php";
      }
      else {
        console.error("Login failed: " + (result.error));
      }
    } catch (error) {
      console.error("Error: " + error.message);
    }
  });

  // Handle create account form submission
  createAccountForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = createAccountForm.querySelector('input[type="email"]').value;
    const password = createAccountForm.querySelector('input[type="password"]').value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch("/api/createAccount.php", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = "/index.php";
      }
      else {
        console.error("Registration failed: " + (result.error));
      }
    } catch (error) {
      console.error("Error: " + error.message);
    }
  });
});

async function getSessionData() {
  try {
    const response = await fetch("/api/getSessionData.php", {
      method: "POST",
      credentials: "include"
    });

    const result = await response.json();

    if (result) {
      sessionData = result;
    }
    else {
      sessionData = null;
    }
  } catch (error) {
    console.error("Error: " + error.message);
  }
}

async function getEvents() {
  try {
    const formData = new FormData();
    formData.append("timelineId", id);

    const response = await fetch("/api/getEvents.php", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    const result = await response.json();

    if (result && result.success) {
      return result.data;
    }
    else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error: " + error.message);
    return null;
  }
}

// Create an event
async function createEvent(title, time, date, description) {
  try {
    let datetime = date+" "+time+":00";

    const formData = new FormData();
    formData.append("timelineId", id);
    formData.append("title", title);
    formData.append("date", datetime);
    formData.append("description", description);

    const response = await fetch("/api/createEvent.php", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    const result = await response.json();

    if (result) {
      if (result.success) {
        return result.data;
      }

      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error: " + error.message);
  }

  return null;
}

// Return a new event block with the given informations
function GetEvent(idEvent, title, time, date, description) {
  const event = document.createElement("div"); // Create the event container
  event.classList = "event";
  event.dataset.eventId = idEvent;

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

  deleteInsert.addEventListener("click", async () => { // Handle the delete button click
    const eventId = event.dataset.eventId;
    const idDeletedTheEvent = await deleteEvent(eventId);

    if (idDeletedTheEvent) {
      event.remove();
    }
  });
  
  return event;
  
  /* The returned structure

  <div class='event' data-eventId={id}>
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

async function deleteEvent(eventId) {
  try {
    const formData = new FormData();
    formData.append("eventId", eventId);

    const response = await fetch("/api/deleteEvent.php", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    const result = await response.json();

    if (result && result.success) {
      return true;
    }
    else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error: " + error.message);
    return false;
  }
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
    deleteButton.addEventListener("click", async () => {
      const event = deleteButton.closest(".event");
      const eventId = event.dataset.eventId;
      const idDeletedTheEvent = await deleteEvent(eventId);

      if (idDeletedTheEvent) {
        event.remove();
      }
    });
  });
}

// Toggle login section
function toggleLoginSection() {
  isLoginShowed = !isLoginShowed;

  if (isLoginShowed) {
    loginCreateAccountSection.style.display = "block";

    if (isMobileMenuShowed) {
      toggleMobileMenu();
    }
  }
  else {
    loginCreateAccountSection.style.display = "none";
  }
}

// Toggle the mobile menu (show/hide)
function toggleMobileMenu() {
  if (!window.location.href.includes("timeline.php")) {
    return;
  }

  isMobileMenuShowed = !isMobileMenuShowed;

  if (isMobileMenuShowed) {
    addEventForm.style.display = "flex";
    header.style.flexDirection = "column";

    if (isLoginShowed) {
      toggleLoginSection();
    }
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
  if (!window.location.href.includes("timeline.php")) {
    return;
  }

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