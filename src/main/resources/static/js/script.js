const baseURL = 'http://localhost:8080';

// Fetch and display drones
async function fetchDrones() {
    const response = await fetch(`${baseURL}/drones`);
    const drones = await response.json();
    const droneList = document.getElementById('drone-list');
    droneList.innerHTML = drones.map(drone => `
        <li>
            ID: ${drone.id}, Status: ${drone.status}
        </li>
    `).join('');
}

// Fetch and display undelivered deliveries
async function fetchUndeliveredDeliveries() {
    const response = await fetch(`${baseURL}/deliveries`);
    const deliveries = await response.json();
    deliveries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const deliveryList = document.getElementById('delivery-list');
    deliveryList.innerHTML = deliveries.map(delivery => `
        <li>
            <div>
                ID: ${delivery.id}, Address: ${delivery.adresse}, Assigned Drone: ${delivery.droneId || 'None'}
            </div>
        </li>
    `).join('');
}

// Create new drone
document.getElementById('add-drone-btn').addEventListener('click', async () => {
    await fetch(`${baseURL}/drones/add`, { method: 'POST' });
    fetchDrones();
});

// Enable drone
document.getElementById('enable-drone-btn').addEventListener('click', async () => {
    const droneId = prompt('Enter Drone ID to Enable:');
    if (droneId) {
        await fetch(`${baseURL}/drones/enable/${droneId}`, { method: 'PUT' });
        fetchDrones();
    }
});

// Disable drone
document.getElementById('disable-drone-btn').addEventListener('click', async () => {
    const droneId = prompt('Enter Drone ID to Disable:');
    if (droneId) {
        await fetch(`${baseURL}/drones/disable/${droneId}`, { method: 'PUT' });
        fetchDrones();
    }
});

// Retire drone
document.getElementById('retire-drone-btn').addEventListener('click', async () => {
    const droneId = prompt('Enter Drone ID to Retire:');
    if (droneId) {
        await fetch(`${baseURL}/drones/retire/${droneId}`, { method: 'PUT' });
        fetchDrones();
    }
});

// Assign drone to delivery
document.getElementById('assign-drone-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const deliveryId = document.getElementById('delivery-id').value;
    const droneId = document.getElementById('drone-id').value;

    const response = await fetch(`${baseURL}/deliveries/schedule?leveringId=${deliveryId}&droneId=${droneId}`, { method: 'PUT' });
    if (response.ok) {
        alert('Drone assigned successfully!');
        fetchUndeliveredDeliveries(); // Refresh the delivery list
    } else {
        alert('Failed to assign drone.');
    }
});

// Simulate new delivery
document.getElementById('simulate-delivery-btn').addEventListener('click', async () => {
    const pizzaId = Math.floor(Math.random() * 10);  // Random pizza ID for demo
    const address = `Street ${Math.floor(Math.random() * 100)}`;
    await fetch(`${baseURL}/deliveries/add?pizzaId=${pizzaId}&adresse=${address}`, { method: 'POST' });
    fetchUndeliveredDeliveries();
});

// Fetch initial data
fetchDrones();
fetchUndeliveredDeliveries();

// Auto-refresh deliveries list every 60 seconds
setInterval(fetchUndeliveredDeliveries, 60000);
