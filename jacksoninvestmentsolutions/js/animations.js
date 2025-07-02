// Shiny text animation functionality
document.addEventListener('DOMContentLoaded', function() {
    const shinyText = document.querySelector('.shiny-text');
    if (!shinyText) return;

    // Function to trigger the animation
    function triggerShine() {
        // Remove any existing animation
        shinyText.classList.remove('animate');
        
        // Trigger reflow
        void shinyText.offsetWidth;
        
        // Add animation class
        shinyText.classList.add('animate');
        
        // Set random interval for next animation (7-15 seconds)
        const nextInterval = Math.floor(Math.random() * 8000) + 7000; // 7-15 seconds
        setTimeout(triggerShine, nextInterval);
    }

    // Initial trigger with a small delay
    setTimeout(triggerShine, 2000);

    // Also trigger on visibility change (when user comes back to tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            triggerShine();
        }
    });
});
