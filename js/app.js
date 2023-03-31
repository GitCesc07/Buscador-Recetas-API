function iniciarApp() {

  const selectCategoria = document.querySelector("#categorias");
  selectCategoria.addEventListener("change", seleccionarCategoria)

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
    // Iterar en los resultados
    recetas.forEach(receta => {
      const { } = receta;

      const recetaContenedor = document.createElement("DIV");
      recetaContenedor.classList.add('col-md-4');

      const recetaCard = document.createElement("DIV");
      recetaCard.classList.add('card', 'mb-4');

      const recetaImagen = document.createElement('IMG');
      recetaImagen.classList.add('card-img-top');
    })
  }
}

document.addEventListener("DOMContentLoaded", iniciarApp);