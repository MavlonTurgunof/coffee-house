// menu.ts
import { type CoffeeItem } from "./main";

interface CartItem {
  id: number;
  name: string;
  price: number;

  image: string;
  size?: string;
  additives?: string[];
  quantity: number;
}

const API_URL =
  "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products";

let allProducts: CoffeeItem[] = [];

document.addEventListener("DOMContentLoaded", () => {
  // Grab elements AFTER DOM is ready
  const menuGrid = document.getElementById("menu-grid") as HTMLElement;
  const loader = document.getElementById("loader") as HTMLElement;
  const errorEl = document.getElementById("error") as HTMLElement;
  const filterButtons =
    document.querySelectorAll<HTMLButtonElement>(".filter-btn");

  const modal = document.getElementById("menuModal") as HTMLElement;
  const closeModalBtn = document.getElementById("closeModal") as HTMLElement;
  const modalImage = document.getElementById("modalImage") as HTMLImageElement;
  const modalName = document.getElementById("modalName") as HTMLElement;
  const modalDescription = document.getElementById(
    "modalDescription"
  ) as HTMLElement;
  const sizeOptions = document.getElementById("sizeOptions") as HTMLElement;
  const additivesOptions = document.getElementById(
    "additivesOptions"
  ) as HTMLElement;
  const modalPrice = document.getElementById("modalPrice") as HTMLElement;
  const closeButton = document.getElementById("closeButton") as HTMLElement;
  const addCartButton = document.getElementById(
    "addCartButton"
  ) as HTMLButtonElement;
  let selectedSizePrice = 0;
  let selectedAdditives: number[] = [];

  const Images: Record<string, string> = {
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

  function getCart(): CartItem[] {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }

  function saveCart(cart: CartItem[]) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  async function fetchProducts() {
    try {
      if (loader) loader.style.display = "block";
      if (errorEl) errorEl.textContent = "";

      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      // store in global list for filtering
      allProducts = Array.isArray(result.data) ? result.data : [];
      console.log("Fetched products:", allProducts);

      renderProducts(allProducts);
    } catch (err) {
      console.error(err);
      if (errorEl)
        errorEl.textContent = "Something went wrong while loading products ☕";
      renderProducts([]); // show empty state
    } finally {
      if (loader) loader.style.display = "none";
    }
  }

  function renderProducts(products: CoffeeItem[]) {
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
        // UI: toggle active class
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const rawCategory = btn.dataset.category ?? "all";
        const category = String(rawCategory).toLowerCase().trim();

        console.log("Filter clicked:", category);

        if (category === "all") {
          renderProducts(allProducts);
          return;
        }

        // Normalize product.category before comparison
        const filtered = allProducts.filter(
          (p) =>
            String(p.category ?? "")
              .toLowerCase()
              .trim() === category
        );

        console.log("Filtered length:", filtered.length);
        renderProducts(filtered);
      });
    });
  }

  async function openModal(productId: number) {
    try {
      const res = await fetch(
        `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${productId}`
      );
      const data = await res.json();
      const product = data.data;

      // 🖼️ Fill modal content
      modalImage.src = Images[product.name.toLowerCase()]!;
      modalName.textContent = product.name;
      modalDescription.textContent = product.description;
      modalPrice.textContent = `$${product.price}`;

      // Reset selections
      selectedSizePrice = 0;
      selectedAdditives = [];

      // 🧩 Render sizes
      sizeOptions.innerHTML = "";
      Object.entries(product.sizes).forEach(
        ([key, sizeData]: [string, any]) => {
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
        }
      );

      // 🧂 Render additives
      additivesOptions.innerHTML = "";
      product.additives.forEach((additive: any, index: number) => {
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
        const selectedSize =
          document.querySelector(".size-option.active")?.textContent ||
          "default";

        const selectedAdditivesNames = Array.from(
          document.querySelectorAll(".additive-option.active")
        ).map((el) => el.textContent || "");

        const cart = getCart();

        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: Number(
            modalPrice.textContent?.replace("$", "") || product.price
          ),
          image: Images[product.name.toLowerCase()]!,
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
  }

  function updateTotal(product: any) {
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
