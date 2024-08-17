const API_BASE_URL = process.env.API_BASE_URL || 'http://yourapiurl.com/api';
const API_KEY = process.env.API_KEY || 'yourapikey';

document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
document.getElementById('createForm').addEventListener('submit', createEvent);

document.addEventListener('click', function(e) {
    if (e.target && e.target.className === 'update-btn') {
        const eventId = e.target.dataset.eventId;
        updateEvent(eventId);
    } else if (e.target && e.target.className === 'delete-btn') {
        const eventId = e.target.dataset.eventId;
        deleteEvent(eventId);
    }
});

function fetchAndDisplayData() {
    fetchEvents()
    .then(displayEvents)
    .catch(handleError);
}

function fetchEvents() {
    return fetch(`${API_BASE_URL}/events`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` },
    }).then(response => response.json());
}

function displayEvents(data) {
    const eventsContainer = document.getElementById('eventsContainer');
    eventsContainer.innerHTML = '';
    data.forEach(event => {
        eventsContainer.innerHTML += createEventHTML(event);
    });
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

function createEvent(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jsonData = Object.fromEntries(formData.entries());
    postEvent(jsonData)
    .then(fetchAndDisplayData)
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
    }).then(response => response.json());
}

function updateEvent(eventId) {
    const title = prompt("Enter new title for event:");
    if (title) {
        const eventData = { title };
        putEvent(eventId, eventData)
        .then(fetchAndDisplayData)
        .catch(handleError);
    }
}

function putEvent(eventId, eventData) {
    return fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(eventData),
    }).then(response => response.json());
}

function deleteEvent(eventId) {
    if (confirm("Are you sure you want to delete this event?")) {
        deleteEventRequest(eventId)
        .then(fetchAndDisplayData)
        .catch(handleError);
    }
}

function deleteEventRequest(eventId) {
    return fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${API_KEY}` },
    }).then(response => response.json());
}

function handleError(err) {
    console.error(err);
}