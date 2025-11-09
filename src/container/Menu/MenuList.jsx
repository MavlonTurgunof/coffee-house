import React, { useEffect, useState } from "react";
import request from "../../components/config/index";
import tea from "../../assets/icons/tea.png";
import coffee from "../../assets/icons/coffee.png";
import dessert from "../../assets/icons/dessert.png";
import ProductCard from "./ProductCard";
import coffeeTeaAnim from "../../assets/CoffeeTea.json";
import Lottie from "lottie-react";
import Modal from "./Modal";
import { MenuImages } from "../../Data/MenuData";

function MenuList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const getProducts = async () => {
    setIsLoading(true);
    try {
      let res = await request.get("/products");
      setProducts(
        category === "all"
          ? res.data.data
          : res.data?.data?.filter((item) => item.category === category)
      );
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const openModal = (product) => {
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  useEffect(() => {
    getProducts();
  }, [category]);

  const categories = [
    { name: "all", label: "All" },
    { name: "coffee", label: "Coffee", icon: coffee },
    { name: "tea", label: "Tea", icon: tea },
    { name: "dessert", label: "Dessert", icon: dessert },
  ];

  console.log(isModalOpen);

  return (
    <section className="text-text1 relative">
      <h1 className="font-semibold text-[60px] text-center ">
        Behind each of our cups <br /> hides an
        <span className="text-text3"> amazing surprise</span>
      </h1>
      <div className="flex items-center gap-4 justify-center my-10">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategory(cat.name)}
            className={`cursor-pointer flex items-center gap-2 border border-bordermenu  rounded-[100px] p-2 hover:bg-secondary hover:text-text2 transition-colors duration-300
              ${
                category === cat.name
                  ? "bg-secondary text-text2 border-secondary"
                  : "bg-transparent text-text1 hover:bg-secondary/80 hover:text-text2"
              }`}
          >
            {cat.icon && (
              <img src={cat.icon} alt={cat.label} className="w-5 h-5" />
            )}
            {cat.label}
          </button>
        ))}
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Lottie
              animationData={coffeeTeaAnim}
              loop={true}
              autoplay={true}
              className="h-[400px] w-[400px]"
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-10 mb-[100px]">
            {products.map((product) => {
              const normalizedName = product.name.toLowerCase();
              const imageSrc = MenuImages[normalizedName];
              return (
                <ProductCard
                  product={product}
                  key={product.id}
                  Image={imageSrc}
                  onOpen={() => openModal(product)}
                />
              );
            })}
          </div>
        )}
      </div>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        productId={selectedProductId}
      />
    </section>
  );
}

export default MenuList;
