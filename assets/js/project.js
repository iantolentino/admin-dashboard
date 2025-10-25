// Projects management functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectsView();
    loadProjects();
});

function initializeProjectsView() {
    // View toggle functionality
    const viewRadios = document.querySelectorAll('input[name="projectView"]');
    viewRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const view = this.id.replace('View', '');
            switchProjectView(view);
        });
    });
}

function switchProjectView(view) {
    // Hide all views
    document.getElementById('listViewContent').classList.add('d-none');
    document.getElementById('gridViewContent').classList.add('d-none');
    document.getElementById('kanbanViewContent').classList.add('d-none');
    
    // Show selected view
    document.getElementById(`${view}ViewContent`).classList.remove('d-none');
    
    // Load appropriate data for the view
    if (view === 'kanban') {
        loadKanbanData();
    }
}

function loadProjects() {
    const projects = [
        {
            id: 1,
            name: 'Website Redesign',
            description: 'Marketing Site',
            category: 'web',
            status: 'completed',
            progress: 100,
            dueDate: '2024-12-15',
            priority: 'high',
            team: [1, 2]
        },
        {
            id: 2,
            name: 'Mobile App Development',
            description: 'iOS & Android Application',
            category: 'mobile',
            status: 'in-progress',
            progress: 65,
            dueDate: '2025-01-30',
            priority: 'high',
            team: [1, 3]
        },
        {
            id: 3,
            name: 'API Integration',
            description: 'Payment Gateway Integration',
            category: 'web',
            status: 'todo',
            progress: 0,
            dueDate: '2024-12-20',
            priority: 'medium',
            team: [2]
        }
    ];
    
    renderProjectsTable(projects);
    renderProjectsGrid(projects);
}

function renderProjectsTable(projects) {
    const tbody = document.querySelector('#listViewContent tbody');
    // Clear existing rows (keep the first sample row)
    while (tbody.rows.length > 1) {
        tbody.deleteRow(1);
    }
    
    projects.forEach(project => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="project-avatar bg-primary text-white rounded-circle me-3" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        ${project.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div class="fw-bold">${project.name}</div>
                        <small class="text-muted">${project.description}</small>
                    </div>
                </div>
            </td>
            <td>
                <div class="avatar-group">
                    ${project.team.map(memberId => 
                        `<img src="../assets/img/user-avatar.jpg" class="rounded-circle" width="30" alt="Team Member">`
                    ).join('')}
                    <span class="avatar-count">+${project.team.length}</span>
                </div>
            </td>
            <td>${getStatusBadge(project.status)}</td>
            <td>
                <div class="progress" style="height: 6px; width: 100px;">
                    <div class="progress-bar ${getProgressColor(project.progress)}" style="width: ${project.progress}%"></div>
                </div>
                <small>${project.progress}%</small>
            </td>
            <td>${formatDate(project.dueDate)}</td>
            <td>${getPriorityBadge(project.priority)}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewProject(${project.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="editProject(${project.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProject(${project.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
    });
}

function renderProjectsGrid(projects) {
    const grid = document.getElementById('gridViewContent');
    grid.innerHTML = '';
    
    projects.forEach(project => {
        const col = document.createElement('div');
        col.className = 'col-xl-4 col-lg-6 mb-4';
        col.innerHTML = `
            <div class="card project-card">
                <div class="card-header bg-primary text-white">
                    <h6 class="mb-0">${project.name}</h6>
                    <small>${project.description}</small>
                </div>
                <div class="card-body">
                    <p class="card-text">${getProjectDescription(project.category)}</p>
                    <div class="mb-3">
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar ${getProgressColor(project.progress)}" style="width: ${project.progress}%"></div>
                        </div>
                        <small class="text-muted">${project.progress}% Complete</small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        ${getStatusBadge(project.status)}
                        <small class="text-muted">Due: ${formatDate(project.dueDate)}</small>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="avatar-group">
                            ${project.team.map(memberId => 
                                `<img src="../assets/img/user-avatar.jpg" class="rounded-circle" width="30" alt="Team">`
                            ).join('')}
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary" onclick="viewProject(${project.id})">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="editProject(${project.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });
}

function getStatusBadge(status) {
    const badges = {
        'completed': 'bg-success',
        'in-progress': 'bg-warning',
        'todo': 'bg-secondary',
        'on-hold': 'bg-danger'
    };
    const texts = {
        'completed': 'Completed',
        'in-progress': 'In Progress',
        'todo': 'To Do',
        'on-hold': 'On Hold'
    };
    return `<span class="badge ${badges[status]}">${texts[status]}</span>`;
}

function getPriorityBadge(priority) {
    const badges = {
        'high': 'bg-danger',
        'medium': 'bg-warning',
        'low': 'bg-info'
    };
    return `<span class="badge ${badges[priority]}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>`;
}

function getProgressColor(progress) {
    if (progress === 100) return 'bg-success';
    if (progress >= 70) return 'bg-info';
    if (progress >= 30) return 'bg-warning';
    return 'bg-danger';
}

function getProjectDescription(category) {
    const descriptions = {
        'web': 'Website development and design project',
        'mobile': 'Mobile application development',
        'design': 'UI/UX design and prototyping',
        'marketing': 'Marketing campaign and strategy'
    };
    return descriptions[category] || 'Project description';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function createProject() {
    const form = document.getElementById('createProjectForm');
    const formData = new FormData(form);
    
    // Simulate project creation
    showToast('Project created successfully!', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('createProjectModal'));
    modal.hide();
    form.reset();
    
    // Reload projects
    setTimeout(() => {
        loadProjects();
    }, 1000);
}

function viewProject(projectId) {
    showToast(`Viewing project ${projectId}`, 'info');
}

function editProject(projectId) {
    showToast(`Editing project ${projectId}`, 'info');
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        showToast('Project deleted successfully!', 'success');
    }
}

function loadKanbanData() {
    // Simulate loading kanban data
    console.log('Loading kanban data...');
}