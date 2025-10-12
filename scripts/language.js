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

        // Save to localStorage
        localStorage.setItem('lang', newLang);

        // Update current language
        currentLang = newLang;

        // Load new language
        loadLanguage(newLang);
    });
});

function loadLanguage(lang) {
    fetch(`languages/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            // Update all elements with translations
            for (const key in data) {
                const element = document.getElementById(key);
                if (element) {
                    element.textContent = data[key];
                }
            }

            // Update HTML lang attribute
            document.documentElement.lang = lang;
        })
        .catch(error => {
            console.error('Error loading language file:', error);
        });
}