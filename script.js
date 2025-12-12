document.addEventListener("DOMContentLoaded", () => {
  const addContactBtn = document.getElementById("addContactBtn");
  const contactModal = document.getElementById("contactModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const contactForm = document.getElementById("contactForm");
  const modalTitle = document.getElementById("modalTitle");
  const contactsContainer = document.getElementById("contacts-container");
  const searchInput = document.getElementById("searchInput");
  const avatarInput = document.getElementById("avatarInput");
  const avatarPreview = document.getElementById("avatarPreview");
  const avatarPathInput = document.getElementById("avatarPath");

  // Error Modal Elements
  const errorModal = document.getElementById("errorModal");
  const errorModalBackdrop = document.getElementById("errorModalBackdrop");
  const errorModalTitle = document.getElementById("errorModalTitle");
  const errorModalMessage = document.getElementById("errorModalMessage");
  const errorModalOkBtn = document.getElementById("errorModalOkBtn");

  // Containers for special lists
  const favoritesContainer = document.getElementById("favorites-container");
  const emergencyContainer = document.getElementById("emergency-container");
  const favoritesContainerMobile = document.getElementById(
    "favorites-container-mobile"
  );
  const emergencyContainerMobile = document.getElementById(
    "emergency-container-mobile"
  );

  // Stats elements
  const totalCountEl = document.getElementById("total-count");
  const favoritesCountEl = document.getElementById("favorites-count");
  const emergencyCountEl = document.getElementById("emergency-count");

  // Form inputs
  const contactIdInput = document.getElementById("contactId");
  const contactNameInput = document.getElementById("contactName");
  const contactPhoneInput = document.getElementById("contactPhone");
  const contactEmailInput = document.getElementById("contactEmail");
  const contactAddressInput = document.getElementById("contactAddress");
  const contactGroupInput = document.getElementById("contactGroup");
  const contactNotesInput = document.getElementById("contactNotes");
  const contactFavoriteInput = document.getElementById("contactFavorite");
  const contactEmergencyInput = document.getElementById("contactEmergency");

  // --- State ---
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  let editingContactId = null;

  // --- Functions ---

  // Save contacts to localStorage
  const saveContacts = () => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  };

  // Generate a unique ID
  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return parts[0][0];
  };

  // Render all contacts and stats
  const renderContacts = (searchTerm = "") => {
    contactsContainer.innerHTML = "";
    let filteredContacts = contacts;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredContacts = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.phone.includes(term) ||
          (c.email && c.email.toLowerCase().includes(term))
      );
    }

    if (filteredContacts.length === 0) {
      contactsContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fa-solid fa-address-book  text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 font-medium">No contacts found</p>
                    <p class="text-gray-400 text-sm mt-1">Click "Add Contact" to get started</p>
                </div>
            `;
    } else {
      filteredContacts.forEach((contact) => {
        contactsContainer.appendChild(createContactCard(contact));
      });
    }
    updateStats();
    renderSpecialLists();
  };

  // Create a contact card element
  const createContactCard = (contact) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 relative group";
    card.dataset.contactId = contact.id;

    const avatarContent = contact.avatar
      ? `<img src="${contact.avatar}" alt="${contact.name}" class="w-full h-full object-cover rounded-xl">`
      : `<span class="text-white font-bold text-xl">${getInitials(
          contact.name
        )}</span>`;

    const groupColors = {
      family: "from-green-400 to-emerald-500",
      friends: "from-blue-400 to-indigo-500",
      work: "from-purple-400 to-pink-500",
      school: "from-yellow-400 to-orange-500",
      other: "from-gray-400 to-slate-500",
    };
    const avatarBg = contact.avatar
      ? ""
      : `bg-gradient-to-br ${
          groupColors[contact.group] || "from-violet-500 to-indigo-600"
        }`;

    card.innerHTML = `
            <div class="flex items-start gap-4">
                <div class="w-16 h-16 ${avatarBg} rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0 overflow-hidden">
                    ${avatarContent}
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 text-lg truncate">${
                      contact.name
                    }</h3>
                    <div class="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <i class="fa-solid fa-phone text-xs"></i>
                        <span>${contact.phone}</span>
                    </div>
                    ${
                      contact.email
                        ? `
                    <div class="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <i class="fa-solid fa-envelope text-xs"></i>
                        <span class="truncate">${contact.email}</span>
                    </div>`
                        : ""
                    }
                    ${
                      contact.address
                        ? `
                    <div class="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <i class="fa-solid fa-location-dot text-xs"></i>
                        <span class="truncate">${contact.address}</span>
                    </div>`
                        : ""
                    }
                </div>
            </div>
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div class="flex gap-2">
                    ${
                      contact.favorite
                        ? '<i class="fa-solid fa-star text-amber-400"></i>'
                        : ""
                    }
                    ${
                      contact.emergency
                        ? '<i class="fa-solid fa-heart-pulse text-rose-500"></i>'
                        : ""
                    }
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="editContact('${
                      contact.id
                    }')" class="w-8 h-8 flex items-center justify-center text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                        <i class="fa-solid fa-pen text-sm"></i>
                    </button>
                    <button onclick="deleteContact('${
                      contact.id
                    }')" class="w-8 h-8 flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <i class="fa-solid fa-trash text-sm"></i>
                    </button>
                </div>
            </div>
        `;
    return card;
  };

  // Render favorites and emergency lists
  const renderSpecialLists = () => {
    const favorites = contacts.filter((c) => c.favorite);
    const emergency = contacts.filter((c) => c.emergency);

    // Render desktop lists with specific empty messages
    renderList(favoritesContainer, favorites, "No favorites yet");
    renderList(emergencyContainer, emergency, "No emergency contacts");

    // Render mobile lists with specific empty messages
    renderList(
      favoritesContainerMobile,
      favorites,
      "No starred contacts yet.",
      true
    );
    renderList(
      emergencyContainerMobile,
      emergency,
      "No urgent contacts yet.",
      true
    );
  };

  // Helper to render a list
  const renderList = (
    container,
    list,
    emptyMessage = "No contacts yet.",
    isMobile = false
  ) => {
    container.innerHTML = "";
    if (list.length === 0) {
      container.innerHTML = `<p class="text-center text-gray-400 text-sm py-4">${emptyMessage}</p>`;
      return;
    }
    list.forEach((contact) => {
      const item = document.createElement("div");
      item.className = isMobile
        ? "flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
        : "flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors";

      const avatarContent = contact.avatar
        ? `<img src="${contact.avatar}" alt="${contact.name}" class="w-full h-full object-cover rounded-lg">`
        : `<span class="text-white font-bold text-sm">${getInitials(
            contact.name
          )}</span>`;

      const groupColors = {
        family: "from-green-400 to-emerald-500",
        friends: "from-blue-400 to-indigo-500",
        work: "from-purple-400 to-pink-500",
        school: "from-yellow-400 to-orange-500",
        other: "from-gray-400 to-slate-500",
      };
      const avatarBg = contact.avatar
        ? ""
        : `bg-gradient-to-br ${
            groupColors[contact.group] || "from-violet-500 to-indigo-600"
          }`;

      item.innerHTML = `
                <div class="w-10 h-10 ${avatarBg} rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0 overflow-hidden">
                    ${avatarContent}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 text-sm truncate">${contact.name}</p>
                    <p class="text-xs text-gray-500 truncate">${contact.phone}</p>
                </div>
            `;
      item.addEventListener("click", () => editContact(contact.id));
      container.appendChild(item);
    });
  };

  // Update statistics
  const updateStats = () => {
    totalCountEl.textContent = contacts.length;
    favoritesCountEl.textContent = contacts.filter((c) => c.favorite).length;
    emergencyCountEl.textContent = contacts.filter((c) => c.emergency).length;
  };

  // Show modal
  const showModal = (contact = null) => {
    contactModal.classList.remove("hidden");
    modalTitle.textContent = contact ? "Edit Contact" : "Add New Contact";
    editingContactId = contact ? contact.id : null;

    if (contact) {
      contactIdInput.value = contact.id;
      contactNameInput.value = contact.name;
      contactPhoneInput.value = contact.phone;
      contactEmailInput.value = contact.email || "";
      contactAddressInput.value = contact.address || "";
      contactGroupInput.value = contact.group || "";
      contactNotesInput.value = contact.notes || "";
      contactFavoriteInput.checked = contact.favorite || false;
      contactEmergencyInput.checked = contact.emergency || false;
      avatarPathInput.value = contact.avatar || "";
      updateAvatarPreview(contact.avatar);
    } else {
      contactForm.reset();
      contactIdInput.value = "";
      avatarPathInput.value = "";
      updateAvatarPreview(null);
    }
  };

  // Hide modal
  const hideModal = () => {
    contactModal.classList.add("hidden");
    contactForm.reset();
    editingContactId = null;
  };

  // Show error modal
  const showErrorModal = (title, message) => {
    errorModalTitle.textContent = title;
    errorModalMessage.textContent = message;
    errorModal.classList.remove("hidden");
  };

  // Hide error modal
  const hideErrorModal = () => {
    errorModal.classList.add("hidden");
  };

  // Update avatar preview
  const updateAvatarPreview = (path) => {
    if (path) {
      avatarPreview.innerHTML = `<img src="${path}" alt="Avatar" class="w-full h-full object-cover rounded-2xl">`;
    } else {
      avatarPreview.innerHTML = '<i class="fa-solid fa-user"></i>';
    }
  };

  // Handle avatar file change
  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        avatarPathInput.value = event.target.result;
        updateAvatarPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // --- Event Listeners ---
  addContactBtn.addEventListener("click", () => showModal());
  closeModalBtn.addEventListener("click", hideModal);
  cancelModalBtn.addEventListener("click", hideModal);
  modalBackdrop.addEventListener("click", hideModal);
  errorModalOkBtn.addEventListener("click", hideErrorModal);
  errorModalBackdrop.addEventListener("click", hideErrorModal);

  // Form submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = contactNameInput.value.trim();
    const phone = contactPhoneInput.value.trim();
    const email = contactEmailInput.value.trim();
    const address = contactAddressInput.value.trim();
    const group = contactGroupInput.value;
    const notes = contactNotesInput.value.trim();
    const favorite = contactFavoriteInput.checked;
    const emergency = contactEmergencyInput.checked;
    const avatar = avatarPathInput.value;

    // Validation
    if (!name) {
      showErrorModal("Missing Name", "Please enter a name for the contact!");
      return;
    }
    if (!phone) {
      showErrorModal(
        "Missing Phone Number",
        "Please enter a phone number for the contact!"
      );
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      showErrorModal("Invalid Email", "Please enter a valid email address.");
      return;
    }

    const contactData = {
      name,
      phone,
      email,
      address,
      group,
      notes,
      favorite,
      emergency,
      avatar,
    };

    if (editingContactId) {
      // Edit existing contact
      const index = contacts.findIndex((c) => c.id === editingContactId);
      if (index !== -1) {
        contacts[index] = { ...contacts[index], ...contactData };
      }
    } else {
      // Add new contact
      contacts.unshift({ id: generateId(), ...contactData });
    }

    saveContacts();
    renderContacts(searchInput.value);
    hideModal();
  });

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    renderContacts(e.target.value);
  });

  // Global functions for inline onclick handlers
  window.editContact = (id) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      showModal(contact);
    }
  };

  window.deleteContact = (id) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      contacts = contacts.filter((c) => c.id !== id);
      saveContacts();
      renderContacts(searchInput.value);
    }
  };

  // Initial render
  renderContacts();
});
