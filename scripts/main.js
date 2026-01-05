const main = document.querySelector("main");
const addEventForm = document.getElementById("addEventForm");
const title = document.getElementById("title");
const time = document.getElementById("time");
const date = document.getElementById("date");
const description = document.getElementById("description");
const today = new Date().getFullYear()+"-"+((new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1)+"-"+((new Date().getDate()+1)<10?"0"+new Date().getDate():new Date().getDate());

document.addEventListener("DOMContentLoaded", () => {
  date.value = today;

  addEventForm.addEventListener("submit", (e) => {
    e.preventDefault();

    main.appendChild(GetEvent(title.value, time.value, date.value, description.value));

    title.value = "";
    time.value = "";
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

  event.appendChild(dateToInsert);
  event.appendChild(titleToInsert);
  event.appendChild(descriptionToInsert);
  
  return event;
  
  /* <div className='event'>
    <p className='date'>
      {date} - {time}
    </p>
    <h3 className='title'>
      {title}
    </h3>
    <p className='description'>
      {description}
    </p>
  </div> */
}