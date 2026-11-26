document.getElementById("store").addEventListener("click", () => {
    window.open("https://photon.dino.icu/store", "_self");
});

const heroTrack = document.querySelector('.hero-track');
const hero = document.querySelector('.hero');
const heroImg = document.querySelector('.hero img');
const heroText = document.querySelector('.hero-text');
let ticking = false;
const focusSections = ['#aboutus', '#games', '#animations', '#contact']
    .map(id => document.querySelector(id))
    .filter(Boolean);
function updateSectionFocus() {
    const viewportCenter = window.innerHeight / 2 + 35;
    const maxDist = window.innerHeight * 0.65;
    focusSections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    const secCenter = rect.top + rect.height / 2;
    const offset = (secCenter - viewportCenter) / maxDist;
    const clamped = Math.max(-1, Math.min(1, offset));
    const abs = Math.abs(clamped);
    const translateY = clamped * 45;
    const blur = abs * 10;
    const opacity = 1 - Math.pow(abs, 1.6) * 0.85;
    sec.style.transform = `translateY(${translateY}px)`;
    sec.style.filter = `blur(${blur}px)`;
    sec.style.opacity = opacity;
    });
}

function updateHeroScroll() {
    const scrollY = window.scrollY;
    const scrollDist = heroTrack.offsetHeight - hero.offsetHeight;
    const progress = Math.min(Math.max(scrollY / scrollDist, 0), 1);
    const scale = 1.05 + progress * 0.45;
    const blur = progress * 16;
    const imgOpa = 1 - progress * 0.65;
    heroImg.style.transform = `scale(${scale})`;
    heroImg.style.filter = `blur(${blur}px)`;
    heroImg.style.opacity = imgOpa;
    heroText.style.transform = `translateY(${-progress * 80}px)`;
    heroText.style.opacity = 1 - progress * 1.4;
    updateSectionFocus();
    ticking = false;
}

updateSectionFocus();

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateHeroScroll);
        ticking = true;
    }
}, { passive: true });

const aboutSection = document.querySelector('.aboutus');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            aboutSection.classList.add('show');
        }
    });
}, { threshold: 0.25 });
aboutObserver.observe(aboutSection);

document.querySelectorAll('.navbar a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: 'smooth'});
        }
    });
});

window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
});

const orbitalNav = document.querySelector('.orbital-nav');
const orbitNodes = document.querySelectorAll('.orbit-node');
const trackedSections = ['#aboutus', '#games', '#animations', '#contact']
    .map(id => document.querySelector(id))
    .filter(Boolean);
function toggleOrbitalVisibility() {
    if (window.scrollY > heroTrack.offsetHeight - hero.offsetHeight * 0.6) {
        orbitalNav.classList.add('visible');
    } else {
        orbitalNav.classList.remove('visible');
    }
}
window.addEventListener('scroll', toggleOrbitalVisibility, { passive: true});
toggleOrbitalVisibility();

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const activeId = `#${entry.target.id}`;
            orbitNodes.forEach(node => {
                node.classList.toggle('active', node.dataset.target === activeId);
            });
        }
    });
}, { threshold: 0.45 });
trackedSections.forEach(sec => sectionObserver.observe(sec));
orbitNodes.forEach(node => {
    node.addEventListener('click', () => {
        const targetSection = document.querySelector(node.dataset.target);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});