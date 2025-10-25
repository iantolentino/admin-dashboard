// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.main');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            main.classList.toggle('expanded');
        });
    }

    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const isDark = html.getAttribute('data-bs-theme') === 'dark';
            html.setAttribute('data-bs-theme', isDark ? 'light' : 'dark');
            
            // Update icon and text
            const icon = this.querySelector('i');
            const text = this.querySelector('span');
            
            if (isDark) {
                icon.className = 'bi bi-moon';
                text.textContent = 'Dark Mode';
            } else {
                icon.className = 'bi bi-sun';
                text.textContent = 'Light Mode';
            }
            
            // Save preference
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-bs-theme', savedTheme);
        
        if (savedTheme === 'dark') {
            const icon = darkModeToggle.querySelector('i');
            const text = darkModeToggle.querySelector('span');
            icon.className = 'bi bi-sun';
            text.textContent = 'Light Mode';
        }
    }

    // Auto-update badges and notifications
    updateNotificationBadges();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

function updateNotificationBadges() {
    // Simulate real-time updates
    setInterval(() => {
        const badges = document.querySelectorAll('.badge');
        badges.forEach(badge => {
            if (badge.textContent.match(/^\d+$/)) {
                const current = parseInt(badge.textContent);
                if (current > 0 && Math.random() > 0.7) {
                    badge.textContent = Math.max(0, current - 1).toString();
                }
            }
        });
    }, 30000);
}

// Chart data simulation
function getRandomData(length = 12, min = 100, max = 1000) {
    return Array.from({ length }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// Export functions for use in other modules
window.dashboardUtils = {
    getRandomData,
    updateNotificationBadges
};

// Add this to script.js or each page's JavaScript
function setActiveSidebarItem() {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        const link = item.querySelector('.sidebar-link');
        if (link && link.getAttribute('href') === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Call this on page load
document.addEventListener('DOMContentLoaded', setActiveSidebarItem);


// Enhanced navigation handling
function initializeNavigation() {
    // Set active sidebar item based on current page
    setActiveSidebarItem();
    
    // Handle sidebar link clicks
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const sidebarItem = this.closest('.sidebar-item');
            const sidebarItems = document.querySelectorAll('.sidebar-item');
            
            // Remove active class from all items
            sidebarItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked item
            sidebarItem.classList.add('active');
            
            // Store active state in session storage for persistence
            sessionStorage.setItem('activeSidebarItem', this.getAttribute('href'));
        });
    });
    
    // Restore active state from session storage
    const activeItem = sessionStorage.getItem('activeSidebarItem');
    if (activeItem) {
        const activeLink = document.querySelector(`.sidebar-link[href="${activeItem}"]`);
        if (activeLink) {
            const sidebarItems = document.querySelectorAll('.sidebar-item');
            sidebarItems.forEach(item => item.classList.remove('active'));
            activeLink.closest('.sidebar-item').classList.add('active');
        }
    }
}

// Call this in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    // ... your existing code
});