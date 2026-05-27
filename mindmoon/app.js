// Importar las funciones de Firebase directamente desde su CDN
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
    var audio = new Audio('click.mp3');
  
  window.addEventListener("load", function(event) {
    setTimeout(() => {
const quitardiv = document.getElementById("carga");

  quitardiv.classList.add("active")
 
  setTimeout(() =>{
    quitardiv.remove();


  },1000)
    },1000);
 
});


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
const form = document.querySelector('#formulario .form-card');
const feed = document.getElementById('feed');
const tagsGlobalesDiv =
  document.getElementById('tags-globales');

let filtroActual = null;
const q = query(
  collection(db, "publicaciones"),
  orderBy("relevancia", "desc"),
  orderBy("timestamp", "desc")
);

onSnapshot(q, (snapshot) => {
  audio.play();
  feed.innerHTML = `
    <div class="section-header">
      <h2>Publicaciones recientes</h2>
      <p class="muted">No estás solo. Otros también están luchando.</p>
    </div>
  `;
const tagsUnicos = new Set();
  snapshot.forEach((docSnap) => {

    const data = docSnap.data();
    if (data.tags) {
  data.tags.forEach(tag => {
    tagsUnicos.add(tag);
  });
}
    const postId = docSnap.id;
    if (
  filtroActual &&
  (!data.tags || !data.tags.includes(filtroActual))
){
  return;
}

    const article = document.createElement('article');
    article.className = 'post';
    article.id = `post-${postId}`;

    const timestamp = data.timestamp ? data.timestamp.toDate() : new Date();

    const fechaFormateada = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
const likesDados =
  JSON.parse(localStorage.getItem('likesDados')) || [];

const yaDioLike = likesDados.includes(postId);
    const tagsHTML = data.tags && data.tags.length > 0
      ? data.tags.map(t => `<span class="tag">${t}</span>`).join('')
      : '';

   article.innerHTML = `
  <div class="post-header">
    <span class="user">Alguien intentando</span>
    <span class="time">${fechaFormateada}</span>
  </div>

  <p>${data.texto}</p>

  <div class="tags">${tagsHTML}</div>

  <div class="acciones-post">
   <button 
  class="btn-relevancia ${yaDioLike ? 'liked' : ''}" 
  data-id="${postId}"
  ${yaDioLike ? 'disabled' : ''}
>
   <img src="flrcha.svg" alt="Like" width="22" height="22"/>${data.relevancia || 0}
</button>
  </div>

  <div class="comentarios-section">

    <div class="lista-comentarios" id="comentarios-${postId}"></div>

    <form class="form-comentario" data-post-id="${postId}">
      <input type="text" placeholder="Añade un consejo..." required>
      <button type="submit" class="secondary">Enviar</button>
    </form>

  </div>
`;

    feed.appendChild(article);

    const comentariosRef = collection(db, "publicaciones", postId, "comentarios");

const qComentarios = query(
  comentariosRef,
  orderBy("relevancia", "desc"),
orderBy("timestamp", "asc")
);

onSnapshot(qComentarios, (comentariosSnapshot) => {

  const contenedorComentarios =
    document.getElementById(`comentarios-${postId}`);

  if (!contenedorComentarios) return;

  contenedorComentarios.innerHTML = '';

  comentariosSnapshot.forEach((cDoc) => {

    const cData = cDoc.data();
      let likesComentarios =
  JSON.parse(localStorage.getItem('likesComentarios')) || [];

const claveComentario = `${postId}_${cDoc.id}`;

const yaLikeComentario =
  likesComentarios.includes(claveComentario);
    contenedorComentarios.innerHTML += `
  <div class="comentario-item">

    <div class="comentario-texto">
      <span class="user">Anónimo:</span>
      ${cData.texto}
    </div>

    <button 
      class="btn-relevancia btn-like-comentario 
  ${yaLikeComentario ? 'liked' : ''}"
      data-post="${postId}"
      data-comentario="${cDoc.id}"
    >
       <img src="flrcha.svg" alt="Like" width="16" height="16"/>
       ${cData.relevancia || 0}
    </button>

  </div>
`;

  });

});

  });
tagsGlobalesDiv.innerHTML = '';

const btnTodos = document.createElement('button');

btnTodos.className =
  `tag-filtro ${filtroActual === null ? 'active' : ''}`;

btnTodos.textContent = 'Todos';

btnTodos.onclick = () => {
  filtroActual = null;
};

tagsGlobalesDiv.appendChild(btnTodos);

tagsUnicos.forEach(tag => {

  const btn = document.createElement('button');

  btn.className =
    `tag-filtro ${filtroActual === tag ? 'active' : ''}`;

  btn.textContent = tag;

  btn.onclick = () => {
    filtroActual = tag;
  };

  tagsGlobalesDiv.appendChild(btn);

});
});





form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const texto = document.getElementById('texto').value;
  const tagsInput = document.getElementById('tags').value;
  const tags = tagsInput.split(' ').filter(tag => tag.trim() !== '');

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Publicando...';

  try {
    await addDoc(collection(db, "publicaciones"), {
  texto: texto,
  tags: tags,
  relevancia: 0,
  timestamp: serverTimestamp()
});
    form.reset();
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Publicar';
  }
});


document.addEventListener('submit', async (e) => {
  if (e.target.classList.contains('form-comentario')) {
    e.preventDefault();
    
    const formComentario = e.target;
    const postId = formComentario.getAttribute('data-post-id');
    const inputComentario = formComentario.querySelector('input');
    const textoComentario = inputComentario.value;
    const botonComentario = formComentario.querySelector('button');

    botonComentario.disabled = true;

    try {
      // Guardar en la subcolección "comentarios" dentro de esa "publicacion"
      await addDoc(collection(db, "publicaciones", postId, "comentarios"), {
  texto: textoComentario,
  relevancia: 0,
  timestamp: serverTimestamp()
});
      inputComentario.value = ''; // Limpiar el input
    } catch (error) {
      console.error("Error al comentar: ", error);
    } finally {
      botonComentario.disabled = false;
    }
  }
});

document.addEventListener('click', async (e) => {

  const boton = e.target.closest('.btn-relevancia');

  if (!boton) return;

  const postId = boton.getAttribute('data-id');

  let likesDados =
    JSON.parse(localStorage.getItem('likesDados')) || [];

  // Ya dio like
  if (likesDados.includes(postId)) {

    alert("Ya diste relevancia a esta publicación 🌙");
    return;

  }

  // BLOQUEAR INMEDIATAMENTE
  likesDados.push(postId);

  localStorage.setItem(
    'likesDados',
    JSON.stringify(likesDados)
  );

  boton.disabled = true;
  boton.classList.add('liked');

  try {

    const postRef = doc(db, "publicaciones", postId);

    await updateDoc(postRef, {
      relevancia: increment(1)
    });

  } catch (error) {

    console.error("Error al dar relevancia:", error);

    // Si falla Firebase revertimos
    likesDados = likesDados.filter(id => id !== postId);

    localStorage.setItem(
      'likesDados',
      JSON.stringify(likesDados)
    );

    boton.disabled = false;
    boton.classList.remove('liked');

  }

});

document.addEventListener('click', async (e) => {

  const btn = e.target.closest('.btn-like-comentario');

  if (!btn) return;

  const postId = btn.dataset.post;
  const comentarioId = btn.dataset.comentario;

  let likesComentarios =
    JSON.parse(localStorage.getItem('likesComentarios')) || [];

  const clave = `${postId}_${comentarioId}`;

  // Ya reaccionó
  if (likesComentarios.includes(clave)) {

    alert("Ya apoyaste este comentario 🌙");
    return;

  }

  // Bloquear instantáneamente
  likesComentarios.push(clave);

  localStorage.setItem(
    'likesComentarios',
    JSON.stringify(likesComentarios)
  );

  btn.disabled = true;
  btn.classList.add('liked');

  try {

    const comentarioRef = doc(
      db,
      "publicaciones",
      postId,
      "comentarios",
      comentarioId
    );

    await updateDoc(comentarioRef, {
      relevancia: increment(1)
    });

  } catch (error) {

    console.error(error);

    likesComentarios =
      likesComentarios.filter(id => id !== clave);

    localStorage.setItem(
      'likesComentarios',
      JSON.stringify(likesComentarios)
    );

    btn.disabled = false;
    btn.classList.remove('liked');

  }

});

