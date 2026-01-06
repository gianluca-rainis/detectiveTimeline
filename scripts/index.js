const titleTimeline = document.getElementById("titleTimeline");
const dateTimeline = document.getElementById("dateTimeline");

let isMobileTimelineMenuShowed = false;

document.addEventListener("DOMContentLoaded", async () => {
    addEventForm.style.display = "none";
    
    dateTimeline.value = today;

    // Handle mobile menu for addTimelineForm
    mobileMenuButton.addEventListener("click", (e) => {
        e.stopPropagation();
        
        isMobileTimelineMenuShowed = !isMobileTimelineMenuShowed;

        if (isMobileTimelineMenuShowed) {
            addTimelineForm.style.display = "flex";
            header.style.flexDirection = "column";

            if (isLoginShowed) {
                toggleLoginSection();
            }
        }
        else {
            addTimelineForm.style.display = "none";
            header.style.flexDirection = "row";
        }
    });

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
      console.error("Error: " + error.message);
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
        console.error("Error: " + error.message);
    }

    return null;
}

// Delete a timeline
async function deleteTimeline(id) {
    try {
        const formData = new FormData();
        formData.append("timelineId", id);

        const response = await fetch("/api/deleteTimeline.php", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const result = await response.json();

        if (result) {
            if (result.success) {
                return true;
            }

            throw new Error(result.error);
        }
    } catch (error) {
        console.error("Error: " + error.message);
    }

    return false;
}

// Return a new timeline block with the given informations
function GetTimeline(id, title, date) {
  const event = document.createElement("div"); // Create the event container
  event.classList = "event";
  event.dataset.timelineId = id;

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

  deleteInsert.addEventListener("click", async () => { // Handle the delete button click
    const isDeleted = await deleteTimeline(event.dataset.timelineId);

    if (isDeleted) {
        event.remove();
    }
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

window.addEventListener("resize", handleTimelineResize);
handleTimelineResize(); // Initial call

// Handle resize for addTimelineForm visibility
function handleTimelineResize() {
    if (window.innerWidth <= 850) {
        addTimelineForm.style.display = "none";
        mobileMenuButton.style.display = "block";
    }
    else {
        addTimelineForm.style.display = "flex";
        mobileMenuButton.style.display = "none";

        if (isMobileTimelineMenuShowed) {
            isMobileTimelineMenuShowed = false;
            header.style.flexDirection = "row";
        }
    }
};