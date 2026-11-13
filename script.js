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

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        if (intro) {
            intro.style.opacity = '0';
            intro.style.visibility = 'hidden';
        }
    }, 1500);
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

window.handleRegister = async function(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            role: "user",
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
            document.getElementById('profileName').innerText = data.username;
            document.getElementById('profileEmail').innerText = data.email;
            
            const roleBadge = document.getElementById('profileRole');
            if (data.role === 'admin') {
                roleBadge.innerText = "Yönetici (Admin)";
                roleBadge.classList.add('admin');
                adminNavItem.style.display = 'block';
            } else {
                roleBadge.innerText = "Vatandaş";
                roleBadge.classList.remove('admin');
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

window.loadAllUsers = async function() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Üyeler getiriliyor...</td></tr>';

    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        tbody.innerHTML = '';

        querySnapshot.forEach((docSnap) => {
            const userData = docSnap.data();
            const uid = docSnap.id;
            const isAdmin = userData.role === 'admin';

            const row = `
                <tr>
                    <td><strong>${userData.username}</strong></td>
                    <td style="color: var(--text-muted);">${userData.email}</td>
                    <td>
                        <span class="role-badge ${isAdmin ? 'admin' : ''}">
                            ${isAdmin ? 'Admin' : 'Vatandaş'}
                        </span>
                    </td>
                    <td>
                        ${!isAdmin 
                            ? `<button class="action-btn btn-make-admin" onclick="changeUserRole('${uid}', 'admin')">Admin Yap</button>` 
                            : `<button class="action-btn btn-make-user" onclick="changeUserRole('${uid}', 'user')">Yetkiyi Al</button>`
                        }
                        <button class="action-btn btn-delete-user" onclick="deleteUserRecord('${uid}')">Kaydı Sil</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" style="color: #ef4444;">Hata: ${error.message}</td></tr>`;
    }
};

window.changeUserRole = async function(uid, newRole) {
    try {
        await updateDoc(doc(db, "users", uid), { role: newRole });
        window.loadAllUsers();
    } catch (error) {
        alert("Yetki güncellenemedi: " + error.message);
    }
};

window.deleteUserRecord = async function(uid) {
    if (confirm("Bu vatandaşın sistem kaydını silmek istediğinize emin misiniz?")) {
        try {
            await deleteDoc(doc(db, "users", uid));
            window.loadAllUsers();
        } catch (error) {
            alert("Silme hatası: " + error.message);
        }
    }
};
