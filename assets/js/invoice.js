// Invoice functionality
let currentInvoice = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeInvoice();
    loadInvoiceData();
});

function initializeInvoice() {
    // Set current date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').textContent = formatDate(today);
    
    // Set due date to 30 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('dueDate').textContent = formatDate(dueDate.toISOString().split('T')[0]);
}

function loadInvoiceData() {
    // Sample invoice data
    currentInvoice = {
        id: 'INV-2024-001',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'paid',
        client: {
            name: 'Client Company Inc.',
            address: '456 Client Avenue\nClient City, CL 54321',
            email: 'billing@clientcompany.com'
        },
        items: [
            {
                description: 'Website Design & Development',
                details: 'Custom responsive website with admin panel',
                quantity: 1,
                unitPrice: 1500.00,
                amount: 1500.00
            },
            {
                description: 'SEO Optimization',
                details: 'On-page SEO and technical optimization',
                quantity: 1,
                unitPrice: 500.00,
                amount: 500.00
            },
            {
                description: 'Content Management System',
                details: 'Custom CMS integration',
                quantity: 1,
                unitPrice: 500.00,
                amount: 500.00
            }
        ],
        subtotal: 2500.00,
        taxRate: 0.10,
        taxAmount: 250.00,
        discount: 0.00,
        total: 2750.00
    };

    renderInvoice();
}

function renderInvoice() {
    // Update header information
    document.getElementById('invoiceDate').textContent = formatDate(currentInvoice.date);
    document.getElementById('dueDate').textContent = formatDate(currentInvoice.dueDate);
    
    // Update client information
    document.getElementById('clientName').textContent = currentInvoice.client.name;
    document.getElementById('clientAddress').innerHTML = currentInvoice.client.address.replace(/\n/g, '<br>');
    document.getElementById('clientEmail').textContent = currentInvoice.client.email;
    
    // Update status and amounts
    document.getElementById('invoiceStatus').textContent = currentInvoice.status.charAt(0).toUpperCase() + currentInvoice.status.slice(1);
    document.getElementById('invoiceStatus').className = `badge bg-${getStatusColor(currentInvoice.status)}`;
    document.getElementById('totalAmount').textContent = formatCurrency(currentInvoice.total);
    
    // Render invoice items
    renderInvoiceItems();
    
    // Update totals
    updateTotals();
}

function renderInvoiceItems() {
    const tbody = document.getElementById('invoiceItems');
    tbody.innerHTML = '';

    currentInvoice.items.forEach((item, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <strong>${item.description}</strong><br>
                <small class="text-muted">${item.details}</small>
            </td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.unitPrice)}</td>
            <td>${formatCurrency(item.amount)}</td>
        `;
    });
}

function updateTotals() {
    document.getElementById('subtotal').textContent = formatCurrency(currentInvoice.subtotal);
    document.getElementById('taxAmount').textContent = formatCurrency(currentInvoice.taxAmount);
    document.getElementById('discount').textContent = formatCurrency(currentInvoice.discount);
    document.getElementById('grandTotal').textContent = formatCurrency(currentInvoice.total);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getStatusColor(status) {
    const colors = {
        'paid': 'success',
        'pending': 'warning',
        'overdue': 'danger',
        'draft': 'secondary'
    };
    return colors[status] || 'secondary';
}

function downloadPDF() {
    showToast('Generating PDF download...', 'info');
    // In a real application, this would generate and download a PDF
    setTimeout(() => {
        showToast('PDF downloaded successfully!', 'success');
    }, 2000);
}

function sendInvoice() {
    const email = currentInvoice.client.email;
    if (confirm(`Send invoice to ${email}?`)) {
        showToast('Sending invoice...', 'info');
        // Simulate sending
        setTimeout(() => {
            showToast('Invoice sent successfully!', 'success');
        }, 1500);
    }
}

function markAsPaid() {
    currentInvoice.status = 'paid';
    renderInvoice();
    showToast('Invoice marked as paid', 'success');
}

function markAsPending() {
    currentInvoice.status = 'pending';
    renderInvoice();
    showToast('Invoice marked as pending', 'warning');
}

function saveInvoice() {
    // Get form values and update currentInvoice
    const form = document.getElementById('editInvoiceForm');
    currentInvoice.id = document.getElementById('editInvoiceNumber').value;
    currentInvoice.date = document.getElementById('editInvoiceDate').value;
    currentInvoice.dueDate = document.getElementById('editDueDate').value;
    currentInvoice.status = document.getElementById('editInvoiceStatus').value;
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editInvoiceModal'));
    modal.hide();
    
    renderInvoice();
    showToast('Invoice updated successfully!', 'success');
}

function addInvoiceItem() {
    const newItem = {
        description: 'New Service',
        details: 'Service description',
        quantity: 1,
        unitPrice: 0.00,
        amount: 0.00
    };
    
    currentInvoice.items.push(newItem);
    recalculateTotals();
    renderInvoice();
}

function recalculateTotals() {
    currentInvoice.subtotal = currentInvoice.items.reduce((sum, item) => sum + item.amount, 0);
    currentInvoice.taxAmount = currentInvoice.subtotal * currentInvoice.taxRate;
    currentInvoice.total = currentInvoice.subtotal + currentInvoice.taxAmount - currentInvoice.discount;
}

// Print functionality
function printInvoice() {
    window.print();
}

// Enhanced toast function for all pages
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    container.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}