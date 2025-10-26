var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
// menu.ts

const API_URL =
  "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products";
let allProducts = [];
document.addEventListener("DOMContentLoaded", () => {
  // Grab elements AFTER DOM is ready
  const menuGrid = document.getElementById("menu-grid");
  const loader = document.getElementById("loader");
  const errorEl = document.getElementById("error");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("menuModal");
  const closeModalBtn = document.getElementById("closeModal");
  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalDescription = document.getElementById("modalDescription");
  const sizeOptions = document.getElementById("sizeOptions");
  const additivesOptions = document.getElementById("additivesOptions");
  const modalPrice = document.getElementById("modalPrice");
  const closeButton = document.getElementById("closeButton");
  const addCartButton = document.getElementById("addCartButton");
  let selectedSizePrice = 0;
  let selectedAdditives = [];
  const Images = {
    "irish coffee": "./assets/images/menu/coffee-1.svg",
    "kahlua coffee": "./assets/images/menu/coffee-2.svg",
    "honey raf": "./assets/images/menu/coffee-3.svg",
    "ice cappuccino": "./assets/images/menu/coffee-4.svg",
    espresso: "./assets/images/menu/coffee-5.svg",
    latte: "./assets/images/menu/coffee-6.svg",
    "latte macchiato": "./assets/images/menu/coffee-7.svg",
    "coffee with cognac": "./assets/images/menu/coffee-8.svg",
    moroccan: "./assets/images/menu/tea-1.svg",
    ginger: "./assets/images/menu/tea-2.svg",
    cranberry: "./assets/images/menu/tea-3.svg",
    "sea buckthorn": "./assets/images/menu/tea-4.svg",
    "marble cheesecake": "./assets/images/menu/dessert-1.svg",
    "red velvet": "./assets/images/menu/dessert-2.svg",
    cheesecakes: "./assets/images/menu/dessert-3.svg",
    "creme brulee": "./assets/images/menu/dessert-4.svg",
    pancakes: "./assets/images/menu/dessert-5.svg",
    "honey cake": "./assets/images/menu/dessert-6.svg",
    "chocolate cake": "./assets/images/menu/dessert-7.svg",
    "black forest": "./assets/images/menu/dessert-8.svg",
  };
  function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  function fetchProducts() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (loader) loader.style.display = "block";
        if (errorEl) errorEl.textContent = "";
        const response = yield fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = yield response.json();
        // store in global list for filtering
        allProducts = Array.isArray(result.data) ? result.data : [];
        console.log("Fetched products:", allProducts);
        renderProducts(allProducts);
      } catch (err) {
        console.error(err);
        if (errorEl)
          errorEl.textContent =
            "Something went wrong while loading products ☕";
        renderProducts([]); // show empty state
      } finally {
        if (loader) loader.style.display = "none";
      }
    });
  }
  function renderProducts(products) {
    if (!menuGrid) return;
    menuGrid.innerHTML = "";
    if (!products.length) {
      menuGrid.innerHTML = `<p class="no-results">No products found.</p>`;
      return;
    }
    products.forEach((product) => {
      // normalize name to match keys in Images map
      const normalizedName = product.name.toLowerCase();
      const imageSrc = Images[normalizedName];
      const card = document.createElement("div");
      card.className = "menu-card";
      card.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}">
        <div class="menu-card-content">
          <div class="menu-desc">
            <h3>${product.name}</h3>
            <p>${product.description || ""}</p>
          </div>
          <div class="price">$${product.price}</div>
        </div>
      `;
      card.addEventListener("click", () => openModal(product.id));
      menuGrid.appendChild(card);
    });
  }
  function setupFilters() {
    if (!filterButtons.length) {
      console.warn("No filter buttons found (.filter-btn)");
      return;
    }
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        var _a;
        // UI: toggle active class
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const rawCategory =
          (_a = btn.dataset.category) !== null && _a !== void 0 ? _a : "all";
        const category = String(rawCategory).toLowerCase().trim();
        console.log("Filter clicked:", category);
        if (category === "all") {
          renderProducts(allProducts);
          return;
        }
        // Normalize product.category before comparison
        const filtered = allProducts.filter((p) => {
          var _a;
          return (
            String((_a = p.category) !== null && _a !== void 0 ? _a : "")
              .toLowerCase()
              .trim() === category
          );
        });
        console.log("Filtered length:", filtered.length);
        renderProducts(filtered);
      });
    });
  }
  function openModal(productId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const res = yield fetch(
          `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${productId}`
        );
        const data = yield res.json();
        const product = data.data;
        // 🖼️ Fill modal content
        modalImage.src = Images[product.name.toLowerCase()];
        modalName.textContent = product.name;
        modalDescription.textContent = product.description;
        modalPrice.textContent = `$${product.price}`;
        // Reset selections
        selectedSizePrice = 0;
        selectedAdditives = [];
        // 🧩 Render sizes
        sizeOptions.innerHTML = "";
        Object.entries(product.sizes).forEach(([key, sizeData]) => {
          const btn = document.createElement("button");
          btn.classList.add("option-btn", "size-option"); // ✅ added class
          btn.textContent = `${key.toUpperCase()} (${sizeData.size})`;
          btn.addEventListener("click", () => {
            document
              .querySelectorAll(".size-option")
              .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            selectedSizePrice = parseFloat(
              sizeData.discountPrice || sizeData.price
            );
            updateTotal(product);
          });
          sizeOptions.appendChild(btn);
        });
        // 🧂 Render additives
        additivesOptions.innerHTML = "";
        product.additives.forEach((additive, index) => {
          const btn = document.createElement("button");
          btn.classList.add("option-btn", "additive-option"); // ✅ added class
          btn.textContent = `${additive.name} (+$${
            additive.discountPrice || additive.price
          })`;
          btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            if (btn.classList.contains("active")) {
              selectedAdditives.push(index);
            } else {
              selectedAdditives = selectedAdditives.filter((i) => i !== index);
            }
            updateTotal(product);
          });
          additivesOptions.appendChild(btn);
        });
        // 🛒 Add to cart button
        addCartButton.onclick = () => {
          var _a, _b;
          const selectedSize =
            ((_a = document.querySelector(".size-option.active")) === null ||
            _a === void 0
              ? void 0
              : _a.textContent) || "default";
          const selectedAdditivesNames = Array.from(
            document.querySelectorAll(".additive-option.active")
          ).map((el) => el.textContent || "");
          const cart = getCart();
          const newItem = {
            id: product.id,
            name: product.name,
            price: Number(
              ((_b = modalPrice.textContent) === null || _b === void 0
                ? void 0
                : _b.replace("$", "")) || product.price
            ),
            image: Images[product.name.toLowerCase()],
            size: selectedSize,
            additives: selectedAdditivesNames,
            quantity: 1,
          };
          // check if same product with same size exists
          const existing = cart.find(
            (item) => item.id === newItem.id && item.size === newItem.size
          );
          if (existing) {
            existing.quantity += 1;
          } else {
            cart.push(newItem);
          }
          saveCart(cart);
          alert(`${product.name} added to cart 🛒`);
          modal.style.display = "none";
        };
        // Show modal
        modal.style.display = "flex";
      } catch (error) {
        console.error("Error loading product details:", error);
      }
    });
  }
  function updateTotal(product) {
    let total = selectedSizePrice || parseFloat(product.price);
    selectedAdditives.forEach((index) => {
      const additive = product.additives[index];
      total += parseFloat(additive.discountPrice || additive.price);
    });
    modalPrice.textContent = `$${total.toFixed(2)}`;
  }
  // Close modal handlers
  closeModalBtn.addEventListener("click", () => (modal.style.display = "none"));
  closeButton.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
  // initialize
  fetchProducts();
  setupFilters();
});
//# sourceMappingURL=menu.js.map
