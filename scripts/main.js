function GetEvent(title, time, date, description) {
  const event = document.createElement("div");
  event.classList = "event";

  const date = document.createElement("p");
  

  /* return (
    <div className='event'>
      <p className='date'>
        {date} - {time}
      </p>
      <h3 className='title'>
        {title}
      </h3>
      <p className='description'>
        {description}
      </p>
    </div>
  ); */
}

const main = document.querySelector("main");
const addEventForm = document.getElementById("addEventForm");
const title = document.getElementById("title");
const time = document.getElementById("time");
const date = document.getElementById("date");
const description = document.getElementById("description");

function handleFormSubmit(e) {
  addEventForm.preventDefault(e);

  if (addEventForm && title && time && date && description) {
    if (main) {
      main.appendChild(GetEvent(title.nodeValue, time.nodeValue, date.nodeValue, description.nodeValue));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  addEventForm.addEventListener("submit", handleFormSubmit);
});