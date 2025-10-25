// Settings functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
});

function initializeSettings() {
    initializeThemeSettings();
    initializeColorSettings();
    initializeTabNavigation();
}

function initializeThemeSettings() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Apply theme
            applyTheme(theme);
        });
    });
}

function applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'auto') {
        // Remove explicit theme and let CSS media query handle it
        html.removeAttribute('data-bs-theme');
        localStorage.removeItem('theme');
    } else {
        html.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    showToast('Theme updated successfully!', 'success');
}

function initializeColorSettings() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Apply color
            applyAccentColor(color);
        });
    });
}

function applyAccentColor(color) {
    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Save to localStorage
    localStorage.setItem('accentColor', color);
    
    showToast('Accent color updated!', 'success');
}

function initializeTabNavigation() {
    // Highlight active tab based on URL hash
    const hash = window.location.hash;
    if (hash) {
        const tab = document.querySelector(`a[href="${hash}"]`);
        if (tab) {
            // Remove active class from all tabs
            document.querySelectorAll('.settings-nav .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current tab
            tab.classList.add('active');
            
            // Show corresponding tab content
            const tabContent = document.querySelector(hash);
            if (tabContent) {
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                tabContent.classList.add('show', 'active');
            }
        }
    }
}

// Load saved settings
function loadSavedSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        
        // Update theme option
        const themeOption = document.querySelector(`.theme-option[data-theme="${savedTheme}"]`);
        if (themeOption) {
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            themeOption.classList.add('active');
        }
    }
    
    // Load accent color
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--primary-color', savedColor);
        
        // Update color option
        const colorOption = document.querySelector(`.color-option[data-color="${savedColor}"]`);
        if (colorOption) {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            colorOption.classList.add('active');
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadSavedSettings);