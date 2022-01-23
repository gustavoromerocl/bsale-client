

const container = document.querySelector('#products');
const templateCard = document.getElementById('template-card').content;
const templatePill = document.getElementById('template-pill').content;
const fragment = document.createDocumentFragment();
const form = document.querySelector('.form-inline');
const load = document.querySelector('#cargando');
const container_categories = document.querySelector('.dropdown-menu');
let timer;

/**
 * @description La función bindEvents() agrupa todos los listener para ser ejecutados una vez se inicia la app
 */
const bindEvents = function(){
  /**
   * Listener sobre el evento keyup de la barra buscadora, recibe el timer declarado en las variables locales y 
   * si tiene un intervalo asociado lo elimina para evitar buscar por cada vez que se presiona una tecla, mejorando el rendimiento de la app
   */
  form.addEventListener('keyup', function(ev){
    ev.preventDefault();
    if(timer) window.clearInterval(timer);
    
    timer = window.setTimeout(() => {
      searchProduct();
    }, 1000);
    
  });
  /* Listener sobre la accion submit del buscador */
  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    searchProduct();
  });

  /* Listener para ejecutar el filtro de categorias */
  container_categories.addEventListener('click', async (ev) => {
    /* Se corrige bug ya que el filtro ver todo funciona con el href del html, necesita recargar la pagina por lo que no le aplicamos ev.preventDefault */
    if(ev.target.classList.contains('all')) return;
    ev.preventDefault();
    setFilter(ev);
  });
}
/**
 * @description La función cleanContainer() que se hace cargo de limpiar el contenedor de productos
 */
const cleanContainer = function(){
  container.innerHTML = '';
}


/**
 * @description La función fetchData() realiza una petición GET a la Rest APi para consumir sus datos. Está diseñada para cambiar el
 * endpoint(uri) y la función que manipula los datos(callback) con el fin de reutilizar el código.
 * 
 * @param {string} uri Parametro que recibe el endpoint 
 * @param {function} callback Parametro que recibe una función para manipular los datos recibidos
 */

 //https://bsale-challenge.herokuapp.com/
const fetchData = async (uri, callback) => {
  const host = 'http://localhost:8080';
  try {
    const res = await fetch(`${host}/${uri}`);
    const data = await res.json();
    if (data) load.style.display = 'none';
    callback(data)
  } catch(err){
    alert(err);
  }
}

/**
 * @description La función buildProducts() recibe la data resultado de fetch data y construye mediante un template de bootstrap los elementos html con
 * la información obtenida
 * @param {Array} data Parametro que recibe la respuesta del endpoint de productos
 */
const buildProducts = (data) => {
  data.content.map(({url_image, name, price, id}) => {
    //Validamos que la imagen exista
    if(url_image) {
      templateCard.querySelector('.card').classList.add('zoomIn');
      templateCard.querySelector('h5').textContent = name;
      templateCard.querySelector('p').textContent = price;
      templateCard.querySelector('img').setAttribute('src', url_image);
      templateCard.querySelector('button').dataset.id = id;

      const clone = templateCard.cloneNode(true);
      fragment.appendChild(clone)
    }
  });
  container.appendChild(fragment);
}

/**
 * @description La función buildCategories() recibe los datos del endpoint de categorias y construye mediante un template de bootstrap los elementos html con
 * la información obtenida
 * @param {Array} data Parametro que recibe la respuesta del endpoint de categorias
 */
const buildCategories = (data) => {
  data.map(({id, name}) => {
    let label = templatePill.querySelector('label');
    let input = templatePill.querySelector('input');
    label.textContent = name;
    label.setAttribute('for', name);
    label.dataset.id = id;
    input.style.display = 'none';
    input.setAttribute('id', name);

    const clone = templatePill.cloneNode(true);
    fragment.appendChild(clone);
  });
  container_categories.appendChild(fragment);
}

/**
 * @description La función searchProduct() realiza una peticion al endpoint de busqueda de productos y valida que hayan coincidencias
 */
const searchProduct = async function(){
  let inputValue = document.getElementById('search').value.toLowerCase();
  let res = await fetch(`https://bsale-challenge.herokuapp.com/api/products/${inputValue}`);
  const data = await res.json();
  
  if (data.length === 0) {
    container.innerHTML = '<div class="container-search"><p>No se encontraron coincidencias</p><div>';
  }else {
    cleanContainer();
    buildProducts(data);
  } 
}


/**
 * @description La función setFilter() recibe el evento click sobre la lista de categorias en el DOM y limpia los productos para cargar 
 * solo los devueltos por el endpoint de la categoria seleccionado limpiando el contenedor de productos
 * @param {event} ev Parametro que recibe el evento del listener
 */
const setFilter = async (ev) => {
  const res = await fetch(`https://bsale-challenge.herokuapp.com/api/categories/${ev.target.dataset.id}`)
  const data = await res.json();

  try{
    if(data){
      container.innerHTML = '';
      buildProducts(data);
    }
    else{
      container.innerHTML = '<p>No se encontraron coincidencias</p>';
    }
  }catch(err){
    alert(err);
  }
} 

/**
 * @description Esta función anónima ejecuta las funciones fetchData() y bindEvents() para el arranque de la app
 */
(function(){
  const product_uri = 'api/products'
  const category_uri = 'api/categories'

  fetchData(product_uri, buildProducts);
  fetchData(category_uri, buildCategories);
  bindEvents();
})();