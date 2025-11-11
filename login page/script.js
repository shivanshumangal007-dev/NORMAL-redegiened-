const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Enhanced touch support for mobile devices
registerBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  container.classList.add("active");
});

loginBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  container.classList.remove("active");
});

// Prevent form submission for demo purposes
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Add your form submission logic here
  });
});
