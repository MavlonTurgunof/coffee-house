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
const API_URL =
  "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites";
const carouselContainer = document.getElementById("carousel-container");
const loader = document.getElementById("loader");
const errorEl = document.getElementById("error");
const dotsContainer = document.getElementById("dots");
const coffeeImages = {
  "irish coffee": "/assets/images/coffee-slider/coffee-slider-1.svg",
  "latte macchiato": "/assets/images/coffee-slider/coffee-slider-3.svg",
  "honey raf": "/assets/images/coffee-slider/coffee-slider-3.svg",
  latte: "./assets/images/menu/coffee-6.svg",
  espresso: "./assets/images/menu/coffee-5.svg",
  "coffee with cognac": "./assets/images/menu/coffee-8.svg",
  "ice cappuccino": "./assets/images/menu/coffee-4.svg",
  "kahlua coffee": "./assets/images/menu/coffee-2.svg",
};
// data fetching
function fetchFavorites() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      loader.style.display = "block";
      errorEl.textContent = "";
      const response = yield fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = yield response.json();
      const coffees = result.data;
      console.log(coffees);
      renderCarousel(coffees);
    } catch (err) {
      errorEl.textContent = "Something went wrong while loading coffees ☕";
    } finally {
      loader.style.display = "none";
    }
  });
}
function renderCarousel(coffees) {
  carouselContainer.innerHTML = "";
  dotsContainer.innerHTML = "";
  coffees.forEach((coffee, index) => {
    const normalizedName = coffee.name.toLowerCase();
    const imageSrc = coffeeImages[normalizedName];
    const slide = document.createElement("div");
    slide.classList.add("slide");
    if (index === 0) slide.classList.add("active");
    slide.innerHTML = `
      <img src="${imageSrc}" alt="${coffee.name}" />
      <h2>${coffee.name}</h2>
      <p>${coffee.description}</p>
      <span class="price">$${coffee.discountPrice}</span>
    `;
    carouselContainer.appendChild(slide);
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });
  initCarousel();
}
function initCarousel() {
  var _a, _b;
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let current = 0;
  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }
  (_a = document.querySelector(".next")) === null || _a === void 0
    ? void 0
    : _a.addEventListener("click", () => {
        current = (current + 1) % slides.length;
        showSlide(current);
      });
  (_b = document.querySelector(".prev")) === null || _b === void 0
    ? void 0
    : _b.addEventListener("click", () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
      });
}
fetchFavorites();

//# sourceMappingURL=main.js.map
