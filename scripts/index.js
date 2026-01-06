document.addEventListener("DOMContentLoaded", async () => {
    addEventForm.style.display = "none";

    const timelines = await getTimelines();

    const addNewTimelineButton = document.createElement("button");
    addNewTimelineButton.id = "addNewTimeline";
    addNewTimelineButton.innerHTML = `<img src="./images/add.svg" style="width: 50px;" /> Create a new timeline!`;

    header.appendChild(addNewTimelineButton);

    if (timelines.length != 0) {
        timelines.forEach(timeline => {
            main.appendChild(GetTimeline(timeline.title, timeline.date));
        });
    }
});

async function getTimelines() {
    let timelines = [];

    try {
      const response = await fetch("/api/getTimelines.php", {
        method: "POST",
        credentials: "include"
      });

      const result = await response.json();

      if (result) {
        if (result.success) {
            timelines = result.data;
        }
        else {
            throw new Error(result.error);
        }
      }
    } catch (error) {
      alert("Error: " + error.message);
    }

    return timelines;
}

// Return a new timeline block with the given informations
function GetTimeline(title, date) {
  const event = document.createElement("div"); // Create the event container
  event.classList = "event";

  const dateToInsert = document.createElement("p"); // Add date
  dateToInsert.classList = "date";
  dateToInsert.innerHTML = `${date}`;

  const titleToInsert = document.createElement("h3"); // Add title
  titleToInsert.classList = "title";
  titleToInsert.innerHTML = title;

  const deleteInsert = document.createElement("img"); // Add the delete event button
  deleteInsert.className = "delete";
  deleteInsert.src = "./images/delete.png";

  event.appendChild(dateToInsert);
  event.appendChild(titleToInsert);
  event.appendChild(deleteInsert);

  deleteInsert.addEventListener("click", () => { // Handle the delete button click
    event.remove();
  });
  
  return event;
  
  /* The returned structure

  <div class='event'>
    <p className='date'>
      {date}
    </p>
    <h3 class='title'>
      {title}
    </h3>
    <img src="./images/delete.png" class="delete" />
  </div> */
}