
document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll(".page");
    const navLinks = document.querySelectorAll(".nav-link");
    const navMenu = document.getElementById("navLinks");
    const menuToggle = document.getElementById("menuToggle");

    function openPage(pageId) {
        const target = document.getElementById(pageId);
        if (!target) return;

        pages.forEach(page => {
            page.classList.remove("active");
        });

        target.classList.add("active");

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.page === pageId
            );
        });

        navMenu.classList.remove("open");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        menuToggle.setAttribute("aria-expanded", "false");

        history.replaceState(null, "", "#" + pageId);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // MENÜ VE SAYFA GEÇİŞLERİ
    document.querySelectorAll("[data-page]").forEach(element => {
        element.addEventListener("click", event => {
            event.preventDefault();
            openPage(element.dataset.page);
        });
    });

    // SAYFA İÇİ BUTONLAR
    document.querySelectorAll("[data-go]").forEach(button => {
        button.addEventListener("click", () => {
            openPage(button.dataset.go);
        });
    });

    // MOBİL MENÜ
    menuToggle.addEventListener("click", () => {
        const opened = navMenu.classList.toggle("open");

        menuToggle.innerHTML = opened
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

        menuToggle.setAttribute("aria-expanded", opened);
    });

    // DOĞRUDAN SAYFA LİNKİYLE AÇILIŞ
    function loadInitialPage() {
        const pageId = location.hash.replace("#", "");

        if (pageId && document.getElementById(pageId)) {
            openPage(pageId);
        } else {
            openPage("home");
        }
    }

    loadInitialPage();

    // GERİ / İLERİ TUŞLARI
    window.addEventListener("popstate", () => {
        loadInitialPage();
    });

});
