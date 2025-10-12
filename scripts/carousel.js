// Project carousel functionality
let currentIndex = 0;
let isAnimating = false;
const track = document.getElementById('projectTrack');

// Project data structure
const projectData = [
    {
        title: '',
        desc: '',
        link: 'https://github.com/mv54173/EvolutionaryComputing',
        linkText: ''
    },
    {
        title: '',
        desc: '',
        link: 'https://github.com/mv54173/JNotepadPP',
        linkText: ''
    },
    {
        title: '',
        desc: '',
        link: 'https://github.com/mv54173/JPaint',
        linkText: ''
    }
];

// Load project data from hidden elements
function loadProjectData() {
    const project1Title = document.getElementById('project-1-title');
    const project2Title = document.getElementById('project-2-title');
    const project3Title = document.getElementById('project-3-title');

    if (project1Title) {
        projectData[0].title = project1Title.textContent;
        projectData[0].desc = document.getElementById('project-1-desc').textContent;
        projectData[0].linkText = document.getElementById('project-1-link').textContent;

        projectData[1].title = project2Title.textContent;
        projectData[1].desc = document.getElementById('project-2-desc').textContent;
        projectData[1].linkText = document.getElementById('project-2-link').textContent;

        projectData[2].title = project3Title.textContent;
        projectData[2].desc = document.getElementById('project-3-desc').textContent;
        projectData[2].linkText = document.getElementById('project-3-link').textContent;
    }
}

// Get circular index (wraps around)
function getCircularIndex(index) {
    const len = projectData.length;
    return ((index % len) + len) % len;
}

// Create project card element
function createCard(dataIndex, position) {
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
        <a href="${project.link}" target="_blank" class="project-link">
            <i class="fa fa-github"></i>
            <span>${project.linkText}</span>
        </a>
    `;

    // Add click handler for non-active cards
    if (position !== 1) {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.project-link')) {
                if (position === 0) {
                    moveCarousel(-1);
                } else if (position === 2) {
                    moveCarousel(1);
                }
            }
        });
    }

    return card;
}

// Render carousel with current state
function renderCarousel(animate = false) {
    const prevIndex = getCircularIndex(currentIndex - 1);
    const currIndex = currentIndex;
    const nextIndex = getCircularIndex(currentIndex + 1);

    const order = [prevIndex, currIndex, nextIndex];

    if (animate) {
        const cards = track.querySelectorAll('.project-card');
        cards.forEach(card => card.classList.add('transitioning'));

        setTimeout(() => {
            track.innerHTML = '';
            order.forEach((dataIndex, position) => {
                track.appendChild(createCard(dataIndex, position));
            });
            isAnimating = false;
        }, 50);
    } else {
        track.innerHTML = '';
        order.forEach((dataIndex, position) => {
            track.appendChild(createCard(dataIndex, position));
        });
    }
}

// Move carousel in specified direction
function moveCarousel(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const cards = track.querySelectorAll('.project-card');

    // Animate out
    if (direction === 1) {
        cards.forEach(card => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'translateX(-430px) scale(0.85)';
            card.style.opacity = '0';
        });
    } else {
        cards.forEach(card => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'translateX(430px) scale(0.85)';
            card.style.opacity = '0';
        });
    }

    // Update index and render new cards
    setTimeout(() => {
        currentIndex = getCircularIndex(currentIndex + direction);
        renderCarousel(false);

        const newCards = track.querySelectorAll('.project-card');

        // Reset position for animation
        newCards.forEach(card => {
            card.style.transition = 'none';
            card.style.transform = direction === 1 ?
                'translateX(430px) scale(0.85)' :
                'translateX(-430px) scale(0.85)';
            card.style.opacity = '0';
        });

        // Animate in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newCards.forEach((card) => {
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
function initCarouselKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            moveCarousel(-1);
        } else if (e.key === 'ArrowRight') {
            moveCarousel(1);
        }
    });
}

// Initialize carousel
function initCarousel() {
    if (!track) return;

    loadProjectData();
    renderCarousel();
    initCarouselKeyboard();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initCarousel);