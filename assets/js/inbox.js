// Inbox functionality
let emails = [];
let selectedEmailId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadEmails();
});

function loadEmails() {
    // Sample email data
    emails = [
        {
            id: 1,
            from: 'Sarah Johnson',
            email: 'sarah@company.com',
            subject: 'Project Update Meeting',
            preview: 'Hi team, let\'s schedule a meeting to discuss the latest project updates...',
            date: '2024-12-15 14:30',
            unread: true,
            important: true,
            labels: ['work']
        },
        {
            id: 2,
            from: 'Mike Smith',
            email: 'mike@client.com',
            subject: 'Contract Review',
            preview: 'I\'ve reviewed the contract and have a few questions about section 3.2...',
            date: '2024-12-14 11:15',
            unread: true,
            important: false,
            labels: ['work', 'important']
        },
        {
            id: 3,
            from: 'Newsletter',
            email: 'news@technews.com',
            subject: 'Weekly Tech Digest',
            preview: 'This week in tech: New framework releases, security updates, and more...',
            date: '2024-12-14 09:00',
            unread: false,
            important: false,
            labels: []
        },
        {
            id: 4,
            from: 'David Wilson',
            email: 'david@partner.org',
            subject: 'Collaboration Opportunity',
            preview: 'I wanted to discuss a potential collaboration between our teams...',
            date: '2024-12-13 16:45',
            unread: false,
            important: true,
            labels: ['work']
        },
        {
            id: 5,
            from: 'System Alert',
            email: 'alerts@system.com',
            subject: 'Security Update Required',
            preview: 'Your system requires an important security update. Please install...',
            date: '2024-12-13 14:20',
            unread: true,
            important: true,
            labels: ['important']
        }
    ];

    renderEmailList();
}

function renderEmailList() {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';

    emails.forEach(email => {
        const emailElement = document.createElement('div');
        emailElement.className = `email-item ${email.unread ? 'unread' : ''} ${selectedEmailId === email.id ? 'selected' : ''}`;
        emailElement.addEventListener('click', () => selectEmail(email.id));

        const fromInitials = email.from.split(' ').map(n => n[0]).join('').toUpperCase();
        
        emailElement.innerHTML = `
            <div class="d-flex align-items-start">
                <div class="email-avatar me-3">${fromInitials}</div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <h6 class="mb-1">${email.from}</h6>
                        <small class="text-muted">${formatEmailDate(email.date)}</small>
                    </div>
                    <h6 class="mb-1">${email.subject}</h6>
                    <p class="text-muted mb-0 small">${email.preview}</p>
                    <div class="mt-1">
                        ${email.important ? '<span class="badge bg-warning me-1">Important</span>' : ''}
                        ${email.labels.map(label => `<span class="badge bg-secondary me-1">${label}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        emailList.appendChild(emailElement);
    });
}

function selectEmail(emailId) {
    selectedEmailId = emailId;
    const email = emails.find(e => e.id === emailId);
    
    if (email) {
        // Mark as read
        email.unread = false;
        
        // Update UI
        renderEmailList();
        showEmailContent(email);
    }
}

function showEmailContent(email) {
    document.getElementById('emptyEmailView').classList.add('d-none');
    document.getElementById('emailContentView').classList.remove('d-none');
    
    const contentView = document.getElementById('emailContentView');
    contentView.innerHTML = `
        <div class="email-header border-bottom pb-3 mb-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h4>${email.subject}</h4>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" onclick="replyToEmail(${email.id})">
                        <i class="bi bi-reply"></i> Reply
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="forwardEmail(${email.id})">
                        <i class="bi bi-forward"></i> Forward
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEmail(${email.id})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${email.from}</strong>
                    <span class="text-muted">&lt;${email.email}&gt;</span>
                </div>
                <div class="text-muted">
                    ${formatEmailDate(email.date)}
                </div>
            </div>
            <div class="mt-2">
                <span class="badge bg-light text-dark">To: me</span>
            </div>
        </div>
        
        <div class="email-body">
            <p>Hello,</p>
            <p>${email.preview}</p>
            <p>${getEmailBody(email.id)}</p>
            <p>Best regards,<br>${email.from}</p>
        </div>
        
        <div class="email-footer mt-4 pt-3 border-top">
            <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" onclick="replyToEmail(${email.id})">
                    <i class="bi bi-reply"></i> Reply
                </button>
                <button class="btn btn-sm btn-outline-primary" onclick="forwardEmail(${email.id})">
                    <i class="bi bi-forward"></i> Forward
                </button>
                <button class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-printer"></i> Print
                </button>
            </div>
        </div>
    `;
}

function getEmailBody(emailId) {
    const bodies = {
        1: 'We need to discuss the Q4 project milestones and resource allocation. The development team has made significant progress, but we need to address some challenges with the integration timeline. Please review the attached documents and let me know your availability for a meeting next week.',
        2: 'Specifically, I\'m concerned about the delivery timelines mentioned in clause 3.2. Could we schedule a call to discuss potential adjustments? I\'ve attached the marked-up contract for your review.',
        3: 'In this week\'s digest: React 18.3 released with new features, major security vulnerability discovered in popular npm package, and AI development tools you should check out. Read the full articles on our website.',
        4: 'Our team has been following your work and we\'re impressed with your recent project outcomes. We believe there\'s a great opportunity for collaboration that could benefit both organizations.',
        5: 'This update addresses critical security vulnerabilities that could potentially compromise user data. The update will be automatically deployed during the maintenance window tonight at 2:00 AM.'
    };
    return bodies[emailId] || 'Email content not available.';
}

function formatEmailDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return `${diffMins}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays < 7) {
        return `${diffDays}d ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function sendEmail() {
    const form = document.getElementById('composeForm');
    const to = document.getElementById('to').value;
    const subject = document.getElementById('subject').value;
    
    // Simulate sending email
    showToast(`Email sent to ${to}`, 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('composeModal'));
    modal.hide();
    form.reset();
}

function replyToEmail(emailId) {
    const email = emails.find(e => e.id === emailId);
    if (email) {
        document.getElementById('to').value = email.email;
        document.getElementById('subject').value = `Re: ${email.subject}`;
        document.getElementById('message').value = `\n\n--- Original Message ---\nFrom: ${email.from}\nSubject: ${email.subject}\n\n`;
        
        const modal = new bootstrap.Modal(document.getElementById('composeModal'));
        modal.show();
        
        document.getElementById('message').focus();
    }
}

function forwardEmail(emailId) {
    const email = emails.find(e => e.id === emailId);
    if (email) {
        document.getElementById('to').value = '';
        document.getElementById('subject').value = `Fwd: ${email.subject}`;
        document.getElementById('message').value = `\n\n--- Forwarded message ---\nFrom: ${email.from}\nSubject: ${email.subject}\nDate: ${email.date}\n\n`;
        
        const modal = new bootstrap.Modal(document.getElementById('composeModal'));
        modal.show();
    }
}

function deleteEmail(emailId) {
    if (confirm('Are you sure you want to delete this email?')) {
        emails = emails.filter(e => e.id !== emailId);
        selectedEmailId = null;
        
        renderEmailList();
        document.getElementById('emptyEmailView').classList.remove('d-none');
        document.getElementById('emailContentView').classList.add('d-none');
        
        showToast('Email moved to trash', 'success');
    }
}