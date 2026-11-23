// ==========================================
// 0. Smooth Nav Scroll with Header Offset
// ==========================================
(function initNavScroll() {
  const HEADER_HEIGHT = 70; // px — matches sticky header
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
// ==========================================
// 1. Service Cards Interactive Accordion
// ==========================================
const serviceCards = document.querySelectorAll(".service-card");
let typingTimer = null;

// Store original paragraph text on load
serviceCards.forEach((card) => {
  const paragraph = card.querySelector(".card-content p");
  if (paragraph) {
    paragraph.dataset.fullText = paragraph.textContent.trim();
    paragraph.textContent = "";
  }
});

function typeParagraph(paragraph, speed = 18) {
  if (!paragraph) return;
  const fullText = paragraph.dataset.fullText || "";
  paragraph.textContent = "";
  let index = 0;

  function step() {
    if (index < fullText.length) {
      paragraph.textContent += fullText.charAt(index);
      index++;
      typingTimer = setTimeout(step, speed);
    }
  }

  // Slight pause so the panel starts widening before typing begins
  typingTimer = setTimeout(step, 80);
}

function activateCard(selectedCard) {
  if (!selectedCard) return;
  clearTimeout(typingTimer);

  serviceCards.forEach((crd) => {
    crd.classList.remove("active");
    const p = crd.querySelector(".card-content p");
    if (p) p.textContent = "";
  });

  selectedCard.classList.add("active");
  const activeParagraph = selectedCard.querySelector(".card-content p");
  typeParagraph(activeParagraph, 18);
}

serviceCards.forEach((card) => {
  card.addEventListener("click", () => activateCard(card));
  card.addEventListener("mouseenter", () => activateCard(card));
});

// Trigger typing for initial active card
const initiallyActive = document.querySelector(".service-card.active");
if (initiallyActive) {
  activateCard(initiallyActive);
}

// "Something else" card quick scroll
const somethingElseCard = document.querySelector(".something-else-card");
if (somethingElseCard) {
  somethingElseCard.addEventListener("click", () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ==========================================
// 2. Click Ripple Effect
// ==========================================
document.addEventListener("click", (e) => {
  const ripple = document.createElement("span");
  ripple.className = "click-ripple";
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
});

// ==========================================
// 3. Portfolio Marquee Hover & Speed Easing
// ==========================================
const portfolioRows = document.querySelectorAll(".portfolio-row");
const allPortfolioItems = document.querySelectorAll(".portfolio-item");

let mouseX = -1;
let mouseY = -1;
let pointerInsideWindow = false;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  pointerInsideWindow = true;
});

document.addEventListener("mouseleave", () => {
  pointerInsideWindow = false;
});

function easeTrackSpeed(track, targetRate) {
  if (!track) return;
  const anims = track.getAnimations();
  const anim = anims.length > 0 ? anims[0] : null;
  if (!anim) return;

  if (track._targetRate === targetRate) return;
  track._targetRate = targetRate;

  cancelAnimationFrame(track._speedRaf);

  function step() {
    const current = anim.playbackRate;
    const diff = targetRate - current;

    if (Math.abs(diff) < 0.01) {
      anim.playbackRate = targetRate;
      return;
    }

    anim.playbackRate = current + diff * 0.14;
    track._speedRaf = requestAnimationFrame(step);
  }

  track._speedRaf = requestAnimationFrame(step);
}

function updatePortfolioHoverUnderCursor() {
  let activeItem = null;

  if (pointerInsideWindow && mouseX >= 0 && mouseY >= 0) {
    const elUnderCursor = document.elementFromPoint(mouseX, mouseY);
    if (elUnderCursor) {
      activeItem = elUnderCursor.closest(".portfolio-item");
    }
  }

  // Highlight whichever box is currently under the cursor
  allPortfolioItems.forEach((item) => {
    item.classList.toggle("is-hovered", item === activeItem);
  });

  // Slow down track when hovered
  portfolioRows.forEach((row) => {
    const track = row.querySelector(".portfolio-track");
    if (track) {
      const isRowActive = Boolean(activeItem && row.contains(activeItem));
      easeTrackSpeed(track, isRowActive ? 0.25 : 1);
    }
  });

  requestAnimationFrame(updatePortfolioHoverUnderCursor);
}

requestAnimationFrame(updatePortfolioHoverUnderCursor);

// ==========================================
// 4. Process Workflow Steps & Preview
// ==========================================
const processData = [
  {
    title: "Reach Out",
    desc: "Share your project, session, or event details and timeline so we can map out the right next step.",
    img: "process-we-talk.jpg"
  },
  {
    title: "Plan & Setup",
    desc: "We organize the gear, signal flow, room acoustic tuning, or creative direction tailored to what you need.",
    img: "how-it-goes-setup.jpg"
  },
  {
    title: "Mix & Build",
    desc: "Hands-on recording, live sound engineering, multitrack mixing, or PA deployment executed cleanly from start to finish.",
    img: "mixing-mastering-console-replacement.jpg"
  },
  {
    title: "Deliver",
    desc: "You receive polished master files, clean event wrap-up, and reliable follow-up so everything is ready to go.",
    img: "process-get-it-done.jpg"
  }
];

const processSection = document.querySelector("#process");
const processStepsContainer = document.querySelector(".process-steps");
const stepCards = document.querySelectorAll(".process-step");
const previewImg = document.querySelector("#processPreviewImg");
const previewTag = document.querySelector("#processPreviewTag");
const previewTitle = document.querySelector("#processPreviewTitle");
const previewDesc = document.querySelector("#processPreviewDesc");

function setActiveProcessStep(index) {
  const item = processData[index];
  if (!item) return;

  stepCards.forEach((card, idx) => {
    card.classList.toggle("is-active", idx === index);
  });

  if (previewTag) previewTag.textContent = item.tag;
  if (previewTitle) previewTitle.textContent = item.title;
  if (previewDesc) previewDesc.textContent = item.desc;

  if (previewImg && previewImg.getAttribute("src") !== item.img) {
    previewImg.classList.add("is-swapping");
    previewImg.setAttribute("src", item.img);
    previewImg.setAttribute("alt", item.title);
    previewImg.addEventListener(
      "load",
      () => previewImg.classList.remove("is-swapping"),
      { once: true }
    );
  }
}

// ── Auto-cycle setup ───────────────────────────────────────
let processAutoIndex = 0;
let processTimer = null;
const PROCESS_DELAY = 5500;

function processNext() {
  processAutoIndex = (processAutoIndex + 1) % processData.length;
  setActiveProcessStep(processAutoIndex);
}

function startProcessAuto() {
  stopProcessAuto();
  processTimer = setInterval(processNext, PROCESS_DELAY);
}

function stopProcessAuto() {
  if (processTimer) { clearInterval(processTimer); processTimer = null; }
}
// ───────────────────────────────────────────────────────────

stepCards.forEach((card) => {
  const idx = Number(card.dataset.step);
  // Manual override: pause auto, jump to clicked/hovered step, then resume
  card.addEventListener("mouseenter", () => {
    stopProcessAuto();
    processAutoIndex = idx;
    setActiveProcessStep(idx);
  });
  card.addEventListener("focus", () => {
    stopProcessAuto();
    processAutoIndex = idx;
    setActiveProcessStep(idx);
  });
  card.addEventListener("click", () => {
    stopProcessAuto();
    processAutoIndex = idx;
    setActiveProcessStep(idx);
  });
});

// Resume auto-play when mouse leaves the whole process section
if (processSection) {
  processSection.addEventListener("mouseleave", () => {
    if (processStepsContainer && processStepsContainer.classList.contains("in-view")) {
      startProcessAuto();
    }
  });
  processSection.addEventListener("focusout", (e) => {
    if (!processSection.contains(e.relatedTarget)) {
      if (processStepsContainer && processStepsContainer.classList.contains("in-view")) {
        startProcessAuto();
      }
    }
  });
}

if (processSection && processStepsContainer && "IntersectionObserver" in window) {
  const processObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          processStepsContainer.classList.add("in-view");
          startProcessAuto(); // start cycling when section scrolls into view
          processObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  processObserver.observe(processSection);
} else if (processStepsContainer) {
  processStepsContainer.classList.add("in-view");
  startProcessAuto();
}

// ==========================================
// 5. Testimonials Carousel Controller
// ==========================================
(function initTestimonialsCarousel() {
  const track = document.getElementById("testimonialTrack");
  const viewport = document.getElementById("testimonialViewport");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  const dotsContainer = document.getElementById("testimonialDots");

  if (!track || !viewport || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll(".testimonial-card");
  if (!cards.length) return;

  let currentIndex = 0;

  function getCardsPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getCardsPerView());
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    const maxIdx = getMaxIndex();
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement("button");
      dot.className = `t-dot ${i === currentIndex ? "is-active" : ""}`;
      dot.setAttribute("aria-label", `Go to review slide ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlide() {
    const card = cards[0];
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= getMaxIndex();

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".t-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
    updateSlide();
  }

  // ── Auto-play ──────────────────────────────────────────────
  const AUTO_DELAY = 4000;
  let autoTimer = null;

  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(() => {
      currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
      updateSlide();
    }, AUTO_DELAY);
  }

  function stopAutoPlay() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Pause on hover, resume on leave
  viewport.addEventListener("mouseenter", stopAutoPlay);
  viewport.addEventListener("mouseleave", startAutoPlay);
  // ────────────────────────────────────────────────────────────

  prevBtn.addEventListener("click", () => {
    stopAutoPlay();
    if (currentIndex > 0) { currentIndex--; updateSlide(); }
    startAutoPlay();
  });

  nextBtn.addEventListener("click", () => {
    stopAutoPlay();
    if (currentIndex < getMaxIndex()) { currentIndex++; updateSlide(); }
    startAutoPlay();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentIndex < getMaxIndex()) {
        currentIndex++;
        updateSlide();
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
        updateSlide();
      }
    }
    startAutoPlay();
  }, { passive: true });

  window.addEventListener("resize", () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    renderDots();
    updateSlide();
  });

  renderDots();
  updateSlide();
  startAutoPlay(); // kick off on page load
})();

// ==========================================
// 6. Contact Inquiry Form Email Handler
// ==========================================
const inquiryForm = document.querySelector("#inquiry-form");
if (inquiryForm) {
  inquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(inquiryForm);
    const name = formData.get("name") || "";
    const service = formData.get("service") || "";
    const date = formData.get("date") || "";

    const subject = encodeURIComponent(`Project Inquiry: ${service} — ${name}`);
    const body = encodeURIComponent(
      `Hello Denis / Krich Tech,\n\nI would like to inquire about your audio services.\n\n` +
      `• Name / Band: ${name}\n` +
      `• Service Needed: ${service}\n` +
      `• Target Date: ${date}\n\n` +
      `Looking forward to discussing the project!\n`
    );

    window.location.href = `mailto:krichtech98@gmail.com?subject=${subject}&body=${body}`;
  });
}
