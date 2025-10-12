document.addEventListener('DOMContentLoaded', function () {
    const langSwitch = document.getElementById('lang-switch');

    // Get current language from localStorage or default to 'hr'
    let currentLang = localStorage.getItem('lang') || 'hr';

    // Load the initial language
    loadLanguage(currentLang);

    // Add click listener to switch languages
    langSwitch.addEventListener('click', function () {
        // Toggle between 'en' and 'hr'
        const newLang = currentLang === 'en' ? 'hr' : 'en';

        console.log(newLang);

        // Save to localStorage
        localStorage.setItem('lang', newLang);

        // Reload page to apply new language
        location.reload();
    });
});

function loadLanguage(lang) {
    fetch(`languages/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Language data loaded:', lang, data); // Debug log

            // Update all elements with translations
            for (const key in data) {
                const element = document.getElementById(key);
                if (element) {
                    // Use innerHTML to support HTML tags in translations
                    element.innerHTML = data[key];
                } else {
                    console.warn(`Element with id "${key}" not found`); // Debug log
                }
            }

            // Update HTML lang attribute
            document.documentElement.lang = lang;

            // Trigger custom event to notify other scripts that language has changed
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        })
        .catch(error => {
            console.error('Error loading language file:', error);
        });
}