/* ===============================
   MENU TOGGLE
   =============================== */
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;

  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
}

/* CLOSE MENU WHEN CLICKING ANYWHERE ELSE */
document.addEventListener("click", function (event) {
  const menu = document.getElementById("menu");
  const menuIcon = document.querySelector(".menu-icon");

  if (!menu || !menuIcon) return;

  if (
    !menu.contains(event.target) &&
    !menuIcon.contains(event.target)
  ) {
    menu.style.display = "none";
  }
});

/* ===============================
   BACKGROUND SLIDESHOW
   =============================== */
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";

const backgrounds = [
  "images/bg1.jpg",
  "images/bg2.jpg",
  "images/bg3.jpg",
  "images/bg4.jpg"
];

let bgIndex = 0;

function changeBackground() {
  document.body.style.backgroundImage = `url("${backgrounds[bgIndex]}")`;
  bgIndex = (bgIndex + 1) % backgrounds.length;
}

changeBackground();
setInterval(changeBackground, 5000);

/* ===============================
   PAGE NAVIGATION
   =============================== */
function openServices() {
  window.location.href = "services.html";
}

function openSaree() {
  window.location.href = "saree.html";
}

function openReviews() {
  window.location.href = "reviews.html";
}

function openGiveReviews() {
  window.location.href = "give-review.html";
}

function openAppointment() {
  window.location.href = "appointment.html";
}

/* ===============================
   PASSWORD LOCK (BRIDAL)
   =============================== */
const ACCESS_PASSWORD = "BRIDE2025";
const ACCESS_DAYS = 30;

function checkAccess() {
  const savedAccess = localStorage.getItem("bridalAccess");
  const savedDate = localStorage.getItem("accessDate");
  const today = Date.now();

  if (savedAccess === "true" && savedDate) {
    const daysPassed = (today - Number(savedDate)) / (1000 * 60 * 60 * 24);
    if (daysPassed <= ACCESS_DAYS) {
      window.location.href = "bridal.html";
      return;
    }
  }

  const userPassword = prompt("Enter access password:");
  if (userPassword === ACCESS_PASSWORD) {
    localStorage.setItem("bridalAccess", "true");
    localStorage.setItem("accessDate", today.toString());
    window.location.href = "bridal.html";
  } else {
    alert("Wrong password ❌ Please contact us.");
  }
}

/* ===============================
   FADE-IN ON SCROLL
   =============================== */
const faders = document.querySelectorAll(".service-card");

const appearOnScroll = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

faders.forEach(card => {
  card.classList.add("fade");
  appearOnScroll.observe(card);
});

/* ===============================
   REVIEWS SYSTEM (ADMIN SAFE)
   =============================== */

/* ADMIN CONFIG */
const ADMIN_PASSWORD = "ADMIN123"; // 🔴 CHANGE THIS
const ADMIN_MODE_KEY = "adminMode";

/* DEFAULT REVIEWS */
const defaultReviews = [
  { name: "Lakshmi", text: "Very friendly service and neat work by akka. Really satisfied" },
  { name: "Priya", text: "Bridal makeup was perfect. Everyone appreciated my look." },
  { name: "Revathi", text: "Good service very friendly akka she is the best." },
  { name: "Nisha", text: "Nalla pananga enoda bridal makeup. Will book her in the future also." }
];

/* LOAD REVIEWS */
function loadReviews() {
  const container = document.getElementById("reviewsContainer");
  if (!container) return;

  let storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];

  // merge default + stored (no duplicates)
  const allReviews = [...defaultReviews];
  storedReviews.forEach(r => {
    if (!allReviews.some(d => d.text === r.text)) {
      allReviews.push(r);
    }
  });

  localStorage.setItem("reviews", JSON.stringify(allReviews));

  const isAdmin = localStorage.getItem(ADMIN_MODE_KEY) === "true";
  container.innerHTML = "";

  allReviews.forEach((review, index) => {
    const card = document.createElement("div");
    card.className = "review-card";

    const deleteBtn = isAdmin
      ? `<button class="delete-btn" onclick="deleteReview(${index})">Delete</button>`
      : "";

    card.innerHTML = `
      <p class="review-text">“${review.text}”</p>
      <p class="review-name">– ${review.name}</p>
      ${deleteBtn}
    `;

    container.appendChild(card);
  });
}

/* SUBMIT REVIEW */
function submitReview() {
  const name = document.getElementById("reviewName").value.trim();
  const text = document.getElementById("reviewText").value.trim();

  if (!name || !text) {
    alert("Please fill all fields");
    return;
  }

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [...defaultReviews];
  reviews.push({ name, text });

  localStorage.setItem("reviews", JSON.stringify(reviews));
  alert("Thank you for your review ❤️");
  window.location.href = "reviews.html";
}

/* DELETE REVIEW (ADMIN ONLY) */
function deleteReview(index) {
  if (localStorage.getItem(ADMIN_MODE_KEY) !== "true") return;

  if (!confirm("Delete this review?")) return;

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.splice(index, 1);
  localStorage.setItem("reviews", JSON.stringify(reviews));
  loadReviews();
}

/* ENABLE ADMIN MODE */
function enableAdminMode() {
  const pwd = prompt("Enter admin password:");
  if (pwd === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_MODE_KEY, "true");
    alert("Admin mode enabled ✅");
    loadReviews();
  } else {
    alert("Wrong password ❌");
  }
}

/* AUTO-HIDE ADMIN MODE ON RELOAD */
window.addEventListener("beforeunload", () => {
  localStorage.removeItem(ADMIN_MODE_KEY);
});

/* AUTO LOAD REVIEWS */
document.addEventListener("DOMContentLoaded", loadReviews);
