/* Apply a saved preference before styles render. Dark is the default. */
(() => {
  let theme = "dark";
  try {
    const saved = localStorage.getItem("WebTinyOne-theme");
    if (saved === "light" || saved === "dark") theme = saved;
  } catch {
    /* Browsing with storage disabled still supports the default theme. */
  }
  document.documentElement.dataset.theme = theme;
})();
