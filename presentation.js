/* Motion enhances visible content; no hidden-content dependency on JavaScript. */
(() => {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const animations = new Set();
  function animate(element, distance = 16) {
    if (motion.matches || typeof element.animate !== "function") return;
    const effect = element.animate(
      [
        { opacity: 0.45, transform: `translateY(${distance}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 550, easing: "cubic-bezier(.2,.7,.2,1)" },
    );
    animations.add(effect);
    effect.finished.catch(() => {}).finally(() => animations.delete(effect));
  }
  let observer;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(
        ".section-heading,.feature,.price-card,.person,.project-intro,.process-grid article",
      )
      .forEach((element) => observer.observe(element));
  }
  animate(document.querySelector(".hero-content"), 12);
  document.querySelectorAll(".project-faq details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (details.open) animate(details.querySelector("p"), 6);
    });
  });
  motion.addEventListener("change", () => {
    if (motion.matches) animations.forEach((animation) => animation.cancel());
  });

  const progress = document.querySelector(".reading-progress span");
  const links = [...document.querySelectorAll("#navigation a")];
  const destinations = links
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute("href")),
    }))
    .filter((item) => item.section);
  let scheduled = false;
  function updateReadingPosition() {
    scheduled = false;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const ratio =
      distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    let current;
    // DOM order can differ from navigation order, so compare actual positions.
    let nearest = -Infinity;
    destinations.forEach((item) => {
      const top = item.section.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.3 && top > nearest) {
        nearest = top;
        current = item.link;
      }
    });
    links.forEach((link) => {
      if (link === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateReadingPosition);
    }
  }
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);
  updateReadingPosition();
})();
