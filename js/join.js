document.addEventListener('DOMContentLoaded', function() {
    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Get plan type from URL if available
    let planType = getUrlParameter('plan');

    // Set default custom message based on plan
    const planMessage = document.getElementById('plan-message');

    if (planType) {
        switch(planType) {
            case 'off-peak':
                planMessage.textContent = 'Your Off-Peak Access membership will allow you to use the gym facilities before 12PM and after 8PM.';
                break;
            case 'full-access':
                planMessage.textContent = 'Your Full Access membership will give you 24/7 access to all gym facilities and 8 group classes per month.';
                break;
            case 'premium':
                planMessage.textContent = 'Your Premium membership includes 24/7 access, unlimited classes, pool access, and personal training sessions.';
                break;
            default:
            // Keep default message
        }
    }

    // You could add functionality here to populate any other plan-specific information
    // without showing a detailed membership summary
});