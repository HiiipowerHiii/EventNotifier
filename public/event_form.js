import React, { useState, useEffect } from 'react';

const EventForm = ({ onSubmit, initialData = {} }) => {
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [date, setDate] = useState('');
const [time, setTime] = useState('');

useEffect(() => {
if (initialData) {
  setTitle(initialData.title || '');
  setDescription(initialData.description || '');
  setDate(initialData.date || '');
  setTime(initialData.time || '');
}
}, [initialData]);

const handleSubmit = (event) => {
event.preventDefault();

if (!title || !description || !date || !time) {
  alert('All fields are required!');
  return;
}

onSubmit({ title, description, date, time });
};

return (
<form onSubmit={handleSubmit}>
  <div>
    <label>Title</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  </div>
  <div>
    <label>Description</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    ></textarea>
  </div>
  <div>
    <label>Date</label>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  </div>
  <div>
    <label>Time</label>
    <input
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
    />
  </div>
  <button type="submit">Submit</button>
</form>
);
};

export default EventForm;