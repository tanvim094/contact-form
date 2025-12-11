document.addEventListener('DOMContentLoaded', (event) => {

    // --- Animation Logic (Unchanged) ---

    // Select all elements that have the 'hidden-item' class
    const animatedElements = document.querySelectorAll('.hidden-item');

    // Function to check if an element is in the viewport
    const isInViewport = (element) => {
        // Get the position of the element relative to the viewport
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // Function to show/hide the elements
    const handleScrollAnimation = () => {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.remove('hidden-item');
                element.classList.add('active-item');
            }
        });
    };

    // Run the check once on load and listen for scroll events
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation);

    // --- GAS Submission Logic (UPDATED) ---

    const form = document.getElementById('simpleForm');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the default form submission (page reload)

        // 1. Disable button to prevent double-submission
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // 2. Collect form data into a JavaScript object
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Add the 'action' parameter required by the GAS doPost function
        data.action = 'submitForm';

        // 3. Use google.script.run to send the data to the GAS backend
        // Note: For a form deployed separately from GAS, you would typically use fetch()
        // to send a POST request to the GAS Web App URL.
        // However, since this form is likely hosted on a regular server (HTML/CSS/JS files),
        // we'll use a standard AJAX/fetch POST request to the Web App URL.

        // Since the environment is NOT a GAS-deployed HTML file, we need the Web App URL
        // and use the standard Fetch API.

        // *** IMPORTANT ***
        // Replace this placeholder with the actual Web App URL you deployed from GAS
        const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxeZgYY3SMXKpSW7B5qoX1By15B1R05SSrxVC3I8f_BICdUBoAro-VWaKn_UGogyCkOxw/exec'; 

        fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            body: new URLSearchParams(data) // Sends data in x-www-form-urlencoded format
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            alert('Form submitted successfully! Data saved to Google Sheet.');
            form.reset(); // Clear the form fields

            // 4. Re-enable the button
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during submission. Check the console for details.');

            // 4. Re-enable the button
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        });

    });
});