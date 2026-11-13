
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", opened);
});

nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

document.getElementById("panelButton").addEventListener("click", () => {
    document.getElementById("panelMessage").textContent =
        "Vatandaş sistemi geliştirme aşamasında. Açılış duyurularını takip et!";
});
