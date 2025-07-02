// Cookie Consent Banner
function createCookieBanner() {
    if (!document.cookie.split('; ').find(row => row.startsWith('cookieConsent='))) {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.style.position = 'fixed';
        banner.style.bottom = '0';
        banner.style.left = '0';
        banner.style.right = '0';
        banner.style.padding = '15px 20px';
        banner.style.backgroundColor = '#f8f9fa';
        banner.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
        banner.style.zIndex = '9999';
        banner.style.display = 'flex';
        banner.style.flexWrap = 'wrap';
        banner.style.alignItems = 'center';
        banner.style.justifyContent = 'space-between';
        banner.style.gap = '15px';
        
        banner.innerHTML = `
            <div style="flex: 1; min-width: 250px;">
                <p style="margin: 0; font-size: 0.9rem; color: #333;">
                    We use cookies to enhance your experience. By continuing to browse, you agree to our 
                    <a href="privacy-policy.html" style="color: #0071e3; text-decoration: underline;">Privacy Policy</a> 
                    and 
                    <a href="terms-of-use.html" style="color: #0071e3; text-decoration: underline;">Terms of Use</a>.
                </p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="accept-cookies" style="padding: 8px 20px; background-color: #0071e3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                    Accept
                </button>
                <button id="reject-cookies" style="padding: 8px 20px; background-color: #f1f1f1; color: #333; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-weight: 500;">
                    Reject
                </button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Add event listeners
        document.getElementById('accept-cookies').addEventListener('click', () => {
            setCookie('cookieConsent', 'accepted', 365);
            banner.style.display = 'none';
        });
        
        document.getElementById('reject-cookies').addEventListener('click', () => {
            setCookie('cookieConsent', 'rejected', 30);
            banner.style.display = 'none';
            // Optionally implement additional logic for rejected cookies
        });
    }
}

// Helper function to set cookies
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

// Initialize cookie consent banner when DOM is loaded
document.addEventListener('DOMContentLoaded', createCookieBanner);
