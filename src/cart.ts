interface CartItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  size?: string;
  additives?: string[];
  quantity: number;
}

const cartItemsContainer = document.getElementById("cart-items") as HTMLElement;
const totalPriceElement = document.getElementById("total-price") as HTMLElement;
const token = localStorage.getItem("token");
const loginBtns = document.getElementById("login-btns") as HTMLElement;
const confirmBtn = document.getElementById(
  "confirm-order"
) as HTMLButtonElement;

// --- Helpers ---
function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Render cart items ---
function renderCartItems() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceElement.textContent = "$0.00";
    return;
  }

  cart.forEach((item) => {
    const additives = item.additives?.length
      ? item.additives.join(", ")
      : "None";
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="cart-item-left">
        <img
          src="./assets/icons/trash.svg"
          alt="delete"
          width="24"
          height="24"
          class="delete-item"
          data-id="${item.id}"
        />
        <img
          src="${item.image}"
          alt="${item.name}"
          width="100"
          height="100"
          class="cart-item-pic"
        />
        <div class="cart-item-name">
          <h2>${item.name}</h2>
          <div><p>${item.size || "Default"}</p><p>${additives}</p></div>
        </div>
      </div>
      <h2 class="cart-item-price">$${(item.price * item.quantity).toFixed(
        2
      )}</h2>
    `;
    cartItemsContainer.appendChild(div);
  });

  totalPriceElement.textContent = `$${total.toFixed(2)}`;
  addDeleteListeners();
}

// --- Delete logic ---
function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete-item");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number((e.target as HTMLElement).getAttribute("data-id"));
      removeItemFromCart(id);
    });
  });
}

function removeItemFromCart(id: number) {
  const updatedCart = getCart().filter((item) => item.id !== id);
  saveCart(updatedCart);
  renderCartItems();
}

// --- Initial render ---
renderCartItems();

// --- Show confirm button only if logged in ---
if (token) {
  loginBtns.style.display = "none";
  confirmBtn.style.display = "block";
}

// --- Confirm order ---
confirmBtn?.addEventListener("click", async () => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const items = cart.map((item: any) => ({
      productId: item.id, // ✅ fixed
      size: (item.size || "").toLowerCase().charAt(0), // optional cleanup
      additives: (item.additives || []).map((a: string) =>
        a.replace(/\s*\(\+\$[\d.]+\)/, "")
      ),
      quantity: item.quantity,
    }));

    const totalPrice = cart.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price,
      0
    );

    const confirmData = { items, totalPrice };
    console.log("Sending confirmData:", confirmData); // 🧠 debug log

    const response = await fetch(
      "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/orders/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(confirmData),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Server error:", errData);
      throw new Error("Order confirmation failed");
    }

    localStorage.removeItem("cart");
    localStorage.setItem(
      "orderSummary",
      JSON.stringify({
        totalPrice,
        address: localStorage.getItem("address") || "Not provided",
        payment: localStorage.getItem("payment") || "Cash",
        items,
      })
    );

    window.location.href = "./confirm.html";
  } catch (err) {
    console.error(err);
    alert("Something went wrong while confirming your order.");
  }
});
