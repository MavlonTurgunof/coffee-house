document.addEventListener("DOMContentLoaded", () => {
  // Retrieve order summary from localStorage
  const orderData = JSON.parse(localStorage.getItem("orderSummary") || "{}");
  // Select DOM elements
  const orderItemsContainer = document.getElementById("order-items");
  const orderTotal = document.getElementById("order-total");
  const orderAddress = document.getElementById("order-address");
  const orderPayment = document.getElementById("order-payment");
  const backHome = document.getElementById("back-home");
  // Check if there’s data
  if (!orderData.items || orderData.items.length === 0) {
    orderItemsContainer.innerHTML = "<p>No order data found.</p>";
    return;
  }
  // Render each ordered item
  orderItemsContainer.innerHTML = orderData.items
    .map((item, index) => {
      var _a, _b;
      return `
      <div class="receipt-item">
        <span>${index + 1}. Product #${item.productId}</span>
        <span>Size: ${
          ((_a = item.size) === null || _a === void 0
            ? void 0
            : _a.toUpperCase()) || "-"
        }</span>
        <span>Additives: ${
          ((_b = item.additives) === null || _b === void 0 ? void 0 : _b.length)
            ? item.additives.join(", ")
            : "None"
        }</span>
        <span>Qty: ${item.quantity}</span>
      </div>
    `;
    })
    .join("");
  // Fill order summary info
  orderAddress.textContent = orderData.address || "Not provided";
  orderPayment.textContent = orderData.payment || "Not selected";
  orderTotal.textContent = `$${orderData.totalPrice.toFixed(2)}`;
  // Handle "Back to Home" button
  backHome.addEventListener("click", () => {
    localStorage.removeItem("orderSummary");
    window.location.href = "/";
  });
});

//# sourceMappingURL=confirm.js.map
