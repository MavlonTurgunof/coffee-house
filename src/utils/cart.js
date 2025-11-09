import { getJSON, setJSON } from "./storage";

const CART_KEY = "cart";
const WISHLIST_KEY = "wishlist";

const buildLineId = (productId, sizeKey, additiveKeys = []) =>
  `${productId}::${sizeKey || ""}::${[...additiveKeys].sort().join(",")}`;

export const getCart = () => getJSON(CART_KEY);
export const getWishlist = () => getJSON(WISHLIST_KEY);

export const addToCart = (line) => {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.lineId === line.lineId);
  if (idx >= 0) {
    cart[idx].qty += line.qty || 1;
  } else {
    cart.push(line);
  }
  setJSON(CART_KEY, cart);
  return cart;
};

export const updateQty = (lineId, qty) => {
  const cart = getCart().map((x) => (x.lineId === lineId ? { ...x, qty } : x));
  setJSON(CART_KEY, cart);
  return cart;
};

export const removeFromCart = (lineId) => {
  const cart = getCart().filter((x) => x.lineId !== lineId);
  setJSON(CART_KEY, cart);
  return cart;
};

export const clearCart = () => setJSON(CART_KEY, []);

export const addToWishlist = (item) => {
  const list = getWishlist();
  if (!list.some((x) => x.id === item.id)) {
    list.push(item);
    setJSON(WISHLIST_KEY, list);
  }
  return list;
};

export const removeFromWishlist = (id) => {
  const list = getWishlist().filter((x) => x.id !== id);
  setJSON(WISHLIST_KEY, list);
  return list;
};
