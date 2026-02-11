const toggle = document.querySelector(".theme-toggle");
const body = document.body;
const revealItems = document.querySelectorAll(".reveal");
const quizButton = document.querySelector(".quiz-btn");
const quizResult = document.querySelector(".quiz-result");
const introButton = document.querySelector(".intro-cta");
const ritualPanelCopy = document.querySelector(".ritual-panel-copy");
const ritualListItems = Array.from(document.querySelectorAll(".ritual-list li"));

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
    plan.order.forEach((key, index) => {
      const item = ritualListItems.find((node) => node.dataset.product === key);
      if (item) {
        item.classList.add("is-active");
        item.setAttribute("data-order", String(index + 1));
      }
    });
  });
}
