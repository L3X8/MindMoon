import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyAFQantEw8pLQ3UAjDeqiuci6lJYuB4wrY",
  authDomain: "mintmoon-91538.firebaseapp.com",
  projectId: "mintmoon-91538",
  storageBucket: "mintmoon-91538.firebasestorage.app",
  messagingSenderId: "109288798309",
  appId: "1:109288798309:web:d08d74901400de2076ae8c",
  measurementId: "G-8KC0G9LYLX"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.querySelector('.form-card');
const lista = document.getElementById('lista-anecdotas');

form.addEventListener('submit', async (e) => {

  e.preventDefault();

  const titulo =
    form.querySelector('input').value;

  const historia =
    form.querySelector('textarea').value;

  await addDoc(collection(db, "anecdotas"), {

    titulo,
    historia,

    emociones: {
      triste: 0,
      apoyo: 0,
      impacto: 0,
      inspirador: 0
    },

    timestamp: serverTimestamp()

  });

  form.reset();

});

const q = query(
  collection(db, "anecdotas"),
  orderBy("timestamp", "desc")
);

onSnapshot(q, (snapshot) => {

  lista.innerHTML = '';

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement('article');

    card.className = 'post';

    card.innerHTML = `

      <h3>${data.titulo}</h3>

      <p>${data.historia}</p>

      <div class="emociones">

        <button class="emocion-btn"
          data-id="${id}"
          data-emocion="triste">

          😢 ${data.emociones?.triste || 0}

        </button>

        <button class="emocion-btn"
          data-id="${id}"
          data-emocion="apoyo">

          ❤️ ${data.emociones?.apoyo || 0}

        </button>

        <button class="emocion-btn"
          data-id="${id}"
          data-emocion="impacto">

          😨 ${data.emociones?.impacto || 0}

        </button>

        <button class="emocion-btn"
          data-id="${id}"
          data-emocion="inspirador">

          🔥 ${data.emociones?.inspirador || 0}

        </button>

      </div>

    `;

    lista.appendChild(card);

  });

});

document.addEventListener('click', async (e) => {

  const btn = e.target.closest('.emocion-btn');

  if (!btn) return;

  const id = btn.dataset.id;
  const emocion = btn.dataset.emocion;

  // Obtener emociones guardadas
  let emocionesGuardadas =
    JSON.parse(localStorage.getItem('emocionesGuardadas')) || {};

  // Si ya reaccionó a esta anécdota
  if (emocionesGuardadas[id]) {

    alert("Ya reaccionaste a esta anécdota 🌙");
    return;

  }

  // BLOQUEAR INMEDIATAMENTE
  emocionesGuardadas[id] = emocion;

  localStorage.setItem(
    'emocionesGuardadas',
    JSON.stringify(emocionesGuardadas)
  );

  btn.disabled = true;
  btn.classList.add('reacted');

  try {

    const anecdotaRef = doc(db, "anecdotas", id);

    await updateDoc(anecdotaRef, {
      [`emociones.${emocion}`]: increment(1)
    });

  } catch (error) {

    console.error(error);

    // Revertir si falla
    delete emocionesGuardadas[id];

    localStorage.setItem(
      'emocionesGuardadas',
      JSON.stringify(emocionesGuardadas)
    );

    btn.disabled = false;
    btn.classList.remove('reacted');

  }

});