// public/js/register.js
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "./firebase-init.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) { console.error("registerForm not found"); return; }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (document.getElementById("name") || {}).value?.trim();
    const email = (document.getElementById("email") || {}).value?.trim();
    const password = (document.getElementById("password") || {}).value;

    if (!name || !email || !password) {
      alert("Please fill name, email and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      // create a user document in Firestore (role = user)
      await setDoc(doc(db, "users", uid), {
        name, email, role: "user", createdAt: serverTimestamp()
      });
      alert("Registration successful — please login.");
      window.location.href = "userlogin.html";
    } catch (err) {
      console.error("Register error:", err);
      // show friendly message for common errors
      if (err.code === "auth/email-already-in-use") alert("Email already in use.");
      else if (err.code === "auth/invalid-email") alert("Invalid email.");
      else if (err.code === "auth/weak-password") alert("Password should be at least 6 characters.");
      else alert(err.message || "Registration failed.");
    }
  });
});
