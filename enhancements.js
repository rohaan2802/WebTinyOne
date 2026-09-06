/* Progressive enhancements: links and all work remain usable without JS. */
(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  function syncThemeButton() {
    const dark = root.dataset.theme === "dark";
    const label = dark ? "Use light theme" : "Use dark theme";
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    themeButton.querySelector("span").textContent = dark
      ? "Light theme"
      : "Dark theme";
    themeButton.querySelector("i").className = dark
      ? "fas fa-sun"
      : "fas fa-moon";
    document.querySelector('meta[name="theme-color"]').content = dark
      ? "#101311"
      : "#fcdb00";
  }
  syncThemeButton();
  themeButton.hidden = false;
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("WebTinyOne-theme", root.dataset.theme);
    } catch {
      /* Session-only fallback. */
    }
    syncThemeButton();
  });

  const cards = [...document.querySelectorAll(".work-card")];
  const filters = [...document.querySelectorAll("[data-filter]")];
  document.querySelector(".work-tools").hidden = false;
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filters.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      cards.forEach((card) => {
        card.hidden =
          button.dataset.filter !== "All" &&
          card.dataset.category !== button.dataset.filter;
      });
      const count = cards.filter((card) => !card.hidden).length;
      document.querySelector(".filter-status").textContent =
        `Showing ${count} of ${cards.length} projects`;
    }),
  );

  const viewer = document.querySelector(".image-viewer");
  const viewerImage = viewer.querySelector(".viewer-image");
  let selected = 0;
  let opener;
  function visibleCards() {
    return cards.filter((card) => !card.hidden);
  }
  function showImage(index) {
    const visible = visibleCards();
    selected = (index + visible.length) % visible.length;
    const card = visible[selected];
    const image = card.querySelector("img");
    viewerImage.src = image.src;
    viewerImage.alt = image.alt;
    viewer.querySelector("h2").textContent =
      card.querySelector("h3").textContent;
    viewer.querySelector("#viewer-position").textContent =
      `${selected + 1} / ${visible.length}`;
    viewer.querySelectorAll("[data-direction]").forEach((button) => {
      button.disabled = visible.length < 2;
    });
  }
  cards.forEach((card) =>
    card.querySelector("[data-preview]").addEventListener("click", (event) => {
      if (
        typeof viewer.showModal !== "function" ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      opener = event.currentTarget;
      showImage(visibleCards().indexOf(card));
      viewer.showModal();
      document.body.classList.add("viewer-open");
      viewer.querySelector(".viewer-close").focus();
    }),
  );
  viewer
    .querySelector(".viewer-close")
    .addEventListener("click", () => viewer.close());
  viewer
    .querySelectorAll("[data-direction]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        showImage(selected + Number(button.dataset.direction)),
      ),
    );
  viewer.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      const controls = [...viewer.querySelectorAll("button:not(:disabled)")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(selected + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  viewer.addEventListener("click", (event) => {
    const rect = viewer.getBoundingClientRect();
    if (
      event.target === viewer &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      viewer.close();
  });
  viewer.addEventListener("close", () => {
    document.body.classList.remove("viewer-open");
    opener?.focus({ preventScroll: true });
  });

  const backToTop = document.querySelector(".back-to-top");
  function updateBackToTop() {
    backToTop.hidden = window.scrollY < 600;
  }
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    document
      .querySelector(".site-header .brand")
      .focus({ preventScroll: true });
  });
})();
