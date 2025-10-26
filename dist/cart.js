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
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const token = localStorage.getItem("token");
const loginBtns = document.getElementById("login-btns");
const confirmBtn = document.getElementById("confirm-order");
// --- Helpers ---
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
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
    var _a;
    const additives = (
      (_a = item.additives) === null || _a === void 0 ? void 0 : _a.length
    )
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
      const id = Number(e.target.getAttribute("data-id"));
      removeItemFromCart(id);
    });
  });
}
function removeItemFromCart(id) {
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
confirmBtn === null || confirmBtn === void 0
  ? void 0
  : confirmBtn.addEventListener("click", () =>
      __awaiter(void 0, void 0, void 0, function* () {
        try {
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const items = cart.map((item) => ({
            productId: item.id, // ✅ fixed
            size: (item.size || "").toLowerCase().charAt(0), // optional cleanup
            additives: (item.additives || []).map((a) =>
              a.replace(/\s*\(\+\$[\d.]+\)/, "")
            ),
            quantity: item.quantity,
          }));
          const totalPrice = cart.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          );
          const confirmData = { items, totalPrice };
          console.log("Sending confirmData:", confirmData); // 🧠 debug log
          const response = yield fetch(
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
            const errData = yield response.json().catch(() => ({}));
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
          window.location.href = "/confirm.html";
        } catch (err) {
          console.error(err);
          alert("Something went wrong while confirming your order.");
        }
      })
    );

//# sourceMappingURL=cart.js.map
