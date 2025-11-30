// js/userdashboard.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "./firebase-init.js";

const soilsListUser = () => document.getElementById("soilsListUser");
const distListUser = () => document.getElementById("distListUser");

async function loadSoilsUser() {
  const q = collection(db, "soils");
  const snap = await getDocs(q);
  const box = soilsListUser();
  box.innerHTML = "";
  snap.forEach(d => {
    const data = d.data();
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<strong>${data.name}</strong> <small>${data.type}</small><p>pH:${data.ph}</p><p>${data.description||""}</p>`;
    box.appendChild(el);
  });
}

async function loadDistUser() {
  const q = collection(db, "distributors");
  const snap = await getDocs(q);
  const box = distListUser();
  box.innerHTML = "";
  snap.forEach(d => {
    const data = d.data();
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<strong>${data.name}</strong><p>${data.contact} - ${data.address}</p>`;
    box.appendChild(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    // allow anonymous viewing if you like; here we just load lists
    loadSoilsUser();
    loadDistUser();
  });
});
