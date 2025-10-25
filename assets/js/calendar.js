// Calendar functionality
let currentDate = new Date();
let currentView = 'month';

document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    loadEvents();
});

function initializeCalendar() {
    // Navigation
    document.getElementById('prevMonth').addEventListener('click', () => navigate(-1));
    document.getElementById('nextMonth').addEventListener('click', () => navigate(1));
    
    // View switching
    document.querySelectorAll('[data-view]').forEach(button => {
        button.addEventListener('click', function() {
            switchView(this.getAttribute('data-view'));
        });
    });
    
    renderCalendar();
}

function navigate(direction) {
    if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + direction);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() + (direction * 7));
    } else {
        currentDate.setDate(currentDate.getDate() + direction);
    }
    renderCalendar();
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });
    renderCalendar();
}

function renderCalendar() {
    updateHeader();
    
    if (currentView === 'month') {
        renderMonthView();
    } else if (currentView === 'week') {
        renderWeekView();
    } else {
        renderDayView();
    }
}

function updateHeader() {
    const options = { year: 'numeric', month: 'long' };
    document.getElementById('currentMonthYear').textContent = 
        currentDate.toLocaleDateString('en-US', options);
}

function renderMonthView() {
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    let current = new Date(startDate);
    
    while (current <= endDate) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (current.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        if (isToday(current)) {
            dayElement.classList.add('today');
        }
        
        dayElement.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${current.getDate()}</span>
                <small class="text-muted">${getEventsForDate(current).length}</small>
            </div>
            <div class="events-container">
                ${getEventsForDate(current).slice(0, 2).map(event => `
                    <div class="calendar-event event-${event.type}" title="${event.title}">
                        ${event.title}
                    </div>
                `).join('')}
                ${getEventsForDate(current).length > 2 ? 
                    `<small class="text-muted">+${getEventsForDate(current).length - 2} more</small>` : ''}
            </div>
        `;
        
        dayElement.addEventListener('click', () => openDayView(current));
        calendarDays.appendChild(dayElement);
        
        current.setDate(current.getDate() + 1);
    }
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function getEventsForDate(date) {
    // Simulate events - in real app, this would filter from actual events data
    const events = [
        {
            id: 1,
            title: 'Team Meeting',
            type: 'meeting',
            date: new Date(),
            color: '#2196f3'
        },
        {
            id: 2,
            title: 'Project Deadline',
            type: 'deadline',
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
            color: '#f44336'
        }
    ];
    
    return events.filter(event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
}

function openDayView(date) {
    showToast(`Opening day view for ${date.toLocaleDateString()}`, 'info');
}

function addEvent() {
    const form = document.getElementById('addEventForm');
    const formData = new FormData(form);
    
    // Simulate event creation
    showToast('Event added successfully!', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
    modal.hide();
    form.reset();
    
    // Reload calendar
    setTimeout(() => {
        renderCalendar();
    }, 500);
}

function loadEvents() {
    // Update stats
    document.getElementById('eventsThisMonth').textContent = '8';
    document.getElementById('meetingsThisMonth').textContent = '5';
    document.getElementById('deadlinesThisMonth').textContent = '2';
    document.getElementById('tasksThisMonth').textContent = '1';
}