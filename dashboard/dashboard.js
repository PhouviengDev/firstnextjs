// IT Development Plan Dashboard JavaScript

// Dashboard data configuration
const dashboardData = {
    project: {
        status: "In Progress",
        lastUpdated: new Date().toLocaleDateString(),
        startDate: "2024-01-15",
        phases: [
            { name: "Phase 1: Foundation & Finance", progress: 35, status: "in-progress" },
            { name: "Phase 2: Administration & Integration", progress: 0, status: "pending" },
            { name: "Phase 3: Optimization & Expansion", progress: 0, status: "pending" }
        ]
    },
    
    budget: {
        total: 1800000,
        spent: 216000,
        categories: [
            { name: "Development Team", amount: 1200000, color: "#3498db" },
            { name: "Infrastructure & Licensing", amount: 300000, color: "#27ae60" },
            { name: "External Consultancy", amount: 150000, color: "#f39c12" },
            { name: "Training & Change Management", amount: 100000, color: "#e74c3c" },
            { name: "Contingency", amount: 180000, color: "#9b59b6" }
        ]
    },
    
    roi: {
        investment: 1800000,
        annualSavings: 2700000,
        projectedReturns: [
            { year: "Year 1", investment: -1800000, savings: 1350000, net: -450000 },
            { year: "Year 2", investment: 0, savings: 2700000, net: 2250000 },
            { year: "Year 3", investment: 0, savings: 2700000, net: 4950000 }
        ]
    },
    
    departments: {
        finance: {
            applications: [
                { name: "Invoice Management System", progress: 60 },
                { name: "Income/Outcome Tracking", progress: 45 },
                { name: "Project Investment Tracking", progress: 30 },
                { name: "Mobile Financial App", progress: 25 }
            ]
        },
        administration: {
            applications: [
                { name: "Vehicle Booking System", progress: 0 },
                { name: "Meeting Room Management", progress: 0 },
                { name: "Agenda & Meeting Dashboard", progress: 0 },
                { name: "Mobile Admin App", progress: 0 }
            ]
        }
    }
};

// Chart instances
let budgetChart = null;
let roiChart = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeCharts();
    updateTimestamps();
    setupEventListeners();
    
    // Refresh data every 30 seconds
    setInterval(updateDashboardData, 30000);
});

// Initialize dashboard data
function initializeDashboard() {
    updateProjectStatus();
    updateProgressBars();
    updateBudgetBreakdown();
    updateDepartmentProgress();
}

// Update project status and timestamps
function updateProjectStatus() {
    const statusElement = document.getElementById('project-status');
    const lastUpdatedElement = document.getElementById('last-updated');
    
    if (statusElement) {
        statusElement.textContent = dashboardData.project.status;
    }
    
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = dashboardData.project.lastUpdated;
    }
}

// Update progress bars
function updateProgressBars() {
    const overallProgress = calculateOverallProgress();
    const overallProgressBar = document.querySelector('.progress-card .progress-fill');
    const overallProgressText = document.querySelector('.progress-card .progress-text');
    
    if (overallProgressBar && overallProgressText) {
        overallProgressBar.style.width = `${overallProgress}%`;
        overallProgressText.textContent = `${overallProgress}% Complete`;
    }
    
    // Update phase progress bars
    dashboardData.project.phases.forEach((phase, index) => {
        const phaseCard = document.querySelector(`.phase-${index + 1}`);
        if (phaseCard) {
            const progressBar = phaseCard.querySelector('.progress-fill');
            const progressText = phaseCard.querySelector('.progress-text');
            const phaseStatus = phaseCard.querySelector('.phase-status');
            
            if (progressBar) progressBar.style.width = `${phase.progress}%`;
            if (progressText) {
                if (phase.progress === 0) {
                    progressText.textContent = "Not Started";
                } else {
                    progressText.textContent = `${phase.progress}% Complete`;
                }
            }
            if (phaseStatus) {
                phaseStatus.textContent = phase.status === "in-progress" ? "In Progress" : 
                                         phase.status === "completed" ? "Completed" : "Pending";
            }
        }
    });
}

// Calculate overall project progress
function calculateOverallProgress() {
    const totalProgress = dashboardData.project.phases.reduce((sum, phase) => sum + phase.progress, 0);
    return Math.round(totalProgress / dashboardData.project.phases.length);
}

// Update budget breakdown
function updateBudgetBreakdown() {
    const spentPercentage = (dashboardData.budget.spent / dashboardData.budget.total) * 100;
    const spendBar = document.querySelector('.spend-fill');
    const spendText = document.querySelector('.spend-text');
    
    if (spendBar) {
        spendBar.style.width = `${spentPercentage}%`;
    }
    
    if (spendText) {
        spendText.textContent = `$${formatCurrency(dashboardData.budget.spent)} spent of $${formatCurrency(dashboardData.budget.total)} budget (${Math.round(spentPercentage)}%)`;
    }
}

// Update department progress
function updateDepartmentProgress() {
    // Update Finance department
    const financeApps = document.querySelectorAll('.department-card.finance .app-progress');
    dashboardData.departments.finance.applications.forEach((app, index) => {
        if (financeApps[index]) {
            financeApps[index].textContent = `${app.progress}%`;
        }
    });
    
    // Update Administration department
    const adminApps = document.querySelectorAll('.department-card.admin .app-progress');
    dashboardData.departments.administration.applications.forEach((app, index) => {
        if (adminApps[index]) {
            adminApps[index].textContent = `${app.progress}%`;
        }
    });
}

// Initialize charts
function initializeCharts() {
    initializeBudgetChart();
    initializeROIChart();
}

// Initialize budget pie chart
function initializeBudgetChart() {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;
    
    const config = {
        type: 'doughnut',
        data: {
            labels: dashboardData.budget.categories.map(cat => cat.name),
            datasets: [{
                data: dashboardData.budget.categories.map(cat => cat.amount),
                backgroundColor: dashboardData.budget.categories.map(cat => cat.color),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.parsed / dashboardData.budget.total) * 100).toFixed(1);
                            return `${context.label}: $${formatCurrency(context.parsed)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    };
    
    budgetChart = new Chart(ctx, config);
}

// Initialize ROI line chart
function initializeROIChart() {
    const ctx = document.getElementById('roiChart');
    if (!ctx) return;
    
    const config = {
        type: 'line',
        data: {
            labels: dashboardData.roi.projectedReturns.map(item => item.year),
            datasets: [
                {
                    label: 'Cumulative Net Return',
                    data: dashboardData.roi.projectedReturns.map(item => item.net),
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Annual Savings',
                    data: dashboardData.roi.projectedReturns.map(item => item.savings),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${formatCurrency(Math.abs(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '$' + formatCurrency(Math.abs(value));
                        }
                    }
                }
            }
        }
    };
    
    roiChart = new Chart(ctx, config);
}

// Format currency helper function
function formatCurrency(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K';
    } else {
        return amount.toLocaleString();
    }
}

// Update timestamps
function updateTimestamps() {
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    const footerTimestamp = document.getElementById('footer-timestamp');
    if (footerTimestamp) {
        footerTimestamp.textContent = timestamp;
    }
    
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
        lastUpdated.textContent = now.toLocaleDateString();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add click events for interactive elements
    setupKPICardEvents();
    setupProgressCardEvents();
    setupDepartmentCardEvents();
    setupTimelineEvents();
    setupRiskCardEvents();
}

// KPI card interactions
function setupKPICardEvents() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach(card => {
        card.addEventListener('click', function() {
            showKPIDetails(this);
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
        });
    });
}

// Progress card interactions
function setupProgressCardEvents() {
    const progressCards = document.querySelectorAll('.progress-card');
    progressCards.forEach(card => {
        card.addEventListener('click', function() {
            showProgressDetails(this);
        });
    });
}

// Department card interactions
function setupDepartmentCardEvents() {
    const departmentCards = document.querySelectorAll('.department-card');
    departmentCards.forEach(card => {
        card.addEventListener('click', function() {
            showDepartmentDetails(this);
        });
    });
}

// Timeline interactions
function setupTimelineEvents() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            showTimelineDetails(this);
        });
    });
}

// Risk card interactions
function setupRiskCardEvents() {
    const riskCards = document.querySelectorAll('.risk-card');
    riskCards.forEach(card => {
        card.addEventListener('click', function() {
            showRiskDetails(this);
        });
    });
}

// Show KPI details
function showKPIDetails(card) {
    const title = card.querySelector('h3').textContent;
    const value = card.querySelector('.kpi-value').textContent;
    const subtitle = card.querySelector('.kpi-subtitle').textContent;
    
    showModal(`${title} Details`, `
        <div class="modal-content">
            <h3>${title}</h3>
            <div class="modal-value">${value}</div>
            <div class="modal-subtitle">${subtitle}</div>
            <div class="modal-description">
                ${getKPIDescription(title)}
            </div>
        </div>
    `);
}

// Show progress details
function showProgressDetails(card) {
    const title = card.querySelector('h3').textContent;
    const progress = card.querySelector('.progress-text').textContent;
    
    showModal(`${title} Details`, `
        <div class="modal-content">
            <h3>${title}</h3>
            <div class="modal-progress">${progress}</div>
            <div class="modal-description">
                ${getProgressDescription(title)}
            </div>
        </div>
    `);
}

// Show department details
function showDepartmentDetails(card) {
    const title = card.querySelector('h3').textContent;
    const status = card.querySelector('.department-status').textContent;
    
    showModal(`${title} Details`, `
        <div class="modal-content">
            <h3>${title}</h3>
            <div class="modal-status">Status: ${status}</div>
            <div class="modal-description">
                ${getDepartmentDescription(title)}
            </div>
        </div>
    `);
}

// Show timeline details
function showTimelineDetails(item) {
    const date = item.querySelector('.timeline-date').textContent;
    const title = item.querySelector('h4').textContent;
    const description = item.querySelector('p').textContent;
    
    showModal(`${title} Details`, `
        <div class="modal-content">
            <h3>${title}</h3>
            <div class="modal-date">${date}</div>
            <div class="modal-description">${description}</div>
            <div class="modal-details">
                ${getTimelineDescription(title)}
            </div>
        </div>
    `);
}

// Show risk details
function showRiskDetails(card) {
    const level = card.querySelector('.risk-level').textContent;
    const title = card.querySelector('h4').textContent;
    const description = card.querySelector('p').textContent;
    const status = card.querySelector('.risk-status').textContent;
    
    showModal(`Risk: ${title}`, `
        <div class="modal-content">
            <h3>${title}</h3>
            <div class="modal-risk-level ${level.toLowerCase()}">${level} Risk</div>
            <div class="modal-description">${description}</div>
            <div class="modal-status">Status: ${status}</div>
            <div class="modal-details">
                ${getRiskDescription(title)}
            </div>
        </div>
    `);
}

// Generic modal display function
function showModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.dashboard-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'dashboard-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        <style>
            .dashboard-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }
            .modal-dialog {
                position: relative;
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #ecf0f1;
            }
            .modal-header h3 {
                margin: 0;
                color: #2c3e50;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-close:hover {
                color: #e74c3c;
            }
            .modal-body {
                padding: 20px;
            }
            .modal-value {
                font-size: 2rem;
                font-weight: bold;
                color: #27ae60;
                margin: 10px 0;
            }
            .modal-risk-level {
                padding: 8px 15px;
                border-radius: 20px;
                display: inline-block;
                font-weight: bold;
                margin: 10px 0;
            }
            .modal-risk-level.low {
                background: #27ae60;
                color: white;
            }
            .modal-risk-level.medium {
                background: #f39c12;
                color: white;
            }
            .modal-risk-level.high {
                background: #e74c3c;
                color: white;
            }
        </style>
    `;
    
    // Add styles to head if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'modal-styles';
        styleElement.innerHTML = modalStyles;
        document.head.appendChild(styleElement);
    }
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Setup close events
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) modal.remove();
    });
    
    // Close on escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Description helper functions
function getKPIDescription(title) {
    const descriptions = {
        "Total Investment": "This represents the complete budget allocated for the 24-month IT development project, covering all phases from infrastructure setup to final deployment.",
        "Expected ROI": "Return on Investment calculation based on projected cost savings and efficiency improvements over a 3-year period.",
        "Payback Period": "The time required to recoup the initial investment through operational savings and productivity improvements.",
        "Efficiency Gain": "Expected improvement in operational efficiency across all departments through automation and streamlined processes."
    };
    return descriptions[title] || "Detailed information about this metric.";
}

function getProgressDescription(title) {
    const descriptions = {
        "Overall Progress": "Combined progress across all three phases of the IT development project.",
        "Phase 1: Foundation & Finance": "Infrastructure setup and Finance department applications development including invoice management and tracking systems.",
        "Phase 2: Administration & Integration": "Administration department applications and system integrations including vehicle booking and meeting management.",
        "Phase 3: Optimization & Expansion": "Performance optimization, AI integration, and advanced analytics implementation."
    };
    return descriptions[title] || "Detailed progress information for this phase.";
}

function getDepartmentDescription(title) {
    const descriptions = {
        "Finance Department": "Development of comprehensive financial management applications including invoice processing, budget tracking, and investment monitoring with mobile capabilities.",
        "Administration Department": "Creation of administrative tools for resource management including vehicle booking, meeting room scheduling, and agenda management systems."
    };
    return descriptions[title] || "Detailed information about this department's applications.";
}

function getTimelineDescription(title) {
    const descriptions = {
        "Infrastructure Setup": "Establishing cloud environment on AWS, implementing CI/CD pipelines, setting up monitoring systems, and configuring security protocols.",
        "Finance Application Development": "Building invoice management system, income/outcome tracking dashboard, project investment monitoring, and mobile financial applications.",
        "Testing & Security Audits": "Comprehensive testing including unit tests, integration tests, user acceptance testing, and security penetration testing.",
        "Finance System Go-Live": "Production deployment of Finance applications, user training programs, and go-live support activities.",
        "Administration Phase": "Development of administration applications including vehicle booking, meeting management, and system integrations.",
        "Optimization & AI Integration": "Performance optimization, advanced analytics implementation, and AI-powered features integration."
    };
    return descriptions[title] || "Detailed milestone information.";
}

function getRiskDescription(title) {
    const descriptions = {
        "Security Vulnerabilities": "Potential security risks are mitigated through regular security audits, penetration testing, and implementation of SOC 2 compliance standards.",
        "Integration Complexity": "System integration challenges are addressed through phased implementation approach and comprehensive testing protocols.",
        "User Adoption": "User resistance is managed through comprehensive change management programs, training sessions, and department champion networks.",
        "Budget Overrun": "Budget risks are controlled through agile methodology, regular reviews, and 10% contingency allocation."
    };
    return descriptions[title] || "Detailed risk information and mitigation strategies.";
}

// Simulate real-time data updates
function updateDashboardData() {
    // Simulate progress updates
    const financeProgress = dashboardData.departments.finance.applications;
    financeProgress.forEach(app => {
        if (app.progress < 100 && Math.random() > 0.7) {
            app.progress = Math.min(100, app.progress + Math.floor(Math.random() * 5));
        }
    });
    
    // Update phase progress based on application progress
    const totalFinanceProgress = financeProgress.reduce((sum, app) => sum + app.progress, 0) / financeProgress.length;
    dashboardData.project.phases[0].progress = Math.round(totalFinanceProgress * 0.6); // 60% of total phase
    
    // Update overall progress
    const overallProgress = calculateOverallProgress();
    
    // Update budget spent (simulate incremental spending)
    if (Math.random() > 0.8) {
        dashboardData.budget.spent += Math.floor(Math.random() * 10000);
        dashboardData.budget.spent = Math.min(dashboardData.budget.spent, dashboardData.budget.total);
    }
    
    // Refresh dashboard display
    updateProgressBars();
    updateBudgetBreakdown();
    updateDepartmentProgress();
    updateTimestamps();
}

// Export functions for external use
window.dashboardAPI = {
    updateProgress: updateProgressBars,
    updateBudget: updateBudgetBreakdown,
    refreshCharts: initializeCharts,
    getData: () => dashboardData
};