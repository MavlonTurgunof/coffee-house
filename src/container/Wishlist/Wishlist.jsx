// src/pages/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../../utils/cart";
import { MenuImages } from "../../Data/MenuData";
import Modal from "../Menu/Modal";
import ProductCard from "../Menu/ProductCard";

export default function Wishlist() {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  useEffect(() => setList(getWishlist()), []);

  const openModal = (product) => {
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <section className=" mx-auto p-6 text-text1 relative">
      <h1 className="text-3xl font-semibold mb-6">Wishlist</h1>
      {list.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-4 gap-10 mb-[100px]">
          {list.map((product) => {
            const normalizedName = product.name.toLowerCase();
            const imageSrc = MenuImages[normalizedName];
            return (
              <ProductCard
                product={product}
                key={product.id}
                Image={imageSrc}
                onOpen={() => openModal(product)}
                removeFromWishlist={removeFromWishlist}
              />
            );
          })}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        productId={selectedProductId}
      />
    </section>
  );
}
