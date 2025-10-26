interface OrderItem {
  productId: number;
  size?: string;
  additives?: string[];
  quantity: number;
}

interface OrderSummary {
  totalPrice: number;
  address: string;
  payment: string;
  items: OrderItem[];
}

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve order summary from localStorage
  const orderData: OrderSummary = JSON.parse(
    localStorage.getItem("orderSummary") || "{}"
  );

  // Select DOM elements
  const orderItemsContainer = document.getElementById(
    "order-items"
  ) as HTMLElement;
  const orderTotal = document.getElementById("order-total") as HTMLElement;
  const orderAddress = document.getElementById("order-address") as HTMLElement;
  const orderPayment = document.getElementById("order-payment") as HTMLElement;
  const backHome = document.getElementById("back-home") as HTMLButtonElement;

  // Check if there’s data
  if (!orderData.items || orderData.items.length === 0) {
    orderItemsContainer.innerHTML = "<p>No order data found.</p>";
    return;
  }

  // Render each ordered item
  orderItemsContainer.innerHTML = orderData.items
    .map(
      (item: OrderItem, index: number) => `
      <div class="receipt-item">
        <span>${index + 1}. Product #${item.productId}</span>
        <span>Size: ${item.size?.toUpperCase() || "-"}</span>
        <span>Additives: ${
          item.additives?.length ? item.additives.join(", ") : "None"
        }</span>
        <span>Qty: ${item.quantity}</span>
      </div>
    `
    )
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
