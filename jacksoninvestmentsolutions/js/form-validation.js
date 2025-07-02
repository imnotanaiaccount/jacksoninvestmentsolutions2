document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    // Track if form has been submitted to show validation messages
    let formSubmitted = false;
    let isSubmitting = false;

    // Add focused attribute to track if a field was interacted with
    const inputs = form.querySelectorAll('input, select, textarea');
    const submitButton = form.querySelector('button[type="submit"]');
    let originalButtonText = submitButton ? submitButton.innerHTML : '';
    
    // Add event listeners for validation
    inputs.forEach(input => {
        // Set initial focused state
        input.setAttribute('focused', 'false');
        
        // Handle focus events
        input.addEventListener('focus', function() {
            this.setAttribute('focused', 'true');
            // Only show validation messages after first submission attempt
            if (formSubmitted) {
                validateField(this);
            }
        });

        // Handle blur events for validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Real-time validation for text inputs
        if (['text', 'email', 'tel', 'textarea'].includes(input.type)) {
            input.addEventListener('input', function() {
                if (formSubmitted || this.getAttribute('focused') === 'true') {
                    validateField(this);
                }
            });
        }
    });
    
    // Custom form submission handler for n8n
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (isSubmitting) return false;
        
        // Mark form as submitted for validation
        formSubmitted = true;
        
        // Validate all required fields
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // If form is not valid, prevent submission and show errors
        if (!isValid) {
            const firstError = form.querySelector('.error-message:not([style*="display: none"])');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        
        // If we get here, form is valid - prepare for submission
        isSubmitting = true;
        
        // Show loading state on submit button
        if (submitButton) {
            originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Sending...';
        }
        
        try {
            // Get form data
            const formData = new FormData(form);
            
            // Add timestamp
            formData.append('submissionTime', new Date().toISOString());
            
            // Get the webhook URL from form action
            const webhookUrl = form.getAttribute('action');
            
            // Submit to n8n webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                // Show success message
                showMessage('success', 'Thank you!', 'Your message has been sent. We\'ll contact you shortly.');
                
                // Reset form
                form.reset();
                formSubmitted = false;
                
                // Reset focused state on all inputs
                inputs.forEach(input => input.setAttribute('focused', 'false'));
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('error', 'Error', 'There was a problem sending your message. Please try again later or contact us directly.');
        } finally {
            // Reset button state
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
            isSubmitting = false;
        }
        
        return false;
    });

    // Function to validate a single field
    function validateField(field) {
        // Skip validation for hidden fields and non-required fields that are empty
        if (field.type === 'hidden' || (!field.required && !field.value.trim())) {
            return true;
        }
        
        const errorMessage = field.parentElement.querySelector('.error-message');
        if (!errorMessage) return true;
        
        let isValid = true;
        let errorMessageText = '';
        
        // Check required fields
        if (field.required) {
            if (field.type === 'checkbox' && !field.checked) {
                errorMessageText = field.dataset.errorMessage || 'This field is required';
                isValid = false;
            } else if (field.type !== 'checkbox' && !field.value.trim()) {
                errorMessageText = 'This field is required';
                isValid = false;
            }
        }
        
        // Validate email format if not already invalid
        if (isValid && field.type === 'email' && field.value.trim()) {
            if (!isValidEmail(field.value)) {
                errorMessageText = 'Please enter a valid email address';
                isValid = false;
            }
        }
        
        // Validate phone number format if not already invalid
        if (isValid && field.type === 'tel' && field.value.trim()) {
            if (!isValidPhone(field.value)) {
                errorMessageText = 'Please enter a valid phone number (10+ digits)';
                isValid = false;
            }
        }
        
        // Show or clear error message
        if (!isValid) {
            showError(field, errorMessage, errorMessageText);
        } else {
            clearError(field, errorMessage);
        }
        
        return isValid;
    }
    
    // Helper function to show error
    function showError(field, errorElement, message) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.setAttribute('aria-invalid', 'true');
    }
    
    // Helper function to clear error
    function clearError(field, errorElement) {
        field.classList.remove('error');
        errorElement.style.display = 'none';
        field.setAttribute('aria-invalid', 'false');
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Phone validation helper (simple check for 10 digits)
    function isValidPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    }
    
    // Show message function (for success/error messages)
    function showMessage(type, title, message) {
        // You can implement a custom message system here
        // For now, we'll use a simple alert
        alert(`${title}: ${message}`);
        
        // In a real implementation, you might want to show a nice toast or modal
        // Example:
        /*
        const messageContainer = document.createElement('div');
        messageContainer.className = `message ${type}`;
        messageContainer.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
        `;
        document.body.appendChild(messageContainer);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageContainer.remove();
        }, 5000);
        */
        
        return true;
    }

    // Attach AJAX submission for sellerGuideForm
    const sellerGuideForm = document.getElementById('sellerGuideForm');
    if (sellerGuideForm) {
        sellerGuideForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(sellerGuideForm);
            formData.append('submissionTime', new Date().toISOString());
            try {
                const response = await fetch(sellerGuideForm.getAttribute('action'), {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData).toString()
                });
                if (response.ok) {
                    showMessage('success', 'Success!', 'Check your email for the Seller Guide download link.');
                    sellerGuideForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showMessage('error', 'Error', 'There was a problem. Please try again later.');
            }
        });
    }
    // Attach AJAX submission for buyerGuideForm
    const buyerGuideForm = document.getElementById('buyerGuideForm');
    if (buyerGuideForm) {
        buyerGuideForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(buyerGuideForm);
            formData.append('submissionTime', new Date().toISOString());
            try {
                const response = await fetch(buyerGuideForm.getAttribute('action'), {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData).toString()
                });
                if (response.ok) {
                    showMessage('success', 'Success!', 'Check your email for the Buyer Guide download link.');
                    buyerGuideForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showMessage('error', 'Error', 'There was a problem. Please try again later.');
            }
        });
    }
});
