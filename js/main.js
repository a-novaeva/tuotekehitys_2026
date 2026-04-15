if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

// REVEAL + STAGGER
const revealElements = document.querySelectorAll(".reveal, .line-reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((el) => revealObserver.observe(el));

const staggerGroups = document.querySelectorAll("[data-stagger]");

const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll(".stagger-item");
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("visible");
        }, index * 120);
      });
    }
  });
}, { threshold: 0.15 });

staggerGroups.forEach((group) => staggerObserver.observe(group));

// MOBILE MENU
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

// LIGHTBOX
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
const galleryLinks = document.querySelectorAll(".gallery-link");

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  lightboxImg.alt = "";
  document.body.classList.remove("no-scroll");
}

galleryLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const img = link.querySelector("img");
    openLightbox(link.href, img ? img.alt : "");
  });
});

if (lightbox) {
  lightbox.addEventListener("click", closeLightbox);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});

// CLOSE MODAL CLEANUP
const modalClose = document.querySelector(".modal-close");

if (modalClose) {
  modalClose.addEventListener("click", () => {
    const form = document.getElementById("contact-form");
    const successBox = document.querySelector("[data-fs-success]");
    const errorBox = document.querySelector("[data-fs-error]");

    if (form) {
      form.reset();
    }

    document
      .querySelectorAll("#contact-form input, #contact-form textarea")
      .forEach((field) => {
        field.removeAttribute("aria-invalid");
      });

    document
      .querySelectorAll("[data-fs-error]")
      .forEach((field) => {
        if (field !== errorBox && field !== successBox) {
          field.textContent = "";
        }
      });

    if (successBox) {
      successBox.textContent = "";
    }

    if (errorBox) {
      errorBox.textContent = "";
    }
  });
}

// HOME GALLERY SLIDER
const galleryTrack = document.getElementById("galleryTrack");
const leftArrow = document.querySelector(".gallery-arrow-left");
const rightArrow = document.querySelector(".gallery-arrow-right");
const dots = document.querySelectorAll(".gallery-pictures .dot");
const gallerySlider = document.getElementById("gallerySlider");

let currentPage = 0;
let galleryInterval;

function getItemsPerPage() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 900) return 2;
  return 4;
}

function updateGallerySlider() {
  if (!galleryTrack || !leftArrow || !rightArrow) return;

  const items = document.querySelectorAll(".gallery-item");
  if (!items.length) return;

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(items.length / itemsPerPage);

  if (currentPage >= totalPages) currentPage = totalPages - 1;
  if (currentPage < 0) currentPage = 0;

  const itemWidth = items[0].offsetWidth;
  const gap = 24;
  const moveAmount = currentPage * (itemWidth + gap) * itemsPerPage;

  galleryTrack.style.transform = `translateX(-${moveAmount}px)`;

  leftArrow.disabled = currentPage === 0;
  rightArrow.disabled = currentPage === totalPages - 1;

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentPage);
    dot.style.display = index < totalPages ? "inline-block" : "none";
  });
}

function nextGalleryPage() {
  const items = document.querySelectorAll(".gallery-item");
  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(items.length / itemsPerPage);

  currentPage = (currentPage + 1) % totalPages;
  updateGallerySlider();
}

function startGalleryAutoplay() {
  if (!galleryTrack) return;
  stopGalleryAutoplay();
  galleryInterval = setInterval(nextGalleryPage, 3500);
}

function stopGalleryAutoplay() {
  clearInterval(galleryInterval);
}

if (leftArrow && rightArrow) {
  leftArrow.addEventListener("click", () => {
    currentPage--;
    updateGallerySlider();
    startGalleryAutoplay();
  });

  rightArrow.addEventListener("click", () => {
    currentPage++;
    updateGallerySlider();
    startGalleryAutoplay();
  });
}

if (gallerySlider) {
  gallerySlider.addEventListener("mouseenter", stopGalleryAutoplay);
  gallerySlider.addEventListener("mouseleave", startGalleryAutoplay);
}

// REFERENCES LOGO SLIDER
const referencesLogoTrack = document.getElementById("referencesLogoTrack");
const referencesLogoLeftArrow = document.querySelector(".references-logo-arrow-left");
const referencesLogoRightArrow = document.querySelector(".references-logo-arrow-right");
const referencesLogoDots = document.querySelectorAll(".references-logo-dot");
const referencesLogoSlider = document.getElementById("referencesLogoSlider");

let referencesLogoPage = 0;
let referencesLogoInterval;

function getReferencesLogoItemsPerPage() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function updateReferencesLogoSlider() {
  if (!referencesLogoTrack || !referencesLogoLeftArrow || !referencesLogoRightArrow) return;

  const items = document.querySelectorAll(".references-logo-item");
  if (!items.length) return;

  const itemsPerPage = getReferencesLogoItemsPerPage();
  const totalPages = Math.ceil(items.length / itemsPerPage);

  if (referencesLogoPage >= totalPages) referencesLogoPage = totalPages - 1;
  if (referencesLogoPage < 0) referencesLogoPage = 0;

  const itemWidth = items[0].offsetWidth;
  const gap = 20;
  const moveAmount = referencesLogoPage * (itemWidth + gap) * itemsPerPage;

  referencesLogoTrack.style.transform = `translateX(-${moveAmount}px)`;

  referencesLogoLeftArrow.disabled = referencesLogoPage === 0;
  referencesLogoRightArrow.disabled = referencesLogoPage === totalPages - 1;

  referencesLogoDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === referencesLogoPage);
    dot.style.display = index < totalPages ? "inline-block" : "none";
  });
}

function nextReferencesLogoPage() {
  const items = document.querySelectorAll(".references-logo-item");
  const itemsPerPage = getReferencesLogoItemsPerPage();
  const totalPages = Math.ceil(items.length / itemsPerPage);

  referencesLogoPage = (referencesLogoPage + 1) % totalPages;
  updateReferencesLogoSlider();
}

function startReferencesLogoAutoplay() {
  if (!referencesLogoTrack) return;
  stopReferencesLogoAutoplay();
  referencesLogoInterval = setInterval(nextReferencesLogoPage, 3000);
}

function stopReferencesLogoAutoplay() {
  clearInterval(referencesLogoInterval);
}

if (referencesLogoLeftArrow && referencesLogoRightArrow) {
  referencesLogoLeftArrow.addEventListener("click", () => {
    referencesLogoPage--;
    updateReferencesLogoSlider();
    startReferencesLogoAutoplay();
  });

  referencesLogoRightArrow.addEventListener("click", () => {
    referencesLogoPage++;
    updateReferencesLogoSlider();
    startReferencesLogoAutoplay();
  });
}

if (referencesLogoSlider) {
  referencesLogoSlider.addEventListener("mouseenter", stopReferencesLogoAutoplay);
  referencesLogoSlider.addEventListener("mouseleave", startReferencesLogoAutoplay);
}

// SHARED LOAD + RESIZE
window.addEventListener("resize", () => {
  updateGallerySlider();
  updateReferencesLogoSlider();
});

window.addEventListener("load", () => {
  updateGallerySlider();
  updateReferencesLogoSlider();
  startGalleryAutoplay();
  startReferencesLogoAutoplay();
});