let currentLanguageData = null;

document.addEventListener('DOMContentLoaded', function () {
    const langSwitch = document.getElementById('lang-switch');
    let currentLang = localStorage.getItem('lang') || 'hr';

    loadLanguage(currentLang);

    langSwitch.addEventListener('click', function () {
        const newLang = currentLang === 'en' ? 'hr' : 'en';
        localStorage.setItem('lang', newLang);
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
            currentLanguageData = data;
            console.log('Language data loaded:', lang, data);

            // Update simple text elements
            for (const key in data) {
                if (key === 'projects' || key === 'stats' || key === 'skills' || key === 'education' || key === 'experience') {
                    continue; // Skip arrays, handle separately
                }

                const element = document.getElementById(key);
                if (element) {
                    element.innerHTML = data[key];
                }
            }

            // Build dynamic sections
            if (data.stats) buildStats(data.stats);
            if (data.skills) buildSkills(data.skills);
            if (data.education) buildEducation(data.education);
            if (data.experience) buildExperience(data.experience);
            if (data.projects) buildProjects(data.projects);

            document.documentElement.lang = lang;

            // Trigger event for carousel
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { lang, data: currentLanguageData }
            }));
        })
        .catch(error => {
            console.error('Error loading language file:', error);
        });
}

function buildStats(stats) {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;

    statsGrid.innerHTML = stats.map(stat => `
        <div class="stat-item">
            <div class="stat-number" data-target="${stat.value}">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}

function buildSkills(skills) {
    const programmingContainer = document.querySelector('.skills-grid > div:first-child');
    const toolsContainer = document.querySelector('.skills-grid > div:last-child');

    if (programmingContainer && skills.programming) {
        const title = programmingContainer.querySelector('h3');
        const barsContainer = document.createElement('div');

        barsContainer.innerHTML = skills.programming.map(skill => `
            <div class="skill-bar">
                <div class="skill-level" style="--skill-width: ${skill.level}%">${skill.name}</div>
            </div>
        `).join('');

        programmingContainer.innerHTML = '';
        programmingContainer.appendChild(title);
        programmingContainer.appendChild(barsContainer);
    }

    if (toolsContainer && skills.tools) {
        const title = toolsContainer.querySelector('h3');
        const badgesContainer = document.createElement('div');

        badgesContainer.innerHTML = skills.tools.map(tool =>
            `<span class="tech-badge">${tool}</span>`
        ).join('');

        toolsContainer.innerHTML = '';
        toolsContainer.appendChild(title);
        toolsContainer.appendChild(badgesContainer);
    }
}

function buildEducation(education) {
    const container = document.getElementById('education');
    const existingItems = container.querySelectorAll('.timeline-item');
    existingItems.forEach(item => item.remove());

    education.forEach(edu => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        let content = `
            <h3 class="w3-text-white">${edu.institution}</h3>
            <p class="w3-text-grey">
                <i class="fa fa-calendar fa-fw w3-margin-right"></i>${edu.period}
            </p>
            <p><strong>${edu.degree}</strong></p>
        `;

        if (edu.description) {
            content += `<p>${edu.description}</p>`;
        }

        if (edu.courses) {
            content += `<p style="font-size: 14px; color: #aaa;">${edu.courses}</p>`;
        }

        item.innerHTML = content;
        container.appendChild(item);
    });
}

function buildExperience(experience) {
    const container = document.querySelector('.experience-grid');
    if (!container) return;

    container.innerHTML = experience.map(exp => `
        <div class="experience-card">
            <div class="experience-header">
                <div class="experience-icon">
                    <i class="fa ${exp.icon}"></i>
                </div>
                <h3 class="w3-text-white">${exp.title}</h3>
                <p class="w3-text-grey" style="margin: 0;">
                    <i class="fa fa-calendar fa-fw"></i> ${exp.period}
                </p>
                <p style="margin-top: 5px;"><strong>${exp.company}</strong></p>
                <p style="margin-bottom: 5px;"><i>${exp.type}</i></p>
            </div>
            <div class="experience-body">
                <p>${exp.description}</p>
                ${exp.tags ? `
                    <div class="experience-tags">
                        ${exp.tags.map(tag => `<span class="experience-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                ${exp.list ? `
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        ${exp.list.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function buildProjects(projects) {
    // This is handled by carousel.js
    console.log('Projects will be built by carousel.js');
}

function getCurrentLanguageData() {
    return currentLanguageData;
}