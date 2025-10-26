export interface Coffee {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
}

export interface CoffeeItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
}

const API_URL =
  "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites";
const carouselContainer = document.getElementById(
  "carousel-container"
) as HTMLElement;
const loader = document.getElementById("loader") as HTMLElement;
const errorEl = document.getElementById("error") as HTMLElement;
const dotsContainer = document.getElementById("dots") as HTMLElement;

const coffeeImages: Record<string, string> = {
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

async function fetchFavorites() {
  try {
    loader.style.display = "block";
    errorEl.textContent = "";

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch data");

    const result = await response.json();
    const coffees: Coffee[] = result.data;

    console.log(coffees);

    renderCarousel(coffees);
  } catch (err) {
    errorEl.textContent = "Something went wrong while loading coffees ☕";
  } finally {
    loader.style.display = "none";
  }
}

function renderCarousel(coffees: any[]) {
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
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let current = 0;

  function showSlide(index: number) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  document.querySelector(".next")?.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  document.querySelector(".prev")?.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });
}

fetchFavorites();
