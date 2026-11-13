/* 1. INTRO KONTROLÜ */
window.addEventListener('load', () => {
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        intro.style.opacity = '0';
        intro.style.visibility = 'hidden';
    }, 2000);
});

/* 2. MOBİL MENÜ AÇMA / KAPAMA */
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    navMenu.classList.toggle('show');

    if (navMenu.classList.contains('show')) {
        menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
}

/* 3. TAB SWITCHING (SEKME DEĞİŞTİRME) */
function switchTab(tabId, element) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    if (element && element.classList.contains('nav-btn')) {
        element.classList.add('active');
    }

    const navMenu = document.getElementById('navMenu');
    if (navMenu.classList.contains('show')) {
        toggleMenu();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getNavBtn(index) {
    return document.querySelectorAll('.nav-btn')[index];
}

/* 4. PARÇACIKLI CANLI ARKA PLAN */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 162, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 40; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

animate();

/* 5. İSİM ÖNERİCİ MANTIĞI */
const males = [
    "Barış", "Mert", "Yavuz", "Emre", "Kaan", "Burak",
    "Serkan", "Oğuz", "Arda", "Eren", "Volkan", "Deniz"
];

const females = [
    "Selin", "Zeynep", "Elif", "Buse", "Merve", "Aslı",
    "Derin", "Ece", "Melisa", "Ceren", "Simge"
];

const surnames = [
    "Karadağ", "Sancak", "Yılmaz", "Kaya", "Aydın",
    "Demir", "Çelik", "Şahin", "Koç", "Yıldırım", "Korkmaz"
];

function generateName(gender) {
    let list = gender === 'male' ? males : females;
    let first = list[Math.floor(Math.random() * list.length)];
    let last = surnames[Math.floor(Math.random() * surnames.length)];

    document.getElementById('nameDisplay').innerText = `${first} ${last}`;
}
