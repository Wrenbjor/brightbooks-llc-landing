/* ============================================================
   BRIGHT BOOKS — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- sticky nav blur on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobileNav");
  function closeMenu() {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  hamburger.addEventListener("click", function () {
    var open = hamburger.classList.toggle("open");
    mobileNav.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- promise sun-ray decoration ---------- */
  var rays = document.getElementById("sunRays");
  if (rays) {
    var n = 13;
    for (var i = 0; i < n; i++) {
      var d = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2); // 0 center -> 1 edge
      var h = 14 + (1 - d) * 30;
      var bar = document.createElement("i");
      bar.style.height = h + "px";
      bar.style.opacity = (0.5 + (1 - d) * 0.5).toFixed(2);
      rays.appendChild(bar);
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var ans = item.querySelector(".faq-a");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // close siblings
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        if (o !== item) {
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = null;
          o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        ans.style.maxHeight = null;
        btn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        ans.style.maxHeight = ans.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- contact form ---------- */
  // Deploy-time stub: replace with Calendly redirect / webhook.
  function submitToCalendly(formData) {
    console.log("submitToCalendly()", formData);
    return Promise.resolve(true);
  }

  var form = document.getElementById("contactForm");
  var thankyou = document.getElementById("thankyou");

  function setError(field, on) { field.classList.toggle("err", on); }
  function emailValid(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function validate() {
    var ok = true;
    var name = form.name, email = form.email, phone = form.phone;
    var fName = name.closest("[data-field]"),
        fEmail = email.closest("[data-field]"),
        fPhone = phone.closest("[data-field]");

    var nameBad = name.value.trim() === "";
    setError(fName, nameBad); if (nameBad) ok = false;

    var emailBad = !emailValid(email.value.trim());
    setError(fEmail, emailBad); if (emailBad) ok = false;

    var phoneBad = phone.value.replace(/[^0-9]/g, "").length < 7;
    setError(fPhone, phoneBad); if (phoneBad) ok = false;

    return ok;
  }

  // live-clear errors as the user fixes them
  ["name", "email", "phone"].forEach(function (id) {
    form[id].addEventListener("input", function () {
      var f = form[id].closest("[data-field]");
      if (f.classList.contains("err")) validate();
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstErr = form.querySelector(".field.err input, .field.err textarea");
      if (firstErr) firstErr.focus();
      return;
    }
    var data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      business: form.business.value.trim(),
      situation: form.situation.value.trim()
    };
    submitToCalendly(data).then(function () {
      form.style.display = "none";
      thankyou.classList.add("show");
    });
  });
})();
