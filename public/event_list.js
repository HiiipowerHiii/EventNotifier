import React, { useState, useEffect } from 'react';

const fetchEvents = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/events`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventsFromServer = await fetchEvents();
        setEvents(eventsFromServer);
      } catch (error) {
        setError(error.message);
      }
    };

    getEvents();
  }, []);

  return (
    <div>
      <h2>Event List</h2>
      {error && <div style={{color: 'red'}}>Error: {error}</div>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><b>Date:</b> {new Date(event.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;