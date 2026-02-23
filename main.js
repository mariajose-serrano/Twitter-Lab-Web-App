"use strict";

/*
  TWITTERLAB - main.js
  Objetivo:
  1) Pintar 10 usuarios (desde API o desde localStorage si ya hay guardados).
  2) Al hacer click en una tarjeta, marcar/desmarcar como "amigo" (clase CSS "friend").
  3) Botón "Guardar datos": guardar el array actual en localStorage.
  4) Botón "Recuperar datos": leer del localStorage, sustituir el array y repintar.
*/

// ===============================
// SECCIÓN DE QUERY-SELECTOR
// Traemos elementos del HTML
// ===============================
const usersList = document.querySelector(".js_usersList");
const btnSave = document.querySelector(".btn-save");
const btnLoad = document.querySelector(".btn-load");

// ===============================
// SECCIÓN DE DATOS (estado global)
// Aquí guardamos los usuarios en memoria
// ===============================
let usersArray = [];

// Clave que usaremos en localStorage (un "nombre" para guardar/leer)
const LS_KEY = "usersBackup";

// ===============================
// SECCIÓN DE FUNCIONES DE RENDER
// (Pintar 1 usuario y pintar la lista completa)
// ===============================

/*
  Devuelve el HTML de UNA tarjeta de usuario.
  - Si oneUser.isFriend es true, añade la clase "friend" para pintarlo distinto.
  - Guarda el id del usuario en data-id para poder identificarlo al hacer click.
*/
function renderOneUser(oneUser) {
  const friendClass = oneUser.isFriend ? "friend" : "";

  return `
    <li class="userCard ${friendClass}" data-id="${oneUser.login.uuid}">
      <img src="${oneUser.picture.medium}" alt="Userphoto" />
      
      <p><strong>Nombre:</strong> ${oneUser.name.first} ${oneUser.name.last}</p>
      <p><strong>Usuario:</strong> ${oneUser.login.username}</p>
      
      <p><strong>Ciudad:</strong> ${oneUser.location.city}</p>
    </li>
  `;
}

/*
  Pinta TODOS los usuarios en el <ul class="js_usersList">.
  - Si no hay usuarios, muestra un mensaje.
*/
function renderAllUsers(list) {
  if (list.length === 0) {
    usersList.innerHTML = "<li>No hay tarjetas!</li>";
    return;
  }

  let html = "";
  for (const oneUser of list) {
    html += renderOneUser(oneUser);
  }
  usersList.innerHTML = html;
}

// ===============================
// SECCIÓN DE FUNCIONES DE EVENTOS
// (click en tarjetas, guardar, recuperar)
// ===============================

/*
  Al hacer click dentro del <ul>:
  - Detectamos la tarjeta (.userCard) más cercana.
  - Buscamos el usuario en usersArray por su uuid.
  - Alternamos isFriend (true/false).
  - Repintamos para que se vea el cambio.
*/
function toggleFriend(event) {
  const li = event.target.closest(".userCard");
  if (!li) return;

  const clickedId = li.dataset.id;

  const clickedUser = usersArray.find((user) => user.login.uuid === clickedId);
  if (!clickedUser) return;

  // Alterna: si estaba true pasa a false; si estaba false pasa a true
  clickedUser.isFriend = !clickedUser.isFriend;

  // Repintamos para que se aplique o quite la clase "friend"
  renderAllUsers(usersArray);
}

/*
  Guarda el array actual en localStorage:
  - JSON.stringify convierte el array de objetos en texto.
*/
function saveUsersToLocalStorage() {
  localStorage.setItem(LS_KEY, JSON.stringify(usersArray));
  console.log("Usuarios guardados:", usersArray);
}

/*
  Recupera el array desde localStorage:
  - Si no hay nada guardado, devolvemos [].
  - Si hay datos, sustituimos usersArray y repintamos.
*/
function loadUsersFromLocalStorage() {
  const dataInLS = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  console.log("CLICK recuperar");
  console.log("LS RAW:", localStorage.getItem("usersBackup"));

  if (dataInLS.length === 0) {
    console.log("No hay datos guardados en localStorage");
    return;
  }

  usersArray = dataInLS;
  renderAllUsers(usersArray);

  console.log("Usuarios recuperados:", usersArray);
}

// ===============================
// SECCIÓN DE API (traer usuarios)
// ===============================

/*
  Pide 10 usuarios a randomuser.me
  - Guarda data.results en usersArray
  - Repinta
*/
function fetchUsersFromApi() {
  fetch("https://randomuser.me/api/?results=10")
    .then((res) => res.json())
    .then((data) => {
      usersArray = data.results;
      renderAllUsers(usersArray);
      console.log("Usuarios cargados desde API:", usersArray);
    });
}

// ===============================
// SECCIÓN DE EVENTOS
// Enganchamos los listeners
// ===============================
btnSave.addEventListener("click", saveUsersToLocalStorage);
btnLoad.addEventListener("click", loadUsersFromLocalStorage);
usersList.addEventListener("click", toggleFriend);

// ===============================
// SECCIÓN DE INICIO (al cargar la página)
// 1) Si hay datos guardados -> pintar esos
// 2) Si no hay -> pedir a la API
// ===============================
function init() {
  const dataInLS = JSON.parse(localStorage.getItem(LS_KEY) || "[]");

  if (dataInLS.length > 0) {
    usersArray = dataInLS;
    renderAllUsers(usersArray);
    console.log("Cargados desde localStorage al iniciar");
  } else {
    fetchUsersFromApi();
  }
}

init();
