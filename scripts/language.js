document.addEventListener('DOMContentLoaded', function() {
    const langSwitch = document.getElementById('lang-switch');
    const userLang = localStorage.getItem('lang') || 'en';
    loadLanguage(userLang);
    langSwitch.addEventListener('click', function() {
        const newLang = userLang === 'en' ? 'hr' : 'en';
        localStorage.setItem('lang', newLang);
        loadLanguage(newLang);
        location.reload();
    });
});
function loadLanguage(lang) {
    fetch(`languages/${lang}.json`).then(response => response.json()).then(data => {
        for (const key in data) {
            const element = document.getElementById(key);
            if (element) element.textContent = data[key];
        }
    });
}