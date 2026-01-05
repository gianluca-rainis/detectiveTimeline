const main = document.querySelector("main");
const addEventForm = document.getElementById("addEventForm");
const title = document.getElementById("title");
const time = document.getElementById("time");
const date = document.getElementById("date");
const description = document.getElementById("description");
const today = new Date().getFullYear()+"-"+((new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1)+"-"+((new Date().getDate()+1)<10?"0"+new Date().getDate():new Date().getDate());
const now = (new Date().getHours()<10?"0"+new Date().getHours():new Date().getHours())+":"+(new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes());

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
  });
});

function GetEvent(title, time, date, description) {
  const event = document.createElement("div");
  event.classList = "event";

  const dateToInsert = document.createElement("p");
  dateToInsert.classList = "date";
  dateToInsert.innerHTML = `${date} - ${time}`;

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
      {date} - {time}
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