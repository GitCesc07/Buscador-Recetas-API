function iniciarApp() {

  const resultado = document.querySelector("#resultado");
  const selectCategoria = document.querySelector("#categorias");

  if (selectCategoria) {
    selectCategoria.addEventListener("change", seleccionarCategoria);
    obtenerCategoria();
  }

  const favoritoDiv = document.querySelector(".favoritos");
  if (favoritoDiv) {
    obtenerFavoritos();
  }

  const modal = new bootstrap.Modal('#modal', {});

  function obtenerCategoria() {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

    fetch(url)
      .then(respuesta => respuesta.json())
      .then(resultado => mostrarCategoria(resultado.categories))
  }

  function mostrarCategoria(categorias = []) {
    categorias.forEach(categoria => {

      const { strCategory } = categoria;
      const option = document.createElement('OPTION');
      option.value = strCategory;
      option.textContent = strCategory;

      selectCategoria.appendChild(option);
    })
  }

  function seleccionarCategoria(e) {
    const categoria = e.target.value;
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

    fetch(url)
      .then(respuesta => respuesta.json())
      .then(resultado => mostrarReceta(resultado.meals))
  }

  function mostrarReceta(recetas = []) {

    limpiarHTML(resultado);

    // Mostrando información si existe algún resultado en la API
    const heading = document.createElement('H2');
    heading.classList.add("text-center", "text-black", "my-5");
    heading.textContent = recetas.length ? "Resultados" : "No hay Resultados";
    resultado.appendChild(heading);

    // Iterar en los resultados
    recetas.forEach(receta => {
      const { idMeal, strMeal, strMealThumb } = receta;

      const recetaContenedor = document.createElement('DIV');
      recetaContenedor.classList.add('col-md-4');

      const recetaCard = document.createElement('DIV');
      recetaCard.classList.add('card', 'mb-4');

      const recetaImagen = document.createElement('IMG');
      recetaImagen.classList.add('card-img-top');
      recetaImagen.alt = `Imagen de la receta ${strMeal ?? receta.img}`;
      recetaImagen.src = strMealThumb ?? receta.img;

      const recetaCardBody = document.createElement('DIV');
      recetaCardBody.classList.add('card-body');

      const recetaHeading = document.createElement('H3');
      recetaHeading.classList.add('card-title', 'mb-3');
      recetaHeading.textContent = strMeal ?? receta.titulo;

      const recetaButton = document.createElement('BUTTON');
      recetaButton.classList.add('btn', 'btn-danger', 'w-100');
      recetaButton.textContent = "Ver receta";
      // recetaButton.dataset.bsTarget = "#modal";
      // recetaButton.dataset.bsToggle = "modal";
      recetaButton.onclick = function () {
        seleccionarReceta(idMeal ?? receta.id);
      }

      // Inyectar código de HTML5
      recetaCardBody.appendChild(recetaHeading)
      recetaCardBody.appendChild(recetaButton);

      recetaCard.appendChild(recetaImagen);
      recetaCard.appendChild(recetaCardBody);

      recetaContenedor.appendChild(recetaCard);

      resultado.appendChild(recetaContenedor);
    })
  }

  function seleccionarReceta(id) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(url)
      .then(respuesta => respuesta.json())
      .then(resultado => mostrarRecetaModal(resultado.meals[0]))
  }

  function mostrarRecetaModal(receta) {
    const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

    // Añadir contenido al modal
    const modalTitle = document.querySelector(".modal .modal-title");
    const modalBody = document.querySelector(".modal .modal-body");

    modalTitle.classList.add('text-center');
    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
    <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}" />
    <h3 class="my-3"> Instrucciones </h3>
    <p>${strInstructions}</p>
    <h3 class="my-3">Ingredientes y Cantidades</h3>
    `;

    const listGroup = document.createElement("UL");
    listGroup.classList.add("list-group");

    // Mostrar cantidades e ingredientes
    for (let i = 1; i <= 20; i++) {
      if (receta[`strIngredient${i}`]) {
        const ingrediente = receta[`strIngredient${i}`];
        const cantidad = receta[`strMeasure${i}`];

        const ingredienteLi = document.createElement("LI");
        ingredienteLi.classList.add("list-group-item");
        ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

        listGroup.appendChild(ingredienteLi);
      }
    }

    modalBody.appendChild(listGroup);

    const modalFooter = document.querySelector(".modal-footer");
    limpiarHTML(modalFooter);

    // Botones de cerrar y guardar favoritos
    const btnFavorito = document.createElement("BUTTON");
    btnFavorito.classList.add("btn", "btn-danger", "col");
    btnFavorito.textContent = existeStorage(idMeal) ? "Eliminar Favorito" : "Guardar Favorito";

    // localStorage, donde se podra agregar o eliminar elementos
    btnFavorito.onclick = function () {

      if (existeStorage(idMeal)) {
        eliminarfavorito(idMeal);
        btnFavorito.textContent = "Guardar Favorito";
        mostrarToast("Eliminado Correctamente");
        return;
      }

      agregarFavorito({
        id: idMeal,
        titulo: strMeal,
        img: strMealThumb
      });
      btnFavorito.textContent = "Eliminar Favorito";
      mostrarToast("Agregado Correctamente");
    }


    const btnCerrarModal = document.createElement("BUTTON");
    btnCerrarModal.classList.add("btn", "btn-secondary", "col");
    btnCerrarModal.textContent = "Cerrar";
    btnCerrarModal.onclick = function () {
      modal.hide();
    }

    modalFooter.appendChild(btnFavorito);
    modalFooter.appendChild(btnCerrarModal);

    // Muestra el modal donde se cargarán toda la información de la API
    modal.show();
  }

  function agregarFavorito(receta) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));
  }

  function eliminarfavorito(id) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);

    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
  }

  function existeStorage(id) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    return favoritos.some(favorito => favorito.id === id);
  }

  function mostrarToast(mensaje) {
    const toastDiv = document.querySelector("#toast");
    const toastBody = document.querySelector(".toast-body");
    const toast = new bootstrap.Toast(toastDiv);
    toastBody.textContent = mensaje;

    toast.show();
  }

  function obtenerFavoritos() {
    const favorito = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    if (favorito.length) {
      mostrarReceta(favorito)
      return;
    }

    const noFavorito = document.createElement("P");
    noFavorito.textContent = "Aún no hay ningún registro en favoritos";
    noFavorito.classList.add("fs-4", "text-center", "font-bold", "mt-5");
    resultado.appendChild(noFavorito);
  }

  function limpiarHTML(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }
}

document.addEventListener("DOMContentLoaded", iniciarApp);