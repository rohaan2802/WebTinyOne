/* Navigation stays visible when JavaScript is unavailable. */
document.documentElement.classList.add("js");
const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu(restoreFocus = false) {
  toggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  if (restoreFocus) toggle.focus();
}
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
});
navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  closeMenu();
  // Move keyboard focus out of the collapsed mobile navigation.
  if (target) {
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
      once: true,
    });
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true")
    closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
matchMedia("(min-width: 761px)").addEventListener("change", () => closeMenu());
document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.querySelectorAll("[disabled]").forEach((control) => {
    control.disabled = false;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.querySelector(".form-status").textContent = form.classList.contains(
      "contact-form",
    )
      ? "Your message is ready to preview. This demo does not send or store messages."
      : "Your email format is valid. This demo does not create a subscription or store your email.";
  });
});
