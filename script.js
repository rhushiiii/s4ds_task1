document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reload

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("⚠️ Please fill in all fields before submitting.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("⚠️ Please enter a valid email address.");
    return;
  }

  alert("✅ Thank you, " + name + "! Your message has been submitted.");
  document.getElementById("contactForm").reset();
});
