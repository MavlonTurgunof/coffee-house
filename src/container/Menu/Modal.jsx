// ProductModal.jsx (only the changed/added parts shown)
import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.svg";
import request from "../../components/config";
import { MenuImages } from "../../Data/MenuData";
import { addToCart, addToWishlist } from "../../utils/cart";

export default function Modal({ open, onClose, productId }) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [sizeKey, setSizeKey] = useState(null);
  const [additiveKeys, setAdditiveKeys] = useState(new Set());
  const [qty, setQty] = useState(1);

  const getProduct = async () => {
    if (!open || !productId) return;
    setIsLoading(true);
    try {
      const res = await request.get(`/products/${productId}`);
      const item = res.data?.data ?? null;
      setProduct(item);

      const firstKey = item?.sizes ? Object.keys(item.sizes)[0] : null;
      setSizeKey(firstKey);
      setAdditiveKeys(new Set());
      setQty(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [open, productId]);

  if (!open) return null;

  const toNum = (v) => (v ? parseFloat(v) : 0);
  const basePrice = (() => {
    if (!product) return 0;
    if (product.sizes && sizeKey && product.sizes[sizeKey]) {
      const s = product.sizes[sizeKey];
      return toNum(s.discountPrice ?? s.price);
    }
    return toNum(product.discountPrice ?? product.price);
  })();

  const additivesTotal = (() => {
    if (!product?.additives) return 0;
    return [...additiveKeys].reduce((sum, key) => {
      const a = product.additives.find((x) => x.name === key);
      return sum + toNum(a?.discountPrice ?? a?.price);
    }, 0);
  })();

  const lineTotal = (basePrice + additivesTotal) * qty;

  const toggleAdditive = (name) => {
    setAdditiveKeys((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    const lineId = `${product.id}::${sizeKey || ""}::${[...additiveKeys]
      .sort()
      .join(",")}`;

    addToCart({
      lineId,
      id: product.id,
      name: product.name,
      imageKey: product.name?.toLowerCase?.() || "",
      sizeKey: sizeKey,
      sizeLabel: sizeKey ? product.sizes[sizeKey]?.size : null,
      additives: [...additiveKeys],
      unitPrice: basePrice + additivesTotal,
      qty,
      productRaw: product,
    });

    onClose();
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    addToWishlist({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
    });
  };

  const normalizedName = product?.name?.toLowerCase?.() || "";
  const imgSrc = MenuImages?.[normalizedName] || Logo;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-bg text-text1 w-fit rounded-[40px] overflow-hidden p-10">
        {!isLoading && product && (
          <div className="flex gap-5">
            <img
              src={imgSrc}
              alt={product.name}
              className="w-[310px] h-[310px] rounded-[40px] object-contain bg-card"
            />
            <div className="flex-1">
              <h1 className="text-[24px] font-semibold">{product.name}</h1>
              <p className="text-[16px]">{product.description}</p>

              {product.sizes && (
                <div className="mt-5">
                  <h2 className="text-lg font-medium mb-2">Size</h2>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(product.sizes).map(([key, s]) => {
                      const active = key === sizeKey;
                      const price = toNum(s.discountPrice ?? s.price);
                      return (
                        <button
                          type="button"
                          key={key}
                          onClick={() => setSizeKey(key)}
                          aria-pressed={active}
                          className={`bg-bg px-3 py-2 rounded-xl border text-sm transition outline-none ${
                            active
                              ? "bg-secondary text-text2 border-primary ring-2 ring-primary/30"
                              : "border-border hover:bg-secondary hover:text-text2"
                          }`}
                          title={s.size}
                        >
                          <div className="font-semibold">
                            {key.toUpperCase()}
                          </div>
                          <div className="text-xs opacity-80">{s.size}</div>
                          <div className="text-sm">${price.toFixed(2)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {Array.isArray(product.additives) &&
                product.additives.length > 0 && (
                  <div className="mt-5">
                    <h2 className="text-lg font-medium mb-2">Additives</h2>
                    <div className="flex flex-wrap gap-2">
                      {product.additives.map((a) => {
                        const active = additiveKeys.has(a.name);
                        const price = toNum(a.discountPrice ?? a.price);
                        return (
                          <button
                            type="button"
                            key={a.name}
                            onClick={() => toggleAdditive(a.name)}
                            aria-pressed={active}
                            className={`bg-bg px-3 py-2 rounded-xl border text-sm transition outline-none ${
                              active
                                ? "bg-secondary text-text2 border-primary ring-2 ring-primary/30"
                                : "border-border hover:bg-secondary hover:text-text2"
                            }`}
                          >
                            {a.name} • ${price.toFixed(2)}
                          </button>
                        );
                      })}
                    </div>{" "}
                  </div>
                )}

              <div className="mt-6 flex items-center gap-2">
                <div className="flex items-center gap-3">
                  <button
                    className="w-8 h-8 rounded-full border hover:bg-card"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{qty}</span>
                  <button
                    className="w-8 h-8 rounded-full border hover:bg-card"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="text-2xl font-bold">
                  Total: ${lineTotal.toFixed(2)}
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToWishlist}
                    className="px-4 py-2 rounded-xl border hover:bg-secondary transition hover:text-text2"
                  >
                    Add to wishlist
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 rounded-xl bg-bg text-primary-foreground hover:bg-secondary transition hover:text-text2"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
