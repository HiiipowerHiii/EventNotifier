import React, { useState, useEffect, useCallback } from 'react';

const EventNotifierForm = ({ onEventSubmit, initialEventData = {} }) => {
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventDescription: '',
    eventDate: '',
    eventTime: ''
  });

  useEffect(() => {
    setFormData({
      eventTitle: initialEventData.title || '',
      eventDescription: initialEventData.description || '',
      eventDate: initialEventData.date || '',
      eventTime: initialEventData.time || '',
    });
  }, [initialEventData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleFormSubmit = useCallback((event) => {
    event.preventDefault();

    const { eventTitle, eventDescription, eventDate, eventTime } = formData;

    if (!eventTitle || !eventDescription || !eventDate || !eventTime) {
      alert('All fields are required!');
      return;
    }

    onEventSubmit({ title: eventTitle, description: eventDescription, date: eventDate, time: eventTime });
  }, [formData, onEventSubmit]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          name="eventTitle"
          value={formData.eventTitle}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="eventDescription"
          value={formData.eventDescription}
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <label>Date</label>
        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Time</label>
        <input
          type="time"
          name="eventTime"
          value={formData.eventTime}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EventNotifierForm;