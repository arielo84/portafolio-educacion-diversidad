// =========================================
// Tema (Dark/Light Mode)
// =========================================
const themeBtn = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
htmlElement.setAttribute("data-theme", savedTheme);
updateButtonIcon(savedTheme);

themeBtn.addEventListener("click", () => {
  const newTheme =
    htmlElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("portfolio-theme", newTheme);
  updateButtonIcon(newTheme);
});

function updateButtonIcon(theme) {
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

/* =========================================
   Animaciones al hacer Scroll (Intersection Observer)
   ========================================= */
const hiddenElements = document.querySelectorAll(".hidden-scroll");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show-scroll");
      }
    });
  },
  { threshold: 0.1 },
);

hiddenElements.forEach((el) => observer.observe(el));

/* =========================================
   Lógica del Visor de PDF (Modal)
   ========================================= */
const pdfModal = document.getElementById("pdf-modal");
const pdfViewer = document.getElementById("pdf-viewer");
const closeModal = document.querySelector(".close-modal");

// FIX: bloqueo de scroll robusto para mobile (evita el "rubber-band scroll"
// de iOS que dejaba pasar el gesto de scroll al fondo mientras el modal
// estaba abierto, y que hacía ver la grilla de tarjetas desplazada/rota)
let scrollPosition = 0;

const lockBodyScroll = () => {
  scrollPosition = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
};

const unlockBodyScroll = () => {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollPosition);
};

document.addEventListener("click", (e) => {
  // Verificamos si el clic fue en un botón de PDF
  if (e.target?.classList.contains("view-pdf-btn")) {
    const pdfSrc = e.target.getAttribute("data-pdf");
    if (pdfSrc) {
      // 1. Limpieza de memoria y estado antes de cargar
      pdfViewer.src = "";
      // 2. Asignación del nuevo recurso
      pdfViewer.src = pdfSrc;
      // 3. Mostrar modal
      pdfModal.style.display = "flex";
      lockBodyScroll();
    }
  }
});

// Cerramos el modal
const closePdfView = () => {
  pdfModal.style.display = "none";
  pdfViewer.src = ""; // Limpieza para liberar recursos
  unlockBodyScroll();
};

closeModal?.addEventListener("click", closePdfView);

window.addEventListener("click", (e) => {
  if (e.target === pdfModal) closePdfView();
});

/* =========================================
   Lógica del Menú Hamburguesa
   ========================================= */
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

/* =========================================
   Botón para volver al inicio
   ========================================= */
const backToTop = document.querySelector(".back-to-top");

const updateBackToTopVisibility = () => {
  backToTop?.classList.toggle("visible", window.scrollY > 450);
};

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

// Alternar menú
hamburger.addEventListener("click", (e) => {
  e.stopPropagation(); // Evita que el clic se propague al document
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("open");
});

// Cerrar al hacer clic en un link (UX profesional)
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("active");
    hamburger.classList.remove("open");
  }
});

// Cerrar al hacer clic fuera del menú
document.addEventListener("click", (e) => {
  if (
    navLinks.classList.contains("active") &&
    !navLinks.contains(e.target) &&
    e.target !== hamburger
  ) {
    navLinks.classList.remove("active");
    hamburger.classList.remove("open");
  }
});

// --- CORRECCIÓN DE EMERGENCIA: Forzar visibilidad ---
window.addEventListener("load", () => {
  setTimeout(() => {
    const hiddens = document.querySelectorAll(".hidden-scroll");
    hiddens.forEach((el) => {
      if (!el.classList.contains("show-scroll")) {
        el.classList.add("show-scroll");
      }
    });
  }, 500);
});
