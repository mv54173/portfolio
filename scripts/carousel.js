// Project carousel functionality
let currentIndex = 0;
let isAnimating = false;
let projectData = [];

// Load all projects from HTML
function loadProjectData() {
    projectData = [];
    let index = 1;

    while (true) {
        const titleEl = document.getElementById(`project-${index}-title`);
        if (!titleEl) break;

        const descEl = document.getElementById(`project-${index}-desc`);
        const linkTextEl = document.getElementById(`project-${index}-link`);
        const urlEl = document.getElementById(`project-${index}-url`);

        projectData.push({
            title: titleEl.textContent,
            desc: descEl ? descEl.textContent : '',
            linkText: linkTextEl ? linkTextEl.textContent : 'View',
            url: urlEl ? urlEl.textContent : '#'
        });

        index++;
    }

    console.log(`Loaded ${projectData.length} projects`);
    return projectData.length;
}

// Get circular index
function getCircularIndex(index) {
    const len = projectData.length;
    return ((index % len) + len) % len;
}

// Create a project card
function createProjectCard(dataIndex, position) {
    const project = projectData[dataIndex];
    const card = document.createElement('div');
    card.className = 'project-card';

    if (position === 1) {
        card.classList.add('active');
    }

    card.innerHTML = `
        <div>
            <h3>${project.title}</h3>
            <p>${project.desc}</p>
        </div>
        <a href="${project.url}" target="_blank" class="project-link">
            <i class="fa fa-github"></i>
            <span>${project.linkText}</span>
        </a>
    `;

    // Click inactive cards to navigate
    if (position !== 1) {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.project-link')) {
                moveCarousel(position === 0 ? -1 : 1);
            }
        });
    }

    return card;
}

// Render the carousel (shows 3 cards: prev, current, next)
function renderCarousel() {
    const track = document.getElementById('projectTrack');
    if (!track || projectData.length === 0) return;

    track.innerHTML = '';

    const prevIndex = getCircularIndex(currentIndex - 1);
    const currIndex = currentIndex;
    const nextIndex = getCircularIndex(currentIndex + 1);

    track.appendChild(createProjectCard(prevIndex, 0));
    track.appendChild(createProjectCard(currIndex, 1));
    track.appendChild(createProjectCard(nextIndex, 2));
}

// Move carousel left (-1) or right (1)
function moveCarousel(direction) {
    if (isAnimating || projectData.length === 0) return;
    isAnimating = true;

    const track = document.getElementById('projectTrack');
    const cards = track.querySelectorAll('.project-card');

    // Animate out
    cards.forEach(card => {
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        if (direction === 1) {
            card.style.transform = 'translateX(-430px) scale(0.85)';
        } else {
            card.style.transform = 'translateX(430px) scale(0.85)';
        }
        card.style.opacity = '0';
    });

    setTimeout(() => {
        // Update index
        currentIndex = getCircularIndex(currentIndex + direction);

        // Render new cards
        track.innerHTML = '';
        const prevIndex = getCircularIndex(currentIndex - 1);
        const currIndex = currentIndex;
        const nextIndex = getCircularIndex(currentIndex + 1);

        const prevCard = createProjectCard(prevIndex, 0);
        const currCard = createProjectCard(currIndex, 1);
        const nextCard = createProjectCard(nextIndex, 2);

        // Position them off-screen
        [prevCard, currCard, nextCard].forEach(card => {
            card.style.transition = 'none';
            if (direction === 1) {
                card.style.transform = 'translateX(430px) scale(0.85)';
            } else {
                card.style.transform = 'translateX(-430px) scale(0.85)';
            }
            card.style.opacity = '0';
        });

        track.appendChild(prevCard);
        track.appendChild(currCard);
        track.appendChild(nextCard);

        // Animate in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                [prevCard, currCard, nextCard].forEach(card => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.transform = '';
                    card.style.opacity = '';
                });

                setTimeout(() => {
                    isAnimating = false;
                }, 600);
            });
        });
    }, 600);
}

// Keyboard navigation
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            moveCarousel(-1);
        } else if (e.key === 'ArrowRight') {
            moveCarousel(1);
        }
    });
}

// Reload carousel when language changes
document.addEventListener('languageChanged', function () {
    const count = loadProjectData();
    if (count > 0) {
        currentIndex = 0;
        renderCarousel();
    }
});

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', function () {
    const count = loadProjectData();
    if (count > 0) {
        renderCarousel();
        initKeyboardNav();
    } else {
        console.warn('No projects found');
    }
});