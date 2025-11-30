// public/js/login.js
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth } from "./firebase-init.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");
  if (!form) { console.error("userForm not found"); return; }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = (document.getElementById("email") || {}).value?.trim();
    const password = (document.getElementById("password") || {}).value;

    if (!email || !password) {
      alert("Enter email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "userdashboard.html";
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/wrong-password") alert("Incorrect password.");
      else if (err.code === "auth/user-not-found") alert("No account found for this email.");
      else alert(err.message || "Login failed.");
    }
  });
});
