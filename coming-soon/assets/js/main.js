document.documentElement.classList.add("js");

/* Site genel yapılandırması — tek güncelleme noktası */
const SITE_CONFIG = {
  whatsapp: "+201063275860", // TODO: gerçek numara (ülke kodu + sayı, + ve boşluk olmadan)
  whatsappText: "السلام عليكم، أريد التسجيل في برنامج جيل كالصحابة",
};

function waUrl(extraText) {
  const text = extraText ? `${SITE_CONFIG.whatsappText}\n\n${extraText}` : SITE_CONFIG.whatsappText;
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function initCarousel(root) {
  const track = root.querySelector(".carousel__track");
  const slides = Array.from(root.querySelectorAll(".carousel__slide"));
  const prev = root.querySelector(".carousel__control--prev");
  const next = root.querySelector(".carousel__control--next");
  const dotsWrap = root.querySelector(".carousel__dots");
  const count = slides.length;
  if (!track || count < 2) return;

  const rtl = getComputedStyle(document.documentElement).direction === "rtl";
  const auto = root.dataset.carousel !== "off" && !prefersReducedMotion.matches;
  let index = 0;
  let timer = null;

  const dots = slides.map((slide, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carousel__dot";
    b.setAttribute("aria-label", `الانتقال إلى الشريحة ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function goTo(i) {
    index = (i + count) % count;
    render();
  }

  function render() {
    const offset = index * 100;
    track.style.transform = `translateX(${rtl ? offset : -offset}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
      d.setAttribute("aria-current", i === index ? "true" : "false");
    });
    slides.forEach((s, i) => s.setAttribute("aria-hidden", i === index ? "false" : "true"));
  }

  const nextSlide = () => goTo(index + 1);
  const prevSlide = () => goTo(index - 1);

  if (prev) prev.addEventListener("click", prevSlide);
  if (next) next.addEventListener("click", nextSlide);

  if (auto) {
    const stop = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };
    const start = () => { stop(); timer = setInterval(nextSlide, 4500); };
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("touchstart", stop, { passive: true });
    start();
  }

  let sx = 0;
  let sy = 0;
  root.addEventListener("touchstart", (e) => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  root.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 40) return;
    const goNext = rtl ? dx > 0 : dx < 0;
    goNext ? nextSlide() : prevSlide();
  }, { passive: true });

  root.tabIndex = 0;
  root.setAttribute("role", "region");
  root.setAttribute("aria-roledescription", "carousel");
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); rtl ? prevSlide() : nextSlide(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); rtl ? nextSlide() : prevSlide(); }
  });

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = waUrl(el.dataset.wa || "");
    el.target = "_blank";
    el.rel = "noopener";
  });

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const backTop = document.querySelector(".back-top");
  if (backTop) {
    window.addEventListener(
      "scroll",
      () => backTop.classList.toggle("is-visible", window.scrollY > 500),
      { passive: true }
    );
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
