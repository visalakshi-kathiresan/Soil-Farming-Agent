// js/admindashboard.js
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "./firebase-init.js";

const soilsListEl = () => document.getElementById("soilsList");
const distListEl = () => document.getElementById("distList");

async function loadSoils() {
  const q = collection(db, "soils");
  const snap = await getDocs(q);
  const box = soilsListEl();
  box.innerHTML = "";
  snap.forEach(d => {
    const data = d.data();
    const id = d.id;
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <strong>${data.name}</strong> <small>(${data.type}, pH: ${data.ph})</small>
      <p>${data.description || ""}</p>
      <button data-id="${id}" class="delete-soil">Delete</button>
    `;
    box.appendChild(el);
  });
}

async function loadDistributors() {
  const q = collection(db, "distributors");
  const snap = await getDocs(q);
  const box = distListEl();
  box.innerHTML = "";
  snap.forEach(d => {
    const data = d.data();
    const id = d.id;
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <strong>${data.name}</strong>
      <p>${data.contact} — ${data.address}</p>
      <button data-id="${id}" class="delete-dist">Delete</button>
    `;
    box.appendChild(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const soilForm = document.getElementById("soilForm");
  const distForm = document.getElementById("distForm");
  const logoutBtn = document.getElementById("logoutBtn");

  soilForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("soilName").value.trim();
    const type = document.getElementById("soilType").value.trim();
    const ph = document.getElementById("soilPh").value.trim();
    const description = document.getElementById("soilDesc").value.trim();
    try {
      await addDoc(collection(db, "soils"), {
        name, type, ph, description, createdAt: serverTimestamp()
      });
      soilForm.reset();
      await loadSoils();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  distForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("distName").value.trim();
    const contact = document.getElementById("distContact").value.trim();
    const address = document.getElementById("distAddress").value.trim();
    try {
      await addDoc(collection(db, "distributors"), {
        name, contact, address, createdAt: serverTimestamp()
      });
      distForm.reset();
      await loadDistributors();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });

  // delegate delete buttons
  document.body.addEventListener("click", async (e) => {
    if (e.target.matches(".delete-soil")) {
      const id = e.target.dataset.id;
      if (!confirm("Delete this soil?")) return;
      await deleteDoc(doc(db, "soils", id));
      await loadSoils();
    }
    if (e.target.matches(".delete-dist")) {
      const id = e.target.dataset.id;
      if (!confirm("Delete this distributor?")) return;
      await deleteDoc(doc(db, "distributors", id));
      await loadDistributors();
    }
  });

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "adminlogin.html";
  });

  // require logged in user — if not, redirect to adminlogin
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "adminlogin.html";
      return;
    }
    // load lists
    loadSoils();
    loadDistributors();
  });
});
