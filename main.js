document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. LIGHTBOX GALLERY FUNCTIONALITY
  // ==========================================
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.querySelector(".lightbox-close");
  const triggers = document.querySelectorAll(".lightbox-trigger");

  if (lightboxModal && triggers.length > 0) {
    triggers.forEach(img => {
      img.addEventListener("click", () => {
        lightboxModal.classList.add("active");
        lightboxModal.setAttribute("aria-hidden", "false");
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.getAttribute("data-caption") || img.alt;
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove("active");
      lightboxModal.setAttribute("aria-hidden", "true");
    };

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // ==========================================
  // 2. DYNAMIC SEARCH & FILTERING
  // ==========================================
  const searchInput = document.getElementById("serviceSearchInput");
  const serviceCards = document.querySelectorAll(".service-card");

  if (searchInput && serviceCards.length > 0) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      serviceCards.forEach(card => {
        const titleData = card.getAttribute("data-title") || "";
        const contentText = card.textContent.toLowerCase();

        if (titleData.includes(query) || contentText.includes(query)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  }

  // ==========================================
  // 3. INTERACTIVE ACCORDIONS
  // ==========================================
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const isOpen = content.classList.contains("open");

      // Close all accordions
      document.querySelectorAll(".accordion-content").forEach(c => {
        c.classList.remove("open");
        c.style.maxHeight = null;
      });
      document.querySelectorAll(".accordion-header").forEach(h => h.classList.remove("active"));

      // Toggle current accordion
      if (!isOpen) {
        header.classList.add("active");
        content.classList.add("open");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // ==========================================
  // 4. LEAFLET INTERACTIVE MAP INTEGRATION
  // ==========================================
  const mapElement = document.getElementById("map");
  if (mapElement && typeof L !== "undefined") {
    // Co-ordinates for Pretoria / Johannesburg construction office center point
    const officeLocation = [-25.7479, 28.2293];

    const map = L.map("map").setView(officeLocation, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker(officeLocation).addTo(map)
      .bindPopup("<b>Tenchi Constructions HQ</b><br>123 Building Avenue, Suite 400")
      .openPopup();
  }
});