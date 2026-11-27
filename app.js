document.getElementById("store").addEventListener("click", () => {
    window.open("https://photon.dino.icu/store", "_self");
});

const heroTrack = document.querySelector('.hero-track');
const hero = document.querySelector('.hero');
const heroImg = document.querySelector('.hero img');
const heroText = document.querySelector('.hero-text');
const sectionsTrack = document.querySelector('.sections-track');
const stagePanels = ['#aboutus', '#games', '#animations', '#contact']
    .map(id => document.querySelector(id))
    .filter(Boolean);
const orbitalNav = document.querySelector('.orbital-nav');
const orbitNodes = document.querySelectorAll('.orbit-node');
const aboutSection = document.querySelector('.aboutus');
const SHIFT_X = 60;
let ticking = false;

function updateSectionFocus() {
    const topOff = 70;
    const stageH = window.innerHeight - topOff;
    const trackTop = sectionsTrack.getBoundingClientRect().top;
    const totalScrollable = sectionsTrack.offsetHeight - stageH;
    const rawProgress = (topOff - trackTop) / totalScrollable;
    const stageIndex = Math.max(0, Math.min(stagePanels.length - 1, rawProgress * (stagePanels.length - 1)));
    const activeIdx = Math.round(stageIndex);
    stagePanels.forEach((panel, i) => {
        const diff = i - stageIndex;
        const abs = Math.abs(diff);
        if (abs >= 1) {
            panel.style.opacity = '0';
            panel.style.filter = 'blur(12px)';
            panel.style.transform = `translateY(${diff > 0 ? SHIFT_X : -SHIFT_X}px)`;
            panel.classList.remove('active-panel');
        } else {
            const translateY = diff * SHIFT_X;
            const blur = abs * 12;
            const opacity = 1 - abs;

            panel.style.transform = `translateY(${translateY}px)`;
            panel.style.filter = `blur(${blur}px)`;
            panel.style.opacity = opacity;
            panel.classList.toggle('active-panel', abs < 0.5);
        }
    });
    if (stageIndex < 0.6 && trackTop <= topOff + stageH * 0.5) {
        aboutSection.classList.add('show');
    }
    const activeId = `#${stagePanels[activeIdx].id}`;
    orbitNodes.forEach(node => {
        node.classList.toggle('active', node.dataset.target === activeId);
    });
}

function toggleOrbitalVisibility() {
    if (window.scrollY > heroTrack.offsetHeight - hero.offsetHeight * 0.6) {
        orbitalNav.classList.add('visible');
    } else {
        orbitalNav.classList.remove('visible');
    }
}

function updateScrollAnimations() {
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
    toggleOrbitalVisibility();
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateScrollAnimations);
        ticking = true;
    }
}, { passive: true });

function scrollToStageSection(targetId) {
    const idx = stagePanels.findIndex(p => `#${p.id}` === targetId);
    if (idx === -1) return;

    const topOff = 70;
    const stageH = window.innerHeight - topOff;
    const totalScrollable = sectionsTrack.offsetHeight - stageH;
    const trackPageTop = sectionsTrack.getBoundingClientRect().top + window.scrollY;
    const targetScrollY = (trackPageTop - topOff) + (idx / (stagePanels.length - 1)) * totalScrollable;

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
}

document.querySelectorAll('.navbar a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (stagePanels.some(p => `#${p.id}` === targetId)) {
            e.preventDefault();
            scrollToStageSection(targetId);
        }
    });
});

orbitNodes.forEach(node => {
    node.addEventListener('click', () => {
        scrollToStageSection(node.dataset.target);
    });
});

window.addEventListener('load', () => {
    if (window.location.hash) {
        scrollToStageSection(window.location.hash);
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    updateScrollAnimations();
});

updateScrollAnimations();