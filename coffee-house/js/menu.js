import { menuItems } from "../Data/products.js";

const menuGrid = document.getElementById("menu-grid");
const filterButtons = document.querySelectorAll(".filter-btn");

// Modal elements
const modal = document.getElementById("menuModal");
const closeModal = document.getElementById("closeModal");
const closeButton = document.getElementById("closeButton");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const sizeOptions = document.getElementById("sizeOptions");
const additivesOptions = document.getElementById("additivesOptions");

let basePrice = 0;

// Display menu cards
function displayMenu(category) {
  menuGrid.innerHTML = "";

  const filtered =
    category === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === category);

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("menu-card");

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="menu-card-content">
        <div class="menu-desc">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
        <div class="price">$${item.price}</div>
      </div>
    `;

    // 🔥 Click to open modal
    card.addEventListener("click", () => openModal(item));

    menuGrid.appendChild(card);
  });
}

// Open modal with selected coffee
function openModal(item) {
  modal.style.display = "flex";
  modalImage.src = item.image;
  modalName.textContent = item.name;
  modalDescription.textContent = item.description;
  basePrice = parseFloat(item.price);
  modalPrice.textContent = `$${basePrice.toFixed(2)}`;

  // Sizes
  sizeOptions.innerHTML = "";
  Object.keys(item.sizes).forEach((key) => {
    const btn = document.createElement("button");
    btn.textContent = `${key.toUpperCase()} (${item.sizes[key].size})`;
    btn.addEventListener("click", () => {
      setActive(btn, sizeOptions);
      updatePrice(item, key);
    });
    sizeOptions.appendChild(btn);
  });

  // Additives
  additivesOptions.innerHTML = "";
  item.additives.forEach((add) => {
    const btn = document.createElement("button");
    btn.textContent = add.name;
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      updatePrice(item);
    });
    additivesOptions.appendChild(btn);
  });
}

// Update total price dynamically
function updatePrice(item, selectedSizeKey) {
  let total = basePrice;

  // Add size price
  const activeSize = sizeOptions.querySelector(".active");
  if (activeSize) {
    const sizeKey = activeSize.textContent[0].toLowerCase();
    total += parseFloat(item.sizes[sizeKey]["add-price"]);
  }

  // Add additives price
  const activeAdditives = additivesOptions.querySelectorAll(".active");
  activeAdditives.forEach(() => (total += 0.5));

  modalPrice.textContent = `$${total.toFixed(2)}`;
}

// Set active state for buttons
function setActive(selectedBtn, container) {
  container
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.remove("active"));
  selectedBtn.classList.add("active");
}

// Filter button click event
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    const category = btn.getAttribute("data-category");
    displayMenu(category);
  });
});

// Close modal
closeModal.onclick = () => (modal.style.display = "none");
closeButton.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Initialize
displayMenu("all");
