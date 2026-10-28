// Apply preferences before the first paint to avoid a theme flash on reload.
try {
  const theme = localStorage.getItem("portfolio-theme");
  const dark = theme === "dark" || (theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const language = localStorage.getItem("portfolio-language");
  if (["en", "fr", "ar"].includes(language)) {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }
} catch {
  document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
