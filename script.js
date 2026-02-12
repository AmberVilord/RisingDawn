const toggle = document.querySelector(".theme-toggle");
const body = document.body;
const revealItems = document.querySelectorAll(".reveal");
const quizButton = document.querySelector(".quiz-btn");
const quizResult = document.querySelector(".quiz-result");
const introButton = document.querySelector(".intro-cta");
const ritualPanelCopy = document.querySelector(".ritual-panel-copy");
const ritualListItems = Array.from(document.querySelectorAll(".ritual-list li"));
const engravingInput = document.querySelector(".engraving-input");
const engravingCount = document.querySelector(".engraving-count");
const addToCartButtons = Array.from(document.querySelectorAll(".add-to-cart"));
const bagItemsContainer = document.querySelector("#bag-items");
const bagTotal = document.querySelector("#bag-total");
const banner = document.querySelector(".banner");

const introSection = document.querySelector("#intro");
if (introSection && window.location.hash) {
  body.classList.remove("intro-active");
  body.classList.add("intro-dismissed");
}

const updateAnchorOffset = () => {
  if (!banner) return;
  const bannerHeight = banner.getBoundingClientRect().height;
  const ritualOffset = bannerHeight + 108;
  const customizeOffset = bannerHeight + 216;
  document.documentElement.style.setProperty("--anchor-offset-ritual", `${ritualOffset}px`);
  document.documentElement.style.setProperty("--anchor-offset-customize", `${customizeOffset}px`);
};

updateAnchorOffset();
window.addEventListener("resize", updateAnchorOffset);

const setTheme = (theme) => {
  body.classList.remove("theme-light", "theme-dark");
  body.classList.add(theme);
};

toggle.addEventListener("click", () => {
  const isLight = body.classList.contains("theme-light");
  setTheme(isLight ? "theme-dark" : "theme-light");
});

if (introButton) {
  introButton.addEventListener("click", () => {
    body.classList.remove("intro-active");
    body.classList.add("intro-dismissed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const CART_KEY = "risingDawnCart";

const formatPrice = (value) => `$${value.toFixed(2).replace(/\.00$/, "")}`;

const loadCart = () => {
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveCart = (items) => {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const renderBag = () => {
  if (!bagItemsContainer || !bagTotal) return;
  const items = loadCart();
  bagItemsContainer.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "bag-empty";
    empty.textContent = "Your bag is empty";
    bagItemsContainer.appendChild(empty);
    bagTotal.textContent = formatPrice(0);
    return;
  }
  let total = 0;
  items.forEach((item, index) => {
    total += item.price;
    const row = document.createElement("article");
    row.className = "bag-item";
    row.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>${item.detail}</p>
      </div>
      <div class="bag-item-meta">
        <span class="bag-price">${formatPrice(item.price)}</span>
        <button class="bag-remove" type="button" data-index="${index}">Remove</button>
      </div>
    `;
    bagItemsContainer.appendChild(row);
  });
  bagTotal.textContent = formatPrice(total);
};

if (bagItemsContainer) {
  bagItemsContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("bag-remove")) return;
    const index = Number(target.dataset.index);
    const items = loadCart();
    if (Number.isNaN(index)) return;
    items.splice(index, 1);
    saveCart(items);
    renderBag();
  });
}

const ritualPlans = {
  Meditation: {
    story: "Slowly awaken your senses and set the tone for a calm, focused morning.",
    order: ["mist", "body-wash", "perfume", "lotion", "hand-cream", "lip-balm"],
  },
  Journaling: {
    story: "Let warmth and softness guide your thoughts as you create your morning page.",
    order: ["lotion", "lip-balm", "perfume", "mist", "hand-cream", "body-wash"],
  },
  Movement: {
    story: "Prepare for action with clean energy, light hydration, and bright clarity.",
    order: ["body-wash", "lotion", "mist", "perfume", "lip-balm", "hand-cream"],
  },
  "Big Meeting": {
    story: "Step into the day with presence, polish, and an elegant scent trail.",
    order: ["perfume", "lotion", "lip-balm", "hand-cream", "mist", "body-wash"],
  },
};

const resetRitualList = () => {
  ritualListItems.forEach((item) => {
    item.classList.remove("is-active");
    item.removeAttribute("data-order");
  });
};

if (quizButton && quizResult) {
  quizButton.addEventListener("click", () => {
    const selected = document.querySelector("input[name='morning']:checked");
    if (!selected) {
      quizResult.textContent = "Choose a path to reveal your ritual.";
      if (ritualPanelCopy) {
        ritualPanelCopy.textContent = "Choose a path to see your personalized sequence.";
      }
      resetRitualList();
      return;
    }
    const plan = ritualPlans[selected.value];
    if (!plan) {
      quizResult.textContent = "Your ritual is ready.";
      return;
    }
    quizResult.textContent = plan.story;
    if (ritualPanelCopy) {
      ritualPanelCopy.textContent = "Your ritual flow is ready. Follow the order below.";
    }
    resetRitualList();
    const normalizedOrder = ["body-wash", ...plan.order.filter((key) => key !== "body-wash")];
    normalizedOrder.forEach((key, index) => {
      const item = ritualListItems.find((node) => node.dataset.product === key);
      if (item) {
        item.classList.add("is-active");
        item.setAttribute("data-order", String(index + 1));
      }
    });
  });
}

if (engravingInput && engravingCount) {
  const updateCount = () => {
    const count = engravingInput.value.length;
    engravingCount.textContent = `${count}/20`;
  };
  updateCount();
  engravingInput.addEventListener("input", updateCount);
}

if (addToCartButtons.length) {
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.productName || "Rising at Dawn";
      const basePrice = Number(button.dataset.basePrice || "0");
      const useEngraving = button.dataset.useEngraving === "true";
      const engraving = useEngraving && engravingInput ? engravingInput.value.trim() : "";
      const detail = useEngraving
        ? `Custom engraving: ${engraving || "Not specified"}`
        : button.dataset.productDetail || "Signature ritual set";
      const item = {
        id: button.dataset.productId || "custom-item",
        name,
        detail,
        price: useEngraving ? 156 : basePrice,
      };
      const items = loadCart();
      items.push(item);
      saveCart(items);
      renderBag();
      const newLabel = button.dataset.changeText || "Added to Bag";
      button.textContent = newLabel;
      button.classList.add("btn-added");
    });
  });
}

renderBag();
