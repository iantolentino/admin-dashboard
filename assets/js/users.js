// Users Management functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeUsersTable();
    initializeUserFilters();
});

function initializeUsersTable() {
    // Generate sample users
    const users = [
        {
            id: 1,
            name: 'John Doe',
            username: '@johndoe',
            email: 'john.doe@example.com',
            role: 'admin',
            status: 'active',
            lastActive: '2 hours ago',
            avatar: '../assets/img/user-avatar.jpg'
        },
        {
            id: 2,
            name: 'Jane Smith',
            username: '@janesmith',
            email: 'jane.smith@example.com',
            role: 'moderator',
            status: 'active',
            lastActive: '1 day ago',
            avatar: '../assets/img/user-avatar.jpg'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            username: '@mikej',
            email: 'mike.johnson@example.com',
            role: 'user',
            status: 'inactive',
            lastActive: '3 days ago',
            avatar: '../assets/img/user-avatar.jpg'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            username: '@sarahw',
            email: 'sarah.wilson@example.com',
            role: 'user',
            status: 'pending',
            lastActive: '1 week ago',
            avatar: '../assets/img/user-avatar.jpg'
        }
    ];

    const tableBody = document.querySelector('#usersTable tbody');
    
    // Clear existing rows (except the first sample row)
    while (tableBody.rows.length > 1) {
        tableBody.deleteRow(1);
    }

    // Add users to table
    users.forEach(user => {
        const row = tableBody.insertRow();
        
        // Checkbox
        const cell1 = row.insertCell(0);
        cell1.innerHTML = '<div class="form-check"><input class="form-check-input" type="checkbox"></div>';
        
        // User info
        const cell2 = row.insertCell(1);
        cell2.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${user.avatar}" alt="User" class="rounded-circle me-3" width="40">
                <div>
                    <div class="fw-bold">${user.name}</div>
                    <small class="text-muted">${user.username}</small>
                </div>
            </div>
        `;
        
        // Email
        const cell3 = row.insertCell(2);
        cell3.textContent = user.email;
        
        // Role
        const cell4 = row.insertCell(3);
        const roleBadge = getRoleBadge(user.role);
        cell4.innerHTML = roleBadge;
        
        // Status
        const cell5 = row.insertCell(4);
        const statusBadge = getStatusBadge(user.status);
        cell5.innerHTML = statusBadge;
        
        // Last Active
        const cell6 = row.insertCell(5);
        cell6.textContent = user.lastActive;
        
        // Actions
        const cell7 = row.insertCell(6);
        cell7.innerHTML = `
            <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.id})" data-bs-toggle="tooltip" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})" data-bs-toggle="tooltip" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="viewUser(${user.id})" data-bs-toggle="tooltip" title="View Profile">
                    <i class="bi bi-eye"></i>
                </button>
            </div>
        `;
    });

    // Initialize select all checkbox
    const selectAll = document.getElementById('selectAll');
    selectAll.addEventListener('change', function() {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });
}

function getRoleBadge(role) {
    const badges = {
        'admin': 'bg-primary',
        'moderator': 'bg-info',
        'user': 'bg-secondary'
    };
    
    const roleText = role.charAt(0).toUpperCase() + role.slice(1);
    return `<span class="badge ${badges[role]}">${roleText}</span>`;
}

function getStatusBadge(status) {
    const badges = {
        'active': 'bg-success',
        'inactive': 'bg-danger',
        'pending': 'bg-warning'
    };
    
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="badge ${badges[status]}">${statusText}</span>`;
}

function initializeUserFilters() {
    const searchInput = document.getElementById('userSearch');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    [searchInput, roleFilter, statusFilter].forEach(element => {
        element.addEventListener('input', filterUsers);
        element.addEventListener('change', filterUsers);
    });
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const rows = document.querySelectorAll('#usersTable tbody tr');
    
    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        const role = row.cells[3].textContent.toLowerCase();
        const status = row.cells[4].textContent.toLowerCase();
        
        const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
        const matchesRole = !roleFilter || role.includes(roleFilter);
        const matchesStatus = !statusFilter || status.includes(statusFilter);
        
        row.style.display = (matchesSearch && matchesRole && matchesStatus) ? '' : 'none';
    });
}

function addNewUser() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    
    // Simulate API call
    const newUser = {
        id: Date.now(),
        name: document.getElementById('fullName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        status: 'pending',
        lastActive: 'Just now',
        avatar: '../assets/img/user-avatar.jpg'
    };
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
    form.reset();
    
    // Show success message
    showToast('User added successfully!', 'success');
    
    // Refresh table (in real app, this would be an API call)
    setTimeout(() => {
        initializeUsersTable();
    }, 1000);
}

function editUser(userId) {
    // Simulate edit functionality
    showToast(`Editing user ${userId}`, 'info');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        // Simulate delete functionality
        showToast('User deleted successfully!', 'success');
    }
}

function viewUser(userId) {
    // Simulate view functionality
    showToast(`Viewing user ${userId} profile`, 'info');
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to container
    const container = document.getElementById('toastContainer') || createToastContainer();
    container.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after hide
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}