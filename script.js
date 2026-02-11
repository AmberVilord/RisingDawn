const toggle = document.querySelector(".theme-toggle");
const body = document.body;
const revealItems = document.querySelectorAll(".reveal");
const quizButton = document.querySelector(".quiz-btn");
const quizResult = document.querySelector(".quiz-result");

const setTheme = (theme) => {
  body.classList.remove("theme-light", "theme-dark");
  body.classList.add(theme);
};

toggle.addEventListener("click", () => {
  const isLight = body.classList.contains("theme-light");
  setTheme(isLight ? "theme-dark" : "theme-light");
});

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

const ritualCopy = {
  Meditation: "Pear dew and cold air for a quiet, focused morning.",
  Journaling: "Dewy rose and soft linen to open the page.",
  Movement: "Bergamot zest and mineral amber to energize the day.",
  "Big Meeting": "Pale woods and skin musk for steady confidence.",
};

if (quizButton && quizResult) {
  quizButton.addEventListener("click", () => {
    const selected = document.querySelector("input[name='morning']:checked");
    if (!selected) {
      quizResult.textContent = "Choose a path to reveal your ritual.";
      return;
    }
    quizResult.textContent = ritualCopy[selected.value] || "Your ritual is ready.";
  });
}
