import React, { useState, useEffect } from 'react';

const fetchEvents = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/events`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Additional error handling if the data is not in expected format
    if (!Array.isArray(data)) {
      throw new Error('Data format is incorrect');
    }
    return data;
  } catch (error) {
    // Re-throw the error to be caught by the calling function
    throw error;
  }
};

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is mounted

    const getEvents = async () => {
      try {
        const eventsFromServer = await fetchEvents();
        // Only update state if component is still mounted
        if (isMounted) {
          setEvents(eventsFromServer);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      }
    };

    getEvents();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h2>Event List</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
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