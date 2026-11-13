
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
    });
});

document.getElementById("panelButton").addEventListener("click", () => {
    document.getElementById("panelMessage").textContent =
        "Vatandaş paneli hazırlık aşamasındadır. Açılış tarihi duyurulacaktır.";
});
