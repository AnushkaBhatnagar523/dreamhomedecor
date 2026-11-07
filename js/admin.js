// Dream Home Real Estate - Standalone Admin Portal & Team Management JS
// Connects seamlessly to properties-data.js localStorage and query engine

document.addEventListener("DOMContentLoaded", () => {
  // DOM Views
  const loginScreen = document.getElementById("loginScreenView");
  const dashboardScreen = document.getElementById("dashboardScreenView");

  // Login Form Elements
  const loginForm = document.getElementById("standaloneLoginForm");
  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");
  const loginRememberCheck = document.getElementById("loginRememberCheck");
  const loginErrorBanner = document.getElementById("loginErrorBanner");
  const togglePasswordBtn = document.getElementById("togglePasswordBtn");

  // Dashboard Header & Navigation
  const dashSessionUser = document.getElementById("dashSessionUser");
  const dashSessionRole = document.getElementById("dashSessionRole");
  const btnDashboardLogout = document.getElementById("btnDashboardLogout");
  const dashStatPropCount = document.getElementById("dashStatPropCount");
  const dashStatLeadCount = document.getElementById("dashStatLeadCount");
  const btnResetAllDefaults = document.getElementById("btnResetAllDefaults");

  // Dashboard Tabs
  const tabProps = document.getElementById("dashTabProps");
  const tabAdd = document.getElementById("dashTabAdd");
  const tabLeads = document.getElementById("dashTabLeads");
  const tabTeam = document.getElementById("dashTabTeam");
  const tabSettings = document.getElementById("dashTabSettings");
  const dashTabLeadBadge = document.getElementById("dashTabLeadBadge");

  // Dashboard Views
  const viewProps = document.getElementById("dashViewProps");
  const viewAdd = document.getElementById("dashViewAdd");
  const viewLeads = document.getElementById("dashViewLeads");
  const viewTeam = document.getElementById("dashViewTeam");
  const viewSettings = document.getElementById("dashViewSettings");

  // Tables & Search
  const propsTableBody = document.getElementById("dashPropertiesTableBody");
  const leadsTableBody = document.getElementById("dashLeadsTableBody");
  const teamTableBody = document.getElementById("dashTeamTableBody");
  const dashLeadSearch = document.getElementById("dashLeadSearch");
  const btnDashExportCsv = document.getElementById("btnDashExportCsv");

  // Forms
  const addPropForm = document.getElementById("dashAddPropertyForm");
  const addTeamForm = document.getElementById("dashAddTeamForm");
  const changePwForm = document.getElementById("dashChangePasswordForm");

  // Settings
  const settingEmail = document.getElementById("dashSettingNotifyEmail");
  const settingPhone = document.getElementById("dashSettingNotifyPhone");
  const settingEmailEnabled = document.getElementById("dashSettingEmailEnabled");
  const settingAutoWa = document.getElementById("dashSettingAutoWa");
  const btnSaveSettings = document.getElementById("btnDashSaveSettings");
  const btnTestEmail = document.getElementById("btnDashTestEmail");
  const btnTestWa = document.getElementById("btnDashTestWa");
  const testEmailStatus = document.getElementById("dashTestEmailStatus");

  // ========================================================================
  // Initialize Authentication State
  // ========================================================================
  const currentSession = getTeamSession();
  if (currentSession) {
    showDashboard(currentSession);
  } else {
    showLoginScreen();
  }

  function showLoginScreen() {
    if (loginScreen) loginScreen.style.display = "flex";
    if (dashboardScreen) dashboardScreen.style.display = "none";
    if (loginErrorBanner) loginErrorBanner.style.display = "none";
    if (loginUsername) setTimeout(() => loginUsername.focus(), 150);
  }

  function showDashboard(session) {
    if (loginScreen) loginScreen.style.display = "none";
    if (dashboardScreen) dashboardScreen.style.display = "block";

    if (dashSessionUser) dashSessionUser.textContent = session.name || session.username;
    if (dashSessionRole) dashSessionRole.textContent = `(${session.role || 'Administrator'})`;

    renderAllDashboardData();
  }

  function renderAllDashboardData() {
    renderPropertiesTable();
    renderLeadsTable();
    renderTeamTable();
    renderStats();
    loadSettingsIntoForm();
  }

  // ========================================================================
  // Login Form Submission
  // ========================================================================
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = (loginUsername?.value || "").trim();
      const password = (loginPassword?.value || "").trim();
      const remember = loginRememberCheck?.checked || false;

      const user = authenticateUser(username, password);
      if (!user) {
        if (loginErrorBanner) {
          loginErrorBanner.innerHTML = "❌ <strong>Invalid ID or Password.</strong> Please check your credentials and try again.";
          loginErrorBanner.style.display = "block";
          loginErrorBanner.classList.remove("shake");
          void loginErrorBanner.offsetWidth; // trigger reflow
          loginErrorBanner.classList.add("shake");
        }
        return;
      }

      setTeamSession(user, remember);
      loginForm.reset();
      showDashboard(user);
      showAdminToast(`👋 Welcome back, ${user.name}!`);
    });
  }

  // Toggle Password Visibility
  if (togglePasswordBtn && loginPassword) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPw = loginPassword.type === "password";
      loginPassword.type = isPw ? "text" : "password";
      togglePasswordBtn.textContent = isPw ? "🙈" : "👁️";
    });
  }

  // Sign Out
  if (btnDashboardLogout) {
    btnDashboardLogout.addEventListener("click", () => {
      if (confirm("Are you sure you want to sign out of the Admin Portal?")) {
        clearTeamSession();
        showLoginScreen();
        showAdminToast("🚪 Successfully logged out.");
      }
    });
  }

  // ========================================================================
  // Dashboard Tab Navigation
  // ========================================================================
  const tabsList = [
    { btn: tabProps, view: viewProps, action: renderPropertiesTable },
    { btn: tabAdd, view: viewAdd },
    { btn: tabLeads, view: viewLeads, action: renderLeadsTable },
    { btn: tabTeam, view: viewTeam, action: renderTeamTable },
    { btn: tabSettings, view: viewSettings, action: loadSettingsIntoForm }
  ];

  tabsList.forEach(item => {
    if (item.btn && item.view) {
      item.btn.addEventListener("click", () => {
        tabsList.forEach(t => {
          if (t.btn) t.btn.classList.remove("active");
          if (t.view) t.view.style.display = "none";
        });
        item.btn.classList.add("active");
        item.view.style.display = "block";
        if (typeof item.action === "function") item.action();
      });
    }
  });

  // ========================================================================
  // 1. Render Properties Table
  // ========================================================================
  function renderPropertiesTable() {
    if (!propsTableBody) return;
    const properties = getStoredProperties();
    renderStats();

    propsTableBody.innerHTML = properties.map(p => `
      <tr>
        <td>
          <img src="${p.image}" style="width: 54px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" onerror="this.src='assets/images/category_houses.jpg'">
        </td>
        <td>
          <strong style="font-size: 14px; color: #0f172a;">${p.title}</strong><br>
          <small style="color: #64748b;">📍 ${p.location}</small>
        </td>
        <td>
          <span class="badge-featured" style="padding: 3px 10px; font-size: 11px;">${p.categoryName}</span>
        </td>
        <td>
          <strong style="color: #16a34a; font-size: 14px;">${p.price}</strong><br>
          <small style="color: #64748b;">${p.area}</small>
        </td>
        <td>
          <button class="admin-action-btn-sm btn-del" style="cursor: pointer;" onclick="window.dashDeleteProperty('${p.id}')">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  // ========================================================================
  // 2. Render Leads & Inquiries Table
  // ========================================================================
  function renderLeadsTable() {
    if (!leadsTableBody) return;
    let leads = getStoredBookings();
    renderStats();

    const query = (dashLeadSearch?.value || "").toLowerCase().trim();
    if (query) {
      leads = leads.filter(b =>
        (b.name + " " + b.phone + " " + b.category + " " + b.id + " " + (b.notes || "")).toLowerCase().includes(query)
      );
    }

    if (leads.length === 0) {
      leadsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 30px;">${query ? 'No matching inquiries found.' : 'No customer inquiries received yet. Submit a test query from the website!'}</td></tr>`;
      return;
    }

    leadsTableBody.innerHTML = leads.map(b => {
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
            <strong style="color: #0f172a; font-size: 13.5px;">#${b.id}</strong><br>
            <span style="font-size: 11px; background: #f1f5f9; color: #475569; padding: 2px 7px; border-radius: 4px; font-weight: 600;">${b.type || 'Inquiry'}</span>
          </td>
          <td>
            <strong style="color: #0f172a;">${b.name}</strong><br>
            <a href="tel:${cleanPhone}" style="color: #1b8354; font-size: 12.5px; font-weight: 600; text-decoration: none;">📞 +91 ${b.phone}</a>
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
            <select onchange="window.dashChangeLeadStatus('${b.id}', this.value)" style="font-size: 11.5px; font-weight: 700; padding: 4px 8px; border-radius: 6px; background: ${st.bg}; color: ${st.text}; border: 1px solid #cbd5e1; cursor: pointer;">
              <option value="New" ${b.status === "New" ? "selected" : ""}>🟢 New Lead</option>
              <option value="Contacted" ${b.status === "Contacted" ? "selected" : ""}>🟡 Contacted</option>
              <option value="Site Visit Done" ${b.status === "Site Visit Done" ? "selected" : ""}>🟣 Visit Done</option>
              <option value="Booked / Converted" ${b.status === "Booked / Converted" ? "selected" : ""}>🏆 Booked</option>
              <option value="Closed" ${b.status === "Closed" ? "selected" : ""}>⚪ Closed</option>
            </select>
          </td>
          <td style="white-space: nowrap;">
            <button class="admin-action-btn-sm" style="background: #ecfdf5; color: #15803d; border: 1px solid #bbf7d0; cursor: pointer;" title="WhatsApp Customer" onclick="window.dashChatClientWa('${cleanPhone}', '${b.name.replace(/'/g, "")}')">💬 Chat</button>
            <button class="admin-action-btn-sm" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; cursor: pointer;" title="Forward Lead to Team WhatsApp" onclick="window.dashForwardLeadWa('${b.id}')">📢 Forward</button>
            <button class="admin-action-btn-sm btn-del" style="cursor: pointer;" title="Delete Inquiry" onclick="window.dashDeleteLead('${b.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  if (dashLeadSearch) {
    dashLeadSearch.addEventListener("input", renderLeadsTable);
  }

  // ========================================================================
  // 3. Render Team Users Table
  // ========================================================================
  function renderTeamTable() {
    if (!teamTableBody) return;
    const users = getStoredTeamUsers();

    teamTableBody.innerHTML = users.map(u => `
      <tr>
        <td>
          <strong style="color: #0f172a;">${u.username}</strong>
          ${u.isSuperAdmin ? `<span style="font-size: 10px; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: 700;">Super Admin</span>` : ''}
        </td>
        <td>
          <strong>${u.name}</strong><br>
          <small style="color: #64748b;">${u.role}</small>
        </td>
        <td>${u.phone || 'N/A'}</td>
        <td>
          ${u.isSuperAdmin ? `<span style="color: #94a3b8; font-size: 11px;">Protected</span>` : `
            <button class="admin-action-btn-sm btn-del" style="cursor: pointer;" onclick="window.dashDeleteTeamUser('${u.username}')">Delete</button>
          `}
        </td>
      </tr>
    `).join("");
  }

  function renderStats() {
    const props = getStoredProperties();
    const leads = getStoredBookings();
    if (dashStatPropCount) dashStatPropCount.textContent = `${props.length} Listed`;
    if (dashStatLeadCount) dashStatLeadCount.textContent = `${leads.length} Received`;
    if (dashTabLeadBadge) dashTabLeadBadge.textContent = leads.length;
  }

  // ========================================================================
  // 4. Add New Property Form Submission
  // ========================================================================
  if (addPropForm) {
    addPropForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("addPropTitle").value;
      const category = document.getElementById("addPropCategory").value;
      const price = document.getElementById("addPropPrice").value;
      const priceNum = parseInt(document.getElementById("addPropPriceNumeric").value) || 3500000;
      const location = document.getElementById("addPropLocation").value;
      const area = document.getElementById("addPropArea").value;
      const facing = document.getElementById("addPropFacing").value || "East Facing";
      const reraNo = document.getElementById("addPropRera").value || "RERA Approved";
      const imageSelect = document.getElementById("addPropImageSelect").value;
      const customImageUrl = document.getElementById("addPropCustomImage")?.value || "";
      const description = document.getElementById("addPropDesc").value;

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

      showAdminToast("✨ New Property Added Successfully!");
      addPropForm.reset();
      renderPropertiesTable();
      if (tabProps) tabProps.click();
    });
  }

  // ========================================================================
  // 5. Add New Team Member Form Submission
  // ========================================================================
  if (addTeamForm) {
    addTeamForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("dashNewTeamName")?.value.trim() || "";
      const username = document.getElementById("dashNewTeamUsername")?.value.trim().toLowerCase() || "";
      const password = document.getElementById("dashNewTeamPassword")?.value.trim() || "";
      const role = document.getElementById("dashNewTeamRole")?.value || "Sales Executive";
      const phone = document.getElementById("dashNewTeamPhone")?.value.trim() || "8251009855";

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
      addTeamForm.reset();
      renderTeamTable();
      showAdminToast(`✨ Team member "${name}" added!`);
    });
  }

  // ========================================================================
  // 6. Change Password Form Submission
  // ========================================================================
  if (changePwForm) {
    changePwForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const session = getTeamSession();
      if (!session) return;

      const currentPw = document.getElementById("dashCurrentPw")?.value || "";
      const newPw = document.getElementById("dashNewPw")?.value || "";
      const confirmPw = document.getElementById("dashConfirmPw")?.value || "";

      if (newPw !== confirmPw) {
        alert("New password and confirmation do not match!");
        return;
      }
      if (newPw.length < 5) {
        alert("Password must be at least 5 characters long.");
        return;
      }

      const users = getStoredTeamUsers();
      const targetUser = users.find(u => u.username.toLowerCase() === session.username.toLowerCase());

      if (!targetUser || targetUser.password !== currentPw) {
        alert("Current password is incorrect.");
        return;
      }

      targetUser.password = newPw;
      saveTeamUsers(users);
      changePwForm.reset();
      showAdminToast("🔒 Password updated successfully!");
    });
  }

  // ========================================================================
  // 7. Load & Save Settings
  // ========================================================================
  function loadSettingsIntoForm() {
    const s = getStoredSettings();
    if (settingEmail) settingEmail.value = s.notificationEmail || "contact@dreamhomeindore.com";
    if (settingPhone) settingPhone.value = s.notificationPhone || "8251009855";
    if (settingEmailEnabled) settingEmailEnabled.checked = s.emailNotificationsEnabled !== false;
    if (settingAutoWa) settingAutoWa.checked = s.autoOpenWhatsApp !== false;
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener("click", () => {
      const email = settingEmail?.value.trim() || "contact@dreamhomeindore.com";
      const phone = settingPhone?.value.trim() || "8251009855";
      const emailEnabled = settingEmailEnabled?.checked || false;
      const autoWa = settingAutoWa?.checked || false;

      saveSettings({
        notificationEmail: email,
        notificationPhone: phone,
        emailNotificationsEnabled: emailEnabled,
        autoOpenWhatsApp: autoWa
      });

      showAdminToast("💾 Notification & WhatsApp settings saved!");
    });
  }

  // Test Email Alert
  if (btnTestEmail) {
    btnTestEmail.addEventListener("click", () => {
      const email = settingEmail?.value.trim() || "";
      if (!email) {
        alert("Please enter a destination email address first.");
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
            testEmailStatus.innerHTML = `<span style="color: #15803d; font-weight: 700;">✅ Test email dispatched to ${email}! Check your inbox (or Spam/Promotions folder).</span>`;
          }
          showAdminToast("📧 Test email dispatched successfully!");
        })
        .catch(err => {
          if (testEmailStatus) {
            testEmailStatus.innerHTML = `<span style="color: #dc2626;">❌ Transmission error: ${err.message}. Please check connection.</span>`;
          }
        });
    });
  }

  // Test WhatsApp Alert Link
  if (btnTestWa) {
    btnTestWa.addEventListener("click", () => {
      const phone = (settingPhone?.value || "8251009855").replace(/\D/g, "");
      const sampleText = encodeURIComponent(
        "🚨 *TEST LEAD ALERT - DREAM HOME INDORE* 🚨\n\n" +
        "This is a test notification verifying your WhatsApp lead alert integration.\n" +
        "Your phone number is correctly configured to receive client queries!"
      );
      window.open(`https://wa.me/91${phone}?text=${sampleText}`, "_blank");
    });
  }

  // Export CSV
  if (btnDashExportCsv) {
    btnDashExportCsv.addEventListener("click", () => {
      const bookings = getStoredBookings();
      if (bookings.length === 0) {
        showAdminToast("No leads available to export.");
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
      showAdminToast("📥 Leads exported successfully to CSV!");
    });
  }

  // Reset defaults
  if (btnResetAllDefaults) {
    btnResetAllDefaults.addEventListener("click", () => {
      if (confirm("Reset all property data to default verified Indore listings?")) {
        resetPropertiesToDefault();
        renderPropertiesTable();
        showAdminToast("Data reset to defaults.");
      }
    });
  }

  // ========================================================================
  // Global Window Helpers for Inline Table Actions
  // ========================================================================
  window.dashDeleteProperty = function (id) {
    if (confirm("Are you sure you want to delete this property listing?")) {
      const props = getStoredProperties().filter(p => p.id !== id);
      savePropertiesToStorage(props);
      renderPropertiesTable();
      showAdminToast("Property listing deleted.");
    }
  };

  window.dashDeleteLead = function (id) {
    if (confirm("Delete this inquiry from leads list?")) {
      deleteBooking(id);
      renderLeadsTable();
      showAdminToast("Inquiry deleted.");
    }
  };

  window.dashChangeLeadStatus = function (id, newStatus) {
    updateBookingStatus(id, newStatus);
    renderLeadsTable();
    showAdminToast(`Status updated to "${newStatus}"`);
  };

  window.dashDeleteTeamUser = function (username) {
    if (confirm(`Are you sure you want to remove team account "${username}"?`)) {
      const users = getStoredTeamUsers().filter(u => u.username !== username);
      saveTeamUsers(users);
      renderTeamTable();
      showAdminToast(`Team user "${username}" removed.`);
    }
  };

  window.dashChatClientWa = function (phone, name) {
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const text = encodeURIComponent(`Hello ${name}! I am calling from Dream Home Real Estate Indore regarding your property inquiry. How may I assist you today?`);
    window.open(`https://wa.me/91${cleanPhone}?text=${text}`, "_blank");
  };

  window.dashForwardLeadWa = function (leadId) {
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

  function showAdminToast(message) {
    let toast = document.getElementById("adminToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "adminToast";
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

