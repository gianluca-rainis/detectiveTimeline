import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import '../styles/style.css'

function Event({ title, time, date, description }) {
  return (
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
  );
}

function App() {
  const [events, setEvents] = useState([]);

  function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = e.target.title.value;
    const time = e.target.time.value;
    const date = e.target.date.value;
    const description = e.target.description.value;

    if (title && time && date && description) {
      setEvents([...events, { title, time, date, description, id: Date.now() }]);
      e.target.reset();
    }
  }

  return (
    <>
      <header>
        <form id='addEventForm' onSubmit={handleFormSubmit}>
          <label>Title</label>
          <input type='text' id='title' name='title' required />

          <label>Date</label>
          <input type='time' id='time' name='time' required />
          <input type='date' id='date' name='date' required />

          <label>Additional informations</label>
          <input type='text' id='description' name='description' required />

          <input type='submit' value="Submit" />
        </form>
      </header>
      <main>
        {events.map(event => (
          <Event 
            key={event.id}
            title={event.title}
            time={event.time}
            date={event.date}
            description={event.description}
          />
        ))}
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)