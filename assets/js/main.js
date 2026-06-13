(function () {
  "use strict";

  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-menu");
  const themeToggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  const anchors = document.querySelectorAll('.nav-menu a[href^="#"]');
  const sections = document.querySelectorAll("header[id], section[id]");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeToggle?.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  applyTheme(root.getAttribute("data-theme") || "dark");

  let fillFrame = null;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function updateCenterFill() {
    fillFrame = null;

    const header = document.getElementById("header");
    if (!header) return;

    const fadeStart = header.offsetHeight * 0.76;
    const fadeEnd = header.offsetHeight * 0.97;
    const fadeRange = Math.max(1, fadeEnd - fadeStart);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pastHero = window.scrollY >= fadeEnd;

    if (reducedMotion) {
      root.style.setProperty("--center-fill-opacity", pastHero ? "1" : "0");
    } else {
      const linear = Math.min(1, Math.max(0, (window.scrollY - fadeStart) / fadeRange));
      const fillProgress = easeOutQuart(linear);
      root.style.setProperty("--center-fill-opacity", fillProgress.toFixed(4));
    }

    document.body.classList.toggle("past-hero", pastHero);
  }

  function scheduleCenterFill() {
    if (fillFrame !== null) return;
    fillFrame = requestAnimationFrame(updateCenterFill);
  }

  function onScroll() {
    nav?.classList.toggle("scrolled", window.scrollY > 50);

    let current = "header";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });

    anchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });

    scheduleCenterFill();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const mobileNavQuery = matchMedia("(max-width: 1100px)");

  function closeMobileNav() {
    navLinks?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  }

  mobileNavQuery.addEventListener("change", (e) => {
    if (!e.matches) closeMobileNav();
  });

  toggle?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
    toggle.setAttribute("aria-expanded", navLinks?.classList.contains("open"));
  });

  navLinks?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMobileNav);
  });

  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll("section .container").forEach((el) => revealObs.observe(el));
  } else {
    document.querySelectorAll("section .container").forEach((el) => el.classList.add("visible"));
  }

  document.querySelectorAll("[data-count]").forEach((el) => {
    if (!("IntersectionObserver" in window)) {
      el.textContent = el.dataset.count;
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = +el.dataset.count;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / 1200, 1);
            el.textContent = Math.floor(p * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          };
          requestAnimationFrame(tick);
          obs.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
  });
})();
