const API_BASE_URL = process.env.API_BASE_URL || 'http://yourapiurl.com/api';
const API_KEY = process.env.API_KEY || 'yourapikey';

document.addEventListener('DOMContentLoaded', fetchAndDisplayEvents);
document.getElementById('createForm').addEventListener('submit', handleCreateEventFormSubmit);

document.addEventListener('click', handleDocumentClick);

function handleDocumentClick(event) {
    if (event.target && event.target.className === 'update-btn') {
        const eventId = event.target.dataset.eventId;
        promptAndUpdateEvent(eventId);
    } else if (event.target && event.target.className === 'delete-btn') {
        const eventId = event.target.dataset.eventId;
        confirmAndDeleteEvent(eventId);
    }
}

function fetchAndDisplayEvents() {
    fetchEvents()
        .then(displayEvents)
        .catch(handleError);
}

function fetchEvents() {
    return fetch(`${API_BASE_URL}/events`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` },
    })
    .then(response => response.json());
}

function displayEvents(events) {
    const eventsContainer = document.getElementById('eventsContainer');
    eventsContainer.innerHTML = events.map(createEventHTML).join('');
}

function createEventHTML(event) {
    return `
        <div>
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <button class="update-btn" data-event-id="${event.id}">Update</button>
            <button class="delete-btn" data-event-id="${event.id}">Delete</button>
        </div>
    `;
}

function handleCreateEventFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const jsonData = Object.fromEntries(formData.entries());
    createAndDisplayNewEvent(jsonData);
}

function createAndDisplayNewEvent(eventData) {
    postEvent(eventData)
        .then(fetchAndDisplayEvents)
        .catch(handleError);
}

function postEvent(eventData) {
    return fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(eventData),
    })
    .then(response => response.json());
}

function promptAndUpdateEvent(eventId) {
    const title = prompt("Enter new title for event:");
    if (title) {
        updateEvent(eventId, { title });
    }
}

function updateEvent(eventId, eventData) {
    putEvent(eventId, eventData)
        .then(fetchAndDisplayEvents)
        .catch(handleError);
}

function putEvent(eventId, eventData) {
    return fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(eventData),
    })
    .then(response => response.json());
}

function confirmAndDeleteEvent(eventId) {
    if (confirm("Are you sure you want to delete this event?")) {
        deleteEventAndRefresh(eventId);
    }
}

function deleteEventAndRefresh(eventId) {
    deleteEvent(eventId)
        .then(fetchAndDisplayEvents)
        .catch(handleError);
}

function deleteEvent(eventId) {
    return fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${API_KEY}` },
    })
    .then(response => response.json());
}

function handleError(error) {
    console.error(error);
}