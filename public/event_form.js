import React, { useState, useEffect } from 'react';

const EventNotifierForm = ({ onEventSubmit, initialEventData = {} }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  useEffect(() => {
    if (initialEventData) {
      setEventTitle(initialEventData.title || '');
      setEventDescription(initialEventData.description || '');
      setEventDate(initialEventData.date || '');
      setEventTime(initialEventData.time || '');
    }
  }, [initialEventData]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!eventTitle || !eventDescription || !eventDate || !eventTime) {
      alert('All fields are required!');
      return;
    }

    onEventSubmit({ title: eventTitle, description: eventDescription, date: eventDate, time: eventTime });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label>Date</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>
      <div>
        <label>Time</label>
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EventNotifierForm;