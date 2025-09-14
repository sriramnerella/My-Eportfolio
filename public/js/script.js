// Portfolio JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    updateCurrentYear();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize theme functionality
    initializeTheme();
    
    // Auto-hide alerts
    autoHideAlerts();
    
    // Initialize project filtering
    initializeProjectFiltering();
});

// Update current year in footer
function updateCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Form validation for contact form
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Initialize character counter
        initializeCharacterCounter();
        
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (validateContactForm()) {
                // Show loading state
                showFormLoading(true);
                
                // Submit form
                this.submit();
            }
            
            contactForm.classList.add('was-validated');
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
                
                // Update character counter for message field
                if (this.id === 'message') {
                    updateCharacterCounter();
                }
            });
            
            // Add real-time validation feedback
            input.addEventListener('keyup', function() {
                if (this.classList.contains('was-validated') || this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
        
        // Add input formatting
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                // Capitalize first letter of each word
                this.value = this.value.replace(/\b\w/g, l => l.toUpperCase());
            });
        }
        
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                // Convert to lowercase
                this.value = this.value.toLowerCase();
            });
        }
    }
}

// Initialize character counter
function initializeCharacterCounter() {
    const messageTextarea = document.getElementById('message');
    const charCountElement = document.getElementById('charCount');
    
    if (messageTextarea && charCountElement) {
        updateCharacterCounter();
    }
}

// Update character counter
function updateCharacterCounter() {
    const messageTextarea = document.getElementById('message');
    const charCountElement = document.getElementById('charCount');
    
    if (messageTextarea && charCountElement) {
        const currentLength = messageTextarea.value.length;
        const maxLength = 2000;
        
        charCountElement.textContent = currentLength;
        
        // Change color based on character count
        const percentage = (currentLength / maxLength) * 100;
        
        if (percentage >= 90) {
            charCountElement.className = 'text-danger fw-bold';
        } else if (percentage >= 75) {
            charCountElement.className = 'text-warning fw-bold';
        } else {
            charCountElement.className = 'text-muted';
        }
        
        // Update form text
        const formText = charCountElement.parentElement;
        if (percentage >= 100) {
            formText.className = 'form-text text-danger';
            formText.innerHTML = `<span id="charCount">${currentLength}</span>/2000 characters - Message too long!`;
        } else {
            formText.className = 'form-text text-muted';
            formText.innerHTML = `<span id="charCount">${currentLength}</span>/2000 characters`;
        }
    }
}

// Validate individual form field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check required fields
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Add appropriate class
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    
    return isValid;
}

// Validate entire contact form
function validateContactForm() {
    const form = document.getElementById('contactForm');
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// Show form loading state
function showFormLoading(loading) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text') || submitButton;
    
    if (loading) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    } else {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
    }
}

// Initialize smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                event.preventDefault();
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations on scroll
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .timeline-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Initialize theme functionality
function initializeTheme() {
    // Add any theme-related functionality here
    // For example, dark mode toggle, theme persistence, etc.
    
    // Example: Add hover effects to cards
    const cards = document.querySelectorAll('.hover-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Auto-hide alerts after 5 seconds
function autoHideAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.classList.remove('show');
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.parentNode.removeChild(alert);
                    }
                }, 150);
            }
        }, 5000);
    });
}

// Utility function to create notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1050; min-width: 300px;';
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 150);
        }
    }, 4000);
}

// Handle skill badge clicks
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('skill-badge')) {
        const skill = event.target.textContent;
        showNotification(`You clicked on ${skill}! This could link to projects using this technology.`, 'info');
    }
});

// Handle project card interactions
document.addEventListener('click', function(event) {
    const projectCard = event.target.closest('.project-card');
    if (projectCard && !event.target.closest('a')) {
        // Add some interactive feedback
        projectCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            projectCard.style.transform = '';
        }, 150);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    // ESC key to close modals or alerts
    if (event.key === 'Escape') {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            const closeButton = alert.querySelector('.btn-close');
            if (closeButton) {
                closeButton.click();
            }
        });
    }
});

// Performance optimization - lazy load images if any
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading
initializeLazyLoading();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Project filtering functionality
function initializeProjectFiltering() {
    const searchInput = document.getElementById('projectSearch');
    const techFilter = document.getElementById('techFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const projectItems = document.querySelectorAll('.project-item');
    const visibleCount = document.getElementById('visibleCount');
    const totalCount = document.getElementById('totalCount');
    
    if (!searchInput || !techFilter || !clearFiltersBtn) return;
    
    // Set total count
    if (totalCount) {
        totalCount.textContent = projectItems.length;
    }
    
    // Filter projects function
    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedTech = techFilter.value.toLowerCase();
        let visibleProjectsCount = 0;
        
        projectItems.forEach(item => {
            const title = item.dataset.title || '';
            const description = item.dataset.description || '';
            const techStack = item.dataset.techstack || '';
            
            // Check search term match
            const searchMatch = !searchTerm || 
                               title.includes(searchTerm) || 
                               description.includes(searchTerm);
            
            // Check tech filter match
            const techMatch = !selectedTech || techStack.includes(selectedTech);
            
            // Show/hide project
            if (searchMatch && techMatch) {
                item.style.display = 'block';
                item.classList.add('animate-in');
                visibleProjectsCount++;
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-in');
            }
        });
        
        // Update visible count
        if (visibleCount) {
            visibleCount.textContent = visibleProjectsCount;
        }
        
        // Show "no results" message if needed
        showNoResultsMessage(visibleProjectsCount === 0);
    }
    
    // Show/hide no results message
    function showNoResultsMessage(show) {
        let noResultsDiv = document.getElementById('noResultsMessage');
        
        if (show && !noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'noResultsMessage';
            noResultsDiv.className = 'col-12 text-center py-5';
            noResultsDiv.innerHTML = `
                <div class="text-muted">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <h5>No projects found</h5>
                    <p>Try adjusting your search criteria or clear the filters.</p>
                    <button type="button" class="btn btn-outline-primary" onclick="clearProjectFilters()">
                        <i class="fas fa-redo me-2"></i>Clear Filters
                    </button>
                </div>
            `;
            
            const projectsContainer = document.getElementById('projectsContainer');
            if (projectsContainer) {
                projectsContainer.appendChild(noResultsDiv);
            }
        } else if (!show && noResultsDiv) {
            noResultsDiv.remove();
        }
    }
    
    // Clear filters function
    function clearFilters() {
        searchInput.value = '';
        techFilter.value = '';
        filterProjects();
        
        // Show success notification
        showNotification('Filters cleared successfully!', 'success');
    }
    
    // Make clear filters function globally accessible
    window.clearProjectFilters = clearFilters;
    
    // Event listeners
    searchInput.addEventListener('input', debounce(filterProjects, 300));
    techFilter.addEventListener('change', filterProjects);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + K to focus search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            searchInput.focus();
        }
        
        // Escape to clear search
        if (event.key === 'Escape' && document.activeElement === searchInput) {
            clearFilters();
        }
    });
    
    // Add search hints
    searchInput.setAttribute('title', 'Use Ctrl/Cmd + K to quickly focus search');
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add filtering animation styles
const filteringStyle = document.createElement('style');
filteringStyle.textContent = `
    .project-item {
        transition: all 0.3s ease;
    }
    
    .project-item.animate-in {
        animation: fadeInScale 0.5s ease forwards;
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .project-item:hover {
        transform: translateY(-5px);
    }
    
    #projectSearch:focus,
    #techFilter:focus {
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        border-color: #007bff;
    }
`;
document.head.appendChild(filteringStyle);

