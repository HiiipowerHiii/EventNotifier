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
    fetch(`${API_BASE_URL}/events`, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        const eventsContainer = document.getElementById('eventsContainer');
        eventsContainer.innerHTML = '';
        data.forEach(event => {
            eventsContainer.innerHTML += `
                <div>
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <button class="update-btn" data-event-id="${event.id}">Update</button>
                    <button class="delete-btn" data-event-id="${event.id}">Delete</button>
                </div>
            `;
        });
    })
    .catch(err => console.error(err));
}

function createEvent(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jsonData = Object.fromEntries(formData.entries());
    
    fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(jsonData),
    })
    .then(response => response.json())
    .then(() => fetchAndDisplayData())
    .catch(err => console.error(err));
}

function updateEvent(eventId) {
    const eventData = {
        title: prompt("Enter new title for event:"), 
    };
    
    fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(eventData),
    })
    .then(response => response.json())
    .then(() => fetchAndDisplayData())
    .catch(err => console.error(err));
}

function deleteEvent(eventId) {
    if (confirm("Are you sure you want to delete this event?")) { 
        fetch(`${API_BASE_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        })
        .then(response => response.json())
        .then(() => fetchAndDisplayData())
        .catch(err => console.error(err));
    }
}