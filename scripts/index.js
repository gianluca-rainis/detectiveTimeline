const titleTimeline = document.getElementById("titleTimeline");
const dateTimeline = document.getElementById("dateTimeline");

document.addEventListener("DOMContentLoaded", async () => {
    addEventForm.style.display = "none";
    
    dateTimeline.value = today;

    const timelines = await getTimelines();

    if (timelines.length != 0) {
        timelines.forEach(timeline => {
            main.appendChild(GetTimeline(timeline.id, timeline.title, timeline.date));
        });
    }

    addTimelineForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const titleValue = titleTimeline.value.trim();
        const dateValue = dateTimeline.value;

        if (titleValue === "") {
            return;
        }

        const createdTimeline = await createTimeline(titleValue, dateValue);

        if (createdTimeline) {
            main.appendChild(GetTimeline(createdTimeline.id, createdTimeline.title, createdTimeline.date));

            titleTimeline.value = "";
            dateTimeline.value = today;
        }
    });
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

// Create a timeline
async function createTimeline(title, date) {
    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("date", date);

        const response = await fetch("/api/createTimeline.php", {
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
        alert("Error: " + error.message);
    }

    return null;
}

// Return a new timeline block with the given informations
function GetTimeline(id, title, date) {
  const event = document.createElement("div"); // Create the event container
  event.classList = "event";

  const dateToInsert = document.createElement("p"); // Add date
  dateToInsert.classList = "date";
  dateToInsert.innerHTML = `${date}`;

  const titleToInsert = document.createElement("h3"); // Add title
  titleToInsert.classList = "title";
  titleToInsert.innerHTML = title;

  const editTimeline = document.createElement("a"); // Add the edit timeline button
  editTimeline.href = "./timeline.php?id="+id;
  editTimeline.innerHTML = `<img src="./images/edit.png" class="editTimeline" />`;

  const deleteInsert = document.createElement("img"); // Add the delete timeline button
  deleteInsert.className = "delete";
  deleteInsert.src = "./images/delete.png";

  event.appendChild(dateToInsert);
  event.appendChild(titleToInsert);
  event.appendChild(editTimeline);
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
    <a href="./timeline.php?id={id}"><img src="./images/edit.png" class="editTimeline" /></a>
    <img src="./images/delete.png" class="delete" />
  </div> */
}