
document.addEventListener("DOMContentLoaded", () => {

    // SAYFA GEÇİŞ SİSTEMİ
    const pages = document.querySelectorAll(".page");
    const navLinks = document.querySelectorAll(".nav-link");
    const navMenu = document.getElementById("navLinks");
    const menuToggle = document.getElementById("menuToggle");

    function openPage(pageId) {
        const target = document.getElementById(pageId);
        if (!target) return;

        pages.forEach(page => page.classList.remove("active"));
        target.classList.add("active");

        navLinks.forEach(link => {
            link.classList.toggle("active", link.dataset.page === pageId);
        });

        navMenu.classList.remove("open");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", "#" + pageId);
    }

    document.querySelectorAll("[data-page]").forEach(element => {
        element.addEventListener("click", event => {
            event.preventDefault();
            openPage(element.dataset.page);
        });
    });

    document.querySelectorAll("[data-go]").forEach(button => {
        button.addEventListener("click", () => {
            openPage(button.dataset.go);
        });
    });

    // MOBİL MENÜ
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");

        const isOpen = navMenu.classList.contains("open");

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // SAYFA YENİLENDİĞİNDE HASH KONTROLÜ
    const initialPage = location.hash.substring(1);
    if (initialPage && document.getElementById(initialPage)) {
        openPage(initialPage);
    }

    // İSİM ÖNERİCİ
    const maleNames = [
        "Barış", "Mert", "Yavuz", "Emre", "Kaan",
        "Burak", "Serkan", "Oğuz", "Arda", "Eren",
        "Volkan", "Deniz", "Kerem", "Alp", "Tuna",
        "Berk", "Furkan", "Samet", "Onur", "Batuhan"
    ];

    const femaleNames = [
        "Selin", "Zeynep", "Elif", "Buse", "Merve",
        "Aslı", "Derin", "Ece", "Melisa", "Ceren",
        "Simge", "İrem", "Duru", "Yağmur", "Ada",
        "Azra", "Defne", "Sude", "Lara", "Nehir"
    ];

    const surnames = [
        "Karadağ", "Sancak", "Yılmaz", "Kaya",
        "Aydın", "Demir", "Çelik", "Şahin",
        "Koç", "Yıldırım", "Korkmaz", "Arslan",
        "Özdemir", "Kara", "Aksoy", "Polat",
        "Güneş", "Doğan", "Aslan", "Erdoğan"
    ];

    function generateName(gender) {
        const names = gender === "male" ? maleNames : femaleNames;

        const first = names[Math.floor(Math.random() * names.length)];
        const last = surnames[Math.floor(Math.random() * surnames.length)];

        document.getElementById("nameDisplay").textContent =
            first + " " + last;
    }

    document.getElementById("maleButton").addEventListener("click", () => {
        generateName("male");
    });

    document.getElementById("femaleButton").addEventListener("click", () => {
        generateName("female");
    });

    // YETKİLİ EKİBİ
    const staff = [
        {
            name: "Samet",
            role: "Founder",
            icon: "fa-crown",
            id: "1160622125950972045"
        },
        {
            name: "Bedirhan",
            role: "Kurucu Temsilcisi",
            icon: "fa-user-gear",
            id: "1167462745524928671"
        },
        {
            name: "Buğra",
            role: "Genel Yönetici",
            icon: "fa-user-gear",
            id: "1193120970026778655"
        },
        {
            name: "Tuna",
            role: "Genel Yönetici Yardımcısı & Site Geliştiricisi",
            icon: "fa-code",
            id: "1080897669431574609"
        },
        {
            name: "Furkan",
            role: "Genel Yönetici Yardımcısı",
            icon: "fa-user-shield",
            id: "1519372636596080723"
        },
        {
            name: "Kerem",
            role: "Deneme Yönetim Ekibi",
            icon: "fa-user-check",
            id: "1257050851114090617"
        },
        {
            name: "F10",
            role: "Modeller",
            icon: "fa-cube",
            id: null
        }
    ];

    const staffGrid = document.getElementById("staffGrid");

    staff.forEach(member => {
        const card = document.createElement("a");

        card.className = "staff-card";

        if (member.id) {
            card.href = "https://discord.com/users/" + member.id;
            card.target = "_blank";
            card.rel = "noopener noreferrer";
        }

        card.innerHTML = `
            <div class="staff-avatar">
                <i class="fa-solid ${member.icon}"></i>
            </div>
            <h3>${member.name}</h3>
            <p>${member.role}</p>
        `;

        staffGrid.appendChild(card);
    });

    // SOSYAL MEDYA
    const socials = [
        {
            name: "Samet",
            username: "@prof.dr.slayer",
            platform: "TikTok",
            icon: "fa-tiktok",
            url: "https://www.tiktok.com/@prof.dr.slayer"
        },
        {
            name: "İstanbul Roleplay",
            username: "@edirnebelediyesi22",
            platform: "TikTok",
            icon: "fa-tiktok",
            url: "https://www.tiktok.com/@edirnebelediyesi22"
        },
        {
            name: "İstanbul Roleplay",
            username: "@edirnebelediyesi55",
            platform: "TikTok",
            icon: "fa-tiktok",
            url: "https://www.tiktok.com/@edirnebelediyesi55"
        },
        {
            name: "İstanbul Roleplay",
            username: "@roblox_istanbulrp",
            platform: "Instagram",
            icon: "fa-instagram",
            url: "https://www.instagram.com/roblox_istanbulrp/"
        },
        {
            name: "Furkan",
            username: "@edirnerp_2026",
            platform: "Instagram",
            icon: "fa-instagram",
            url: "https://www.instagram.com/edirnerp_2026/"
        }
    ];

    const socialGrid = document.getElementById("socialGrid");

    socials.forEach(item => {
        const card = document.createElement("a");

        card.className = "social-card";
        card.href = item.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";

        card.innerHTML = `
            <i class="fa-brands ${item.icon}"></i>
            <div>
                <h3>${item.name}</h3>
                <p>${item.platform} · ${item.username}</p>
            </div>
        `;

        socialGrid.appendChild(card);
    });

    // İLETİŞİM
    const contacts = [
        {
            name: "Bedirhan",
            role: "Destek",
            email: "bedx69@istanbul-roleplay.work.gd"
        },
        {
            name: "Tuna",
            role: "Geliştirici",
            email: "tuna@istanbul-roleplay.work.gd"
        },
        {
            name: "Buğra",
            role: "Yönetim",
            email: "bugra@istanbul-roleplay.work.gd"
        }
    ];

    const contactGrid = document.getElementById("contactGrid");

    contacts.forEach(person => {
        const card = document.createElement("a");

        card.className = "social-card";
        card.href = "mailto:" + person.email;

        card.innerHTML = `
            <i class="fa-solid fa-envelope"></i>
            <div>
                <h3>${person.name} · ${person.role}</h3>
                <p>${person.email}</p>
            </div>
        `;

        contactGrid.appendChild(card);
    });

    // VATANDAŞ PANELİ
    document.getElementById("citizenButton").addEventListener("click", () => {
        document.getElementById("citizenMessage").textContent =
            "Vatandaş sistemi henüz geliştirme aşamasında. Açılış duyurularını takip et!";
    });

});
