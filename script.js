const toggle = document.querySelector(".theme-toggle");
const body = document.body;

const setTheme = (theme) => {
  body.classList.remove("theme-light", "theme-dark");
  body.classList.add(theme);
};

toggle.addEventListener("click", () => {
  const isLight = body.classList.contains("theme-light");
  setTheme(isLight ? "theme-dark" : "theme-light");
});
