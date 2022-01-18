const container = document.querySelector('#products');
const templateCard = document.getElementById('template-card').content;
const templatePill = document.getElementById('template-pill').content;
const fragment = document.createDocumentFragment();
const form = document.querySelector('.form-inline');
const load = document.querySelector('#cargando');
const container_categories = document.querySelector('.dropdown-menu');

const fetchData = async (uri, callback) => {
  try {
    const res = await fetch(`https://bsale-challenge.herokuapp.com/${uri}`);
    const data = await res.json();
    if (data) load.style.display = 'none';
    callback(data)
  } catch(err){
    alert(err);
  }
}

/* Cargamos los productos */
const buildProducts = (data) => {
  data.map(({url_image, name, price, id}) => {
    //Validamos que la imagen exista
    if(url_image) {
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

/* Cargamos las categorias */
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

/* Listener del buscador */
form.addEventListener('submit', function(ev){
  ev.preventDefault();
  let inputValue = document.getElementById('search').value.toLowerCase();
  let uri = `api/products/${inputValue}`;

  if (inputValue) {
    container.innerHTML = '';
    fetchData(uri, buildProducts);
  }else {
    container.innerHTML = '<p>No se encontraron coincidencias</p>';
  }
});

/* Listener de categorias */
container_categories.addEventListener('click', async (ev) => {
  /* Se corrige bug ya que el filtro ver todo funciona con el href del html, necesita recargar la pagina por lo que no le aplicamos ev.preventDefault */
  if(ev.target.classList.contains('all')) return;
  ev.preventDefault();
  setFilter(ev);
})

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

//Función ejecutora
(function(){
  const product_uri = 'api/products'
  const category_uri = 'api/categories'

  fetchData(product_uri, buildProducts);
  fetchData(category_uri, buildCategories);

})();