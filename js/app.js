function iniciarApp() {

  const selectCategoria = document.querySelector("#categorias");
  selectCategoria.addEventListener("change", seleccionarCategoria);

  const resultado = document.querySelector("#resultado");
  const modal = new bootstrap.Modal('#modal', {});

  obtenerCategoria();

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
      recetaImagen.alt = `Imagen de la receta ${strMeal}`;
      recetaImagen.src = strMealThumb;

      const recetaCardBody = document.createElement('DIV');
      recetaCardBody.classList.add('card-body');

      const recetaHeading = document.createElement('H3');
      recetaHeading.classList.add('card-title', 'mb-3');
      recetaHeading.textContent = strMeal;

      const recetaButton = document.createElement('BUTTON');
      recetaButton.classList.add('btn', 'btn-danger', 'w-100');
      recetaButton.textContent = "Ver receta";
      // recetaButton.dataset.bsTarget = "#modal";
      // recetaButton.dataset.bsToggle = "modal";
      recetaButton.onclick = function () {
        seleccionarReceta(idMeal);
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

    console.log(receta);

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
    `;


    // Mostrar cantidades e ingredientes

    // Muestra el modal donde se cargarán toda la información de la API
    modal.show();
  }

  function limpiarHTML(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }
}

document.addEventListener("DOMContentLoaded", iniciarApp);