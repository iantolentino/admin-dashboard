// File Manager functionality
let currentPath = '/';
let selectedFiles = new Set();
let files = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeFileManager();
    loadFiles();
});

function initializeFileManager() {
    // View toggle
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', function() {
            switchView(this.getAttribute('data-view'));
        });
    });

    // Search functionality
    document.getElementById('fileSearch').addEventListener('input', filterFiles);
    document.getElementById('fileSort').addEventListener('change', sortFiles);

    // File selection
    document.getElementById('deleteSelected').addEventListener('click', deleteSelectedFiles);

    // Upload handling
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', handleFileUpload);

    // Drag and drop
    const uploadArea = document.querySelector('.upload-area');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleFileDrop);
}

function switchView(view) {
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });

    document.getElementById('filesGridView').classList.toggle('d-none', view !== 'grid');
    document.getElementById('filesListView').classList.toggle('d-none', view !== 'list');

    renderFiles();
}

function loadFiles() {
    // Sample files data
    files = [
        {
            id: 1,
            name: 'Project Proposal.pdf',
            type: 'pdf',
            size: 2457600,
            modified: new Date('2024-12-01'),
            path: '/'
        },
        {
            id: 2,
            name: 'Company Logo.png',
            type: 'image',
            size: 102400,
            modified: new Date('2024-12-02'),
            path: '/'
        },
        {
            id: 3,
            name: 'Meeting Notes.docx',
            type: 'document',
            size: 51200,
            modified: new Date('2024-12-03'),
            path: '/'
        },
        {
            id: 4,
            name: 'Project Assets',
            type: 'folder',
            size: 0,
            modified: new Date('2024-11-28'),
            path: '/'
        },
        {
            id: 5,
            name: 'Presentation.pptx',
            type: 'document',
            size: 1536000,
            modified: new Date('2024-12-04'),
            path: '/'
        }
    ];

    updateStorageStats();
    renderFiles();
}

function renderFiles() {
    const currentFiles = files.filter(file => file.path === currentPath);
    
    if (currentFiles.length === 0) {
        document.getElementById('emptyState').classList.remove('d-none');
        document.getElementById('filesGridView').classList.add('d-none');
        document.getElementById('filesListView').classList.add('d-none');
        return;
    }

    document.getElementById('emptyState').classList.add('d-none');
    renderGridView(currentFiles);
    renderListView(currentFiles);
}

function renderGridView(files) {
    const grid = document.getElementById('filesGridView');
    grid.innerHTML = '';

    files.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = `file-item ${selectedFiles.has(file.id) ? 'selected' : ''}`;
        fileElement.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                toggleFileSelection(file.id);
            } else {
                selectFile(file.id);
            }
        });
        fileElement.addEventListener('dblclick', () => openFile(file));

        fileElement.innerHTML = `
            <div class="text-center">
                <div class="file-icon ${file.type}">
                    ${getFileIcon(file.type)}
                </div>
                <div class="file-name">
                    <strong>${file.name}</strong>
                </div>
                <div class="file-info text-muted">
                    <small>${formatFileSize(file.size)}</small><br>
                    <small>${formatDate(file.modified)}</small>
                </div>
            </div>
        `;

        grid.appendChild(fileElement);
    });
}

function renderListView(files) {
    const list = document.getElementById('filesListView');
    list.innerHTML = '';

    files.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = `file-item ${selectedFiles.has(file.id) ? 'selected' : ''}`;
        fileElement.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                toggleFileSelection(file.id);
            } else {
                selectFile(file.id);
            }
        });
        fileElement.addEventListener('dblclick', () => openFile(file));

        fileElement.innerHTML = `
            <div class="d-flex align-items-center w-100">
                <div class="file-icon ${file.type} me-3">
                    ${getFileIcon(file.type)}
                </div>
                <div class="flex-grow-1">
                    <div class="fw-bold">${file.name}</div>
                    <small class="text-muted">${formatDate(file.modified)}</small>
                </div>
                <div class="text-end">
                    <div>${formatFileSize(file.size)}</div>
                    <small class="text-muted">${getFileTypeText(file.type)}</small>
                </div>
            </div>
        `;

        list.appendChild(fileElement);
    });
}

function getFileIcon(type) {
    const icons = {
        'folder': '<i class="bi bi-folder-fill"></i>',
        'pdf': '<i class="bi bi-file-earmark-pdf"></i>',
        'image': '<i class="bi bi-file-image"></i>',
        'document': '<i class="bi bi-file-earmark-text"></i>',
        'video': '<i class="bi bi-file-play"></i>',
        'audio': '<i class="bi bi-file-music"></i>'
    };
    return icons[type] || '<i class="bi bi-file"></i>';
}

function getFileTypeText(type) {
    const types = {
        'folder': 'Folder',
        'pdf': 'PDF Document',
        'image': 'Image',
        'document': 'Document',
        'video': 'Video',
        'audio': 'Audio'
    };
    return types[type] || 'File';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function toggleFileSelection(fileId) {
    if (selectedFiles.has(fileId)) {
        selectedFiles.delete(fileId);
    } else {
        selectedFiles.add(fileId);
    }
    renderFiles();
}

function selectFile(fileId) {
    selectedFiles.clear();
    selectedFiles.add(fileId);
    renderFiles();
}

function openFile(file) {
    if (file.type === 'folder') {
        navigateToFolder(file.name);
    } else {
        showToast(`Opening file: ${file.name}`, 'info');
    }
}

function navigateToFolder(folderName) {
    currentPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`;
    updateBreadcrumb();
    renderFiles();
}

function updateBreadcrumb() {
    const breadcrumb = document.getElementById('fileBreadcrumb');
    const paths = currentPath.split('/').filter(p => p);
    
    breadcrumb.innerHTML = '<li class="breadcrumb-item"><a href="#" data-path="/">Home</a></li>';
    
    let currentPath = '';
    paths.forEach((path, index) => {
        currentPath += `/${path}`;
        const isActive = index === paths.length - 1;
        breadcrumb.innerHTML += `
            <li class="breadcrumb-item ${isActive ? 'active' : ''}">
                ${isActive ? path : `<a href="#" data-path="${currentPath}">${path}</a>`}
            </li>
        `;
    });

    // Add click handlers to breadcrumb links
    breadcrumb.querySelectorAll('a[data-path]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentPath = link.getAttribute('data-path');
            updateBreadcrumb();
            renderFiles();
        });
    });
}

function filterFiles() {
    const searchTerm = document.getElementById('fileSearch').value.toLowerCase();
    // Implementation would filter files based on search term
    console.log('Filtering files:', searchTerm);
}

function sortFiles() {
    const sortBy = document.getElementById('fileSort').value;
    // Implementation would sort files based on selected criteria
    console.log('Sorting files by:', sortBy);
}

function handleFileUpload(e) {
    const files = e.target.files;
    simulateUpload(files);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('bg-light');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-light');
    const files = e.dataTransfer.files;
    simulateUpload(files);
}

function simulateUpload(files) {
    const progressBar = document.querySelector('.upload-progress .progress-bar');
    const progressContainer = document.querySelector('.upload-progress');
    
    progressContainer.classList.remove('d-none');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            showToast('Files uploaded successfully!', 'success');
            progressContainer.classList.add('d-none');
            progressBar.style.width = '0%';
            
            // Add uploaded files to the list
            Array.from(files).forEach(file => {
                const newFile = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    type: getFileTypeFromName(file.name),
                    size: file.size,
                    modified: new Date(),
                    path: currentPath
                };
                files.push(newFile);
            });
            
            renderFiles();
            updateStorageStats();
        }
    }, 200);
}

function getFileTypeFromName(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
        'pdf': 'pdf',
        'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image',
        'doc': 'document', 'docx': 'document', 'txt': 'document',
        'mp4': 'video', 'avi': 'video', 'mov': 'video',
        'mp3': 'audio', 'wav': 'audio'
    };
    return types[ext] || 'document';
}

function createFolder() {
    const folderName = document.getElementById('folderName').value.trim();
    if (!folderName) return;

    const newFolder = {
        id: Date.now(),
        name: folderName,
        type: 'folder',
        size: 0,
        modified: new Date(),
        path: currentPath
    };

    files.push(newFolder);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('createFolderModal'));
    modal.hide();
    document.getElementById('createFolderForm').reset();
    
    showToast('Folder created successfully!', 'success');
    renderFiles();
    updateStorageStats();
}

function deleteSelectedFiles() {
    if (selectedFiles.size === 0) {
        showToast('Please select files to delete', 'warning');
        return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)) {
        return;
    }

    files = files.filter(file => !selectedFiles.has(file.id));
    selectedFiles.clear();
    
    showToast('Files deleted successfully!', 'success');
    renderFiles();
    updateStorageStats();
}

function updateStorageStats() {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const totalFiles = files.filter(file => file.type !== 'folder').length;
    const totalFolders = files.filter(file => file.type === 'folder').length;

    document.getElementById('usedStorage').textContent = formatFileSize(totalSize);
    document.getElementById('totalFiles').textContent = totalFiles;
    document.getElementById('totalFolders').textContent = totalFolders;

    // Update progress bar (assuming 10GB total storage)
    const usedPercentage = (totalSize / (10 * 1024 * 1024 * 1024)) * 100;
    document.querySelector('.storage-progress .progress-bar').style.width = `${Math.min(usedPercentage, 100)}%`;
}