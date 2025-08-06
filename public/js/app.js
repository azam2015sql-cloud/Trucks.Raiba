document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const notificationSound = document.getElementById('notification-sound');
    
    fetch('/api/units')
        .then(res => res.json())
        .then(units => displayUnits(units));
    
    socket.on('new_movement', data => {
        updateUnitDisplay(data.unit);
        playNotification(data.notification);
    });
    
    function displayUnits(units) {
        units.forEach(unit => {
            const areaDiv = document.getElementById(`${unit.current_area}-units`);
            if (areaDiv) {
                const unitElement = createUnitElement(unit);
                areaDiv.appendChild(unitElement);
            }
        });
    }
    
    function createUnitElement(unit) {
        const div = document.createElement('div');
        div.className = 'unit-card';
        div.id = `unit-${unit.unit_id}`;
        div.innerHTML = `
            <span class="unit-id">${unit.unit_id}</span>
            <span class="unit-type">${unit.unit_type}</span>
            <span class="unit-status">${unit.current_status}</span>
        `;
        return div;
    }
    
    function playNotification(notification) {
        notificationSound.src = `/sounds/${notification.sound_file}`;
        notificationSound.play();
        showToast(notification.message);
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});
