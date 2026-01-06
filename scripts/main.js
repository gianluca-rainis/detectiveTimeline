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

let isMobileMenuShowed = false;

document.addEventListener("DOMContentLoaded", () => {
  time.value = now;
  date.value = today;

  addEventForm.addEventListener("submit", (e) => {
    e.preventDefault();

    main.appendChild(GetEvent(title.value, time.value, date.value, description.value));

    title.value = "";
    time.value = now;
    date.value = today;
    description.value = "";

    orderTimeline();
  });

  mobileMenuButton.addEventListener("click", toggleMobileMenu);
});

function GetEvent(title, time, date, description) {
  const event = document.createElement("div");
  event.classList = "event";

  const dateToInsert = document.createElement("p");
  dateToInsert.classList = "date";
  dateToInsert.innerHTML = `${date} | ${time}`;

  const titleToInsert = document.createElement("h3");
  titleToInsert.classList = "title";
  titleToInsert.innerHTML = title;

  const descriptionToInsert = document.createElement("p");
  descriptionToInsert.classList = "description";
  descriptionToInsert.innerHTML = description;

  const deleteInsert = document.createElement("img");
  deleteInsert.className = "delete";
  deleteInsert.src = "./images/delete.png";

  event.appendChild(dateToInsert);
  event.appendChild(titleToInsert);
  event.appendChild(descriptionToInsert);
  event.appendChild(deleteInsert);

  deleteInsert.addEventListener("click", () => {
    event.remove();
  });
  
  return event;
  
  /* <div class='event'>
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

function orderTimeline() {
  const events = document.querySelectorAll(".event");
  const dates = document.querySelectorAll(".date");

  for (let i = 0; i < events.length; i++) {
    const thisDate = new Date(dates[i].innerHTML.split(" | ")[0]+" "+dates[i].innerHTML.split(" | ")[1]);

    let minValueIndex = i;
    
    for (let j = i+1; j < events.length; j++) {
      const otherDate = new Date(dates[j].innerHTML.split(" | ")[0]+" "+dates[j].innerHTML.split(" | ")[1]);

      if (otherDate < thisDate) {
        minValueIndex = j;
      }
    }

    let temp = events[i].innerHTML;
    events[i].innerHTML = events[minValueIndex].innerHTML;
    events[minValueIndex].innerHTML = temp;
  }

  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", () => {
      deleteButton.closest(".event").remove();
    });
  });
}

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

window.addEventListener("resize", handleResize);

handleResize();

function handleResize() {
  if (window.innerWidth <= 740) {
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