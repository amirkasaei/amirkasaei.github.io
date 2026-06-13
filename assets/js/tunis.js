(function () {
  "use strict";

  const navLinks = document.querySelectorAll(".tunis-nav a[data-page]");
  const pages = document.querySelectorAll(".page");
  const toggle = document.querySelector(".mobile-nav-toggle");
  const sidebar = document.querySelector(".tunis-nav");
  const aboutPage = document.getElementById("page-about");

  function showPage(id) {
    pages.forEach((p) => p.classList.toggle("active", p.id === "page-" + id));
    navLinks.forEach((a) => a.classList.toggle("active", a.dataset.page === id));

    const active = document.getElementById("page-" + id);
    if (active) active.scrollTop = 0;

    if (id === "about") animateAbout();
    sidebar?.classList.remove("open");
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(el.dataset.goto);
    });
  });

  toggle?.addEventListener("click", () => sidebar?.classList.toggle("open"));

  function animateCounters() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      if (el.dataset.done) return;
      const target = +el.dataset.count;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 1200, 1);
        el.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(step);
        else {
          el.textContent = target;
          el.dataset.done = "1";
        }
      };
      requestAnimationFrame(step);
    });
  }

  let aboutAnimated = false;
  function animateAbout() {
    if (aboutAnimated) return;
    aboutAnimated = true;
    animateCounters();
  }

  if (aboutPage?.classList.contains("active")) animateAbout();

  const observer = aboutPage && "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) animateAbout(); });
      }, { threshold: 0.2 })
    : null;

  if (observer && aboutPage) observer.observe(aboutPage);
})();
