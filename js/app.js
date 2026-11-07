// Dream Home Real Estate - Indore Main Application JS
// Author: Antigravity | Business Phone: 8251009855

document.addEventListener("DOMContentLoaded", () => {
  // App State
  let currentLanguage = localStorage.getItem("dh_lang") || "en";
  let activeCategory = "all";
  let activeLocation = "all";
  let activeBudget = "all";
  let searchQuery = "";
  let currentProperties = getStoredProperties();

  // DOM Elements
  const propertiesContainer = document.getElementById("propertiesGrid");
  const propertyCountBadge = document.getElementById("propertyCountBadge");
  const categoryTabs = document.querySelectorAll(".cat-tab-btn");
  const heroCatPills = document.querySelectorAll(".hero-cat-pill");
  const locationSelect = document.getElementById("locationFilter");
  const budgetSelect = document.getElementById("budgetFilter");
  const searchInput = document.getElementById("propertySearchInput");
  const resetFilterBtn = document.getElementById("btnResetFilters");
  const langToggleBtn = document.getElementById("langToggleBtn");

  // Initialize
  initLanguage(currentLanguage);
  renderProperties();
  initEmiCalculator();
  initEventListeners();
  setupAdminPanel();

  // ========================================================================
  // Render Properties
  // ========================================================================
  function renderProperties() {
    currentProperties = getStoredProperties();

    let filtered = currentProperties.filter(prop => {
      // Category filter
      if (activeCategory !== "all" && prop.category !== activeCategory) {
        return false;
      }
      // Location filter
      if (activeLocation !== "all") {
        const locLower = (prop.location + " " + (prop.locationHi || "")).toLowerCase();
        if (!locLower.includes(activeLocation.toLowerCase())) {
          return false;
        }
      }
      // Budget filter
      if (activeBudget !== "all") {
        const price = prop.priceNumeric || 0;
        if (activeBudget === "under40" && price > 4000000) return false;
        if (activeBudget === "40to80" && (price < 4000000 || price > 8000000)) return false;
        if (activeBudget === "80to150" && (price < 8000000 || price > 15000000)) return false;
        if (activeBudget === "above150" && price < 15000000) return false;
      }
      // Search input
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const text = (prop.title + " " + (prop.titleHi || "") + " " + prop.location + " " + prop.description).toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });

    if (propertyCountBadge) {
      propertyCountBadge.textContent = `${filtered.length} Properties in Indore`;
    }

    if (!propertiesContainer) return;

    if (filtered.length === 0) {
      propertiesContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background: #ffffff; border-radius: 16px; border: 1px dashed #cbd5e1;">
          <div style="font-size: 40px; margin-bottom: 12px;">🏡</div>
          <h3 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">No matching properties found in Indore</h3>
          <p style="color: #64748b; font-size: 14px; max-width: 480px; margin: 0 auto 20px auto;">Try clearing filters or search for Super Corridor, Vijay Nagar, AB Bypass, Nipania, or Rau.</p>
          <button id="emptyResetBtn" class="btn-action-wa-big" style="display: inline-flex; margin: 0 auto; background: #1b8354;">Reset All Filters</button>
        </div>
      `;
      const emptyReset = document.getElementById("emptyResetBtn");
      if (emptyReset) {
        emptyReset.addEventListener("click", resetAllFilters);
      }
      return;
    }

    propertiesContainer.innerHTML = filtered.map(prop => createPropertyCardHTML(prop)).join("");

    // Attach card event listeners
    attachCardEvents();
  }

  function createPropertyCardHTML(prop) {
    const isHi = currentLanguage === "hi";
    const title = (isHi && prop.titleHi) ? prop.titleHi : prop.title;
    const location = (isHi && prop.locationHi) ? prop.locationHi : prop.location;
    const categoryName = (isHi && prop.categoryNameHi) ? prop.categoryNameHi : prop.categoryName;

    // Badges
    let badgeClass = "badge-featured";
    if (prop.badgeType === "hot") badgeClass = "badge-hot";
    if (prop.badgeType === "new") badgeClass = "badge-new";

    // WhatsApp Enquiry Message
    const waText = encodeURIComponent(
      `Hello Dream Home Real Estate! I am interested in:\n\n*${prop.title}*\n📍 Location: ${prop.location}\n💰 Price: ${prop.price}\n\nPlease share more photos, brochure and site visit details.`
    );
    const waUrl = `https://wa.me/918251009855?text=${waText}`;

    return `
      <div class="property-card" data-id="${prop.id}">
        <div class="prop-img-wrapper">
          <img src="${prop.image}" alt="${title}" loading="lazy" onerror="this.src='assets/images/category_houses.jpg'">
          <span class="prop-status-badge ${badgeClass}">${prop.status || "Verified"}</span>
          <span class="prop-category-tag">${categoryName}</span>
          <span class="prop-price-tag">${prop.price}</span>
        </div>
        <div class="property-card-content">
          <h3 class="prop-title">${title}</h3>
          <div class="prop-location">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>${location}</span>
          </div>

          <div class="prop-specs-row">
            <div class="prop-spec-item">
              <span>📐 ${prop.area}</span>
            </div>
            <div class="prop-spec-item">
              <span>🧭 ${prop.facing || "Vastu Compliant"}</span>
            </div>
          </div>

          <div class="prop-rera-tag">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            <span>${prop.reraNo || "Clear Title Verified"}</span>
          </div>

          <div class="prop-action-buttons">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-prop-wa" title="Instant WhatsApp Enquiry">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <a href="tel:8251009855" class="btn-prop-call" title="Call Dream Home">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>Call Now</span>
            </a>
          </div>

          <div class="prop-secondary-actions">
            <button class="btn-book-visit-quick" data-proptitle="${prop.title}">
              📅 Book Visit
            </button>
            <button class="btn-view-details" data-propid="${prop.id}">
              ℹ️ Details
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function attachCardEvents() {
    // Book Visit quick button
    document.querySelectorAll(".btn-book-visit-quick").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const propTitle = e.currentTarget.dataset.proptitle;
        openBookingModal(propTitle);
      });
    });

    // View Details button
    document.querySelectorAll(".btn-view-details").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const propId = e.currentTarget.dataset.propid;
        openPropertyDetailsModal(propId);
      });
    });
  }

  // ========================================================================
  // Filter and Category Handlers
  // ========================================================================
  function initEventListeners() {
    // Category Tabs in Listings
    categoryTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        categoryTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeCategory = tab.dataset.category;
        renderProperties();
      });
    });

    // Hero Category Pills
    heroCatPills.forEach(pill => {
      pill.addEventListener("click", () => {
        const cat = pill.dataset.category;
        activeCategory = cat;
        // sync tabs
        categoryTabs.forEach(t => {
          if (t.dataset.category === cat) t.classList.add("active");
          else t.classList.remove("active");
        });
        renderProperties();
        // Scroll to listings section
        const sec = document.getElementById("property-listings");
        if (sec) sec.scrollIntoView({ behavior: "smooth" });
      });
    });

    // Category Cards in "Our Property Categories" section
    document.querySelectorAll(".category-card").forEach(card => {
      card.addEventListener("click", (e) => {
        const cat = card.dataset.category;
        if (cat) {
          activeCategory = cat;
          categoryTabs.forEach(t => {
            if (t.dataset.category === cat) t.classList.add("active");
            else t.classList.remove("active");
          });
          renderProperties();
          const sec = document.getElementById("property-listings");
          if (sec) sec.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Location Select
    if (locationSelect) {
      locationSelect.addEventListener("change", (e) => {
        activeLocation = e.target.value;
        renderProperties();
      });
    }

    // Budget Select
    if (budgetSelect) {
      budgetSelect.addEventListener("change", (e) => {
        activeBudget = e.target.value;
        renderProperties();
      });
    }

    // Search Input
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderProperties();
      });
    }

    // Reset Filters
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener("click", resetAllFilters);
    }

    // Language Toggle
    if (langToggleBtn) {
      langToggleBtn.addEventListener("click", toggleLanguage);
    }

    // Mobile Hamburger Menu Toggle
    const mobileBtn = document.getElementById("mobileToggleBtn");
    const mobileDrawer = document.getElementById("mobileNavDrawer");
    const mobileDrawerClose = document.getElementById("mobileDrawerClose");

    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener("click", () => {
        mobileDrawer.classList.toggle("active");
      });
    }
    if (mobileDrawerClose && mobileDrawer) {
      mobileDrawerClose.addEventListener("click", () => {
        mobileDrawer.classList.remove("active");
      });
    }

    // Mobile Drawer link clicks
    document.querySelectorAll(".mobile-drawer-link").forEach(link => {
      link.addEventListener("click", () => {
        if (mobileDrawer) mobileDrawer.classList.remove("active");
      });
    });

    // Site Visit Form (On-page)
    const onpageVisitForm = document.getElementById("onpageVisitForm");
    if (onpageVisitForm) {
      onpageVisitForm.addEventListener("submit", handleSiteVisitSubmit);
    }

    // Quick Book Modal Form
    const modalVisitForm = document.getElementById("modalVisitForm");
    if (modalVisitForm) {
      modalVisitForm.addEventListener("submit", handleModalVisitSubmit);
    }

    // Direct Contact Query Form
    const contactQueryForm = document.getElementById("contactQueryForm");
    if (contactQueryForm) {
      contactQueryForm.addEventListener("submit", handleContactQuerySubmit);
    }

    // Hotspot cards click
    document.querySelectorAll(".hotspot-card").forEach(card => {
      card.addEventListener("click", () => {
        const loc = card.dataset.location;
        if (loc) {
          activeLocation = loc;
          if (locationSelect) locationSelect.value = loc;
          renderProperties();
          const sec = document.getElementById("property-listings");
          if (sec) sec.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Modal Close buttons
    document.querySelectorAll(".modal-close-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        closeAllModals();
      });
    });

    // Close modal on clicking backdrop
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          closeAllModals();
        }
      });
    });
  }

  function resetAllFilters() {
    activeCategory = "all";
    activeLocation = "all";
    activeBudget = "all";
    searchQuery = "";
    if (locationSelect) locationSelect.value = "all";
    if (budgetSelect) budgetSelect.value = "all";
    if (searchInput) searchInput.value = "";
    categoryTabs.forEach(t => {
      if (t.dataset.category === "all") t.classList.add("active");
      else t.classList.remove("active");
    });
    renderProperties();
  }

  // ========================================================================
  // Language System (English / हिन्दी)
  // ========================================================================
  function initLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("dh_lang", lang);
    applyLanguageTranslations();
    if (langToggleBtn) {
      langToggleBtn.innerHTML = lang === "hi" 
        ? `<span>🇮🇳 हिन्दी</span> <small style="font-size: 10px; color: #1b8354;">(Switch to EN)</small>`
        : `<span>🌐 English</span> <small style="font-size: 10px; color: #1b8354;">(हिन्दी)</small>`;
    }
  }

  function toggleLanguage() {
    const next = currentLanguage === "en" ? "hi" : "en";
    initLanguage(next);
    renderProperties();
    showToast(next === "hi" ? "भाषा हिन्दी में सेट की गई" : "Language switched to English");
  }

  function applyLanguageTranslations() {
    const isHi = currentLanguage === "hi";
    document.querySelectorAll("[data-en][data-hi]").forEach(el => {
      el.textContent = isHi ? el.getAttribute("data-hi") : el.getAttribute("data-en");
    });
  }

  // ========================================================================
  // Unified Query Dispatch Engine (Email, WhatsApp & Admin Leads)
  // ========================================================================
  function dispatchCustomerQuery(leadData) {
    // 1. Save to Local Leads Database
    saveBooking(leadData);

    const settings = getStoredSettings();
    const recipientEmail = (settings.notificationEmail || "contact@dreamhomeindore.com").trim();
    const businessPhone = (settings.notificationPhone || "8251009855").replace(/\D/g, "");

    // 2. Format WhatsApp Alert Message
    const waText = 
      `🚨 *NEW PROPERTY INQUIRY - DREAM HOME INDORE* 🚨\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *Reference ID:* #${leadData.id}\n` +
      `🏷️ *Type:* ${leadData.type}\n` +
      `👤 *Client Name:* ${leadData.name}\n` +
      `📱 *Client Phone:* ${leadData.phone}\n` +
      `🏡 *Property / Interest:* ${leadData.category}\n` +
      `📅 *Preferred Date / Slot:* ${leadData.date} (${leadData.time})\n` +
      `🚗 *Free Indore Pickup:* ${leadData.pickup}\n` +
      (leadData.notes ? `📝 *Requirements / Message:* ${leadData.notes}\n` : "") +
      `🕒 *Received At:* ${leadData.createdAt}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Dream Home Real Estate Lead Management System_`;

    const cleanWaUrl = `https://wa.me/91${businessPhone}?text=${encodeURIComponent(waText)}`;

    // 3. Send Email Notification via FormSubmit.co
    if (settings.emailNotificationsEnabled !== false && recipientEmail) {
      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(recipientEmail), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `🚨 [New Lead] ${leadData.name} - ${leadData.category} (${leadData.phone})`,
          "Lead Reference ID": "#" + leadData.id,
          "Inquiry Type": leadData.type,
          "Client Name": leadData.name,
          "Contact Phone": leadData.phone,
          "Interested Property / Requirement": leadData.category,
          "Preferred Date": leadData.date,
          "Preferred Time": leadData.time,
          "Free Indore Car Pickup": leadData.pickup,
          "Client Notes": leadData.notes || "None",
          "Submission Time": leadData.createdAt,
          _template: "table"
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Email notification dispatched successfully:", data);
      })
      .catch(err => {
        console.warn("Email alert transmission:", err);
      });
    }

    // 4. Auto-launch WhatsApp if configured
    if (settings.autoOpenWhatsApp) {
      try {
        window.open(cleanWaUrl, "_blank");
      } catch (err) {
        console.log("Popup blocked or mobile browser:", err);
      }
    }

    // 5. Show Confirmation Modal to User
    showBookingConfirmationModal(leadData, cleanWaUrl);
    showToast(`✅ Query Dispatched! Ref #${leadData.id}`);

    // Update admin lead counter badge if visible
    updateAdminLeadBadge();
  }

  function updateAdminLeadBadge() {
    const badge = document.getElementById("adminLeadCountBadge");
    if (badge) {
      const bookings = getStoredBookings();
      badge.textContent = bookings.length;
    }
  }

  // ========================================================================
  // Site Visit & Query Form Handlers
  // ========================================================================
  function handleSiteVisitSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("visitName")?.value || "";
    const phone = document.getElementById("visitPhone")?.value || "";
    const category = document.getElementById("visitCategory")?.value || "Plots";
    const date = document.getElementById("visitDate")?.value || "Tomorrow";
    const time = document.getElementById("visitTime")?.value || "Morning 10 AM";
    const pickup = document.getElementById("visitPickup")?.checked ? "Yes (Free Indore Pickup Required)" : "No (Will come directly)";
    const notes = document.getElementById("visitNotes")?.value || "";

    const lead = {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      type: "Site Visit Schedule",
      name,
      phone,
      category,
      date,
      time,
      pickup,
      notes,
      createdAt: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: "New"
    };

    e.target.reset();
    dispatchCustomerQuery(lead);
  }

  function handleModalVisitSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("modalVisitName")?.value || "";
    const phone = document.getElementById("modalVisitPhone")?.value || "";
    const propertyTitle = document.getElementById("modalVisitProperty")?.value || "Indore Property";
    const date = document.getElementById("modalVisitDate")?.value || "Upcoming Weekend";
    const time = document.getElementById("modalVisitTime")?.value || "11:00 AM";

    const lead = {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      type: "Property Booking Visit",
      name,
      phone,
      category: propertyTitle,
      date,
      time,
      pickup: "Requested",
      notes: `Specific inquiry for: ${propertyTitle}`,
      createdAt: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: "New"
    };

    closeAllModals();
    e.target.reset();
    dispatchCustomerQuery(lead);
  }

  function handleContactQuerySubmit(e) {
    e.preventDefault();
    const name = document.getElementById("contactQueryName")?.value || "";
    const phone = document.getElementById("contactQueryPhone")?.value || "";
    const category = document.getElementById("contactQueryCategory")?.value || "General Inquiry";
    const budget = document.getElementById("contactQueryBudget")?.value || "";
    const message = document.getElementById("contactQueryMessage")?.value || "";

    const lead = {
      id: "INQ-" + Math.floor(100000 + Math.random() * 900000),
      type: "Contact Inquiry",
      name,
      phone,
      category: category + (budget ? ` [Budget: ${budget}]` : ""),
      date: "Flexible Callback",
      time: "Immediate / Office Hours",
      pickup: "N/A",
      notes: message || "Requested quick callback regarding property inquiry.",
      createdAt: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: "New"
    };

    e.target.reset();
    dispatchCustomerQuery(lead);
  }

  function openBookingModal(propTitle = "") {
    const modal = document.getElementById("quickVisitModal");
    const propField = document.getElementById("modalVisitProperty");
    if (propField && propTitle) {
      propField.value = propTitle;
    }
    if (modal) modal.classList.add("active");
  }

  function showBookingConfirmationModal(booking, waUrl) {
    const modal = document.getElementById("confirmationModal");
    const titleEl = document.getElementById("confirmModalTitle");
    const detailsBox = document.getElementById("confirmModalDetails");
    const waBtn = document.getElementById("confirmModalWaBtn");

    if (titleEl) {
      titleEl.textContent = booking.type === "Contact Inquiry" ? "Inquiry Dispatched Successfully!" : "Site Visit Request Received!";
    }

    if (detailsBox) {
      detailsBox.innerHTML = `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 18px; border-radius: 12px; margin: 15px 0; text-align: left;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 style="color: #15803d; font-size: 15px; margin: 0;">🎉 Ref: <strong>#${booking.id}</strong></h4>
            <span style="background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">${booking.type}</span>
          </div>
          <p style="font-size: 13.5px; color: #334155; margin-bottom: 4px;"><strong>Client Name:</strong> ${booking.name}</p>
          <p style="font-size: 13.5px; color: #334155; margin-bottom: 4px;"><strong>Phone:</strong> ${booking.phone}</p>
          <p style="font-size: 13.5px; color: #334155; margin-bottom: 4px;"><strong>Property / Interest:</strong> ${booking.category}</p>
          ${booking.date ? `<p style="font-size: 13px; color: #64748b; margin-bottom: 2px;"><strong>Timing:</strong> ${booking.date} (${booking.time})</p>` : ""}
          <p style="font-size: 12px; color: #64748b; margin-top: 8px; border-top: 1px dashed #bbf7d0; padding-top: 8px;">
            Our Indore sales executive has received this query on WhatsApp & Email and will coordinate with you shortly!
          </p>
        </div>
      `;
    }

    if (waBtn) {
      waBtn.href = waUrl;
    }

    if (modal) modal.classList.add("active");
  }

  // ========================================================================
  // Property Details Modal
  // ========================================================================
  function openPropertyDetailsModal(propId) {
    const prop = currentProperties.find(p => p.id === propId);
    if (!prop) return;

    const modal = document.getElementById("propertyDetailsModal");
    const content = document.getElementById("propDetailsModalContent");
    if (!modal || !content) return;

    const waText = encodeURIComponent(
      `Hello Dream Home Real Estate! I want more info on: *${prop.title}* (ID: ${prop.id}) located at ${prop.location} priced at ${prop.price}. Please share full details.`
    );
    const waUrl = `https://wa.me/918251009855?text=${waText}`;

    content.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px;">
        <div>
          <div style="border-radius: 14px; overflow: hidden; margin-bottom: 12px; max-height: 320px;">
            <img src="${prop.image}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="display: flex; gap: 10px;">
            ${(prop.gallery || []).map(img => `
              <img src="${img}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px; border: 2px solid #e2e8f0; cursor: pointer;">
            `).join("")}
          </div>
        </div>

        <div>
          <span style="background: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px;">${prop.categoryName}</span>
          <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 8px 0;">${prop.title}</h2>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 14px;">📍 ${prop.location}</p>

          <div style="background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
            <div style="font-size: 13px; color: #64748b;">Demand Price</div>
            <div style="font-size: 26px; font-weight: 800; color: #16a34a;">${prop.price}</div>
            <div style="font-size: 12px; color: #64748b;">Rate: ${prop.pricePerSqFt || "Market Best"}</div>
          </div>

          <div style="font-size: 13.5px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
            ${prop.description}
          </div>

          <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Key Amenities & Features:</h4>
          <ul style="list-style: none; display: grid; grid-template-columns: 1fr; gap: 6px; font-size: 13px; color: #475569; margin-bottom: 20px;">
            ${(prop.amenities || []).map(a => `<li>✅ ${a}</li>`).join("")}
          </ul>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="${waUrl}" target="_blank" class="btn-action-wa-big" style="flex: 1; justify-content: center; padding: 10px;">
              💬 WhatsApp Enquiry
            </a>
            <a href="tel:8251009855" class="btn-action-call-big" style="flex: 1; justify-content: center; padding: 10px;">
              📞 Call 8251009855
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("active"));
  }

  // ========================================================================
  // EMI Calculator
  // ========================================================================
  function initEmiCalculator() {
    const amountSlider = document.getElementById("emiAmountSlider");
    const rateSlider = document.getElementById("emiRateSlider");
    const tenureSlider = document.getElementById("emiTenureSlider");

    const amountLabel = document.getElementById("emiAmountLabel");
    const rateLabel = document.getElementById("emiRateLabel");
    const tenureLabel = document.getElementById("emiTenureLabel");

    const emiResultVal = document.getElementById("emiMonthlyResult");
    const emiTotalInterest = document.getElementById("emiTotalInterest");
    const emiTotalPayment = document.getElementById("emiTotalPayment");

    function calculate() {
      if (!amountSlider || !rateSlider || !tenureSlider) return;

      const p = parseFloat(amountSlider.value);
      const r = parseFloat(rateSlider.value) / 12 / 100;
      const n = parseFloat(tenureSlider.value) * 12;

      if (amountLabel) {
        amountLabel.textContent = "₹ " + (p / 100000).toFixed(1) + " Lakh";
      }
      if (rateLabel) {
        rateLabel.textContent = rateSlider.value + " %";
      }
      if (tenureLabel) {
        tenureLabel.textContent = tenureSlider.value + " Years";
      }

      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;

      if (emiResultVal) {
        emiResultVal.textContent = "₹ " + Math.round(emi).toLocaleString("en-IN") + " / mo";
      }
      if (emiTotalInterest) {
        emiTotalInterest.textContent = "₹ " + Math.round(totalInterest).toLocaleString("en-IN");
      }
      if (emiTotalPayment) {
        emiTotalPayment.textContent = "₹ " + Math.round(totalPayable).toLocaleString("en-IN");
      }
    }

    if (amountSlider) amountSlider.addEventListener("input", calculate);
    if (rateSlider) rateSlider.addEventListener("input", calculate);
    if (tenureSlider) tenureSlider.addEventListener("input", calculate);

    calculate();
  }

  // ========================================================================
  // Admin Panel & Team Authentication Management
  // ========================================================================
  function setupAdminPanel() {
    const adminLoginModal = document.getElementById("adminLoginModal");
    const adminLoginForm = document.getElementById("adminLoginForm");
    const adminLoginError = document.getElementById("adminLoginError");
    const adminTogglePwBtn = document.getElementById("adminTogglePwBtn");
    const adminLoginPassword = document.getElementById("adminLoginPassword");

    const adminModal = document.getElementById("adminModal");
    const btnOpenAdmin = document.getElementById("btnOpenAdmin");
    const btnOpenAdminFooter = document.getElementById("btnOpenAdminFooter");
    const btnOpenAdminMobile = document.getElementById("btnOpenAdminMobile");
    const btnAdminLogout = document.getElementById("btnAdminLogout");

    const adminSessionUserName = document.getElementById("adminSessionUserName");
    const adminSessionUserRole = document.getElementById("adminSessionUserRole");

    const adminPropertiesList = document.getElementById("adminPropertiesList");
    const adminBookingsList = document.getElementById("adminBookingsList");
    const adminTeamUsersList = document.getElementById("adminTeamUsersList");
    const adminLeadSearchInput = document.getElementById("adminLeadSearchInput");
    const btnExportLeadsCsv = document.getElementById("btnExportLeadsCsv");

    const addPropertyForm = document.getElementById("adminAddPropertyForm");
    const addTeamMemberForm = document.getElementById("adminAddTeamMemberForm");
    const changePasswordForm = document.getElementById("adminChangePasswordForm");
    const btnResetData = document.getElementById("btnResetDefaultProperties");

    // Notification Settings Elements
    const settingNotifyEmail = document.getElementById("settingNotifyEmail");
    const settingNotifyPhone = document.getElementById("settingNotifyPhone");
    const settingEmailEnabled = document.getElementById("settingEmailEnabled");
    const settingAutoWa = document.getElementById("settingAutoWa");
    const btnSaveSettings = document.getElementById("btnSaveSettings");
    const btnTestEmailAlert = document.getElementById("btnTestEmailAlert");
    const btnTestWaAlert = document.getElementById("btnTestWaAlert");
    const testEmailStatus = document.getElementById("testEmailStatus");

    // 5 Admin Tabs
    const tabProps = document.getElementById("adminTabProps");
    const tabAdd = document.getElementById("adminTabAdd");
    const tabBookings = document.getElementById("adminTabBookings");
    const tabTeam = document.getElementById("adminTabTeam");
    const tabSettings = document.getElementById("adminTabSettings");

    const viewProps = document.getElementById("adminViewProps");
    const viewAdd = document.getElementById("adminViewAdd");
    const viewBookings = document.getElementById("adminViewBookings");
    const viewTeam = document.getElementById("adminViewTeam");
    const viewSettings = document.getElementById("adminViewSettings");

    // Initialize lead count badge
    updateAdminLeadBadge();

    // Check & Handle Admin Access (Protected by Team Login)
    function handleAdminAccess() {
      const session = getTeamSession();
      if (!session) {
        // Not logged in -> Show Team Login Modal
        if (adminLoginError) adminLoginError.style.display = "none";
        if (adminLoginModal) adminLoginModal.classList.add("active");
        const usernameInput = document.getElementById("adminLoginUsername");
        if (usernameInput) setTimeout(() => usernameInput.focus(), 150);
      } else {
        // Authenticated -> Open Admin Dashboard
        openAdminDashboard(session);
      }
    }

    // Admin buttons now link directly to the standalone admin.html login page
    // Optional modal fallback:
    window.openAdminModalFallback = handleAdminAccess;

    // Toggle Password Visibility in Login Modal
    if (adminTogglePwBtn && adminLoginPassword) {
      adminTogglePwBtn.addEventListener("click", () => {
        const isPw = adminLoginPassword.type === "password";
        adminLoginPassword.type = isPw ? "text" : "password";
        adminTogglePwBtn.textContent = isPw ? "🙈" : "👁️";
      });
    }

    // Team Login Form Submission
    if (adminLoginForm) {
      adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("adminLoginUsername")?.value || "";
        const password = document.getElementById("adminLoginPassword")?.value || "";
        const remember = document.getElementById("adminLoginRemember")?.checked || false;

        const authenticatedUser = authenticateUser(username, password);
        if (!authenticatedUser) {
          if (adminLoginError) {
            adminLoginError.textContent = "❌ Invalid Team ID or Password. Please try again with valid credentials.";
            adminLoginError.style.display = "block";
          }
          return;
        }

        // Save session
        setTeamSession(authenticatedUser, remember);

        // Hide error, reset form, close login modal
        if (adminLoginError) adminLoginError.style.display = "none";
        adminLoginForm.reset();
        if (adminLoginModal) adminLoginModal.classList.remove("active");

        // Open Admin Dashboard
        openAdminDashboard(authenticatedUser);
        showToast(`👋 Welcome back, ${authenticatedUser.name}!`);
      });
    }

    // Admin Logout
    if (btnAdminLogout) {
      btnAdminLogout.addEventListener("click", () => {
        if (confirm("Are you sure you want to sign out of the Admin Panel?")) {
          clearTeamSession();
          if (adminModal) adminModal.classList.remove("active");
          showToast("🚪 Successfully logged out of Admin Panel.");
        }
      });
    }

    function openAdminDashboard(userSession) {
      if (adminSessionUserName) adminSessionUserName.textContent = userSession.name || userSession.username;
      if (adminSessionUserRole) adminSessionUserRole.textContent = `(${userSession.role || 'Team Member'})`;

      renderAdminPropertiesTable();
      renderAdminBookingsTable();
      renderAdminTeamTable();
      loadSettingsIntoForm();
      updateAdminLeadBadge();

      if (adminModal) adminModal.classList.add("active");
    }

    // Tab Switching across all 5 Admin Tabs
    const allTabs = [
      { tab: tabProps, view: viewProps, action: renderAdminPropertiesTable },
      { tab: tabAdd, view: viewAdd },
      { tab: tabBookings, view: viewBookings, action: renderAdminBookingsTable },
      { tab: tabTeam, view: viewTeam, action: renderAdminTeamTable },
      { tab: tabSettings, view: viewSettings, action: loadSettingsIntoForm }
    ];

    allTabs.forEach(item => {
      if (item.tab && item.view) {
        item.tab.addEventListener("click", () => {
          allTabs.forEach(t => {
            if (t.tab) t.tab.classList.remove("active");
            if (t.view) t.view.style.display = "none";
          });
          item.tab.classList.add("active");
          item.view.style.display = "block";
          if (typeof item.action === "function") item.action();
        });
      }
    });

    // 1. Render Properties Table
    function renderAdminPropertiesTable() {
      if (!adminPropertiesList) return;
      const props = getStoredProperties();
      adminPropertiesList.innerHTML = props.map(p => `
        <tr>
          <td>
            <img src="${p.image}" style="width: 50px; height: 40px; object-fit: cover; border-radius: 4px;" onerror="this.src='assets/images/category_houses.jpg'">
          </td>
          <td>
            <strong>${p.title}</strong><br>
            <small style="color: #64748b;">${p.location}</small>
          </td>
          <td><span class="badge-featured" style="padding: 2px 8px; font-size: 11px;">${p.categoryName}</span></td>
          <td><strong>${p.price}</strong></td>
          <td>
            <button class="admin-action-btn-sm btn-del" onclick="window.adminDeleteProperty('${p.id}')">Delete</button>
          </td>
        </tr>
      `).join("");
    }

    // 2. Render Bookings / Queries Table
    function renderAdminBookingsTable() {
      if (!adminBookingsList) return;
      let bookings = getStoredBookings();
      updateAdminLeadBadge();

      // Search Filter
      const query = (adminLeadSearchInput?.value || "").toLowerCase().trim();
      if (query) {
        bookings = bookings.filter(b => 
          (b.name + " " + b.phone + " " + b.category + " " + b.id + " " + (b.notes || "")).toLowerCase().includes(query)
        );
      }

      if (bookings.length === 0) {
        adminBookingsList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 25px;">${query ? 'No matching inquiries found.' : 'No customer inquiries received yet.'}</td></tr>`;
        return;
      }

      adminBookingsList.innerHTML = bookings.map(b => {
        const cleanPhone = (b.phone || "").replace(/\D/g, "");
        const statusColors = {
          "New": { bg: "#eff6ff", text: "#1d4ed8" },
          "Contacted": { bg: "#fef3c7", text: "#b45309" },
          "Site Visit Done": { bg: "#f3e8ff", text: "#7e22ce" },
          "Booked / Converted": { bg: "#dcfce7", text: "#15803d" },
          "Closed": { bg: "#f1f5f9", text: "#64748b" }
        };
        const st = statusColors[b.status] || { bg: "#eff6ff", text: "#1d4ed8" };

        return `
          <tr>
            <td>
              <strong style="color: #0f172a;">#${b.id}</strong><br>
              <span style="font-size: 11px; background: #f1f5f9; color: #475569; padding: 1px 6px; border-radius: 4px;">${b.type || 'Inquiry'}</span>
            </td>
            <td>
              <strong>${b.name}</strong><br>
              <a href="tel:${cleanPhone}" style="color: #1b8354; font-size: 12px; font-weight: 600;">📞 ${b.phone}</a>
            </td>
            <td>
              <span style="font-weight: 600; color: #1e293b;">${b.category}</span>
              ${b.notes ? `<br><small style="color: #64748b; font-style: italic;">"${b.notes.substring(0, 50)}${b.notes.length > 50 ? '...' : ''}"</small>` : ''}
            </td>
            <td>
              <span style="font-size: 12px; color: #334155;">${b.date || 'Flexible'} (${b.time || ''})</span><br>
              <small style="color: ${b.pickup && b.pickup.includes('Yes') ? '#15803d' : '#64748b'}; font-weight: 600;">Pickup: ${b.pickup || 'No'}</small>
            </td>
            <td>
              <select onchange="window.adminChangeLeadStatus('${b.id}', this.value)" style="font-size: 11.5px; font-weight: 700; padding: 3px 6px; border-radius: 4px; background: ${st.bg}; color: ${st.text}; border: 1px solid #cbd5e1; cursor: pointer;">
                <option value="New" ${b.status === "New" ? "selected" : ""}>🟢 New Lead</option>
                <option value="Contacted" ${b.status === "Contacted" ? "selected" : ""}>🟡 Contacted</option>
                <option value="Site Visit Done" ${b.status === "Site Visit Done" ? "selected" : ""}>🟣 Visit Done</option>
                <option value="Booked / Converted" ${b.status === "Booked / Converted" ? "selected" : ""}>🏆 Booked</option>
                <option value="Closed" ${b.status === "Closed" ? "selected" : ""}>⚪ Closed</option>
              </select>
            </td>
            <td style="white-space: nowrap;">
              <button class="admin-action-btn-sm" style="background: #ecfdf5; color: #15803d; border: 1px solid #bbf7d0;" title="WhatsApp Customer Directly" onclick="window.adminChatClientWa('${cleanPhone}', '${b.name.replace(/'/g, "")}')">💬 Chat</button>
              <button class="admin-action-btn-sm" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;" title="Forward Lead to Team WhatsApp" onclick="window.adminForwardLeadWa('${b.id}')">📢 Forward</button>
              <button class="admin-action-btn-sm btn-del" title="Delete Inquiry" onclick="window.adminDeleteBooking('${b.id}')">🗑️</button>
            </td>
          </tr>
        `;
      }).join("");
    }

    // Lead Search filter event
    if (adminLeadSearchInput) {
      adminLeadSearchInput.addEventListener("input", renderAdminBookingsTable);
    }

    // Export Leads to CSV
    if (btnExportLeadsCsv) {
      btnExportLeadsCsv.addEventListener("click", () => {
        const bookings = getStoredBookings();
        if (bookings.length === 0) {
          showToast("No leads available to export.");
          return;
        }

        const headers = ["Lead ID", "Inquiry Type", "Client Name", "Phone", "Property / Category", "Date", "Time", "Free Pickup", "Notes", "Status", "Received At"];
        const rows = bookings.map(b => [
          b.id,
          b.type || "Inquiry",
          `"${(b.name || "").replace(/"/g, '""')}"`,
          `"${b.phone || ""}"`,
          `"${(b.category || "").replace(/"/g, '""')}"`,
          `"${b.date || ""}"`,
          `"${b.time || ""}"`,
          `"${b.pickup || ""}"`,
          `"${(b.notes || "").replace(/"/g, '""')}"`,
          b.status || "New",
          `"${b.createdAt || ""}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `DreamHome_Indore_Leads_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("📥 Leads exported successfully to CSV!");
      });
    }

    // 3. Render Team Users Table
    function renderAdminTeamTable() {
      if (!adminTeamUsersList) return;
      const users = getStoredTeamUsers();
      const currentSession = getTeamSession();

      adminTeamUsersList.innerHTML = users.map(u => `
        <tr>
          <td>
            <strong>${u.username}</strong>
            ${u.isSuperAdmin ? `<span style="font-size: 10px; background: #fef3c7; color: #92400e; padding: 1px 5px; border-radius: 4px; margin-left: 4px;">Primary</span>` : ''}
          </td>
          <td>
            <strong>${u.name}</strong><br>
            <small style="color: #64748b;">${u.role}</small>
          </td>
          <td>${u.phone || 'N/A'}</td>
          <td>
            ${u.isSuperAdmin ? `<span style="color: #94a3b8; font-size: 11px;">Protected</span>` : `
              <button class="admin-action-btn-sm btn-del" onclick="window.adminDeleteTeamUser('${u.username}')">Delete</button>
            `}
          </td>
        </tr>
      `).join("");
    }

    // Add New Team Member Form Submission
    if (addTeamMemberForm) {
      addTeamMemberForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("newTeamName")?.value.trim() || "";
        const username = document.getElementById("newTeamUsername")?.value.trim().toLowerCase() || "";
        const password = document.getElementById("newTeamPassword")?.value.trim() || "";
        const role = document.getElementById("newTeamRole")?.value || "Sales Executive";
        const phone = document.getElementById("newTeamPhone")?.value.trim() || "8251009855";

        const users = getStoredTeamUsers();
        if (users.find(u => u.username.toLowerCase() === username)) {
          alert("A team member with this Login ID / Username already exists. Please choose a different ID.");
          return;
        }

        const newUser = {
          id: "usr-" + Date.now(),
          username,
          password,
          name,
          role,
          phone,
          isSuperAdmin: false,
          createdAt: new Date().toLocaleDateString("en-IN")
        };

        users.push(newUser);
        saveTeamUsers(users);
        addTeamMemberForm.reset();
        renderAdminTeamTable();
        showToast(`✨ Team member "${name}" added successfully!`);
      });
    }

    // Change My Password Form Submission
    if (changePasswordForm) {
      changePasswordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentSession = getTeamSession();
        if (!currentSession) return;

        const currentPw = document.getElementById("changePwCurrent")?.value || "";
        const newPw = document.getElementById("changePwNew")?.value || "";
        const confirmPw = document.getElementById("changePwConfirm")?.value || "";

        if (newPw !== confirmPw) {
          alert("New password and confirmation do not match!");
          return;
        }
        if (newPw.length < 5) {
          alert("Password must be at least 5 characters long.");
          return;
        }

        const users = getStoredTeamUsers();
        const targetUser = users.find(u => u.username.toLowerCase() === currentSession.username.toLowerCase());

        if (!targetUser || targetUser.password !== currentPw) {
          alert("Current password is incorrect.");
          return;
        }

        targetUser.password = newPw;
        saveTeamUsers(users);
        changePasswordForm.reset();
        showToast("🔒 Password updated successfully!");
      });
    }

    // 4. Load & Save Query Notification Settings
    function loadSettingsIntoForm() {
      const s = getStoredSettings();
      if (settingNotifyEmail) settingNotifyEmail.value = s.notificationEmail || "contact@dreamhomeindore.com";
      if (settingNotifyPhone) settingNotifyPhone.value = s.notificationPhone || "8251009855";
      if (settingEmailEnabled) settingEmailEnabled.checked = s.emailNotificationsEnabled !== false;
      if (settingAutoWa) settingAutoWa.checked = s.autoOpenWhatsApp !== false;
    }

    if (btnSaveSettings) {
      btnSaveSettings.addEventListener("click", () => {
        const email = settingNotifyEmail?.value.trim() || "contact@dreamhomeindore.com";
        const phone = settingNotifyPhone?.value.trim() || "8251009855";
        const emailEnabled = settingEmailEnabled?.checked || false;
        const autoWa = settingAutoWa?.checked || false;

        saveSettings({
          notificationEmail: email,
          notificationPhone: phone,
          emailNotificationsEnabled: emailEnabled,
          autoOpenWhatsApp: autoWa
        });

        showToast("💾 Notification settings saved successfully!");
      });
    }

    // Test Email Alert Now
    if (btnTestEmailAlert) {
      btnTestEmailAlert.addEventListener("click", () => {
        const email = settingNotifyEmail?.value.trim() || "";
        if (!email) {
          alert("Please enter a valid email address first.");
          return;
        }

        if (testEmailStatus) {
          testEmailStatus.innerHTML = `<span style="color: #2563eb;">⏳ Sending test query to <strong>${email}</strong> via FormSubmit...</span>`;
        }

        fetch("https://formsubmit.co/ajax/" + encodeURIComponent(email), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            _subject: "✅ Test Lead Notification - Dream Home Real Estate Indore",
            "Notification Status": "TEST TRANSMISSION SUCCESSFUL",
            "Target Email": email,
            "Sample Client": "Rajesh Kumar (Indore)",
            "Sample Phone": "+91 9826012345",
            "Sample Requirement": "Residential Plots - Super Corridor Indore",
            "Note": "If this is your first time using this email with FormSubmit, check your inbox for an activation email from FormSubmit and click activate.",
            _template: "table"
          })
        })
        .then(res => res.json())
        .then(data => {
          if (testEmailStatus) {
            testEmailStatus.innerHTML = `<span style="color: #15803d; font-weight: 700;">✅ Test email dispatched to ${email}! Check your inbox (or Spam/Promotions).</span>`;
          }
          showToast("📧 Test email dispatched successfully!");
        })
        .catch(err => {
          if (testEmailStatus) {
            testEmailStatus.innerHTML = `<span style="color: #dc2626;">❌ Transmission error: ${err.message}. Please check connection.</span>`;
          }
        });
      });
    }

    // Test WhatsApp Alert Link
    if (btnTestWaAlert) {
      btnTestWaAlert.addEventListener("click", () => {
        const phone = (settingNotifyPhone?.value || "8251009855").replace(/\D/g, "");
        const sampleText = encodeURIComponent(
          "🚨 *TEST LEAD ALERT - DREAM HOME INDORE* 🚨\n\n" +
          "This is a test notification verifying your WhatsApp lead alert integration.\n" +
          "Your phone number is correctly configured to receive client queries!"
        );
        window.open(`https://wa.me/91${phone}?text=${sampleText}`, "_blank");
      });
    }

    // Global Window Functions for Inline Actions
    window.adminDeleteProperty = function(id) {
      if (confirm("Are you sure you want to delete this property listing?")) {
        const props = getStoredProperties().filter(p => p.id !== id);
        savePropertiesToStorage(props);
        renderAdminPropertiesTable();
        renderProperties();
        showToast("Property listing deleted.");
      }
    };

    window.adminDeleteBooking = function(id) {
      if (confirm("Delete this inquiry from leads list?")) {
        deleteBooking(id);
        renderAdminBookingsTable();
        showToast("Inquiry deleted.");
      }
    };

    window.adminChangeLeadStatus = function(id, newStatus) {
      updateBookingStatus(id, newStatus);
      renderAdminBookingsTable();
      showToast(`Status updated to "${newStatus}"`);
    };

    window.adminDeleteTeamUser = function(username) {
      if (confirm(`Are you sure you want to remove team account "${username}"?`)) {
        const users = getStoredTeamUsers().filter(u => u.username !== username);
        saveTeamUsers(users);
        renderAdminTeamTable();
        showToast(`Team user "${username}" removed.`);
      }
    };

    window.adminChatClientWa = function(phone, name) {
      const cleanPhone = (phone || "").replace(/\D/g, "");
      const text = encodeURIComponent(`Hello ${name}! I am calling from Dream Home Real Estate Indore regarding your property inquiry. How may I assist you today?`);
      window.open(`https://wa.me/91${cleanPhone}?text=${text}`, "_blank");
    };

    window.adminForwardLeadWa = function(leadId) {
      const bookings = getStoredBookings();
      const lead = bookings.find(b => b.id === leadId);
      if (!lead) return;

      const forwardText = encodeURIComponent(
        `📢 *HOT CLIENT LEAD - DREAM HOME INDORE*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📌 *Lead ID:* #${lead.id}\n` +
        `👤 *Client:* ${lead.name}\n` +
        `📱 *Contact:* +91 ${lead.phone}\n` +
        `🏡 *Requirement:* ${lead.category}\n` +
        `📅 *Date / Slot:* ${lead.date} (${lead.time})\n` +
        `🚗 *Pickup:* ${lead.pickup}\n` +
        (lead.notes ? `📝 *Notes:* ${lead.notes}\n` : "") +
        `Status: ${lead.status || 'New'}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `_Forwarded from Dream Home Admin Portal_`
      );
      window.open(`https://wa.me/?text=${forwardText}`, "_blank");
    };

    // Add New Property Submission
    if (addPropertyForm) {
      addPropertyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("newPropTitle").value;
        const category = document.getElementById("newPropCategory").value;
        const price = document.getElementById("newPropPrice").value;
        const priceNum = parseInt(document.getElementById("newPropPriceNumeric").value) || 3500000;
        const location = document.getElementById("newPropLocation").value;
        const area = document.getElementById("newPropArea").value;
        const facing = document.getElementById("newPropFacing").value || "East Facing";
        const reraNo = document.getElementById("newPropRera").value || "RERA Approved";
        const imageSelect = document.getElementById("newPropImage").value;
        const customImageUrl = document.getElementById("newPropCustomImage")?.value || "";
        const description = document.getElementById("newPropDesc").value;

        let finalImage = customImageUrl.trim() ? customImageUrl : imageSelect;

        let catName = "Residential Plots";
        if (category === "farmhouses") catName = "Farmhouses";
        if (category === "flats") catName = "Flats";
        if (category === "houses") catName = "Residential Houses";

        const newProp = {
          id: "dh-" + Date.now(),
          title,
          category,
          categoryName: catName,
          price,
          priceNumeric: priceNum,
          location,
          area,
          facing,
          reraNo,
          status: "New Listing",
          badgeType: "new",
          image: finalImage,
          gallery: [finalImage],
          description,
          amenities: ["Gated Township", "24x7 Security", "RERA Approved", "Immediate Registry"],
          highlights: ["Prime Indore Location", "High Growth Area"]
        };

        const existing = getStoredProperties();
        existing.unshift(newProp);
        savePropertiesToStorage(existing);

        showToast("✨ New Property Added Successfully!");
        addPropertyForm.reset();
        renderAdminPropertiesTable();
        renderProperties();
        if (tabProps && viewProps) {
          allTabs.forEach(t => {
            if (t.tab) t.tab.classList.remove("active");
            if (t.view) t.view.style.display = "none";
          });
          tabProps.classList.add("active");
          viewProps.style.display = "block";
        }
      });
    }

    // Reset default properties
    if (btnResetData) {
      btnResetData.addEventListener("click", () => {
        if (confirm("Reset all property data to default verified Indore listings?")) {
          resetPropertiesToDefault();
          renderAdminPropertiesTable();
          renderProperties();
          showToast("Data reset to defaults");
        }
      });
    }
  }

  // ========================================================================
  // Toast Notification System
  // ========================================================================
  function showToast(message) {
    let toast = document.getElementById("appToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "appToast";
      toast.className = "toast-notice";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>${message}</span>`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }
});
