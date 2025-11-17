/**
 * WebDev NexServ - Consultation Form JavaScript
 * Multi-step consultation form with validation and progress tracking
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeConsultationForm();
});

/**
 * Initialize consultation form functionality
 */
function initializeConsultationForm() {
    console.log('Consultation form initialized');

    const consultationForm = getElement('#consultation-form');
    if (!consultationForm) return;

    // Initialize form steps
    initializeFormSteps(consultationForm);

    // Initialize form validation
    initializeFormValidation(consultationForm);

    // Initialize file upload
    initializeFileUpload(consultationForm);

    // Initialize progress tracking
    initializeProgressTracking(consultationForm);

    // Initialize form submission
    initializeFormSubmission(consultationForm);

    // Handle pre-filled data from URL parameters
    handlePreFilledData(consultationForm);
}

/**
 * Initialize form steps navigation
 */
function initializeFormSteps(form) {
    const steps = getElements('.form-step', form);
    const nextButtons = getElements('.next-step', form);
    const prevButtons = getElements('.prev-step', form);

    let currentStep = 0;

    // Show first step
    showStep(0);

    // Next step buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateCurrentStep()) {
                nextStep();
            }
        });
    });

    // Previous step buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            prevStep();
        });
    });

    // Keyboard navigation
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            if (validateCurrentStep()) {
                nextStep();
            }
        }
    });

    /**
     * Show specific step
     */
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });

        currentStep = stepIndex;
        updateProgressBar(stepIndex);
        updateButtonStates();
        focusFirstInput(stepIndex);

        // Track step view for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'consultation_form_step_view', {
                event_category: 'consultation',
                event_label: `step_${stepIndex + 1}`
            });
        }
    }

    /**
     * Go to next step
     */
    function nextStep() {
        if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
        }
    }

    /**
     * Go to previous step
     */
    function prevStep() {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    }

    /**
     * Validate current step
     */
    function validateCurrentStep() {
        const currentStepElement = steps[currentStep];
        const requiredFields = getElements('[required]', currentStepElement);
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Custom step validations
        if (currentStep === 0) {
            // Validate service interest
            const serviceInterest = getElement('#service-interest', currentStepElement);
            if (serviceInterest && serviceInterest.value) {
                showRelevantFields(serviceInterest.value, currentStepElement);
            }
        } else if (currentStep === 1) {
            // Validate project description length
            const projectDescription = getElement('#project-description', currentStepElement);
            if (projectDescription && projectDescription.value.length < 50) {
                showFieldError(projectDescription, 'Please provide at least 50 characters for the project description');
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Show relevant fields based on service selection
     */
    function showRelevantFields(serviceValue, stepElement) {
        const projectTypeGroup = getElement('#project-type-group');
        if (!projectTypeGroup) {
            // Create project type group if it doesn't exist
            const projectTypeField = getElement('#project-type');
            if (projectTypeField) {
                projectTypeGroup = projectTypeField.closest('.form-group');
                projectTypeGroup.id = 'project-type-group';
            }
        }

        if (projectTypeGroup) {
            // Show/hide project type based on service selection
            const shouldShowProjectType = ['web-design', 'ecommerce', 'multiple'].includes(serviceValue);
            projectTypeGroup.style.display = shouldShowProjectType ? 'block' : 'none';
            projectTypeGroup.querySelector('select').required = shouldShowProjectType;
        }
    }

    /**
     * Update progress bar
     */
    function updateProgressBar(stepIndex) {
        const progressFill = getElement('.progress-fill', form);
        const totalSteps = steps.length;
        const progress = ((stepIndex + 1) / totalSteps) * 100;

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        // Update step indicators
        const stepIndicators = getElements('.step-indicator', form);
        stepIndicators.forEach(indicator => {
            const currentSpan = indicator.querySelector('.current-step');
            const totalSpan = indicator.querySelector('.total-steps');
            if (currentSpan) currentSpan.textContent = stepIndex + 1;
            if (totalSpan) totalSpan.textContent = totalSteps;
        });
    }

    /**
     * Update button states
     */
    function updateButtonStates() {
        const prevButtons = getElements('.prev-step', form);
        const nextButtons = getElements('.next-step', form);
        const submitButton = getElement('button[type="submit"]', form);

        // Show/hide previous button
        prevButtons.forEach(button => {
            button.style.display = currentStep === 0 ? 'none' : 'block';
        });

        // Show/hide next button and submit button
        nextButtons.forEach(button => {
            button.style.display = currentStep === steps.length - 1 ? 'none' : 'block';
        });

        if (submitButton) {
            submitButton.style.display = currentStep === steps.length - 1 ? 'block' : 'none';
        }
    }

    /**
     * Focus first input in step
     */
    function focusFirstInput(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const firstInput = getElement('input, select, textarea', currentStepElement);
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }
}

/**
 * Initialize enhanced form validation
 */
function initializeFormValidation(form) {
    // Real-time validation for service interest
    const serviceInterest = getElement('#service-interest', form);
    if (serviceInterest) {
        serviceInterest.addEventListener('change', function() {
            // Clear project type if service changes
            const projectType = getElement('#project-type', form);
            if (projectType) {
                projectType.value = '';
            }

            // Update project description placeholder
            const projectDescription = getElement('#project-description', form);
            if (projectDescription) {
                updateProjectDescriptionPlaceholder(this.value, projectDescription);
            }

            // Validate field
            validateField(this);
        });
    }

    // Real-time validation for budget range
    const budgetRange = getElement('#budget-range', form);
    if (budgetRange) {
        budgetRange.addEventListener('change', function() {
            validateField(this);
            showBudgetInfo(this.value);
        });
    }

    // Real-time validation for timeline
    const timeline = getElement('#timeline', form);
    if (timeline) {
        timeline.addEventListener('change', function() {
            validateField(this);
            showTimelineInfo(this.value);
        });
    }

    // Character counter for project description
    const projectDescription = getElement('#project-description', form);
    if (projectDescription) {
        const counter = createCharacterCounter(projectDescription, 500, 'minimum 50 characters');
        projectDescription.parentNode.appendChild(counter);
    }

    // Character counter for target audience
    const targetAudience = getElement('#target-audience', form);
    if (targetAudience) {
        const counter = createCharacterCounter(targetAudience, 300);
        targetAudience.parentNode.appendChild(counter);
    }

    // File upload validation
    const fileUpload = getElement('#project-brief', form);
    if (fileUpload) {
        fileUpload.addEventListener('change', function() {
            validateFileUpload(this);
        });
    }
}

/**
 * Update project description placeholder based on service
 */
function updateProjectDescriptionPlaceholder(service, textarea) {
    const placeholders = {
        'web-design': 'Describe the website you want to build, key features, design preferences, and main goals...',
        'brand-identity': 'Tell us about your brand vision, target audience, competitors, and what makes you unique...',
        'digital-strategy': 'Explain your business goals, current challenges, target market, and what success looks like...',
        'ecommerce': 'Describe your products, target customers, desired features, and any specific platform preferences...',
        'multiple': 'Tell us about all the services you need and how they should work together...',
        'not-sure': 'Describe your business goals and challenges, and we\'ll help identify the best solutions...'
    };

    const placeholder = placeholders[service] || placeholders['not-sure'];
    textarea.placeholder = placeholder;
}

/**
 * Show budget information
 */
function showBudgetInfo(budget) {
    const budgetInfo = {
        '5k-10k': 'Suitable for simple websites and basic brand identity packages.',
        '10k-25k': 'Ideal for professional websites with custom features and comprehensive branding.',
        '25k-50k': 'Perfect for complex web applications, e-commerce platforms, and complete brand systems.',
        '50k-100k': 'Great for enterprise-level solutions and multi-faceted digital projects.',
        '100k+': 'Designed for large-scale digital transformations and custom platform development.',
        'discuss': 'We\'re flexible and can work with various budget ranges. Let\'s discuss what\'s possible.'
    };

    // Create or update budget info display
    let budgetInfoElement = getElement('#budget-info');
    if (!budgetInfoElement) {
        budgetInfoElement = document.createElement('div');
        budgetInfoElement.id = 'budget-info';
        budgetInfoElement.className = 'info-box';
        budgetRange.parentNode.parentNode.appendChild(budgetInfoElement);
    }

    budgetInfoElement.textContent = budgetInfo[budget] || '';
    budgetInfoElement.style.display = budget ? 'block' : 'none';
}

/**
 * Show timeline information
 */
function showTimelineInfo(timeline) {
    const timelineInfo = {
        'asap': 'We\'ll prioritize your project and start as soon as possible (2-4 week kickoff).',
        '1-2-months': 'Standard timeline for most projects with proper planning and execution.',
        '3-6-months': 'Ideal for complex projects requiring extensive research and development.',
        '6-months+': 'Suitable for enterprise projects with multiple phases and iterations.',
        'flexible': 'We can work around your schedule and prioritize based on your needs.'
    };

    // Create or update timeline info display
    let timelineInfoElement = getElement('#timeline-info');
    if (!timelineInfoElement) {
        timelineInfoElement = document.createElement('div');
        timelineInfoElement.id = 'timeline-info';
        timelineInfoElement.className = 'info-box';
        timeline.parentNode.parentNode.appendChild(timelineInfoElement);
    }

    timelineInfoElement.textContent = timelineInfo[timeline] || '';
    timelineInfoElement.style.display = timeline ? 'block' : 'none';
}

/**
 * Create character counter
 */
function createCharacterCounter(textarea, maxLength, hint) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.innerHTML = `
        <span class="counter-hint">${hint ? `${hint} • ` : ''}</span>
        <span class="counter-count">0</span>${maxLength ? ` / ${maxLength}` : ' characters'}
    `;

    const updateCounter = () => {
        const length = textarea.value.length;
        const countSpan = counter.querySelector('.counter-count');
        countSpan.textContent = length;

        if (maxLength) {
            if (length > maxLength) {
                counter.classList.add('over-limit');
            } else {
                counter.classList.remove('over-limit');
            }
        }
    };

    textarea.addEventListener('input', updateCounter);
    updateCounter();

    return counter;
}

/**
 * Initialize file upload functionality
 */
function initializeFileUpload(form) {
    const fileInput = getElement('#project-brief', form);
    const fileLabel = getElement('.file-upload-label', form);

    if (!fileInput || !fileLabel) return;

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const uploadText = fileLabel.querySelector('.upload-text');
        const uploadSubtext = fileLabel.querySelector('.upload-subtext');

        if (file) {
            uploadText.textContent = file.name;
            uploadSubtext.textContent = `Size: ${formatFileSize(file.size)}`;
            fileLabel.classList.add('has-file');
        } else {
            uploadText.textContent = 'Choose file or drag and drop';
            uploadSubtext.textContent = 'PDF, DOC, DOCX (MAX. 10MB)';
            fileLabel.classList.remove('has-file');
        }
    });

    // Drag and drop functionality
    fileLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileLabel.classList.add('drag-over');
    });

    fileLabel.addEventListener('dragleave', () => {
        fileLabel.classList.remove('drag-over');
    });

    fileLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileLabel.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    });
}

/**
 * Validate file upload
 */
function validateFileUpload(input) {
    const file = input.files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (file) {
        if (file.size > maxSize) {
            showFieldError(input, 'File size must be less than 10MB');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            showFieldError(input, 'Only PDF, DOC, and DOCX files are allowed');
            return false;
        }
    }

    clearFieldError(input);
    return true;
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Initialize progress tracking
 */
function initializeProgressTracking(form) {
    // Track form abandonment
    let lastActivityTime = Date.now();

    const trackActivity = () => {
        lastActivityTime = Date.now();
    };

    // Track user interactions
    form.addEventListener('input', trackActivity);
    form.addEventListener('change', trackActivity);
    form.addEventListener('click', trackActivity);

    // Check for abandonment
    window.addEventListener('beforeunload', (e) => {
        const formData = new FormData(form);
        const hasData = Array.from(formData.values()).some(value => value.trim() !== '');

        if (hasData && Date.now() - lastActivityTime < 30000) {
            e.preventDefault();
            e.returnValue = 'You have unsaved information in the consultation form. Are you sure you want to leave?';
        }
    });

    // Save progress to localStorage
    const saveProgress = () => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('consultationFormProgress', JSON.stringify(data));
    };

    // Save progress on step change
    const nextButtons = getElements('.next-step', form);
    nextButtons.forEach(button => {
        button.addEventListener('click', saveProgress);
    });

    // Load saved progress
    loadSavedProgress(form);
}

/**
 * Load saved progress from localStorage
 */
function loadSavedProgress(form) {
    try {
        const savedData = localStorage.getItem('consultationFormProgress');
        if (savedData) {
            const data = JSON.parse(savedData);

            // Fill form fields
            Object.entries(data).forEach(([key, value]) => {
                const field = getElement(`[name="${key}"]`, form);
                if (field && value) {
                    if (field.type === 'checkbox') {
                        field.checked = value === 'on' || value === true;
                    } else {
                        field.value = value;
                    }
                }
            });

            // Ask user if they want to continue with saved data
            if (Object.keys(data).length > 0) {
                const hasRequiredFields = ['name', 'email'].some(field => data[field]);
                if (hasRequiredFields) {
                    showNotification('We found your partially completed form. You can continue where you left off.', 'info', 5000);
                }
            }
        }
    } catch (error) {
        console.error('Error loading saved progress:', error);
    }
}

/**
 * Handle pre-filled data from URL parameters
 */
function handlePreFilledData(form) {
    const urlParams = getUrlParams();

    // Pre-fill service interest
    if (urlParams.service) {
        const serviceField = getElement('#service-interest', form);
        if (serviceField) {
            serviceField.value = urlParams.service;
            serviceField.dispatchEvent(new Event('change'));
        }
    }

    // Pre-fill package
    if (urlParams.package) {
        const packageBudgets = {
            'starter': '5k-10k',
            'growth': '15k-25k',
            'enterprise': '50k+'
        };

        const budgetField = getElement('#budget-range', form);
        if (budgetField && packageBudgets[urlParams.package]) {
            budgetField.value = packageBudgets[urlParams.package];
            budgetField.dispatchEvent(new Event('change'));
        }
    }

    // Pre-fill project type
    if (urlParams.projectType) {
        const projectTypeField = getElement('#project-type', form);
        if (projectTypeField) {
            projectTypeField.value = urlParams.projectType;
        }
    }
}

/**
 * Initialize form submission
 */
function initializeFormSubmission(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateCurrentStep()) {
            return;
        }

        const submitButton = getElement('button[type="submit"]', form);
        const originalText = submitButton.textContent;

        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        submitButton.classList.add('loading');

        try {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Add metadata
            data.timestamp = new Date().toISOString();
            data.userAgent = navigator.userAgent;
            data.referrer = document.referrer;

            // Submit to server (simulated)
            const response = await submitConsultationForm(data);

            if (response.success) {
                // Clear saved progress
                localStorage.removeItem('consultationFormProgress');

                // Show success message
                showConsultationSuccess();

                // Reset form
                form.reset();

                // Track conversion
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        event_category: 'consultation',
                        event_label: 'form_completed',
                        value: data['budget-range']
                    });
                }

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

            } else {
                throw new Error(response.message || 'Submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('There was an error submitting your consultation request. Please try again or contact us directly.', 'error');
        } finally {
            // Restore button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.classList.remove('loading');
        }
    });
}

/**
 * Submit consultation form to server
 */
async function submitConsultationForm(data) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, this would be an actual API call
    console.log('Consultation form submitted:', data);

    // Simulate success response
    return {
        success: true,
        message: 'Consultation request submitted successfully',
        id: generateId('consultation')
    };
}

/**
 * Show consultation success message
 */
function showConsultationSuccess() {
    const form = getElement('#consultation-form');
    if (!form) return;

    const successHTML = `
        <div class="consultation-success">
            <div class="success-icon">✓</div>
            <h2>Thank You for Your Interest!</h2>
            <p>Your consultation request has been successfully submitted. Our team will review your information and contact you within 24 hours to schedule your free consultation.</p>

            <div class="next-steps">
                <h3>What Happens Next?</h3>
                <ol>
                    <li>You'll receive a confirmation email within 15 minutes</li>
                    <li>Our team will review your project requirements</li>
                    <li>We'll contact you to schedule a consultation call</li>
                    <li>During the call, we'll discuss your project in detail and provide recommendations</li>
                    <li>You'll receive a detailed proposal with timeline and pricing</li>
                </ol>
            </div>

            <div class="contact-info">
                <p><strong>Need to speak with someone immediately?</strong></p>
                <p>Call us at <a href="tel:+15551234567">+1 (555) 123-4567</a> or email <a href="mailto:hello@webdevnexserv.com">hello@webdevnexserv.com</a></p>
            </div>

            <div class="success-actions">
                <a href="index.html" class="btn btn-primary">Return to Home</a>
                <a href="works.html" class="btn btn-secondary">View Our Work</a>
            </div>
        </div>
    `;

    // Add success styles if not present
    if (!document.querySelector('#success-styles')) {
        const styles = document.createElement('style');
        styles.id = 'success-styles';
        styles.textContent = `
            .consultation-success {
                text-align: center;
                padding: var(--space-12) 0;
                max-width: 600px;
                margin: 0 auto;
            }

            .success-icon {
                width: 80px;
                height: 80px;
                background: var(--color-success);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-3xl);
                font-weight: bold;
                margin: 0 auto var(--space-6);
            }

            .consultation-success h2 {
                color: var(--text-primary);
                margin-bottom: var(--space-4);
                font-size: var(--font-size-2xl);
            }

            .consultation-success p {
                color: var(--text-secondary);
                margin-bottom: var(--space-6);
                max-width: none;
            }

            .next-steps {
                text-align: left;
                background: var(--color-light-gray);
                padding: var(--space-6);
                border-radius: var(--radius-lg);
                margin: var(--space-8) 0;
            }

            .next-steps h3 {
                text-align: center;
                margin-bottom: var(--space-4);
                color: var(--text-primary);
            }

            .next-steps ol {
                margin: 0;
                padding-left: var(--space-6);
            }

            .next-steps li {
                margin-bottom: var(--space-3);
                color: var(--text-secondary);
            }

            .contact-info {
                background: var(--bg-primary);
                border: 2px solid var(--border-light);
                padding: var(--space-6);
                border-radius: var(--radius-lg);
                margin: var(--space-8) 0;
            }

            .contact-info p {
                margin-bottom: var(--space-3);
            }

            .contact-info a {
                color: var(--text-primary);
                text-decoration: underline;
            }

            .success-actions {
                display: flex;
                gap: var(--space-4);
                justify-content: center;
                flex-wrap: wrap;
            }

            .success-actions .btn {
                min-width: 200px;
            }

            @media (max-width: 480px) {
                .success-actions {
                    flex-direction: column;
                }

                .success-actions .btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Replace form with success message
    form.innerHTML = successHTML;
    form.classList.remove('consultation-form');
    form.classList.add('consultation-success-wrapper');
}

// Export consultation functions for other modules
window.WebDevNexServConsultation = {
    validateCurrentStep,
    saveProgress,
    loadSavedProgress,
    showConsultationSuccess
};