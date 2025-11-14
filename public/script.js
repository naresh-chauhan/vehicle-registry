// DOM Elements
const vehicleForm = document.getElementById('vehicleForm');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const resultsContainer = document.getElementById('resultsContainer');

// Load all vehicles on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAllVehicles();
});

// Handle form submission
vehicleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        make: document.getElementById('make').value.trim(),
        model: document.getElementById('model').value.trim(),
        color: document.getElementById('color').value.trim(),
        license_plate: document.getElementById('license_plate').value.trim()
    };

    try {
        const response = await fetch('/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Vehicle added successfully!', 'success');
            vehicleForm.reset();
            loadAllVehicles();
        } else {
            showMessage(data.error || 'Error adding vehicle', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Error:', error);
    }
});

// Handle search input
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    searchTimeout = setTimeout(() => {
        if (query) {
            searchVehicles(query);
        } else {
            loadAllVehicles();
        }
    }, 300);
});

// Clear search
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    loadAllVehicles();
});

// Load all vehicles
async function loadAllVehicles() {
    try {
        const response = await fetch('/api/vehicles');
        const vehicles = await response.json();
        displayVehicles(vehicles);
    } catch (error) {
        showMessage('Error loading vehicles', 'error');
        console.error('Error:', error);
    }
}

// Search vehicles
async function searchVehicles(query) {
    try {
        const response = await fetch(`/api/vehicles/search?q=${encodeURIComponent(query)}`);
        const vehicles = await response.json();
        displayVehicles(vehicles, query);
    } catch (error) {
        showMessage('Error searching vehicles', 'error');
        console.error('Error:', error);
    }
}

// Display vehicles
function displayVehicles(vehicles, searchQuery = '') {
    if (vehicles.length === 0) {
        resultsContainer.innerHTML = '<p class="empty-state">No vehicles found. Add a vehicle or search to see results.</p>';
        return;
    }

    resultsContainer.innerHTML = vehicles.map(vehicle => {
        const name = highlightText(vehicle.name, searchQuery);
        const phone = highlightText(vehicle.phone, searchQuery);
        const make = highlightText(vehicle.make, searchQuery);
        const model = highlightText(vehicle.model, searchQuery);
        const color = highlightText(vehicle.color, searchQuery);
        const licensePlate = highlightText(vehicle.license_plate, searchQuery);
        const date = new Date(vehicle.created_at).toLocaleString();

        return `
            <div class="vehicle-card">
                <div class="vehicle-header">
                    <div class="vehicle-name">${name}</div>
                    <button class="btn btn-danger" onclick="deleteVehicle(${vehicle.id})">Delete</button>
                </div>
                <div class="vehicle-details">
                    <div class="detail-item">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${phone}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Make</span>
                        <span class="detail-value">${make}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Model</span>
                        <span class="detail-value">${model}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Color</span>
                        <span class="detail-value">${color}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">License Plate</span>
                        <span class="detail-value">${licensePlate}</span>
                    </div>
                </div>
                <div class="vehicle-footer">
                    <span>Added: ${date}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Highlight search query in text
function highlightText(text, query) {
    if (!query) return escapeHtml(text);
    
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    return escapedText.replace(regex, '<span class="highlight">$1</span>');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Delete vehicle
async function deleteVehicle(id) {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
        return;
    }

    try {
        const response = await fetch(`/api/vehicles/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Vehicle deleted successfully', 'success');
            const query = searchInput.value.trim();
            if (query) {
                searchVehicles(query);
            } else {
                loadAllVehicles();
            }
        } else {
            showMessage(data.error || 'Error deleting vehicle', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
        console.error('Error:', error);
    }
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    resultsContainer.insertBefore(messageDiv, resultsContainer.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

