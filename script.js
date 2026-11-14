import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    collection 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Bağlantı Bilgilerin
const firebaseConfig = {
  apiKey: "AIzaSyCPsPExgG3H5q_IzV6pPZWliQNfDmomtpQ",
  authDomain: "istanbul-rp.firebaseapp.com",
  projectId: "istanbul-rp",
  storageBucket: "istanbul-rp.firebasestorage.app",
  messagingSenderId: "29565458001",
  appId: "1:29565458001:web:b07c4cbcb01d3a24bf8a70",
  measurementId: "G-NDSDND9DRL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Rozet Açıklamaları (Üstüne tıklandığında bilgi vermek için)
const badgeDetails = {
    dev: { name: "Developer", desc: "Topluluğun yazılım ve sistem altyapısını geliştiren yazılımcı.", icon: "fa-code" },
    admin: { name: "Admin", desc: "Sunucu içi düzeni ve kuralları koruyan yetkili.", icon: "fa-shield-halved" },
    founder: { name: "Founder", desc: "İstanbul Roleplay sunucusunun kurucusu.", icon: "fa-crown" },
    vip: { name: "VIP Üye", desc: "Özelcalcalı ve destekçi şehir sakini statüsü.", icon: "fa-star" },
    donater: { name: "Donater (Bağışçı)", desc: "Sunucuya maddi destek sağlayarak katkıda bulunan bağışçı.", icon: "fa-hand-holding-dollar" },
    booster: { name: "Server Booster", desc: "Discord sunucusuna takviye (boost) basarak destek olan üye.", icon: "fa-rocket" },
    veteran: { name: "Veteran", desc: "Toplulukta uzun süredir bulunan kıdemli üye.", icon: "fa-medal" },
    designer: { name: "Tasarımcı", desc: "Sunucu için grafik, arayüz veya görsel içerikler üreten tasarımcı.", icon: "fa-palette" }
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        if (intro) {
            intro.style.opacity = '0';
            intro.style.visibility = 'hidden';
        }
    }, 1500);
    loadCityCitizens();
});

window.toggleMenu = function() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    navMenu.classList.toggle('show');

    menuToggle.innerHTML = navMenu.classList.contains('show') 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
};

window.switchTab = function(tabId, element) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (element && element.classList.contains('nav-btn')) {
        element.classList.add('active');
    }

    const navMenu = document.getElementById('navMenu');
    if (navMenu.classList.contains('show')) {
        window.toggleMenu();
    }

    if (tabId === 'admin-panel') {
        window.loadAllUsers();
    } else if (tabId === 'vatandaslar-listesi') {
        window.loadCityCitizens();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.getNavBtn = function(index) {
    return document.querySelectorAll('.nav-btn')[index];
};

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

for (let i = 0; i < 40; i++) particles.push(new Particle());

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

const males = ["Barış", "Mert", "Yavuz", "Emre", "Kaan", "Burak", "Serkan", "Oğuz", "Arda", "Eren", "Volkan", "Deniz"];
const females = ["Selin", "Zeynep", "Elif", "Buse", "Merve", "Aslı", "Derin", "Ece", "Melisa", "Ceren", "Simge"];
const surnames = ["Karadağ", "Sancak", "Yılmaz", "Kaya", "Aydın", "Demir", "Çelik", "Şahin", "Koç", "Yıldırım", "Korkmaz"];

window.generateName = function(gender) {
    let list = gender === 'male' ? males : females;
    let first = list[Math.floor(Math.random() * list.length)];
    let last = surnames[Math.floor(Math.random() * surnames.length)];
    document.getElementById('nameDisplay').innerText = `${first} ${last}`;
};

window.toggleAuthMode = function(mode) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginTabBtn');
    const registerBtn = document.getElementById('registerTabBtn');
    const msgBox = document.getElementById('authMessage');

    msgBox.className = 'auth-msg';
    msgBox.innerText = '';

    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginBtn.classList.remove('active');
        registerBtn.classList.add('active');
    }
};

function showAuthMessage(text, type) {
    const msgBox = document.getElementById('authMessage');
    msgBox.innerText = text;
    msgBox.className = `auth-msg ${type}`;
}

// Rozetlere Tıklayınca Açılan Bilgi Modalı
window.showBadgeInfo = function(badgeKey, event) {
    if (event) event.stopPropagation(); // Kart tıklanmasını engelle
    const info = badgeDetails[badgeKey];
    if (!info) return;

    document.getElementById('badgeInfoIcon').innerHTML = `<i class="fa-solid ${info.icon}"></i>`;
    document.getElementById('badgeInfoTitle').innerText = info.name;
    document.getElementById('badgeInfoDesc').innerText = info.desc;
    document.getElementById('badgeInfoModal').style.display = 'flex';
};

window.closeBadgeInfoModal = function() {
    document.getElementById('badgeInfoModal').style.display = 'none';
};

// Rozet HTML oluşturucu (Tıklama Özelliği ile)
function renderBadges(badgesArray) {
    if (!badgesArray || badgesArray.length === 0) return '<span style="color: var(--text-muted); font-size: 12px;">Rozet yok</span>';
    
    return badgesArray.map(b => {
        const info = badgeDetails[b];
        if (!info) return '';
        return `<span class="badge-item badge-${b}" onclick="showBadgeInfo('${b}', event)" title="${info.name}"><i class="fa-solid ${info.icon}"></i></span>`;
    }).join('');
}

window.handleRegister = async function(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const discord = document.getElementById('regDiscord').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            username: username,
            discord: discord,
            email: email,
            role: "Vatandaş",
            badges: [],
            createdAt: new Date().toISOString()
        });

        showAuthMessage("Vatandaş kaydınız başarıyla oluşturuldu!", "success");
    } catch (error) {
        showAuthMessage("Kayıt hatası: " + error.message, "error");
    }
};

window.handleLogin = async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showAuthMessage("Giriş başarılı, yönlendiriliyorsunuz...", "success");
    } catch (error) {
        showAuthMessage("E-posta veya şifre hatalı!", "error");
    }
};

window.handleLogout = async function() {
    await signOut(auth);
    window.switchTab('ana-sayfa', window.getNavBtn(0));
};

onAuthStateChanged(auth, async (user) => {
    const authForms = document.getElementById('authForms');
    const citizenProfile = document.getElementById('citizenProfile');
    const adminNavItem = document.getElementById('adminNavItem');
    const vatandasNavBtn = document.getElementById('vatandasNavBtn');

    if (user) {
        authForms.style.display = 'none';
        citizenProfile.style.display = 'block';
        vatandasNavBtn.innerHTML = '<i class="fa-solid fa-user-check"></i> Kimliğim';

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById('profileName').innerText = data.username || "İsimsiz";
            document.getElementById('profileDiscord').innerText = "@" + (data.discord || "Belirtilmemiş");
            document.getElementById('profileEmail').innerText = data.email;
            
            const roleBadge = document.getElementById('profileRole');
            const userRole = data.role || "Vatandaş";
            roleBadge.innerText = userRole;
            roleBadge.className = `role-badge ${userRole}`;

            document.getElementById('profileBadges').innerHTML = renderBadges(data.badges);

            // Sadece Developer, Yönetim ve Founder yönetim panelini görebilir
            if (["Developer", "Yönetim", "Founder"].includes(userRole)) {
                adminNavItem.style.display = 'block';
            } else {
                adminNavItem.style.display = 'none';
            }
        }
    } else {
        authForms.style.display = 'block';
        citizenProfile.style.display = 'none';
        adminNavItem.style.display = 'none';
        vatandasNavBtn.innerHTML = '<i class="fa-solid fa-id-card"></i> Vatandaş Girişi';
    }
});

// Şehirdeki Vatandaşları Listeleme
window.loadCityCitizens = async function() {
    const grid = document.getElementById('cityCitizensGrid');
    grid.innerHTML = '<div class="card" style="text-align: center; grid-column: 1 / -1;"><p style="color: var(--text-muted);">Vatandaşlar yükleniyor...</p></div>';

    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        grid.innerHTML = '';

        if (querySnapshot.empty) {
            grid.innerHTML = '<div class="card" style="text-align: center; grid-column: 1 / -1;"><p style="color: var(--text-muted);">Şehirde henüz kayıtlı vatandaş bulunmuyor.</p></div>';
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const userData = docSnap.data();
            const role = userData.role || "Vatandaş";
            const badgesHtml = renderBadges(userData.badges);
            
            const safeUsername = (userData.username || "İsimsiz").replace(/'/g, "\\'");
            const safeDiscord = (userData.discord || "Bilinmiyor").replace(/'/g, "\\'");
            const safeRole = role;

            const cardHtml = `
                <div class="card city-citizen-card" onclick="openCitizenModal('${safeUsername}', '${safeDiscord}', '${safeRole}', '${encodeURIComponent(JSON.stringify(userData.badges || []))}')">
                    <div class="city-avatar-icon"><i class="fa-solid fa-user-shield"></i></div>
                    <h3 style="color: #fff; font-size: 18px; margin-bottom: 4px;">${userData.username || "İsimsiz"}</h3>
                    <p style="color: #5865F2; font-size: 13px; font-weight: 600; margin-bottom: 8px;">@${userData.discord || "Belirtilmemiş"}</p>
                    <div style="margin-bottom: 8px;">${badgesHtml}</div>
                    <span class="role-badge ${role}">${role}</span>
                </div>
            `;
            grid.innerHTML += cardHtml;
        });
    } catch (error) {
        grid.innerHTML = `<div class="card" style="text-align: center; grid-column: 1 / -1;"><p style="color: #ef4444;">Vatandaşlar yüklenirken hata oluştu.</p></div>`;
    }
};

window.openCitizenModal = function(username, discord, role, badgesEncoded) {
    document.getElementById('modalName').innerText = username;
    document.getElementById('modalDiscord').innerText = "@" + discord;
    
    const roleSpan = document.getElementById('modalRole');
    roleSpan.innerText = role;
    roleSpan.className = `role-badge ${role}`;

    try {
        const badges = JSON.parse(decodeURIComponent(badgesEncoded));
        document.getElementById('modalBadges').innerHTML = renderBadges(badges);
    } catch(e) {
        document.getElementById('modalBadges').innerHTML = '';
    }

    const cleanDiscord = discord.replace('@', '').trim();
    document.getElementById('modalDiscordBtn').href = `https://discord.com/users/${cleanDiscord}`;

    document.getElementById('citizenModal').style.display = 'flex';
};

window.closeCitizenModal = function() {
    document.getElementById('citizenModal').style.display = 'none';
};

window.loadAllUsers = async function() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Üyeler getiriliyor...</td></tr>';

    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        tbody.innerHTML = '';

        querySnapshot.forEach((docSnap) => {
            const userData = docSnap.data();
            const uid = docSnap.id;
            const currentRole = userData.role || "Vatandaş";
            const userBadges = userData.badges || [];

            const row = `
                <tr>
                    <td><strong>${userData.username || "İsimsiz"}</strong></td>
                    <td style="color: #5865F2; font-weight: 600;">@${userData.discord || "-"}</td>
                    <td>
                        <select class="role-select" onchange="updateUserRole('${uid}', this.value)">
                            <option value="Vatandaş" ${currentRole === 'Vatandaş' ? 'selected' : ''}>Vatandaş</option>
                            <option value="Moderatör" ${currentRole === 'Moderatör' ? 'selected' : ''}>Moderatör</option>
                            <option value="Admin" ${currentRole === 'Admin' ? 'selected' : ''}>Admin</option>
                            <option value="Developer" ${currentRole === 'Developer' ? 'selected' : ''}>Developer</option>
                            <option value="Yönetim" ${currentRole === 'Yönetim' ? 'selected' : ''}>Yönetim</option>
                            <option value="Founder" ${currentRole === 'Founder' ? 'selected' : ''}>Founder</option>
                        </select>
                    </td>
                    <td>
                        <div class="badge-checkboxes">
                            <label><input type="checkbox" ${userBadges.includes('dev') ? 'checked' : ''} onchange="toggleUserBadge('${uid}', 'dev', this.checked)"> Dev</label>
                            <label><input type="checkbox" ${userBadges.includes('admin') ? 'checked' : ''} onchange="toggleUserBadge('${uid}', 'admin', this.checked)"> Admin</label>
                            <label><input type="checkbox" ${userBadges.includes('founder') ? 'checked' : ''} onchange="toggleUserBadge('${uid}', 'founder', this.checked)"> Founder</label>
                            <label><input type="checkbox" ${userBadges.includes('vip') ? 'checked' : ''} onchange="toggleUserBadge('${uid}', 'vip', this.checked)"> VIP</label>
                            <label><input type="checkbox" ${userBadges.includes('donater') ? 'checked' : ''} onchange="toggleUserBadge('${uid}', 'donater', this.checked)"> Donater</label>
                            <label><input type="checkbox" ${userBadges.includes('booster') ? 'checked' : ''} onchange="toggleUserBadge('${uid}', 'booster', this.checked)"> Booster</label>
                            <label><input type="checkbox" ${userBadges.includes('veteran') ? 'checked' : ''} onchange="toggleUserBadge('${uid}', 'veteran', this.checked)"> Veteran</label>
                            <label><input type="checkbox" ${userBadges.includes('designer') ? 'checked' : ''} onchange="toggleUserBadge('${uid}', 'designer', this.checked)"> Designer</label>
                        </div>
                    </td>
                    <td>
                        <button class="action-btn btn-delete-user" onclick="deleteUserRecord('${uid}')">Kaydı Sil</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="color: #ef4444;">Hata: ${error.message}</td></tr>`;
    }
};

window.updateUserRole = async function(uid, newRole) {
    try {
        await updateDoc(doc(db, "users", uid), { role: newRole });
        alert("Yetki başarıyla güncellendi!");
        window.loadAllUsers();
    } catch (error) {
        alert("Yetki güncellenemedi: " + error.message);
    }
};

window.toggleUserBadge = async function(uid, badgeKey, isChecked) {
    try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) return;

        let badges = userDoc.data().badges || [];
        if (isChecked) {
            if (!badges.includes(badgeKey)) badges.push(badgeKey);
        } else {
            badges = badges.filter(b => b !== badgeKey);
        }

        await updateDoc(userRef, { badges: badges });
    } catch (error) {
        alert("Rozet güncellenemedi: " + error.message);
    }
};

window.deleteUserRecord = async function(uid) {
    if (confirm("Bu vatandaşın sistem kaydını silmek istediğinize emin misiniz?")) {
        try {
            await deleteDoc(doc(db, "users", uid));
            window.loadAllUsers();
            window.loadCityCitizens();
        } catch (error) {
            alert("Silme hatası: " + error.message);
        }
    }
};
