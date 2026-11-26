document.getElementById("store").addEventListener("click", () => {
    window.open("https://photon.dino.icu/store", "_self");
});

const hero = document.querySelector('.hero');
const heroImg = document.querySelector('.hero img');
const heroText = document.querySelector('.hero-text');
let ticking = false;

function updateHeroScroll() {
    const scrollY = window.scrollY;
    const heroH = hero.offsetHeight;
    const progress = Math.min(Math.max(scrollY / heroH, 0), 1);

    const scale = 1.05 + progress * 0.3;
    const blur = progress * 14;
    const imgOpa = 1 - progress * 0.65;

    heroImg.style.transform = `scale(${scale})`;
    heroImg.style.filter = `blur(${blur}px)`;
    heroImg.style.opacity = imgOpa;

    heroText.style.transform = `translateY(${-progress * 60}px)`;
    heroText.style.opacity = 1 - progress * 1.3;

    ticking = false;
}

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