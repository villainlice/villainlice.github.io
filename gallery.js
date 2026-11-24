(function () {
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightboxImage");
  var closeBtn = document.getElementById("closeLightbox");
  if (!lightbox || !lightboxImage || !closeBtn) return;

  var labels = {
    tr: ["Fotoğrafı büyüt", "Kapat"],
    en: ["Enlarge photo", "Close"],
    de: ["Foto vergrößern", "Schließen"],
    ru: ["Увеличить фото", "Закрыть"],
    uk: ["Збільшити фото", "Закрити"],
    ar: ["تكبير الصورة", "إغلاق"]
  };
  var lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  var t = labels[lang] || labels.en;
  var lastFocus = null;

  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", t[0]);
  closeBtn.setAttribute("role", "button");
  closeBtn.setAttribute("tabindex", "0");
  closeBtn.setAttribute("aria-label", t[1]);

  function open(img) {
    lastFocus = document.activeElement;
    lightboxImage.src = img.getAttribute("src") || img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add("active");
    closeBtn.focus();
  }
  function close() {
    lightbox.classList.remove("active");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll(".gallery img").forEach(function (img) {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.addEventListener("click", function () { open(this); });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(this); }
    });
  });
  closeBtn.addEventListener("click", close);
  closeBtn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); close(); }
  });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") { e.preventDefault(); closeBtn.focus(); } // keep focus inside the dialog
  });
})();
