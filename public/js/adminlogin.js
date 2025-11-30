// js/adminlogin.js
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "./firebase-init.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const snap = await getDoc(doc(db, "users", uid));
      if (!snap.exists()) {
        alert("User record not found. Contact owner to assign admin role.");
        return;
      }
      const data = snap.data();
      if (data.role === "admin") {
        alert("Admin login successful");
        window.location.href = "admindashboard.html";
      } else {
        alert("You are not an admin.");
      }
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  });
});
